<template src="./User.html"></template>

<script>
import config from '@/config/config';
import CircleIcon from '@/components/common/CircleIcon';
import DwellerCachingHelper from '@/classes/DwellerCachingHelper.ts';

export default {
  name: 'User',
  components: {
    CircleIcon,
  },
  data() {
    return {
      hovered: false,
      user: false,
      name: '',
      icon: '',
    };
  },
  props: [
    'friend',
    'unread',
    'typing',
    'active',
    'clientId',
  ],
  methods: {
    // Navigate to the main route
    navigateToUser(address) {
      this.$store.commit('changeRoute', 'main');
      this.$store.commit('activeChat', address);
      this.$nextTick(() => {
        setTimeout(() => {
          this.$store.commit('setMobileSidebar', false);
        }, 0);
      });
    },
  },
  async mounted() {
    const dwellerCachingHelper = new DwellerCachingHelper(this.$ethereum, config.registryAddress);
    const dweller = await dwellerCachingHelper.getDweller(this.clientId);
    this.name = dweller.name;
    this.icon = dweller.photo;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./User.less"></style>
