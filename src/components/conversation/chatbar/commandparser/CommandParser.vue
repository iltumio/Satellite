<template src="./CommandParser.html"></template>

<script>
import reload from './commands/reload'

export default {
  name: 'CommandParser',
  props: ['command', 'args'],
  data () {
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
        }
      ],
      commandStrings: []
    }
  },
  mounted () {
    this.commands.forEach(cmd => {
      this.commandStrings.push(cmd.command)
    })
    this.$store.subscribeAction((action, state) => {
      if (action.type === 'dispatchCommand') {
        const command = action.payload.command.replace(/\W/g, '')
        switch (command) {
          case 'reload':
            reload.reload()
            break
          default:
            break
        }
      }
    })
  },
  methods: {
    reloadWindow () {
      window.location.reload()
    }
  }
}
</script>

<style scoped lang="less" src="./CommandParser.less"></style>
