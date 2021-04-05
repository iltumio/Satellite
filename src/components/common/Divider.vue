<template>
  <div class="separator">
    <span class="text">{{ getFormattedDate(text) }}</span>
  </div>
</template>

<script>
export default {
  name: 'Divider',
  props: ['text'],
  methods: {
    getFormattedDate (timestamp) {
      const d = new Date(timestamp)
      const dateString = `${this.$i18n.t(
        `dates.month_names.${d.getMonth()}`
      )}, ${d.getDate()}`
      return dateString
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.divider {
  color: pink;
}
.separator {
  display: flex;
  align-items: center;
  text-align: center;
  font-weight: bold;
  color: #bbb;
  margin: 0;
  font-size: 9pt;
}
.separator::before,
.separator::after {
  content: '';
  flex: 1;
  padding-top: 0rem;
  border-bottom: 2px solid #eee;
}
.separator::before {
  margin-right: 0.45em;
  margin-left: 3rem;
}
.separator::after {
  margin-left: 0.45em;
  margin-right: 3rem;
}

@media only screen and (max-width: 768px) {
  .separator {
    display: flex;
    width: 100%;
    clear: both;
    align-items: center;
    text-align: center;
    font-weight: bold;
    color: #bbb;
    margin: 0;
    font-size: 9pt;
    margin: 1rem 0;
  }
}
</style>
