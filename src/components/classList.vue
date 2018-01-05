<template>
  <v-app>
    <router-view></router-view>
    <v-content>
      <v-container fluid grid-list-md>
          <v-list class="grey lighten-5">
            <v-subheader class="mt-2 teal--text text--lighten-2"><h2>Classes</h2></v-subheader>
            <v-divider></v-divider>
            <v-list-tile value="true" v-for="(item, i) in loadedClasses" :key="i" @click="viewClass(i)" ripple>

              <v-list-tile-content>
                <v-list-tile-title class="black--text">
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
            <v-btn v-if="!(this.loadedClasses.length === 0)" round ripple flat @click= "deleteClassMode = !deleteClassMode" class="red lighten-3 mt-2">Delete Class</v-btn>
          </v-list>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

  export default {
    data () {
      return {
        deleteClassMode: false,
        removeButtonPressed: false,
        saveError: false,
      }
    },
    computed: {
      loadedClasses() {
        return this.$store.getters.user.registeredClasses;
      },

    },
    methods: {
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
      removeClass(index) {
        this.saveError = false;
        this.removeButtonPressed = true;
        this.$store.dispatch('removeClass', index);
        this.$store.commit('setCurrentClassIndex', index);
      },
    }
  }
</script>
