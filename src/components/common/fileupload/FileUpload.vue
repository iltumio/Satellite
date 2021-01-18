<template src="./FileUpload.html"></template>

<script>
import config from '@/config/config';
import IPFSUtils from '@/classes/IPFSUtils.ts';
import FileC from '@/classes/FileC.ts';

const uploadAudio = new Audio(`${config.ipfs.browser}${config.sounds.upload}`);

export default {
  name: 'FileUpload',
  props: [
    'file',
    'relayResult',
    'close',
  ],
  data() {
    return {
      link: false,
      ipfsHash: false,
      selectedFile: false,
      progress: 0,
      config,
      fileClass: false,
    };
  },
  mounted() {
    this.selectedFile = this.file || false;
    if (this.file) this.sendToIpfs(this.selectedFile);
  },
  methods: {
    /** @method
     * Get a URL object from the selected file
     * @name getURL
     * @returns created Object URL
     */
    getURL() {
      return URL.createObjectURL(this.selectedFile);
    },
    /** @method
     * Setter
     * Determines which type of file we're sending out in the message
     * this should be used to generalized files for parsing later
     * @name determineFileType
     * @argument type string value of the type of file to check
     * @returns simple file type name for checking later
     */
    determineFileType(type) {
      let ft = 'file';
      if (type.includes('image')) ft = 'image';
      if (type.includes('audio')) ft = 'audio';
      if (type.includes('video')) ft = 'video';
      return ft;
    },
    /** @method
     * Setter
     * Sends the file info out ready for messaging to the parent component
     * This will create a new file class and add the file to the recent
     * files cache stored in Localhost
     * @name sendFileMessage
     */
    async sendFileMessage() {
      if (this.ipfsHash) {
        this.close();
        this.fileClass = new FileC(
          `${config.ipfs.browser}${this.ipfsHash}`,
          this.ipfsHash,
          this.selectedFile,
        );
        this.relayResult(
          this.fileClass.getObject(),
          this.determineFileType(this.selectedFile.type),
        );
        const ipfsUtils = new IPFSUtils(this.$database);
        await ipfsUtils.appendFileCache(this.fileClass.getObject());
        uploadAudio.play();
      }
    },
    /** @method
     * Setter
     * Sets the active file ready for processing
     * this will also trigger an upload to IPFS
     * @name setFile
     * @argument event DOM event for selecting file
     */
    setFile(event) {
      [this.selectedFile] = event.target.files;
      this.sendToIpfs(this.selectedFile);
    },
    /** @method
     * Setter
     * Uploads the file to IPFS. Progress will be updated on the
     * component for tracking in progress bars and watching
     * @name sendToIpfs
     * @argument file the file to be uploaded to IPFS
     */
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
      this.$nextTick(() => {
        this.$refs.hidden.focus();
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./FileUpload.less"></style>
