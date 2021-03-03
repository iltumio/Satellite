<template>
  <div>
    <PhotoCropper 
      field="img"
      langType="en"
      @crop-success="cropSuccess"
      v-model="showCropper"
      :value="showCropper"/>
    <p class="label">{{$t('settings.profile.change_photo')}}</p>
    <button v-if="!ipfsHash" class="button is-primary is-small" v-on:click="toggleCropper">{{$t('settings.profile.upload_profile_pic')}}</button>
    <p v-if="ipfsHash">
      <i class="fa fa-circle-notch fa-pulse"></i> {{$t('settings.profile.confirm_transaction')}}
    </p>    
    <div style="clear: both;"></div>
    <br>

    <p v-if="error" class="red">{{error}}</p>
  </div>
</template>

<script>
import PhotoCropper from 'vue-image-crop-upload';
import Registry from '@/classes/contracts/Registry.ts';
import DwellerContract from '@/classes/contracts/DwellerContract.ts';
import config from '@/config/config';

export default {
  name: 'ChangePhoto',
  props: ['changePhotoHandler', 'close', 'refresh'],
  components: {
    PhotoCropper,
  },
  data() {
    return {
      profileFile: false,
      error: false,
      ipfsHash: false,
      showCropper: false,
    };
  },
  mounted() {
    this.toggleCropper();
  },
  methods: {
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
    toggleCropper() {
      this.showCropper = !this.showCropper;
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
      this.uploadProfilePic(resultFile);
      this.showCropper = false;
    },
    async changePhoto() {
      // Create a registry contract instance
      const registry = new Registry(this.$ethereum, config.registry[config.network.chain]);
      const dwellerContractAddress = await registry.getDwellerContract(this.$ethereum.activeAccount);

      // Create a dweller contract instance
      const dwellerContract = new DwellerContract(this.$ethereum, dwellerContractAddress);

      this.$store.commit('setStatus', 'Transaction created, waiting for confirm');
      dwellerContract.setPhoto(
        this.ipfsHash,
        () => {
          this.close();
          this.$store.commit('setStatus', 'Transaction confirmed');
          this.$store.commit('profilePictureHash', this.ipfsHash.path);
        },
      );
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
      this.changePhoto();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .change-photo {
    float: right;
  }
</style>
