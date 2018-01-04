import addClass from "./components/addClass.vue";
import Home from "./components/Home.vue";
import Signup from "./components/User/Signup.vue";
import Signin from "./components/User/Signin.vue";
import App from "./App.vue";
import AuthGuard from './auth-guard.js';
import viewClass from './components/viewClass.vue';
import editClass from './components/editClass.vue';

export default [
  { path: '/add', name: 'Add', component: addClass, beforeEnter: AuthGuard},
  { path: '/home', name: 'Home', component: Home, beforeEnter: AuthGuard },
  { path: '/view/:id', name: 'View', component: viewClass, beforeEnter: AuthGuard },
  { path: '/edit', name: 'Edit', component: editClass, beforeEnter: AuthGuard },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/signin', name: 'Signin', component: Signin },
]
