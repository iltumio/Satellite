<template src="./QuickFriends.html"></template>

<script>
import Fuse from 'fuse.js'

import CircleIcon from '@/components/common/CircleIcon'

export default {
  name: 'QuickFriends',
  props: ['close'],
  components: {
    CircleIcon
  },
  data () {
    return {
      keyword: '',
      friends: this.$store.state.friends
    }
  },
  methods: {
    /** @method
     * Create chat with given friend
     * @name handleChat
     * @argument fr friend to chat with
     */
    handleChat (fr) {
      this.$store.commit('newChat', fr.address)
      // this.$store.commit('activeChat', fr.address)
      this.$store.dispatch('setActiveChat', { friendAddress: fr.address })

      this.$store.commit('changeRoute', 'main')
      this.close()
      this.$nextTick(() => {
        setTimeout(() => {
          this.$store.commit('setMobileSidebar', false)
        }, 0)
      })
    },
    /** @method
     * Search through friends and update
     * local friends object with filtered friends
     * @name filterFriends
     */
    filterFriends () {
      if (this.keyword) {
        const options = {
          includeScore: false,
          keys: ['name']
        }
        const fuse = new Fuse(this.$store.state.friends, options)
        const result = fuse.search(this.keyword)
        this.friends = result.map(i => i.item)
      } else {
        this.friends = this.$store.state.friends
      }
    }
  },

  directives: {
    'click-outside': {
      bind: (el, binding) => {
        let clickedOffOnce = false
        // Define ourClickEventHandler
        const ourClickEventHandler = event => {
          if (!el.contains(event.target) && el !== event.target) {
            if (clickedOffOnce) {
              // as we are attaching an click event listern to the document (below)
              // ensure the events target is outside the element or a child of it
              binding.value(event) // before binding it
            }
          }
          clickedOffOnce = true
        }
        // attached the handler to the element so we can remove it later easily
        el.__vueClickEventHandler__ = ourClickEventHandler

        // attaching ourClickEventHandler to a listener on the document here
        document.addEventListener('click', ourClickEventHandler)
      },
      unbind: function (el) {
        // Remove Event Listener
        document.removeEventListener('click', el.__vueClickEventHandler__)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./QuickFriends.less"></style>
