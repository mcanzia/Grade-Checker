<template>
  <v-app>
  <v-toolbar app :clipped-left="clipped" color="light-green lighten-2"></v-toolbar>
  <v-container>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignup">
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
                  <v-flex xs12>
                    <v-text-field name="confirmPassword" label="Confirm Password" id="confirmPassword" v-model="confirmPassword" type="password" :rules="[comparePasswords]"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn type="submit">Sign up</v-btn>
                  </v-flex>
                  <v-flex xs12>
                    <div class="g-signin2" data-onsuccess="onGoogleSignup" data-theme="dark"></div>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,

      isLogin: true,
      email: '',
      password: '',
      confirmPassword: '',

      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Grade Checker'
    }
  },
  computed: {
    comparePasswords() {
      return this.password !== this.confirmPassword ? 'Passwords do not match' : ''
    },
    user () {
      return this.$store.getters.user
    },
    error () {
      return this.$store.getters.error
    }
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.$router.push('home')
      }
    }
  },
  methods: {
    onSignup() {
      this.$store.dispatch('signUserUp', {email: this.email, password: this.password})
    },
    onGoogleSignup() {
      this.$store.dispatch('googleSignUp', )
    },
    onDismissed() {
      this.$store.dispatch('clearError')
    },
    login() {
      this.$router.push({ path: 'signin' });
      this.isLogin = true;
    },
    register() {
      this.$router.push({path: 'signup'});
    },
  }
}
</script>
