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
              <img src="https://firebasestorage.googleapis.com/v0/b/grade-checker-mjcanzia.appspot.com/o/images%2FaddClass.png?alt=media&token=ed290288-6958-4f71-a2a7-5e4513c261bb" alt="Add Class Example" class="pl-4 pt-2 hidden-xs-only">
              <img src="https://firebasestorage.googleapis.com/v0/b/grade-checker-mjcanzia.appspot.com/o/images%2FaddClassMobile.png?alt=media&token=a6ac6cd7-cf73-42b7-8f59-919b5d698ad8" alt="Add Class Mobile Example" class="pl-2 pt-2 hidden-sm-and-up">
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
              <img src="https://firebasestorage.googleapis.com/v0/b/grade-checker-mjcanzia.appspot.com/o/images%2FviewClass.png?alt=media&token=c12bc6ce-ab7a-4af4-b8d2-eb05204dffc5" alt="View Class Example" class="pl-4 pt-2 hidden-xs-only">
              <img src="https://firebasestorage.googleapis.com/v0/b/grade-checker-mjcanzia.appspot.com/o/images%2FviewClassMobile.png?alt=media&token=34051e2d-bd3b-4ecc-81cd-08ba7c22e1e0" alt="View Class Mobile Example" class="pl-3 pt-2 hidden-sm-and-up">
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
        modeName: "Edit",
        loginStatus: 'Login',
      }
    },
    methods: {
      addClass() {
        this.$router.push({ path: 'add' });
      },
    }
  }
</script>
