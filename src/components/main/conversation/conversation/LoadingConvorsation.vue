<template>
    <div 
      id="conversation"
      :class="`${(mediaOpen) ? 'media-open' : 'media-closed'} ${(voice) ? 'media-voice' : ''}`"
      ref="chat">
        <div class="bar-small"></div>
        <div class="bar-large"></div>
        <div class="bar-large"></div>
        <div class="bar-small"></div>
        <div class="bar-small"></div>
        <div class="bar-large"></div>
        <div class="bar-large"></div>
    </div>
</template>

<!--
  Noconversation.vue
  This component is shown if users haven't chatted yet.
-->
<script>
export default {
  name: 'NoConversation',
  props: [
    'mediaOpen',
    'voice',
  ],
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
    .bar-small {
      background: rgb(2,0,36);
      background: linear-gradient(90deg,  rgba(32,32,43,0.45) 0%, rgba(32,32,43,0.65) 50%, rgba(32,32,43,0.45) 100%);
      height: 30px;
      width: 35%;
      border-radius: 5px;
      background-size: 200% 200%;
      animation: gradient 0.5s ease infinite;
      margin: 1rem 1rem;
    }
    .bar-large {
      width: 55%;
      height: 100px;
      border-radius: 5px;
      margin: 1rem 1rem;
      background: linear-gradient(90deg,  rgba(32,32,43,0.45) 0%, rgba(32,32,43,0.65) 50%, rgba(32,32,43,0.45) 100%);
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
    #conversation {
      position: absolute;
      top: 3rem;
      left: 0;
      right: 0;
      bottom: 7.5rem;
      padding: 2.5rem 0.4rem;
      padding-top: 0;
      overflow-y: scroll;
      transition: top ease-in-out 0.05s;
      background: #f8f9fb;
      scrollbar-width: thin;
      text-align: center;
    }
    .media-open {
      top: 23rem !important;
    }
    .media-voice {
      top: 16rem !important;
    }
    #scrollBottom {
      position: fixed;
      right: 2rem;
      bottom: 8rem;
      z-index: 2;
      background: #00d0a1;
      color: #fff;
      border-radius: 5px;
      padding: 0.5rem 1rem;
    }
    #scrollBottom:hover {
      cursor: pointer;
      background: #02ddaa;
    }
</style>
