<template>
  <div :class="`modal ${active ? 'is-active' : ''}`">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <CircleIcon image="https://randomuser.me/api/portraits/women/43.jpg" />
        <p class="modal-card-title">
          {{ person }} <br />
          <span class="address">0x0000000000000000000000000000000</span>
        </p>
        <button class="delete" aria-label="close" v-on:click="toggle"></button>
      </header>
      <section class="modal-card-body">
        <p>
          <i class="fab fa-ethereum"></i> {{ $t('payments.pay-label') }}
          {{ person }}.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import CircleIcon from '@/components/common/CircleIcon'

export default {
  name: 'Payment',
  props: ['active', 'toggle', 'person'],
  components: {
    CircleIcon
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.is-normal {
  background: #00d0a1;
  color: #fff;
  border: #00deac;
}
.is-normal:hover {
  color: #fff;
  background: #00deac;
}
.modal-card {
  margin-top: 0;
  border-radius: 5px;
}
.modal-card-head {
  background: #fff;
  border-radius: none !important;
}
.modal-card-body {
  background: #e7ebee;
}
.chat-group {
  position: absolute;
  bottom: 2rem;
  right: 0;
  left: 0;
  height: 5rem;
  padding: 1rem;
}
.input-collection {
  background: #e7ebee;
  border-radius: 5px;
  width: 100%;
  height: 100%;
}
.input-collection i {
  color: #666;
  cursor: pointer;
}
.send {
  position: absolute;
  right: 2.2rem;
  top: 1.75rem;
  font-size: 19pt;
}
.upload {
  position: absolute;
  left: 2.2rem;
  top: 1.75rem;
  font-size: 19pt;
}
.fingerprint {
  position: absolute;
  right: 4.75rem;
  top: 1.75rem;
  font-size: 19pt;
}
.messageuser {
  margin-left: 3rem;
  margin-top: 0.25rem;
  background: transparent;
  border: none;
  box-shadow: none;
  font-size: 12pt;
  width: calc(100% - 8rem);
}
input:focus,
input:focus {
  outline: none !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  border: none !important;
}
input::placeholder {
  color: #666;
  opacity: 0.75;
}
.address {
  font-size: 10pt;
  color: #ccc;
}
.modal-card-title {
  margin-left: 1rem;
}
.circle-icon {
  height: 55px;
  width: 55px;
}
</style>
