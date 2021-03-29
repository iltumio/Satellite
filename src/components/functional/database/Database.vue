<template></template>
<script>
import config from "@/config/config";

export default {
  name: "database",
  data() {
    return { activeAccount: false };
  },
  methods: {
    makeKey() {
      return {
        key: config.textile.key,
      };
    },
  },
  async mounted() {
    // this.$store.dispatch('initDatabase');
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
