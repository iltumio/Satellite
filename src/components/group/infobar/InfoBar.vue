<template src="./InfoBar.html"></template>

<script>
import DwellerID from '@/components/common/dwellerid/DwellerID'
import CircleIcon from '@/components/common/CircleIcon'

export default {
  name: 'InfoBar',
  props: ['toggleMedia', 'makeCall'],
  components: {
    DwellerID,
    CircleIcon
  },
  data () {
    return {
      idActive: false
    }
  },
  methods: {
    /** @method
     * @depricated
     * Toggles the ID card modal
     * @name requestScreenShare
     */
    toggleGroupInfo () {
      this.$store.commit('toggleGroupInfo');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./InfoBar.less"></style>
