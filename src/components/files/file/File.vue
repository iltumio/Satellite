<template src="./File.html"></template>

<script>
import FileIconMapper from '@/utils/FileIconMapper.ts';

export default {
  name: 'File',
  props: [
    'file',
    'updateParent',
    'index',
  ],
  data() {
    return {
      hovered: false,
      unpinned: false,
    };
  },
  methods: {
    /** @method
     * Converts the bytes to a readable string
     * @name bytesToSize
     * @argument bytes value to convert to human readable string
     * @returns human readable filesize
     */
    bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 Bytes';
      // eslint-disable-next-line
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      // eslint-disable-next-line
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },
    /** @method
     * Setter
     * Remove the file from the local cache, not IPFS
     * @name deleteFile
     */
    async deleteFile() {
      this.$database.bucketManager.removeFile(this.file, this.file.path);
      this.unpinned = true;
      setTimeout(() => {
        this.updateParent();
      }, 4000);
    },
    /** @method
     * Setter
     * Traanslates the filetype to a fontawesome icon class
     * @name translateFiletype
     * @argument filetype the filetype to map to
     * @returns fontawesome class identifying the given filetype
     */
    translateFiletype(filetype) {
      return FileIconMapper.translateFiletype(filetype, FileIconMapper.mappings);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./File.less"></style>
