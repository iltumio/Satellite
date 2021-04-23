<template>
  <div class="status-indicator">
      <i 
        :class="`fas fa-dot-circle ${getClass()}`"></i>
        <br>
      <span class="subtext">{{text}}</span>
  </div>
</template>

<script>
export default {
    name: 'StatusIndicator',
    props: ['status', 'text'],
    methods: {
        getClass() {
            let color = 'gray'
            switch (this.status) {
                case 'online':
                    color = 'green'
                    break;
                case 'pending':
                    color = 'yellow'
                    break;
                case 'offline':
                    color = 'gray'
                    break;
                default:
                    color = 'red'
                    break;
            }
            return color
        }
    }
}
</script>

<style scoped lang="less">
    .status-indicator {
        float: left;
        width: 45px;
        height: 45px;
        text-align: center;
    }
    .fa-dot-circle {
        font-size: 12pt;
    }
    .subtext {
        font-size: 8pt;
    }
    .green {
        color: #2ecc71;
    }
    .yellow {
        color: #f1c40f;
    }
    .gray {
        color: #34495e;
    }
    .red {
        color: #e74c3c;
    }

</style>