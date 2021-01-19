<template src="./FileUploadInline.html"></template>

<script>
import config from '@/config/config';
import IPFSUtils from '@/classes/IPFSUtils.ts';
import FileC from '@/classes/FileC.ts';

const uploadAudio = new Audio(`${config.ipfs.browser}${config.sounds.upload}`);

export default {
  name: 'FileUploadInline',
  props: [
    'relayResult',
    'uploadDone',
  ],
  data() {
    return {
      link: false,
      ipfsHash: false,
      selectedFile: false,
      progress: 0,
      config,
    };
  },
  methods: {
    // Clear all data and get ready for another file upload
    reset() {
      this.link = false;
      this.ipfsHash = false;
      this.selectedFile = false;
      this.progress = 0;
      this.fileClass = false;
    },
    // Returns the url to the file on the local machine for preview
    getURL() {
      return URL.createObjectURL(this.selectedFile);
    },
    // Sends the file out for messaging or handling in parent
    sendFileMessage() {
      if (this.ipfsHash) {
        this.relayResult(this.fileClass.getObject());
      }
    },
    // Set the file from the input ready for processing
    setFile(event) {
      [this.selectedFile] = event.target.files;
      this.sendToIpfs(this.selectedFile);
    },
    // Uploads the file to the connected IPFS node
    async sendToIpfs(file) {
      this.$store.commit('setStatus', 'Uploading file to IPFS');
      const ipfsResponse = await window.ipfs.add(
        file,
        {
          progress: (length) => {
            // eslint-disable-next-line
            let percent = ((length / this.selectedFile.size) * 100).toFixed(0);
            this.progress = percent;
            if (percent > 100) {
              this.progress = 100;
            }
          },
        },
      );
      this.$store.commit('setStatus', 'File uploaded to IPFS');
      this.ipfsHash = ipfsResponse.path;
      this.fileClass = new FileC(
        `${config.ipfs.browser}${this.ipfsHash}`,
        this.ipfsHash,
        this.selectedFile,
      );

      const ipfsUtils = new IPFSUtils(this.$database);
      await ipfsUtils.appendFileCache(this.fileClass.getObject());
      this.uploadDone();
      uploadAudio.play();
      this.$nextTick(() => {
        this.$refs.hidden.focus();
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./FileUploadInline.less"></style>
