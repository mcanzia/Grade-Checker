<template>
  <v-app>
    <router-view></router-view>
    <v-toolbar fixed app :clipped-left="clipped" color="light-green lighten-2">
      <v-toolbar-items>
      <v-btn flat v-for="item in toolbarItems" :key="item.title" :to="item.link">
        {{item.title}}
      </v-btn>
    </v-toolbar-items>
      <div v-if="addClassMode">
        <v-btn flat @click='save'>Save</v-btn>
      </div>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="this.userIsAuthenticated" icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid grid-list-md>



      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  import AddClass from './components/addClass.vue';
  export default {
    data () {
      return {
        clipped: false,
        drawer: true,
        fixed: false,

        isLogin: true,
        addClassMode: false,
        saveError: false,

        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Grade Checker',
      }
    },
    computed: {
      toolbarItems () {
        let toolbarItems = [
          {title: 'Login', link: '/signin'},
          {title: 'Register', link: '/signup'},
        ]
        if (this.userIsAuthenticated) {
          toolbarItems = [
            {title: 'Logout', link: '/'},
            {title: 'Add Class', link: '/add'},
          ]
          if (this.$route.name === 'Add') {
            toolbarItems = []
            this.addClassMode = true;
          } else {
            this.addClassMode = false;
          }
        }
        return toolbarItems
      },
      userIsAuthenticated() {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
    },
    methods: {

      login() {
        this.$router.push({ path: 'signin' });
        this.isLogin = true;
      },
      register() {
        this.$router.push( { path: 'signup' } );
      },
      save() {
        if (this.$store.getters.saveHundred === 0 && this.$store.getters.saveClassName !== "") {
          this.saveError = false;
          this.$store.dispatch('resetSaveStatus');
          this.$router.push({path: "home"});
        } else {
          this.saveError = true;
        }
      }
    }
  }
</script>

<!-->
<v-tooltip v-model="saveError" right close-delay>
  <span>Name field empty or percentages do not add up to 100</span>
</v-tooltip>
*/
<-->
