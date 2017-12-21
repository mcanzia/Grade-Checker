import addClass from "./components/addClass.vue";
import Home from "./components/Home.vue";
import Signup from "./components/User/Signup.vue";
import Signin from "./components/User/Signin.vue";
import App from "./App.vue";

export default [
  { path: '/add', name: 'Add', component: addClass},
  { path: '/home', name: 'Home', component: Home },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/signin', name: 'Signin', component: Signin },
]
