<template>
  <v-app>
    <router-view></router-view>
    <v-toolbar fixed app :clipped-left="clipped" color="light-green lighten-2">
      <v-toolbar-items>
        <v-btn flat v-if="userIsAuthenticated && !addClassMode" @click='logout'>Logout</v-btn>
        <v-btn flat v-for="item in toolbarItems" :key="item.title" :to="item.link">
          {{item.title}}
        </v-btn>
        <v-btn flat @click='save' v-if="addClassMode">Save</v-btn>
        <v-btn flat @click='saveEdit' v-if="editClassMode">Save</v-btn>
        <v-btn flat @click='editClass' v-if="viewClassMode">Edit</v-btn>
      </v-toolbar-items>
      <v-toolbar-title v-text="title" class="pr-3"></v-toolbar-title>
      <v-chip v-if="saveError" label color="brown darken-3" text-color="white">
        <v-icon left color="yellow accent-2">warning</v-icon>{{saveErrorMessage}}
      </v-chip>

      <v-spacer></v-spacer>
      <v-btn v-if="userIsAuthenticated" icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid grid-list-md>



      </v-container>
    </v-content>
    <v-navigation-drawer
      fixed
      :clipped="clipped"
      v-model="rightDrawer"
      right
      app
      disable-route-watcher
      disable-resize-watcher
      v-if="this.userIsAuthenticated"
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in loadedClasses"
          :key="i"
          @click="viewClass(i)"
        >
        <v-list-tile-action>
          <div>{{ i }}</div>
        </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  import AddClass from './components/addClass.vue';
  import EditClass from './components/editClass.vue';
  export default {
    data () {
      return {

        isLogin: true,
        addClassMode: false,
        viewClassMode: false,
        editClassMode: false,
        saveError: false,
        saveErrorMessage: "Name field empty or percentages do not add up to 100",

        fixed: true,
        clipped: false,
        rightDrawer: false,
        title: 'Grade Checker',
      }
    },
    computed: {
      toolbarItems () {
        this.saveError = false;
        let toolbarItems = [
          {title: 'Login', link: '/signin'},
          {title: 'Register', link: '/signup'},
        ]
        if (this.userIsAuthenticated) {
          toolbarItems = [{title: 'Home', link: '/home'}];
          if (this.$route.name === 'Add') {
            this.addClassMode = true;
            this.viewClassMode = false;
            this.editClassMode = false;
          } else if (this.$route.name === 'View') {
            this.viewClassMode = true;
            this.addClassMode = false;
            this.editClassMode = false;
          } else if (this.$route.name === 'Edit') {
            this.viewClassMode = false;
            this.addClassMode = false;
            this.editClassMode = true;
          } else if (this.$route.name === 'Home') {
            toolbarItems = [
              {title: 'Add Class', link: '/add'},
            ]
            this.addClassMode = false;
            this.viewClassMode = false;
            this.editClassMode = false;
          } else {
            this.addClassMode = false;
            this.viewClassMode = false;
            this.editClassMode = false;
          }
        }
        this.rightDrawer = false;
        return toolbarItems
      },
      userIsAuthenticated() {
        this.rightDrawer = false;
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      loadedClasses() {
        return this.$store.getters.loadedClasses;
      }
    },
    methods: {

      login() {
        this.saveError = false;
        this.$router.push({ path: 'signin' });
        this.isLogin = true;
      },
      register() {
        this.saveError = false;
        this.$router.push( { path: 'signup' } );
      },
      logout() {
        this.saveError = false;
        this.$store.dispatch('logout')
        this.$router.push({ path: 'signin' })
      },
      save() {
        if (this.$store.getters.saveHundred === 0 && this.$store.getters.saveClassName !== "") {
          this.saveError = false;
          this.$store.dispatch('addNewClass')
          this.$store.dispatch('resetSaveStatus');
          this.$router.push({path: "home"});
        } else {
          this.saveError = true;
        }
      },
      saveEdit() {
        if (this.$store.getters.saveHundred === 0 && this.$store.getters.saveClassName !== "") {
          this.saveError = false;
          this.$store.dispatch('saveClassEdit');
          this.$store.dispatch('resetSaveStatus');
          this.$router.push({path: "view"});
        } else {
          this.saveError = true;
        }
      },
      viewClass(index) {
        this.saveError = false;
        this.$store.commit('setCurrentClassIndex', index);
        this.$router.push({ path: 'view'});
      },
      editClass() {
        this.saveError = false;
        this.$router.push({ path: 'edit'});
      },
    }
  }
</script>

<!-->

<-->
