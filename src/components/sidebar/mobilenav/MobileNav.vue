<template src="./MobileNav.html"></template>

<script>
export default {
  name: 'MobileNav',
  props: ['toggleSettings'],
  methods: {
    setMainRoute(route) {
      this.$store.commit('changeRoute', route);
      this.$store.commit('setMobileSidebar', false);
    },
    openSidebar() {
      this.$store.commit('setMobileSidebar', true);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./MobileNav.less"></style>
