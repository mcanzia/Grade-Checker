<template>
  <v-app>
    <router-view></router-view>
    <v-toolbar fixed flat app :clipped-left="clipped" color="teal lighten-2">
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-if="userIsAuthenticated && !addClassMode && !editClassMode && !viewClassMode" @click='logout'>Logout</v-btn>
        <v-btn flat v-for="item in toolbarItems" :key="item.title" :to="item.link">
          {{item.title}}
        </v-btn>
        <v-btn flat @click='save' v-if="addClassMode">Save</v-btn>
        <v-btn flat @click='saveEdit' v-if="editClassMode">Save</v-btn>
        <v-btn flat @click='editClass' v-if="viewClassMode">Edit</v-btn>
      </v-toolbar-items>
      <v-toolbar-items class="hidden-sm-and-up">
        <v-btn flat v-if="userIsAuthenticated && !addClassMode && !editClassMode && !viewClassMode" @click='logout'>Logout</v-btn>
        <v-btn flat v-for="item in toolbarItems" :key="item.title" :to="item.link">
          {{item.title}}
        </v-btn>
        <v-btn flat @click='save' v-if="addClassMode">Save</v-btn>
        <v-btn flat @click='saveEdit' v-if="editClassMode">Save</v-btn>
        <v-btn flat @click='editClass' v-if="viewClassMode">Edit</v-btn>
        <v-btn flat @click='goToClasses' v-if="userIsAuthenticated && !addClassMode && !editClassMode && !viewClassMode" class="hidden-sm-and-up">Classes</v-btn>
      </v-toolbar-items>

      <v-toolbar-title v-text="title" class="pr-3 hidden-xs-only"></v-toolbar-title>
      <v-toolbar-title v-if="!userIsAuthenticated" v-text="title" class="pr-3 hidden-sm-and-up"></v-toolbar-title>

      <v-chip v-if="saveError" color="red accent-4" text-color="white" class="hidden-xs-only">
        <v-icon left color="yellow accent-2">warning</v-icon>{{saveErrorMessage}}
      </v-chip>

      <v-chip v-if="saveError" color="red accent-4" text-color="white" class="hidden-sm-and-up">
        <v-icon left color="yellow accent-2">warning</v-icon>Name empty or % field ≠ 100
      </v-chip>

      <v-spacer class="hidden-xs-only"></v-spacer>

      <v-btn v-if="userIsAuthenticated && !editClassMode" icon @click.stop="toggleDrawer" class="hidden-xs-only">
        <v-icon>menu</v-icon>
      </v-btn>


    </v-toolbar>
    <v-content>
      <v-container fluid grid-list-md>



      </v-container>
    </v-content>
    <v-navigation-drawer
      fixed
      v-model="rightDrawer"
      width=216
      class="grey lighten-4 hidden-xs-only"
      right
      app
      disable-route-watcher
      disable-resize-watcher
      v-if="this.userIsAuthenticated"
    >
      <v-list>
        <v-subheader class="mt-2"><h2 style="color: black">Classes</h2></v-subheader>
        <v-divider></v-divider>
        <v-list-tile value="true" v-for="(item, i) in loadedClasses" :key="i" @click="viewClass(i)" ripple>

          <v-list-tile-content>
            <v-list-tile-title class="teal--text text--lighten-2">
              <h3>{{ item.name }}</h3>
            </v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action class="mt-3 pb-4">
              <v-icon v-if="!deleteClassMode" class="lime--text text--darken-4">chevron_right</v-icon>
              <v-btn icon v-if="deleteClassMode" @click="removeClass(i)">
                <v-icon color=red>remove_circle_outline</v-icon>
              </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-btn v-if="!(this.loadedClasses.length === 0)" round ripple flat @click= "deleteClassMode = !deleteClassMode" class="ml-5 red lighten-3">Delete Class</v-btn>
      </v-list>
    </v-navigation-drawer>

    <v-footer :fixed="fixed" app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
  import AddClass from './components/addClass.vue';
  import EditClass from './components/editClass.vue';
  export default {
    data () {
      return {

        addClassMode: false,
        viewClassMode: false,
        editClassMode: false,
        deleteClassMode: false,
        removeButtonPressed: false,
        saveError: false,
        saveErrorMessage: "Name field empty or percentages do not add up to 100",

        fixed: true,
        clipped: false,
        rightDrawer: false,
        menuOpen: false,
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
            toolbarItems = [];
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
        return this.$store.getters.user.registeredClasses;
      }
    },
    methods: {

      logout() {
        this.saveError = false;
        this.$store.dispatch('logout')
        this.$router.push('/signin')
      },
      toggleDrawer() {
        if (this.rightDrawer) {
            this.rightDrawer = false;
            this.deleteClassMode = false;
        } else {
          this.rightDrawer = true;
        }
      },
      save() {
        if (this.$store.getters.saveHundred === 0 && this.$store.getters.saveClassName !== "") {
          this.saveError = false;
          this.$store.dispatch('addNewClass')
          this.$store.dispatch('resetSaveStatus');
          this.$router.push('/home');
        } else {
          this.saveError = true;
        }
      },
      saveEdit() {
        if (this.$store.getters.saveHundred === 0 && this.$store.getters.saveClassName !== "") {
          this.saveError = false;
          this.$store.dispatch('saveClassEdit');
          this.$store.dispatch('resetSaveStatus');
          this.$router.push('/view/' + this.$store.getters.currentClassIndex);
        } else {
          this.saveError = true;
        }
      },
      viewClass(index) {
        this.saveError = false;
        this.$store.commit('clearAssignmentScores');
        this.$store.commit('clearTempGrades');

        if (this.removeButtonPressed) {
          if (this.loadedClasses.length === 0) {
              this.$router.push('/home');
          } else {
            this.$store.commit('setCurrentClassIndex', 0);
            this.$router.push('/view/' + index);
          }
        } else {
          this.$store.commit('setCurrentClassIndex', index);
          this.$router.push('/view/' + index);
        }
        this.removeButtonPressed = false;
      },
      editClass() {
        this.saveError = false;
        this.$router.push('/edit');
      },
      removeClass(index) {
        this.saveError = false;
        this.removeButtonPressed = true;
        this.$store.dispatch('removeClass', index);
        this.$store.commit('setCurrentClassIndex', index);
      },
      goToClasses() {
        this.saveError = false;
        this.$router.push('/classlist');
      }
    }
  }
</script>
