<template src="./FilesMobile.html"></template>

<script>
import MobileNav from '@/components/sidebar/mobilenav/MobileNav'
import TopNav from '@/components/common/mobile/TopNav'
import FileContext from '@/components/common/context/FileContext'
import FileUploadInline from '@/components/common/fileuploadinline/FileUploadInline'
import FlexFile from '../flexfile/FlexFile.vue'
import Meter from '@/components/common/meter/Meter'

export default {
  name: 'Files',
  props: ['toggleSettings'],
  components: {
    FileUploadInline,
    FlexFile,
    FileContext,
    MobileNav,
    Meter,
    TopNav
  },
  data () {
    return {
      loading: false,
      showContext: false,
      contextCoordsX: 0,
      contextCoordsY: 0,
      activeFile: null,
      managedFile: false,
      fileSizeTotal: 0,
      removing: false
    }
  },
  methods: {
    bytesPercentageUsed (used) {
      const total = 4294965097
      return (used / total) * 100
    },
    /** @method
     * Converts the bytes to a readable string
     * @name bytesToSize
     * @argument bytes value to convert to human readable string
     * @returns human readable filesize
     */
    bytesToSize (bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Bytes'

      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
    },
    manageFile (file) {
      this.managedFile = file
    },
    copySuccess () {
      this.$toasted.show('ATTN: Link Copied!', {
        type: 'success',
        icon: 'check-circle'
      })
      this.managedFile = false
    },
    fileContext (event) {
      event.preventDefault()
      const fileIndex = event.target.getAttribute('data-id')
      if (fileIndex) {
        this.activeFile = this.$store.state.files[fileIndex]
        this.contextCoordsX = event.clientX
        this.contextCoordsY = event.clientY
        this.showContext = true
      }
    },
    openFile () {
      window.open(this.managedFile.remote, '_blank')
      this.managedFile = false
    },
    /** @method
     * Setter
     * Remove the file from the local cache, not IPFS
     * @name deleteFile
     */
    async deleteFile () {
      this.$database.bucketManager.removeFile(
        this.managedFile,
        this.managedFile.path
      )
      this.unpinned = true
      this.removing = true
      setTimeout(() => {
        this.updateParent()
        this.managedFile = false
        this.removing = false
      }, 4000)
    },
    hideContext () {
      this.showContext = false
      this.activeFile = null
    },
    /** @method
     * Updates the parent with new files
     * @name updateParent
     */
    async updateParent () {
      await this.fetchRecentFiles()
    },
    /** @method
     * Updates the local cache with the new files
     * @name updateCache
     */
    async updateCache () {
      await this.fetchRecentFiles()
    },
    /** @method
     * Close out the file manager by changing the main route
     * @name close
     */
    close () {
      this.$store.commit('setMobileSidebar', true)
      // this.$store.commit('changeRoute', 'main');
    },
    /** @method
     * Fetch files from the IPFS local file cache
     * @name fetchRecentFiles
     */
    async fetchRecentFiles () {
      this.loading = true
      const index = await this.$database.bucketManager.fetchIndex()
      this.loading = false
      this.$store.commit('cacheFiles', index.paths)
    }
  },
  async mounted () {
    await this.fetchRecentFiles()
    let fileSizeTotal = 0
    this.$store.state.files.map(file => {
      fileSizeTotal += file.file.size
    })
    this.fileSizeTotal = fileSizeTotal
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./FilesMobile.less"></style>
