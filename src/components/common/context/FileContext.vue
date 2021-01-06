<template>
  <div id="context" ref="fileMenu" v-click-outside="close">
    <span class="label">{{$t('file_context.actions')}}</span>
    <hr class="divider">
    <ul>
      <li
        v-on:click="openFile">{{$t('file_context.open')}}</li>
      <li
        v-clipboard:copy="file.url"
        v-on:click="closeSoon">{{$t('file_context.copy_link')}}</li>
    </ul>
    <hr class="divider">
    <ul>
      <li
        v-on:click="closeSoon"
        v-clipboard:copy="file.hash">{{$t('file_context.copy_id')}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FileContext',
  props: [
    'file',
    'close',
    'x', 'y',
  ],
  data() {
    return {
      vcoConfig: {
        handler: this.handler,
        events: ['dblclick', 'click', 'contextmenu', 'click.right'],
      },
    };
  },
  methods: {
    openFile() {
      window.open(this.file.url);
      this.closeSoon();
    },
    closeSoon() {
      setTimeout(() => {
        this.close();
      }, 10);
    },
  },
  watch: {
    /* eslint-disable */
    x: function (newVal) {
      this.$refs.fileMenu.style.left = `${newVal}px`;
    },
    y: function (newVal) {
      this.$refs.fileMenu.style.top = `${newVal}px`;
    },
    /* eslint-enable */
  },
  mounted() {
    this.$refs.fileMenu.style.top = `${this.y}px`;
    this.$refs.fileMenu.style.left = `${this.x}px`;
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
    z-index: 100;
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