<template>
  <div id="files" class="noselect">
    <button class="modal-close is-large" aria-label="close" v-on:click="close"></button>
    <h3>{{$t('files.heading')}}</h3>
    <p>{{$t('files.description')}}</p>
    <hr>
    <h2 class="label">{{$t('files.upload')}}</h2>
    <article class="message is-dark">
      <div class="message-body ">
        <FileUploadInline :relayResult="updateCache" :uploadDone="fetchRecentFiles" />
      </div>
    </article>
    <h2 class="label">{{$t('files.history')}}</h2>
    <article class="message is-dark">
      <div class="message-body noselect">
        <h2>{{$t('files.your_files')}}</h2>
        <p>{{$t('files.your_files_subtext')}}</p>
        <br>
        <p v-if="loading" class="label">
          <i class="fa fa-circle-notch fa-pulse"></i> &nbsp; {{$t('files.loading')}}
        </p>
        <FileContext
          v-if="showContext"
          :file="activeFile"
          :x="contextCoordsX"
          :y="contextCoordsY"
          :close="hideContext" />
        <div v-for="(file, index) in recentFiles" v-bind:key="file.hash">
          <p @contextmenu="fileContext">
            <File :file="file" :updateParent="updateParent" :index="index" />
          </p>
        </div>
        <div style="clear:both"></div>
      </div>
    </article>
    
    <br>
  </div>
</template>

<script>
import File from '@/components/files/file/File';
import IPFSUtils from '@/classes/IPFSUtils.ts';
import FileContext from '@/components/common/context/FileContext';
import FileUploadInline from '@/components/common/fileuploadinline/FileUploadInline';

export default {
  name: 'Files',
  components: {
    FileUploadInline,
    File,
    FileContext,
  },
  data() {
    return {
      loading: false,
      recentFiles: [],
      showContext: false,
      contextCoordsX: 0,
      contextCoordsY: 0,
      activeFile: null,
    };
  },
  methods: {
    fileContext(event) {
      event.preventDefault();
      const fileIndex = event.target.getAttribute('data-id');
      if (fileIndex) {
        this.activeFile = this.recentFiles[fileIndex];
        this.contextCoordsX = event.clientX;
        this.contextCoordsY = event.clientY;
        this.showContext = true;
      }
    },
    hideContext() {
      this.showContext = false;
      this.activeFile = null;
    },
    /** @method
     * Updates the parent with new files
     * @name updateParent
     */
    async updateParent() {
      await this.fetchRecentFiles();
    },
    /** @method
     * Updates the local cache with the new files
     * @name updateCache
     */
    async updateCache() {
      await this.fetchRecentFiles();
    },
    /** @method
     * Close out the file manager by changing the main route
     * @name close
     */
    close() {
      this.$store.commit('changeRoute', 'main');
    },
    /** @method
     * Fetch files from the IPFS local file cache
     * @name fetchRecentFiles
     */
    async fetchRecentFiles() {
      this.loading = true;
      const ipfsUtils = new IPFSUtils(this.$database);
      const cache = await ipfsUtils.getFileCache();
      this.loading = false;
      this.recentFiles = cache.reverse();
    },
  },
  async mounted() {
    await this.fetchRecentFiles();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #files {
    position: relative;
    width: 100%;
    height: calc(100% - 2rem - 1px);
    background: #f8f9fb;
    z-index: 5;
    padding: 1rem 1.5rem;
    overflow-y: scroll;
  }
  h3 {
    font-family: 'Major Mono Display', monospace;
    font-size: 20pt;
  }
  .modal-close {
    z-index: 0 !important;
    position: absolute;
  }
</style>
