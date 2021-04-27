<template>
  <div
    id="conversation"
    :class="
      `${mediaOpen ? 'media-open' : 'media-closed'} ${
        voice ? 'media-voice' : ''
      }`
    "
    ref="chat"
  >
    <div class="noconvo">
      <hr class="divider" />
      <h2 class="heading">
        {{ $t('conversation.conversation.no_conversation_heading') }}
      </h2>
      <span>{{ $t('conversation.conversation.no_conversation_subtext') }}</span>
    </div>
  </div>
</template>

<!--
  Noconversation.vue
  This component is shown if users haven't chatted yet.
-->
<script>
export default {
  name: 'NoConversation',
  props: ['mediaOpen', 'voice']
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
#conversation {
  position: absolute;
  top: 3rem;
  left: 0;
  right: 0;
  bottom: 7.5rem;
  padding: 2.5rem 0.4rem;
  padding-top: 2rem;
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
