<template>
  <div id="payment">
    <article class="media">
      <div class="media-content">
        <div class="content">
          <p>
            <i class="fab fa-ethereum logo"></i>
            <strong class="amount">{{message.data.amount}} Ether</strong><br />
            <small>{{message.data.from}}</small><br>
            <i class="fas fa-arrow-down"></i>
            <i class="fas fa-arrow-down"></i>
            <i class="fas fa-arrow-down"></i>
            <b>{{message.data.amount}} ETH</b>
            <i class="fas fa-arrow-down"></i>
            <i class="fas fa-arrow-down"></i>
            <i class="fas fa-arrow-down"></i>
            <small>{{message.data.to}}</small>
            <br>
            <ExternalLink 
              :link="`${config.network.explorer}/tx/${message.data.tx}`" 
              :text="$t('global.view_on_etherscan')">
            </ExternalLink>
          </p>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import config from '@/config/config';
import ExternalLink from '@/components/common/ExternalLink';

export default {
  name: 'Payment',
  components: {
    ExternalLink,
  },
  props: [
    'message',
  ],
  data() {
    return {
      name: false,
      config,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .media {
    background: #fff;
    border-radius: 6px;
    border: 1px solid #eee;
    padding: 0 1rem 0.5rem 1rem;
    max-width: 450px;
    color: #666;
    position: relative;
    border-left: 4px solid #00d0a1;
    margin-bottom: 0.5rem;
  }
  .media:hover .logo {
    color: #000;
  }
  .media-content {
    padding: 0.3rem;
    font-size: 10pt;
  }
  .content {
    padding-left: 5rem;
  }
  .logo {
    font-size: 38pt;
    position: absolute;
    left: 2rem;
    top: 1.15rem;
  }
  .amount {
    color: #00d0a1;
    font-size: 15pt;
  }
  img {
    border-radius: 4px;
  }
</style>
