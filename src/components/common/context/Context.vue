<template>
  <div id="context" ref="contextMenu" v-click-outside="close">
    <span class="label">{{$t('context.actions')}}</span>
    <hr class="divider">
    <ul>
      <li
        v-on:click="reload">{{$t('context.reload')}}</li>
    </ul>
    <hr class="divider">
    <ul>
      <li>{{$t('context.devtools')}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Context',
  props: [
    'close',
    'x', 'y',
  ],
  data() {
    return {
      vcoConfig: {
        handler: this.handler,
        events: ['dblclick', 'click', 'contextmenu', 'contextmenu', 'click.right'],
      },
    };
  },
  methods: {
    reload() {
      window.location.reload();
      this.closeSoon();
    },
    closeSoon() {
      setTimeout(() => {
        this.close();
      }, 10);
    },
  },
  watch: {
    
    x: function (newVal) {
      this.$refs.contextMenu.style.left = `${newVal}px`;
    },
    y: function (newVal) {
      this.$refs.contextMenu.style.top = `${newVal}px`;
    },
    
  },
  mounted() {
    this.$refs.contextMenu.style.top = `${this.y}px`;
    this.$refs.contextMenu.style.left = `${this.x}px`;
  },
};
</script>


<style lang="less" scoped>
  .label {
    margin: 0 !important;
    padding: 0 0.3rem !important;
  }
  .divider {
    width: 100%;
    margin: 0;
    padding: 0;
  }
  #context {
    position: fixed;
    top: 0;
    left: 0;
    background: black;
    z-index: 10;
    width: 170px;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    box-shadow: 0 0 0 4px rgba(0,0,0,0.1);
  }
  ul {
    padding: 0;
    margin: 0;
    li {
      margin: 0;
      padding: 0.25rem;
      font-size: 10pt;
      border-radius: 2px;
    }
  }
</style>