<template>
  <div id="commandParser">
        <span class="label">Available Commands</span>
        <div class="columns is-mobile" v-for="cmd in commands" :key="cmd.id">
            <div class="column">
                <span :class="`command ${cmd.command === command ? 'active' : ''}`">{{cmd.command}}</span>
            </div>
            <div class="column">
                <span class="desc">{{cmd.desc}}</span>
            </div>
        </div>
        <div class="command-container">
            <span :class="`command ${commandStrings.includes(command) ? 'green' : 'red'}`">{{command}}</span>
            <span class="arg" v-for="arg in args" :key="arg">
                {{arg}}
            </span>
        </div>
  </div>
</template>

<script>
import reload from './commands/reload'

export default {
    name: 'CommandParser',
    props: ['command', 'args'],
    data() {
        return {
            commands: [
                {
                    id: 0,
                    command: '/address',
                    args: false,
                    desc: 'Send your address',
                    exec: 'sendAddress'
                },
                {
                    id: 1,
                    command: '/reload',
                    args: false,
                    desc: 'Reload the app',
                    exec: 'reloadWindow'
                },
            ],
            commandStrings: []
        }
    },
    mounted() {
        this.commands.forEach(cmd => {
            this.commandStrings.push(cmd.command)
        })
        this.$store.subscribeAction((action, state) => {
            if (action.type === 'dispatchCommand') {
                const command = action.payload.command
                    .replace(/\W/g, '')
                switch(command) {
                    case 'reload':
                        reload.reload()
                        break;
                    default:
                        break;
                }
            }
        });
    },
    methods: {
        reloadWindow() {
            window.location.reload()
        }
    }
}
</script>

<style lang="less" scoped>
#commandParser {
    position: absolute;
    bottom: 4.5rem;
    /* width: 100%; */
    background: #1a1b26;
    right: 1rem;
    left: 1rem;
    border-radius: 4px;
    padding: 0.5rem;
    border: 1px solid #000;

    .columns .column {
        padding: 0 0.75rem;
    }

    .desc {
        background: #101016;
        color: #fff;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        white-space: nowrap;
    }

    .arg, .command {
        font-family: 'Space Mono', monospace;
    }

    .command-container {
        background: #101016 !important;
        padding: 0.4rem 1rem;
        
    }

    .arg {
        background: #0984e3;
        padding: 0 0.2rem;
        border-radius: 2px;
        margin: 0 0.5rem;
        text-align: center;
        display: inline-block;
        color: #fff;
    }
    .command {
        font-weight: bold;
    }
    .command.active {
        color: #fff;
    }
}
</style>