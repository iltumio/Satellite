<template>
  <div class="meter" :style="`height: ${height}rem !important;`">
      <div :class="`meter-tick ${ticks > 0 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 1 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 2 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 3 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 4 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 5 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 6 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 7 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 8 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 9 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 10 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 11 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 12 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 13 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 14 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 15 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 16 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 17 ?  type == 'loading' ? 'green-tick' : 'green-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 18 ?  type == 'loading' ? 'green-tick' : 'orange-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 19 ?  type == 'loading' ? 'green-tick' : 'orange-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 20 ?  type == 'loading' ? 'green-tick' : 'orange-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 21 ?  type == 'loading' ? 'green-tick' : 'orange-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 22 ?  type == 'loading' ? 'green-tick' : 'red-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 23 ?  type == 'loading' ? 'green-tick' : 'red-tick' : ''}`"></div>
      <div :class="`meter-tick ${ticks > 24 ?  type == 'loading' ? 'green-tick' : 'red-tick' : ''}`"></div>
  </div>
</template>

<script>
export default {
    name: 'Meter',
    props: [
        'ticks',
        'height',
        'type'
    ]
}
</script>

<style lang="less">

.meter {
    width: 100%;
    height: 1.5rem;
    display: inline-block;

    .meter-tick {
        width: 2%;
        height: 100%;
        margin: 1%;
        float: left;
        background: #27293b !important;
        border-radius: 2px;
    }

    .green-tick {
        background: #00b894 !important;
    }
    .orange-tick {
        background: #fbc02d !important;
    }
    .red-tick {
        background: #df7070 !important;
    }
}

</style>