<template>
  <div class="updater green" v-on:click="doUpdate" v-if="updateNeeded">
    <i :class="`fas ${updating ? 'fa-spinner-third fa-spin' : 'fa-sync'}`"></i
    ><br />
    <span class="update-text">{{ $t('update-check.update') }}</span>
  </div>
</template>

<script>
import Package from '../../../package.json'

export default {
  name: 'UpdateCheck',
  props: ['update'],
  data () {
    return {
      updateNeeded: false,
      updating: false
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
            this.update()
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
    setInterval(() => {
      this.checkUpdate()
    }, 15000)
  }
}
</script>

<style scoped lang="less">
.updater {
  text-align: center;
  width: 45px;
  float: right;
  line-height: 0.8;

  .fas {
    font-size: 15pt;
  }
  .update-text {
    font-size: 7pt;
  }
}
@media (max-width: 768px) {
  .updater {
    margin-top: 1.4rem;
  }
}
</style>
