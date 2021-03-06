import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import(/* webpackChunkName: "about" */ './views/Index.vue')
    },
    {
      path: '/ui',
      name: 'ui',
      component: () => import(/* webpackChunkName: "about" */ './views/Ui.vue')
    }
  ]
});
