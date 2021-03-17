<template>
  <div class="switch-button-control">
    <div class="switch-button" :class="{ enabled: isEnabled }" @click="toggle" :style="{'--color': color}">
      <div class="sw-button">
      </div>
    </div>
    <div class="switch-button-label">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToggleSwitch',
  model: {
    prop: 'isEnabled',
    event: 'toggle',
  },
  props: {
    isEnabled: Boolean,
    color: {
      type: String,
      required: false,
      default: '#0984e3',
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle', !this.isEnabled);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .switch-button-control {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .switch-button-control .switch-button {
    height: 1.6em;
    width: calc(1.6em * 2);
    border: 2px solid var(--color);
    box-shadow: inset 0px 0px 2px 0px rgba(0, 0, 0, 0.33);
    border-radius: 1.6em;
    transition: all 0.05s ease-in-out;
    cursor: pointer;
  }
  .switch-button-control .switch-button .sw-button {
    height: calc(1.6em - (2 * 2px));
    width: calc(1.6em - (2 * 2px));
    border: 2px solid var(--color);
    border-radius: calc(1.6em - (2 * 2px));
    background: var(--color);
    transition: all 0.05s ease-in-out;
  }
  .switch-button-control .switch-button.enabled {
    background-color: var(--color);
    box-shadow: none;
  }
  .switch-button-control .switch-button.enabled .sw-button {
    background: white;
    transform: translateX(calc(calc(1.6em - (2 * 2px)) + (2 *2px)));
  }
  .switch-button-control .switch-button-label {
    margin-left: 10px;
  }
  
</style>
