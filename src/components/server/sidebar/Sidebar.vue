<template src="./Sidebar.html"></template>

<script>
import Group from './group/Group'

export default {
  name: 'ServerSidebar',
  components: {
    Group
  },
  data () {
    return {
      groups: [
        {
          name: 'Text Channels',
          channels: [1, 2, 3]
        },
        {
          name: 'Voice Channels',
          channels: [4, 5, 6]
        },
        {
          name: 'Dev Center',
          channels: [0, 7, 8, 9]
        }
      ],
      channels: {
        '0': {
          id: '0',
          type: 'label',
          name: 'github.com/Satellite_im'
        },
        '1': {
          id: '1',
          type: 'feed',
          name: 'feed'
        },
        '2': {
          id: '2',
          type: 'text',
          name: 'general'
        },
        '3': {
          id: '3',
          type: 'text',
          name: 'trade'
        },
        '4': {
          id: '4',
          type: 'voice',
          name: 'General Chatter'
        },
        '5': {
          id: '5',
          type: 'voice',
          name: 'Gaming',
          users: [
            {
              name: 'RetroPronghorn',
              address: '0x43aF5230d1493511fBDeAe0Fbe4C5555E087Bf24'
            },
            {
              name: 'im_eatin_cookies',
              address: '0x5635e06B8655C1455Da640162061c1392DB16357'
            },
            {
              name: 'XileHorizon',
              address: '0xD3312142f90B6002D6CF01A9d858BED4e49Afcf7'
            }
          ]
        },
        '6': {
          id: '6',
          type: 'voice',
          name: 'Development'
        },
        '7': {
          id: '7',
          type: 'text',
          name: 'general'
        },
        '8': {
          id: '8',
          type: 'feed',
          name: 'updates'
        },
        '9': {
          id: '9',
          type: 'voice',
          name: 'Dev Chat'
        }
      }
    }
  },
  methods: {
    setActiveChannel (channel) {
      const nonText = ['voice', 'label']
      if (!nonText.includes(channel.type)) {
        this.$store.commit('activeChannel', channel)
      } else {
        // TODO: Join voice channel
      }
    }
  },
  mounted () {
    if (!this.$store.state.channel) {
      this.$store.commit('activeChannel', this.channels['0'])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Sidebar.less"></style>
