<template>
  <div id="files" class="noselect">
    <TopNav
      :title="$t('files.heading')"
      :backAction="close"
      :toggleSettings="toggleSettings"
    />
    <div class="files-mobile-wrapper" v-body-scroll-lock="true">
      <FileUploadInline
        :relayResult="updateCache"
        :uploadDone="fetchRecentFiles"
        :noAutoSelect="true"
      />
      <hr class="divider" />
      <Meter
        :ticks="bytesPercentageUsed(fileSizeTotal) / 4"
        type="usage"
        :height="1.5"
      />
      <h2 class="label">
        {{ $t('files.usage') }} ({{ bytesToSize(fileSizeTotal) }} / 4GB)
      </h2>
      <br />
      <h2 class="label">{{ $t('files.history') }}</h2>
      <div v-if="!loading" class="files-container">
        <ul>
          <li
            v-for="(file, index) in $store.state.files"
            v-bind:key="file.path"
            v-on:click="manageFile(file)"
          >
            <FlexFile :file="file" updateParent="updateParent" :index="index" />
          </li>
        </ul>
        <!--
        <div v-for="(file, index) in $store.state.files" v-bind:key="file.path">
          <p @contextmenu="fileContext">
            <FlexFile :file="file" :updateParent="updateParent" :index="index" />
          </p>
        </div>
        -->
      </div>
      <div v-else>
        <div class="bar-small"></div>
        <div class="bar-large"></div>
      </div>
      <br />
      <div style="clear:both"></div>

      <br />
      <div class="mask" v-if="managedFile" v-on:click="managedFile = false">
        <img :src="managedFile.remote" alt="" class="f-preview" />
        <br />
        <span class="name">
          <span class="fname">{{ managedFile.file.name }}</span>
          <span class="heading"
            >{{ bytesToSize(managedFile.file.size) }}
            {{ managedFile.file.type }}</span
          >
        </span>
      </div>
      <div class="file-actions" v-if="managedFile">
        <button
          v-clipboard:copy="managedFile.remote"
          v-clipboard:success="copySuccess"
          class="is-button button is-primary full-button"
        >
          <i class="fas fa-link"></i> &nbsp; {{ $t('files.copy-link') }}
        </button>
        <button
          class="is-button button is-primary full-button"
          v-on:click="openFile"
        >
          <i class="fas fa-external-link"></i> &nbsp;
          {{ $t('files.open-file') }}
        </button>
        <button
          class="is-button button is-danger full-button"
          v-on:click="deleteFile"
        >
          <span v-if="!removing"
            ><i class="fas fa-trash"></i> &nbsp;
            {{ $t('files.remove-file') }}</span
          >
          <span v-else
            ><i class="fas fa-spinner-third fa-spin"></i> &nbsp;
            {{ $t('files.removing-file') }}</span
          >
        </button>
      </div>
    </div>
    <MobileNav :toggleSettings="toggleSettings" />
  </div>
</template>

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
<style scoped>
.files-mobile-wrapper {
  height: calc(100% - 7.2rem);
  overflow-y: scroll;
  overflow-x: hidden;
  padding-top: 1rem;
}
.progress {
  border-radius: 0;
}
.f-preview {
  max-height: 400px;
}
.file-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #16161e;
  padding: 2rem 1rem;
  padding-bottom: 4rem;
  z-index: 2;
}
.fname {
  font-family: 'Space Mono', monospace;
  font-size: 12pt;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
  padding-top: 4rem;
  font-weight: bold;
  color: #fff !important;
  background: rgba(0, 0, 0, 0.75);
}
.modal-close {
  margin-top: 1rem;
}

.half-button {
  width: calc(50% - 0.14rem);
  margin-bottom: 1rem;
}
.full-button {
  width: 100%;
  margin-bottom: 0.5rem;
}
.files-container {
  width: calc(100% + 0.4rem);
  margin: -0.2rem;
}
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
  height: 100%;
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
  top: env(safe-area-inset-top, 0);
}

ul {
  display: flex;
  flex-wrap: wrap;
}

li {
  height: 40vh;
  flex-grow: 1;
  padding: 0.2rem 0.2rem;
}

li:last-child {
  flex-grow: 10;
}

img {
  max-height: 100%;
  min-width: 100%;
  object-fit: cover;
  vertical-align: bottom;
}
@media (max-aspect-ratio: 1/1) {
  li {
    height: 12vh;
  }
}

@media (max-height: 480px) {
  li {
    height: 80vh;
  }
}
</style>
