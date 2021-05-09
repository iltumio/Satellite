<template src="./MessageContext.html"></template>

<script>
export default {
  name: 'MessageContext',
  props: ['message', 'close', 'dweller', 'x', 'y'],
  data () {
    return {
      vcoConfig: {
        handler: this.handler,
        events: [
          'dblclick',
          'click',
          'contextmenu',
          'contextmenu',
          'click.right'
        ]
      }
    }
  },
  methods: {
    getDecoded (msg) {
      return decodeURI(msg)
    },
    closeSoon () {
      setTimeout(() => {
        this.close()
      }, 10)
    },
    isTextMessage () {
      return (
        this.message &&
        this.message.payload.data &&
        typeof this.message.payload.data === 'string'
      )
    }
  },
  watch: {
    x: function (newVal) {
      this.$refs.menu.style.left = `${newVal}px`
    },
    y: function (newVal) {
      this.$refs.menu.style.top = `${newVal}px`
    }
  },
  mounted () {
    this.$refs.menu.style.top = `${this.y}px`
    this.$refs.menu.style.left = `${this.x}px`
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="less" scoped src="./MessageContext.less"></style>
