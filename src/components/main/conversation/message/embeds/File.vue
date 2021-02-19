<template>
  <div id="file-embed">
    <a :href="message.payload.data.url" :download="message.payload.data.filename" target="_blank">
      <article class="media">
        <div class="media-content">
          <div class="content">
            <p>
              <i class="fas fa-file-download logo"></i>
              <strong class="filename">{{message.payload.data.filename}}</strong>
              <br>
              <span class="label">{{bytesToSize(message.payload.data.size)}}</span>
            </p>
          </div>
        </div>
      </article>
    </a>
  </div>
</template>

<script>

export default {
  name: 'File',
  props: [
    'message',
  ],
  methods: {
    bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 Bytes';
      // eslint-disable-next-line
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      // eslint-disable-next-line
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #file-embed {
    margin-top: 0.5rem;
    max-width: 400px;
  }
  .media {
    background: #fff;
    border-radius: 6px;
    border: 1px solid #eee;
    padding: 0 1rem 0 1rem;
    max-width: 400px;
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
</style>
