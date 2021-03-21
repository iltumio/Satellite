<template src="./Stickers.html"></template>

<script>
import Sticker from './Sticker';

export default {
  name: 'Stickers',
  props: ['sendMessage'],
  components: {
    Sticker,
  },
  methods: {
    setDisplay(route, data) {
      this.route = route;
      this.routeData = data;
    },
    sendSticker(sticker) {
      this.sendMessage(
        sticker,
        'sticker',
      );
      this.$store.commit('toggleStickers');
    },
    buySticker(sticker) {
      console.log('buy sticker', sticker);
    }
  },
  data() {
    return {
      route: 'my-stickers',
      routeData: false,
      stickers: [
        {
          name: 'Food Pack',
          forSale: true,
          price: 2,
          preview_hash: 'QmPSkYgQFTEPCeEFa7KVWY9G4VVgX9NVpC4hprX28rMpBV',
          factory_address: '0x0',
          stickers: [
            'QmPSkYgQFTEPCeEFa7KVWY9G4VVgX9NVpC4hprX28rMpBV',
            'QmZEyniBpqMQYia67drHo4ZbjNkGxxLE35uokHAxA86F9n',
            'QmTXJ3SuZbaoHJpXDKnVVpijGvGwGT33dcb8MdgASK8Mde',
            'QmQXgJVM5CF21Jt7XtCMxvhjTpwgZhGsB1ATFtoga12wtZ',
            'QmZMUJF7rUArib8YYWAQWyxq86R6j57mhnwLAEuyjHi8Gq'
          ]
        },
        {
          name: 'Night & Day',
          preview_hash: 'QmPrW94kDkp5QuKahRbmi539rd23GJtKkkzRTJmhouCbwM/Stickers%20I-01-02.png',
          factory_address: '0x1',
          forSale: true,
          price: 5,
          stickers: [
            'QmPrW94kDkp5QuKahRbmi539rd23GJtKkkzRTJmhouCbwM/Stickers%20I-01-02.png',
            'QmPrW94kDkp5QuKahRbmi539rd23GJtKkkzRTJmhouCbwM/Stickers%20I-01-16.png',
            'QmPrW94kDkp5QuKahRbmi539rd23GJtKkkzRTJmhouCbwM/Stickers%20I-01-13.png',
            'QmPrW94kDkp5QuKahRbmi539rd23GJtKkkzRTJmhouCbwM/Stickers%20I-01-12.png',
            'QmPrW94kDkp5QuKahRbmi539rd23GJtKkkzRTJmhouCbwM/Stickers%20I-01-08.png',
            'QmPrW94kDkp5QuKahRbmi539rd23GJtKkkzRTJmhouCbwM/Stickers%20I-01-05.png'
          ]
        },
        {
          name: 'Snack Time',
          preview_hash: 'QmQrsBuam1Pk7TLBTENU1odPoq1iRM1s9ni23pSqj9yqgx/Stickers%20I-10-15.png',
          factory_address: '0x2',
          forSale: true,
          price: 2,
          stickers: [
            'QmQrsBuam1Pk7TLBTENU1odPoq1iRM1s9ni23pSqj9yqgx/Stickers%20I-10-15.png',
            'QmQrsBuam1Pk7TLBTENU1odPoq1iRM1s9ni23pSqj9yqgx/Stickers%20I-10-17.png',
            'QmQrsBuam1Pk7TLBTENU1odPoq1iRM1s9ni23pSqj9yqgx/Stickers%20I-10-10.png',
            'QmQrsBuam1Pk7TLBTENU1odPoq1iRM1s9ni23pSqj9yqgx/Stickers%20I-10-07.png',
            'QmQrsBuam1Pk7TLBTENU1odPoq1iRM1s9ni23pSqj9yqgx/Stickers%20I-10-05.png',
          ]
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped src="./Stickers.less"></style>