<template src="./FileUpload.html"></template>

<script>
import config from '@/config/config';
import FileC from '@/classes/FileC.ts';
import PrimaryHeading from '@/components/common/typography/PrimaryHeading';

const uploadAudio = new Audio(`${config.ipfs.browser}${config.sounds.upload}`);

export default {
  name: 'FileUpload',
  components: {
    PrimaryHeading,
  },
  props: [
    'file',
    'relayResult',
    'close',
  ],
  data() {
    return {
      ipfsHash: false,
      selectedFile: false,
      progress: 0,
      imageURL: null,
      config,
      fileClass: false,
      error: false,
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
          this.imageURL,
          this.ipfsHash,
          this.selectedFile,
        );
        this.relayResult(
          this.fileClass.getObject(),
          this.determineFileType(this.selectedFile.type),
        );
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
      this.error = false;
      [this.selectedFile] = event.target.files;
      const size = this.selectedFile.size / 1024 / 1024; // MiB
      if (size > 40) {
        this.error = 'Please select a file smaller than 40 MiB';
        this.selectedFile = false;
      } else {
        this.sendToIpfs(this.selectedFile);
      }
    },
    /** @method
     * Setter
     * Uploads the file to IPFS. Progress will be updated on the
     * component for tracking in progress bars and watching
     * @name sendToIpfs
     * @argument file the file to be uploaded to IPFS
     */
    async sendToIpfs(file) {
      const path = `/${this.$database.bucketManager.prefix}/uploads/${file.name}`;
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
<style scoped lang="less" src="./FileUpload.less"></style>
