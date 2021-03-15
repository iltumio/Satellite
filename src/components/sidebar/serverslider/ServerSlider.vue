<template src="./ServerSlider.html"></template>

<script>
import CircleIcon from '@/components/common/CircleIcon';

export default {
  name: 'ServerSlider',
  props: ['toggleCreateServer', 'servers'],
  components: {
    CircleIcon,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./ServerSlider.less"></style>
