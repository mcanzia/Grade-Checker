import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Routes from "./routes"
import * as firebase from 'firebase'
import { store } from './store'
import AlertCmp from './components/Alert.vue'

Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.use(VueResource)

Vue.component('app-alert', AlertCmp)

const router = new VueRouter({
  routes: Routes,
  mode: 'history',
});

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyBT9iFQOyTzxDz_qRqyv9YyjS3ZYdJEpNo',
      authDomain: 'grade-checker-mjcanzia.firebaseapp.com',
      databaseURL: 'https://grade-checker-mjcanzia.firebaseio.com',
      projectId: 'grade-checker-mjcanzia',
      storageBucket: 'grade-checker-mjcanzia.appspot.com',
    });
  }
})
