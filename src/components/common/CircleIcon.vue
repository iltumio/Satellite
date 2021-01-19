<template>
    <div class="circle-icon" v-on:click="actionHandler">
        <span v-if="icon">
            <i :class="icon"></i>
        </span>
        <div v-if="image && image.trim() !== 'https://ipfs.io/ipfs/'">
          <jazzicon class="jazzicon" :address="address" :diameter="diameter || 45" />
          <img :src="image" :key="image">
        </div>
        <div v-else-if="address">
          <jazzicon class="jazzicon" :address="address" :diameter="diameter || 45" />
        </div>
    </div>
</template>

<script>
import Jazzicon from 'vue-jazzicon';

export default {
  name: 'CircleIcon',
  components: {
    [Jazzicon.name]: Jazzicon,
  },
  props: [
    'image',
    'color',
    'icon',
    'diameter',
    'address',
    'action',
  ],
  methods: {
    actionHandler() {
      if (this.action) this.action();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    .circle-icon {
      width: 45px;
      height: 45px;
      font-size: 16pt;
      text-align: center;
      border-radius: 50%;
      background: #00d0a1;
      margin: 0 auto;
      color: #fff;
      position: relative;
      overflow: hidden;
    }
    .circle-icon img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .jazzicon {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
    }
    i {
      margin-top: 13px;
    }
    #user-info > div.user-details > div > div > div {
      width: 100% !important;
      height: 100% !important;
    }

</style>
