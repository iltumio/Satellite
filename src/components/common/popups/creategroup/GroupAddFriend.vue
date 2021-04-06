<template>
  <div class="columns is-mobile">
    <div class="column photo">
      <CircleIcon
        :image="friend.photo"
        :address="friend.address"
        :diameter="20"
      />
    </div>
    <div class="column name-column">
      {{ friend.name }}
    </div>
    <div class="column add-column">
      <button
        :class="
          `button is-small add-button ${active ? 'is-success' : 'is-primary'}`
        "
        v-on:click="add(friend.address)"
      >
        <i class="fa fa-plus" v-if="!active"></i>
        <i class="fa fa-check" v-else></i>
      </button>
    </div>
  </div>
</template>

<script>
import CircleIcon from '@/components/common/CircleIcon'

export default {
  name: 'GroupAddFriend',
  props: ['friend', 'active', 'add'],
  components: {
    CircleIcon
  }
}
</script>

<style scoped lang="less">
.photo {
  max-width: 44px;
}
.add-button {
  float: right;
  height: 100%;
}
.add-column {
  max-width: 55px;
}
.name-column {
  padding-top: 1.2rem;
}
.circle-icon {
  width: 34px;
  height: 34px;
}
</style>
