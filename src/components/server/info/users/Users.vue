<template>
  <div class="server-info-users">
    <span class="label">Users</span>
    <div style="clear: both;"></div>
    <div class="server-info-users-container">
      <div
        class="server-info-users"
        v-for="user in users"
        :key="user.address">
        <User :user="user" />
      </div>
    </div>
  </div>
</template>

<script>
import User from './User';

export default {
  name: 'Users',
  components: {
    User,
  },
  data() {
    return {
      users: [
        {
          name: 'Matt',
          address: '0xee5F87C6efEa399C07ed0E18CEbF143fCFe5D66E',
        },
        {
          name: 'Samantha',
          address: '0x5635e06B8655C1455Da640162061c1392DB16357',
        },
        {
          name: 'Tom Tomison',
          address: '0xD3312142f90B6002D6CF01A9d858BED4e49Afcf7',
        },
        {
          name: '__xile',
          address: '0xee5F87C6efEa399C07ed0E18CEbF143fCFe5D66E',
        },
        {
          name: 'Frank Frankie',
          address: '0x5635e06B8655C1455Da640162061c1392DB16357',
        },
        {
          name: 'Green Laser',
          address: '0xD3312142f90B6002D6CF01A9d858BED4e49Afcf7',
        },
        {
          name: 'Fresh Water',
          address: '0xee5F87C6efEa399C07ed0E18CEbF143fCFe5D66E',
        },
        {
          name: 'Tom Tomison',
          address: '0xe0aD7E3DcE64068a1c5ccF66893B7cAFc633e551',
        },
        {
          name: '__xile',
          address: '0x5635e06B8655C1455Da640162061c1392DB16357',
        },
        {
          name: 'Frank Frankie',
          address: '0xD3312142f90B6002D6CF01A9d858BED4e49Afcf7',
        },
        {
          name: 'Green Laser',
          address: '0xe0aD7E3DcE64068a1c5ccF66893B7cAFc633e551',
        },
        {
          name: 'Fresh Water',
          address: '0x5635e06B8655C1455Da640162061c1392DB16357',
        },
      ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.server-info-users-container {
  height: 250px;
  overflow-y: scroll;
}
</style>
