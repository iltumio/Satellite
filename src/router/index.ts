import Vue from 'vue';
import Router from 'vue-router';
// @ts-ignore
import ChatComponent from '@/components/Chat';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: window.location.pathname,
  routes: [
    {
      path: '/',
      name: 'home',
      component: ChatComponent
    },
    {
      path: '*',
      component: {
        render(h) {
          return h('h1', 'Page not found!');
        }
      }
    }
  ]
});

export default router;
