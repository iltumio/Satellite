<template>
  <div 
    id="action-selector" 
    class="context"
    v-click-outside="close">
    <p class="label">{{$t('settings.profile.edit_profile')}}</p>
    <ul>
      <li v-on:click="changePhoto">{{$t('settings.profile.change_photo')}}</li>
      <li v-on:click="changeUsername">{{$t('settings.profile.change_username')}}</li>
      <li><hr></li>
      <li>{{$t('settings.profile.copy_address')}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ActionSelector',
  props: ['close', 'changePhoto', 'changeUsername'],
  /* eslint-disable */
  directives: {
    'click-outside': {
      bind: (el, binding) => {
        let clickedOffOnce = false;
        // Define ourClickEventHandler
        const ourClickEventHandler = event => {
          if (!el.contains(event.target) && el !== event.target) {
            if (clickedOffOnce) {
              // as we are attaching an click event listern to the document (below)
              // ensure the events target is outside the element or a child of it
              binding.value(event); // before binding it
            }
          }
          clickedOffOnce = true;
        };
        // attached the handler to the element so we can remove it later easily
        el.__vueClickEventHandler__ = ourClickEventHandler;

        // attaching ourClickEventHandler to a listener on the document here
        document.addEventListener("click", ourClickEventHandler);
      },
      unbind: function(el) {
        // Remove Event Listener
        document.removeEventListener("click", el.__vueClickEventHandler__);
      }
    }
  },
  /* eslint-enable */
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .label {
    padding: 0.25rem 0.5rem !important;
    margin: 0;
    padding-bottom: 0 !important;
  }
  #action-selector {
    position: absolute;
    right: 2rem;
    top: 2rem;
    background: #fff;
    border-radius: 3px;
    font-size: 11pt;
    padding: 0.25rem 0.25rem;
    box-shadow: 0px 0px 4px rgba(0,0,0,0.25);
    z-index: 2;
  }
  ul li {
    padding: 0.2rem 0.5rem;
    cursor: pointer;
  }
  ul li:hover {
    color: #333;
  }
  hr {
    margin: 0;
  }
</style>
