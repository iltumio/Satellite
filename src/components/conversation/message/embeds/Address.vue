<template>
  <div id="payment">
    <article class="media" v-on:click="clickAction">
      <div class="media-content">
        <div class="content">
          <p v-if="account">
            <CircleIcon 
              :address="account.address" 
              :image="account.photo"
              :diameter="35" />
              <span class="text">
                <strong class="filename">{{ account.name }}</strong><br>
                <span class="status">{{ account.statusMsg }}</span>
              </span>
          </p>
          <p v-else>
            <i class="fas fa-file-invoice logo"></i>
            <strong class="filename">{{ address[0] }}</strong>
            <br />
            <ExternalLink
              :link="getEtherscanLink()"
              :text="$t('conversation.message.address.external_link_text')"
            />
          </p>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import ExternalLink from '@/components/common/ExternalLink'
import config from '@/config/config'
import CircleIcon from '@/components/common/CircleIcon'
import DwellerCachingHelper from '@/classes/DwellerCachingHelper'
import { getExplorerByNetwork } from '@/utils/EthereumProvider.ts'

export default {
  name: 'Address',
  props: ['address'],
  components: {
    ExternalLink,
    CircleIcon
  },
  data() {
    return {
      loading: true,
      account: false,
      cache: new DwellerCachingHelper(
        this.$ethereum,
        config.registryAddress,
        config.cacher.dwellerLifespan
      ),
    }
  },
  methods: {
    async isAccount() {
      const user = await this.cache.getDweller(this.address[0])
      return user
    },
    getEtherscanLink () {
      return `${getExplorerByNetwork(config.network.chain)}/address/${
        this.address[0]
      }`
    },
    clickAction() {
      if (this.account) {
         this.$store.commit('viewProfile', this.address[0])
      }
    }
  },
  async mounted() {
    const isAccount = await this.isAccount()
    if (isAccount) {
      this.account = isAccount
      console.log('its an account')
    } else {
      this.account = false
    }
    this.loading = false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#payment {
  margin-top: 0.5rem;
  max-width: 500px;
}
.media {
  background: #fff;
  border-radius: 6px;
  border: 1px solid #eee;
  padding: 0 1rem 0 1rem;
  max-width: 500px;
  color: #666;
  position: relative;
  border-left: 4px solid #00d0a1;
}
.media:hover .logo {
  color: #000;
}
.filename {
  font-size: 12pt;
}
.heading {
  font-size: 9pt;
}
.media-content {
  padding: 0.3rem;
  font-size: 10pt;
}
.label {
  padding: 0 !important;
}
.content {
  padding: 0.5rem 0 0.5rem 3rem;
}
.logo {
  font-size: 24pt;
  position: absolute;
  left: 1.4rem;
  top: 1.2rem;
}
.amount {
  color: #00d0a1;
  font-size: 15pt;
}
img {
  border-radius: 4px;
}
.circle-icon {
  float: left;
  margin: 0 -0.6rem;
}
.text, .status{
  padding-left: 2rem;
}
</style>
