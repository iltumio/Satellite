<template>
  <div>
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{$t('settings.audio_video.input_heading')}}</h2>
        <p>{{$t('settings.audio_video.input_subtext')}}</p>
        <div class="select">
          <select v-model="$store.state.audioDevice">
            <option v-for="device in audioDevices" :key="device.deviceId">{{device.label || $t('settings.audio_video.input_default_text')}}</option>
          </select>
        </div>
        <hr class="spacer">
        <h2>{{$t('settings.audio_video.audio_output')}}</h2>
        <p>{{$t('settings.audio_video.audio_output_subtext')}}</p>
        <div class="select">
          <select>
            <option>{{$t('settings.audio_video.audio_output_default')}}</option>
          </select>
        </div>
        <hr class="spacer">
        <div class="columns">
          <div class="column">
            <h2>{{$t('settings.audio_video.audio_bitrate')}}</h2>
            <p>{{$t('settings.audio_video.audio_bitrate_subtext')}}</p>
            <div class="select">
              <select v-model="$store.state.audioQuality">
                <option value="8">8kbps</option>
                <option value="64">64kbps</option>
                <option value="96">96kbps</option>
                <option value="256">256kbps</option>
                <option value="320">320kbps (MP3)</option>
                <option value="700">510kbps (Opus Peak)</option>
                <option value="1411">1411kbps (FLAC)</option>
              </select>
            </div>
          </div>
          <hr class="spacer">
          <div class="column">
            <h2>{{$t('settings.audio_video.sample_size')}}</h2>
            <p>{{$t('settings.audio_video.sample_size_subtext')}}</p>
            <div class="select">
              <select v-model="$store.state.audioSamples">
                <option value="2">2bits</option>
                <option value="8">8bits</option>
                <option value="24">24bits</option>
                <option value="32">32bits</option>
              </select>
            </div>
          </div>
        </div>
        <hr class="spacer">
        <div class="columns">
          <div class="column">
            <h2>{{$t('settings.audio_video.echo_cancellation')}}</h2>
            <p>{{$t('settings.audio_video.echo_cancellation_subtext')}}</p>
            <br>
            <ToggleSwitch v-model="$store.state.echoCancellation"/>
          </div>
          <hr class="spacer">
          <div class="column">
            <h2>{{$t('settings.audio_video.noise_supression')}}</h2>
            <p>{{$t('settings.audio_video.noise_supression_subtext')}}</p>
            <br>
            <ToggleSwitch v-model="$store.state.noiseSuppression"/>
          </div>
        </div>
        <div class="bordered margin-2">
        <p v-if="love >= 20">
          <i class="fa fa-heart red" /> Lauren my darling, I love you from now until forever.
        </p>
        <div class="columns no-mobile">
          <div class="column image-ipfs" style="max-width: 100px;">
            <img v-on:click="love += 1" src="static/img/icons/opus-logo.png" class="margin" alt="" />
          </div>
          <div class="column padded">
            <p class="padded">
              {{$t('settings.audio_video.opus')}}
              <br>
              <a href="https://opus-codec.org/">https://opus-codec.org/</a>
            </p>
          </div>
        </div>
      </div>
      </div>
    </article>
    <hr class="spacer">
    <h3 class="label">{{$t('settings.audio_video.video')}}</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{$t('settings.audio_video.video_heading')}}</h2>
        <p>{{$t('settings.audio_video.video_subtext')}}</p>
        <div class="select">
          <select v-model="$store.state.videoDevice">
            <option v-for="device in videoDevices" :key="device.deviceId">{{device.label || $t('settings.audio_video.video_default_text')}}</option>
          </select>
        </div>
      </div>
    </article>
    <hr class="spacer">
    <h3 class="label">{{$t('settings.audio_video.screen-share')}}</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{$t('settings.audio_video.capture-mouse')}}</h2>
        <p>{{$t('settings.audio_video.capture-mouse-info')}}</p>
        <div class="select">
          <select v-model="$store.state.captureMouse">
            <option value="always">{{$t('settings.audio_video.capture-mouse-always')}}</option>
            <option value="motion">{{$t('settings.audio_video.capture-mouse-movement')}}</option>
            <option value="never">{{$t('settings.audio_video.capture-mouse-never')}}</option>
          </select>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import ToggleSwitch from '@/components/common/ToggleSwitch';

export default {
  name: 'AudioVideo',
  components: {
    ToggleSwitch,
  },
  data() {
    return {
      love: 0, // shh, its secret
      devices: false,
      audioQuality: 320,
      audioDevices: [],
      videoDevices: [],
      echoCancellation: false,
      noiseSuppression: false,
    };
  },
  async mounted() {
    const devices = await navigator.mediaDevices.enumerateDevices({ audio: true, video: true });
    this.audioQuality = this.$store.state.audioQuality;
    this.devices = devices;
    devices.forEach((device) => {
      if (device.kind === 'videoinput') this.videoDevices.push(device);
      if (device.kind === 'audioinput') this.audioDevices.push(device);
    });
    if (!this.$store.state.selectedVideoDevice) {
      this.$store.commit('setVideoDevice', this.videoDevices[0].label || 'Default Webcam');
    }
    if (!this.$store.state.selectedAudioDevice) {
      this.$store.commit('setAudioDevice', this.audioDevices[0].label || 'Default Microphone');
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .margin {
    margin: 0.5rem;
    margin-left: 25px;
    width: 150px;
  }
  .margin-2 {
    margin: 1rem 0;
  }
  .padded {
    padding-top: 0.65rem;
    padding-left: 1rem;
  }

  @media(max-width: 768px) {
    .image-ipfs {
      margin: 0 auto;
    }

    .image-ipfs img {
      margin: 20px 0 0 0;
    }
  }
</style>
