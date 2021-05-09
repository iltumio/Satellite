<template src="./ExternalLink.html"></template>

<script>
export default {
  name: 'ExternalLink',
  props: ['link', 'text'],
  data () {
    return {
      active: false
    }
  },
  methods: {
    togglePopup () {
      this.active = !this.active
    },
    /** @method
     * @name openLink
     * opens confirmation dialog to view external link
     */
    openLink () {
      this.togglePopup()
      window.open(this.link, '_blank')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./ExternalLink.less"></style>
