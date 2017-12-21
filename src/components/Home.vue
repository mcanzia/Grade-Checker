<template>
  <v-app>
    <router-view></router-view>
    <v-content>
      <v-container fluid grid-list-md>

        <p>Home</p>

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
