<template src="./CreateServer.html"></template>

<script>
import PhotoCropper from 'vue-image-crop-upload';
import CircleIcon from '@/components/common/CircleIcon';
import ServerContract from '@/classes/contracts/ServerContract.ts';
import Registry from '@/classes/contracts/Registry.ts';
import DwellerContract from '@/classes/contracts/DwellerContract.ts';
import config from '@/config/config';

export default {
  name: 'CreateServer',
  props: ['close', 'update'],
  components: {
    PhotoCropper,
    CircleIcon,
  },
  data() {
    return {
      name: '',
      error: false,
      ipfsHash: false,
      showCropper: false,
      photoUrl: false,
      creating: false,
      done: false,
      transactionHash: false,
      confirmation: false,
    };
  },
  methods: {
    toggleCropper() {
      this.showCropper = !this.showCropper;
    },
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      const byteString = atob(dataURI.split(',')[1]);
      // separate out the mime component
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      // write the bytes of the string to an ArrayBuffer
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
    hideChangePhoto() {
      this.showChangePhoto = false;
    },
    cropSuccess(imgDataUrl) {
      const blob = this.dataURItoBlob(imgDataUrl);
      const resultFile = new File(
        [blob],
        'profile_pic',
        {
          type: blob.type,
        },
      );
      this.photoUrl = imgDataUrl;
      this.uploadProfilePic(resultFile);
      this.showCropper = false;
    },
    // When the file upload changes, we upload the profile picture to IPFS
    // for use in the dweller id card
    async uploadProfilePic(file) {
      this.profileFile = URL.createObjectURL(file);
      if (!file.type.includes('image')) {
        this.error = 'Please use an image for your profile picture.';
        return;
      }
      this.error = false;
      this.$store.commit('setStatus', 'Uploading to IPFS');
      const ipfsResponse = await window.ipfs.add(file);
      this.$store.commit('setStatus', 'File uploaded to IPFS');
      this.ipfsHash = ipfsResponse;
    },
    async confirm() {
      if (this.name < 5) {
        this.error = 'Server name must be at least 5 characters.';
        return false;
      }
      this.error = false;
      this.creating = true;
      await this.submitNewServer();
      return true;
    },
    // Create a new profile via the Registry for this user
    async submitNewServer() {
      this.created = true;
      const registry = new Registry(this.$ethereum, config.registry[config.network.chain]);
      registry.createServer(
        this.name,
        (transactionHash) => {
          this.transactionHash = transactionHash;
        },
        (receipt) => {
          this.confirmation = receipt.confirmations;
          this.finishServer(receipt);
        },
      );
    },
    // Set the dweller id profile picture hash on contract
    // after do any final tasks we need to do on chain
    async finishServer() {
      if (!this.ipfsHash) {
        this.done = true;
        return;
      }
      // Get newest server on dweller contract
      const registry = new Registry(this.$ethereum, config.registry[config.network.chain]);
      const dwellerContractAddress = await registry.getDwellerContract(this.$ethereum.activeAccount);

      // Create a DwellerContract instance
      const dwellerContract = new DwellerContract(this.$ethereum, dwellerContractAddress);
      const servers = await dwellerContract.getServers();
      const newServer = servers[servers.length - 1];

      // Create a server contract instance
      const serverContract = new ServerContract(this.$ethereum, newServer);
      serverContract.setPhoto(
        this.ipfsHash,
        () => {
          this.done = true;
          // TODO: find out what this.update() should do
          // this.update();
          this.close();
        },
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./CreateServer.less"></style>
