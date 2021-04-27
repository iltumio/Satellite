<template>
  <div id="files" class="noselect">
    <button
      class="modal-close is-large"
      aria-label="close"
      v-on:click="close"
    ></button>
    <h3>{{ $t('files.heading') }}</h3>
    <hr />
    <h2 class="label">{{ $t('files.upload') }}</h2>
    <article class="message is-dark">
      <div class="message-body ">
        <FileUploadInline
          :relayResult="updateCache"
          :uploadDone="fetchRecentFiles"
        />
      </div>
    </article>
    <h2 class="label">{{ $t('files.history') }}</h2>
    <article class="message is-dark">
      <div class="message-body noselect">
        <p>{{ $t('files.your_files_subtext') }}</p>
        <div v-if="!loading">
          <FileContext
            v-if="showContext"
            :file="activeFile"
            :x="contextCoordsX"
            :y="contextCoordsY"
            :close="hideContext"
          />
          <div
            v-for="(file, index) in $store.state.files"
            v-bind:key="file.path"
          >
            <p @contextmenu="fileContext">
              <File :file="file" :updateParent="updateParent" :index="index" />
            </p>
          </div>
        </div>
        <div v-else>
          <div class="bar-small"></div>
          <div class="bar-large"></div>
        </div>
        <br />
        <div style="clear:both"></div>
      </div>
    </article>

    <br />
  </div>
</template>

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
<style scoped>
.bar-small {
  background: rgb(2, 0, 36);
  background: linear-gradient(
    90deg,
    rgba(32, 32, 43, 0.45) 0%,
    rgba(32, 32, 43, 0.65) 50%,
    rgba(32, 32, 43, 0.45) 100%
  );
  height: 30px;
  width: 35%;
  border-radius: 5px;
  background-size: 200% 200%;
  animation: gradient 0.5s ease infinite;
  margin: 1rem 0;
}
.bar-large {
  width: 55%;
  height: 100px;
  border-radius: 5px;
  margin: 1rem 0;
  background: linear-gradient(
    90deg,
    rgba(32, 32, 43, 0.45) 0%,
    rgba(32, 32, 43, 0.65) 50%,
    rgba(32, 32, 43, 0.45) 100%
  );
  background-size: 200% 200%;
  animation: gradient 0.5s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: -100% 0%;
  }
  100% {
    background-position: -200% 0%;
  }
}
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
  font-family: 'Space Mono', monospace;
  font-size: 20pt;
}
.modal-close {
  z-index: 0 !important;
  position: absolute;
}
</style>
