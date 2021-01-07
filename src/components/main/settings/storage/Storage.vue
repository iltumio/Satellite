<template>
  <div>
    <h3 class="label">{{$t('settings.storage.database_label')}}</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>Enable Database</h2>
        <div class="bordered margin-2">
          <div class="columns">
            <div class="column" style="max-width: 200px;">
              <img src="https://textile.io/images/logo.png" class="margin" alt="" />
            </div>
            <div class="column padded">
              <p class="padded">
                {{$t('settings.storage.threadDB')}}
                <br>
                {{$t('settings.storage.threadDB_learn_more')}} <a href="https://textile.io/">https://textile.io/</a></p>
            </div>
          </div>
        </div>

        <p v-html="$t('settings.storage.threadDB_enable')"/>
        <br>
        <ToggleSwitch v-model="$store.state.databaseEnabled"/>
        <hr class="spacer">
        <h2>{{$t('settings.storage.threadDB_data_id')}}</h2>
        <p>
          {{$t('settings.storage.threadDB_data_id_text')}}
          <br> <br>
          <input v-model="dataid" readonly class="input is-small" placeholder="data..." />     
        </p>
      </div>
    </article>
    <h3 class="label">{{$t('settings.storage.storage_label')}}</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{$t('settings.storage.lfs_heading')}}</h2>
        <p>{{$t('settings.storage.lfs_subtext')}}</p>
        <br>
        <button class="button is-primary is-small" v-on:click="requestUnlimitedStorage">
          {{$t('settings.storage.lfs_request')}}
        </button>
        <hr class="spacer">
        <h2>{{$t('settings.storage.export_ls_heading')}}</h2>
        <p>{{$t('settings.storage.export_ls_subtext')}}</p>
        <br>
        <button class="button is-primary is-small" v-on:click="exportStorage">
         {{$t('settings.storage.export_ls_button')}}
        </button>
        <hr class="spacer">
        <h2>{{$t('settings.storage.data_heading')}}</h2>
        <p class="heading">{{storageSize}}</p>
        <p>{{$t('settings.storage.data_subtext')}}<br>
        <br>
        {{$t('settings.storage.data_subtext_two')}}</p>
        <br>
        <button class="button is-danger is-small" v-on:click="clearData">
          <i class="fas fa-skull-crossbones"></i> &nbsp; {{$t('settings.storage.clear_data')}}
        </button>
      </div>
    </article>
  </div>
</template>

<script>
import ToggleSwitch from '@/components/common/ToggleSwitch';

export default {
  name: 'Storage',
  components: {
    ToggleSwitch,
  },
  data() {
    return {
      dataid: localStorage.getItem('textile.threads.user-storage'),
      storageSize: this.bytesToSize(new Blob(Object.values(localStorage)).size),
    };
  },
  methods: {
    bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 Bytes';
      // eslint-disable-next-line
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      // eslint-disable-next-line
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },
    requestUnlimitedStorage() {
      // eslint-disable-next-line
      window.browser.permissions.request('unlimitedStorage');
    },
    clearData() {
      localStorage.clear();
      window.location.reload();
    },
    downloadToFile(content, filename, contentType) {
      const a = document.createElement('a');
      const file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    },
    exportStorage() {
      this.downloadToFile(
        JSON.stringify(localStorage),
        'storage.json',
        'application/json',
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .margin {
    margin: 0.5rem;
    margin-left: 25px;
    width: 150px;
  }
  .margin-2 {
    margin: 1rem 0;
  }
  .padded {
    padding-top: 0.65rem;
    padding-left: 1rem;
  }
</style>
