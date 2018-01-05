<template>
  <v-app>
    <router-view></router-view>
    <v-content>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-card flat class="grey lighten-5">
            <v-card-text>
              <h2>Click on Add Class to add a new class</h2>
              <h3 class="pl-4 pt-1">Enter class information about the name, assignments and grade scale from the syllabus</h3>
              <h3 class="pl-4 pt-2">Example:</h3>
              <img src="images/addClass.png" alt="Add Class Example" class="pl-4 pt-2 hidden-xs-only">
              <img src="images/addClassMobile.png" alt="Add Class Mobile Example" class="pl-2 pt-2 hidden-sm-and-up">
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12 sm6>
          <v-card flat class="grey lighten-5">
            <v-card-text>
              <h2 class="hidden-xs-only">Select a class from the sidebar to view it</h2>
              <h2 class="hidden-sm-and-up">Select a class from the class list to view it</h2>
              <h3 class="pl-4 pt-1">Enter the grade you earned on each assignment in the score field</h3>
              <h3 class="pl-4 pt-2">Example:</h3>
              <img src="images/viewClass.png" alt="View Class Example" class="pl-4 pt-2 hidden-xs-only">
              <img src="images/viewClassMobile.png" alt="View Class Mobile Example" class="pl-3 pt-2 hidden-sm-and-up">
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

  export default {
    data () {
      return {
        clipped: false,
        drawer: true,
        fixed: false,

        modeName: "Edit",
        loginStatus: 'Login',

        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Grade Checker',
      }
    },
    computed: {

    },
    methods: {

      addClass() {
        this.$router.push({ path: 'add' });
      },
    }
  }
</script>
