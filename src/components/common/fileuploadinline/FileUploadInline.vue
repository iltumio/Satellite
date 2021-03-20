<template src="./FileUploadInline.html"></template>

<script>
import config from '@/config/config';
import FileC from '@/classes/FileC.ts';
import * as nsfwjs from 'nsfwjs'

const uploadAudio = new Audio(`${config.ipfs.browser}${config.sounds.upload}`);

export default {
  name: 'FileUploadInline',
  props: [
    'relayResult',
    'uploadDone',
    'noAutoSelect'
  ],
  data() {
    return {
      link: false,
      ipfsHash: false,
      selectedFile: false,
      progress: 0,
      error: false,
      aiScanning: false,
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
    async setFile(event) {
      this.error = false;
      [this.selectedFile] = event.target.files;
      const size = this.selectedFile.size / 1024 / 1024; // MiB
      this.aiScanning = true;
      let isNSFW = await this.isNSFW(this.selectedFile);
      this.aiScanning = false;

      if (size > 40) {
        this.error = 'Please select a file smaller than 40 MiB';
        this.selectedFile = false;
      } else if (isNSFW) {
        this.error = 'Our AI thinks this image is NSFW';
        this.selectedFile = false;
      } else {
        this.sendToIpfs(this.selectedFile);
      }
    },
    // Checks if file is NSFW
    async isNSFW(file) {
      let fileTypePrefix = file.type.split('/')[0]
      if (fileTypePrefix !== 'image') { return false }

      let fileURL = URL.createObjectURL(file)
      let imgElement = document.createElement('IMG')
      imgElement.src = fileURL;
      return nsfwjs.load()
      .then((model) => {
        return model.classify(imgElement)
      })
      .then((predictionsArr) => {
        let predictionObj = {};
        for (let prediction of predictionsArr) {
          predictionObj[prediction.className] = prediction.probability
        }
        let predictionParams = (predictionObj.Porn > 0.6 || predictionObj.Hentai > 0.6)
        return predictionParams
      })
    },
    // Uploads the file to the connected IPFS node
    async sendToIpfs(file) {
      const path = `/uploads/${file.name}`;
      const result = await this.$database.bucketManager.pushFile(file, path, (progress) => {
        this.progress = progress;
      });
      this.imageURL = `https://hub.textile.io${result.root}${path}`;
      this.$store.commit('setStatus', 'Uploading file to IPFS');
      this.ipfsHash = result.root.replace('/ipfs/', '');
      this.fileClass = new FileC(
        this.imageURL,
        this.ipfsHash,
        this.selectedFile,
      );
      this.uploadDone();
      // Update file index
      this.$database.bucketManager.addToIndex(file, result.root, path);
      uploadAudio.play();
      this.$store.commit('setStatus', 'File uploaded to IPFS');
      this.$nextTick(() => {
        this.$refs.hidden.focus();
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./FileUploadInline.less"></style>
