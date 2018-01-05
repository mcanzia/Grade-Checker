<template>
  <v-app>
   <v-toolbar app :clipped-left="clipped" color="teal lighten-2"></v-toolbar>
  <v-container>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card v-if="!loading">
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignin">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="email" label="Email" id="email" v-model="email" type="email" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="password" label="Password" id="password" v-model="password" type="password" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex sm3 class="hidden-xs-only">
                    <v-btn type="submit">Sign in</v-btn>
                  </v-flex>
                  <v-flex xs12 class="hidden-sm-and-up">
                    <v-btn type="submit">Sign in</v-btn>
                  </v-flex>
                  <v-flex sm1 class="hidden-xs-only">
                    <v-btn @click="onGoogleSignIn" class="blue white--text">Sign in with Google</v-btn>
                  </v-flex>
                  <v-flex xs12 class="hidden-sm-and-up">
                    <v-btn @click="onGoogleSignIn" class="blue white--text">Sign in with Google</v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
        <v-progress-circular v-else indeterminate v-bind:size="50" color="teal lighten-2"></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</v-app>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    error () {
      return this.$store.getters.error
    },
    loading () {
        return this.$store.getters.loading
    },
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/home')
      }
    }
  },
  methods: {
    onSignin() {
      this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
    },
    onDismissed() {
      this.$store.dispatch('clearError')
    },
    login() {
      this.$router.push('/signin' );
      this.isLogin = true;
    },
    register() {
      this.$router.push('/signup');
    },
    onGoogleSignIn() {
      this.$store.dispatch('googleSignIn')
    },
  }
}
</script>
