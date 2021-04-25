<template>
  <div id="mobile-top-nav">
    <div class="columns is-mobile">
      <div class="column smaller-column" v-on:click="backAction">
        <div v-if="backAction"><i class="fas fa-chevron-left"></i> Back</div>
        <div v-else-if="leftText">
          {{ leftText }}
        </div>
      </div>
      <div class="column center-column">
        {{ title }}
      </div>
      <div
        v-if="updateNeeded"
        v-on:click="doUpdate"
        class="column smaller-column right-column update-column green"
      >
        <i v-if="!updating" class="fas fa-angle-double-down"></i>
        <i v-else class="fas fa-spinner-third fa-spin"></i>&nbsp;Update
      </div>
      <div
        v-else-if="toggleSettings"
        class="column smaller-column right-column"
        v-on:click="toggleSettings"
      >
        <i class="fas fa-sliders-h"></i>
      </div>
      <div v-else class="column smaller-column right-column"></div>
    </div>
  </div>
</template>

<script>
import Package from '../../../../package.json'

export default {
  name: 'TopNav',
  props: ['backAction', 'title', 'toggleSettings', 'leftText'],
  data () {
    return {
      updateNeeded: false,
      updating: false,
      updateInterval: false,
    }
  },
  methods: {
    checkUpdate () {
      fetch(
        'https://raw.githubusercontent.com/Satellite-im/Satellite/master/package.json',
        {
          cache: 'no-cache'
        }
      )
        .then(response => response.json())
        .then(data => {
          const localVersion = Package.version
          const remoteVersion = data.version
          if (localVersion !== remoteVersion) {
            this.updateNeeded = true
          }
        })
    },
    doUpdate () {
      this.updating = true
      setTimeout(() => {
        window.location.reload(true)
      }, 2000)
    }
  },
  mounted () {
    this.checkUpdate()
    this.updateInterval = setInterval(() => {
      this.checkUpdate()
    }, 15000)
  },
  beforeUnmount() {
    clearInterval(this.updateInterval)
  }
}
</script>

<style>
#mobile-top-nav {
  overflow: hidden;
  height: 50px;
  margin: -1rem -1.5rem 0 -1.5rem;
}
.update-column {
  font-size: 11pt;
  white-space: nowrap;
}
.smaller-column {
  max-width: 125px;
  height: 50px;
  padding-top: 1.6rem;
  padding-left: 2rem;
}
.center-column {
  padding-top: 1.4rem;
  text-align: center;
  font-family: 'Space Mono', monospace;
  font-size: 13pt;
  height: 50px;
}
.right-column {
  text-align: right;
  padding-right: 2rem;
}
</style>
