<template>
  <div>
    <h3 class="label">{{$t('settings.keybinds.label')}}</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{$t('settings.keybinds.heading')}}</h2>
        <p>{{$t('settings.keybinds.subtext')}}</p>
        <br>
        <br>
        <div class="columns">
          <div class="column">
            <p class="label">{{$t('settings.keybinds.toggle_mute')}}</p>
            <input class="input" value="ALT + M" readonly />
            <br>
            <br>
            <p class="label">{{$t('settings.keybinds.toggle_deafen')}}</p>
            <input class="input" value="ALT + D" readonly />
          </div>
          <div class="column">
            <p class="label">{{$t('settings.keybinds.toggle_settings')}}</p>
            <input class="input" value="ALT + S" readonly />
            <br>
            <br>
            <p class="label">{{$t('settings.keybinds.call')}}</p>
            <input class="input" value="ALT + C" readonly />
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'Keybinds',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
