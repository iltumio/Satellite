<template>
  <div>
    <Group 
      v-for="group in groups" 
      :key="group.id" 
      :active="$store.state.group.identifier === group.identifier"
      :group="group" />
  </div>
</template>

<script>
import Group from '../group/Group'

export default {
  name: 'GroupList',
  components: {
    Group
  },
  data() {
    return {
      groups: [
        {
          name: 'Satellite Testers',
          description: 'A group for Satellite early-access testers.',
          photo: 'http://ipfs.io/ipfs/TBD',
          identifier: '0xaae47eae4ddd4877e0ae0bc780cfaee3cc3b52cb',
          threadID: 'TBD',
          members: [
            '0xca8d2554190310F0DdAcF8647b700ceAABc4Cb10',
            '0x041D5ed4817FD7b7aBD68BB5A8c48A00c3Cc74Fc',
            '0xFb5E3ed9CC6DB44531B8B58fc4045D97f8A9f4a1',
            '0x5A9720a5BB8DAde38b210A50b81FD23e6C604e35',
            '0xb2D822e05176563498901682202A1f9c0F68C93c',
            '0xCcb44CdF291Da57d071326cffaef6Bb98eB1021F',
            '0x0ED3B01FAF2002beD1434Fce6E47aDa3bD43d213',
            '0x7cFbE9977E6577117B589e15CeF2f2F6d18F64ff'
          ]
        },
        {
          name: 'Filecoin Lobby',
          description: 'Chatter about Filecoin and IPFS.',
          photo: 'http://ipfs.io/ipfs/TBD',
          identifier: '0x00047eae4ddd48ee0e0ae0bc780cfaee3cc3b52cb',
          threadID: 'TBD',
          members: [
            '0xca8d2554190310F0DdAcF8647b700ceAABc4Cb10',
            '0x041D5ed4817FD7b7aBD68BB5A8c48A00c3Cc74Fc',
            '0xFb5E3ed9CC6DB44531B8B58fc4045D97f8A9f4a1',
            '0x5A9720a5BB8DAde38b210A50b81FD23e6C604e35',
            '0x7cFbE9977E6577117B589e15CeF2f2F6d18F64ff'
          ]
        },
        {
          name: 'Warframe Fans',
          description: 'WARFRAME BABYYYYY',
          photo: 'http://ipfs.io/ipfs/TBD',
          identifier: '0x11147eae4ddd48ea1e0ae0bc780cfaee3cc3b52cb',
          threadID: 'TBD',
          members: [
            '0xca8d2554190310F0DdAcF8647b700ceAABc4Cb10',
            '0x041D5ed4817FD7b7aBD68BB5A8c48A00c3Cc74Fc',
            '0xFb5E3ed9CC6DB44531B8B58fc4045D97f8A9f4a1',
            '0x5A9720a5BB8DAde38b210A50b81FD23e6C604e35',
            '0x7cFbE9977E6577117B589e15CeF2f2F6d18F64ff',
            '0xb2D822e05176563498901682202A1f9c0F68C93c'
          ]
        }
      ]
    }
  }
}
</script>

<style>

</style>