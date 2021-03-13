<template src="./InfoBar.html"></template>

<script>
import DwellerID from '@/components/common/dwellerid/DwellerID';
import CircleIcon from '@/components/common/CircleIcon';

export default {
  name: 'InfoBar',
  props: ['toggleMedia', 'makeCall'],
  components: {
    DwellerID,
    CircleIcon,
  },
  data() {
    return {
      idActive: false,
    };
  },
  methods: {
    /** @method
     * Triggers a screenshare request event to the store
     * subscribers will be notified to start a share
     * @name requestScreenShare
     */
    requestScreenShare() {
      this.$store.commit('screenShareRequest');
    },
    /** @method
     * @depricated
     * Toggles the ID card modal
     * @name requestScreenShare
     */
    toggleFingerprint() {
      this.$store.commit('toggleUserInfo');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./InfoBar.less"></style>
