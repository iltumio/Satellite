<template src="./MessageBody.html"></template>

<script>
  import CircleIcon from '@/components/common/CircleIcon';
  import MessageContext from '@/components/common/context/MessageContext';
  // Embeds
  import Link from '@/components/main/conversation/message/embeds/Link';
  import OfflineChat from '@/components/main/conversation/message/embeds/OfflineChat';
  import YouTube from '@/components/main/conversation/message/embeds/YouTube';
  import Spotify from '@/components/main/conversation/message/embeds/Spotify';
  import SpotifyTrack from '@/components/main/conversation/message/embeds/SpotifyTrack';
  import Payment from '@/components/main/conversation/message/embeds/Payment';
  import Call from '@/components/main/conversation/message/embeds/Call';
  import ImageViewer from '@/components/main/conversation/message/embeds/ImageViewer';
  import File from '@/components/main/conversation/message/embeds/File';
  import Audio from '@/components/main/conversation/message/embeds/Audio';
  import Video from '@/components/main/conversation/message/embeds/Video';
  import Address from '@/components/main/conversation/message/embeds/Address';
  import DwellerCachingHelper from '@/classes/DwellerCachingHelper.ts';
  import config from '@/config/config';

  import * as dayjs from 'dayjs';
  import * as relativeTime from 'dayjs/plugin/relativeTime';

  dayjs.extend(relativeTime);

  export default {
    name: 'MessageBody',
    props: ['messages', 'scrollToEnd'],
    components: {
      CircleIcon,
      MessageContext,
      // Embeds
      Link,
      // Content Services
      YouTube,
      Spotify,
      SpotifyTrack,
      // Internal
      OfflineChat,
      Payment,
      Call,
      ImageViewer,
      Address,
      File,
      Audio,
      Video,
    },
    data() {
      return {
        dwellerCachingHelper: new DwellerCachingHelper(
          config.registryAddress,
          config.cacher.dwellerLifespan,
        ),
        dweller: false,
        isEditable: false,
        showContext: false,
        contextCoordsX: 0,
        contextCoordsY: 0,
        clickedMessage: null,
        config,
      };
    },
    methods: {
      notEncrypted(message) {
        return message.payload.type === 'text' && !message.secure;
      },
      debug() {
        return window.Vault74.debugEnabled;
      },
      handleContext(event) {
        event.preventDefault();
        const msgId = event.target.parentNode.parentNode.getAttribute('data-id');
        if (msgId) {
          [this.clickedMessage] = this.messages.filter(m => m.id === msgId);
          if (!this.clickedMessage) {
            // eslint-disable-next-line
            [this.clickedMessage] = this.messages.filter(m => m._id === msgId);
          }
          this.contextCoordsX = event.clientX;
          this.contextCoordsY = event.clientY;
          this.showContext = true;
        }
      },
      hideContext() {
        this.showContext = false;
      },
      /** @method
       * Formats a date using dayjs to a human readable string
       * @name formattedDate
       * @argument timestamp unicode timestamp to format
       */
      formattedDate(timestamp) {
        return dayjs().to(timestamp);
      },
      /** @method
       * Setter
       * Gets a dweller from the cache by address then
       * sets the dweller info to data
       * @name getDweller
       * @argument address of the dweller to lookup
       */
      async getDweller(address) {
        this.dweller = await this.dwellerCachingHelper.getDweller(address);
      },
      /** @method
       * Check a message for a valid YouTube URL
       * @name parseYoutubeLink
       * @argument message string to check for links in
       * @returns boolean of wether or not a YouTube link is found
       */
      parseYoutubeLink(message) {
        if (typeof message !== 'string') return false;
        // eslint-disable-next-line
        const YTRegex = /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?/;
        return message.match(YTRegex);
      },
      /** @method
       * Check a message for a valid Spotify URL
       * @name parseSpotifyLink
       * @argument message string to check for links in
       * @returns boolean of wether or not a Spotify link is found
       */
      parseSpotifyLink(message) {
        if (typeof message !== 'string') return false;
        // TODO: I suck at regex, this needs to be a lot more enclusive for songs, artists, etc
        // eslint-disable-next-line
        const SpotifyURL = /https:\/\/open.spotify.com\/playlist\/\S+/;
        return message.match(SpotifyURL);
      },
      parseSpotifyTrack(message) {
        if (typeof message !== 'string') return false;
        // TODO: I suck at regex, this needs to be a lot more enclusive for songs, artists, etc
        // eslint-disable-next-line
        const SpotifyURL = /https:\/\/open.spotify.com\/track\/\S+/;
        return message.match(SpotifyURL);
      },
      /** @method
       * Check a message for a valid Ethereum address
       * @name parseEthAddress
       * @argument message string to check for addresses in
       * @returns boolean of wether or not a Ethereum address is found
       */
      parseEthAddress(message) {
        if (typeof message !== 'string') return false;
        // eslint-disable-next-line
        const ETHRegex = /^0x[a-fA-F0-9]{40}$/;
        return message.match(ETHRegex);
      },
      /** @method
       * Wrap links in <a> tags
       * @name wrapLinks
       * @argument message string to wrap links in
       * @returns string value of formatted message
       */
      wrapLinks(message) {
        return decodeURI(message).replace(/(?:(https?:\/\/[^\s]+))/m, '<a href="$1" target="_blank">$1</a>');
      },
    },
    mounted() {
      this.getDweller(this.messages[0].sender);
      if (this.messages[0].sender === this.$store.state.activeAccount) {
        this.isEditable = true;
      }
    },
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./MessageBody.less" lang="less"></style>
