<template>
    <div class="modal-card bordered achievement">
      <div class="modal-card-head">
        <img :src="`https://ipfs.io/ipfs/${fetchAchievement(achievement).iconHash}`" />
        <div>
          <h2>{{fetchAchievement(achievement).title}}</h2>
          <p>
            {{fetchAchievement(achievement).subtext}}<br />
            <a href="">{{$t('global.view_all_achievements')}}</a>
          </p>
        </div>
      </div>
    </div>
</template>

<script>
import Achievement from '@/utils/Achievement.ts';

export default {
  name: 'Achievement',
  props: [
    'achievement',
  ],
  methods: {
    fetchAchievement(key) {
      return Achievement.achievementDetails(key);
    },
  },
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="less">
  .achievement {
    box-shadow: 0 0 0 4px rgba(0,0,0,0.1);
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    width: 370px;
    height: 85px;
    border-radius: 4px;
    background: red;
    z-index: 10;

    .modal-card-head {
      margin: 0;
      padding: 0;
    }

    img {
      height: 75px !important;
      width: 75px !important;
      float: left;
      margin: 5px;
      margin-right: 1rem;
    }

    h2 {
      font-size: 14pt;
      font-weight: bold;
    }

    p {
      line-height: 130%;
    }
  }
</style>
