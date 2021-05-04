<template src="./Files.html"></template>

<script>
import File from '@/components/files/file/File'
import FileContext from '@/components/common/context/FileContext'
import FileUploadInline from '@/components/common/fileuploadinline/FileUploadInline'

export default {
  name: 'Files',
  components: {
    FileUploadInline,
    File,
    FileContext
  },
  data () {
    return {
      loading: false,
      showContext: false,
      contextCoordsX: 0,
      contextCoordsY: 0,
      activeFile: null
    }
  },
  methods: {
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
      this.$store.commit('changeRoute', 'main')
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Files.less"></style>
