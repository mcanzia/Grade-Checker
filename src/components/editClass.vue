<template>
  <v-app>
    <router-view></router-view>
    <v-content>
      <v-container fluid grid-list-md>

          <v-layout row wrap>
            <v-flex xs2>
              <v-text-field label="Name" v-model="currentClass.name" @blur="setName" required></v-text-field>
            </v-flex>
            <v-flex xs4>
              <div v-if="progress < 100">
                <v-progress-linear v-model="progress"></v-progress-linear>
              </div>
              <div v-else-if="progress === 100">
                <v-progress-linear  v-model="progress" color="green"></v-progress-linear>
                <v-icon small color="green">check_circle</v-icon>
              </div>
              <div v-else-if="progress > 100">
                <v-progress-linear v-model="progress" color="red"></v-progress-linear>
                <v-icon small color="red">warning</v-icon>
              </div>
            </v-flex>
            <v-flex xs2>
              <v-subheader>{{hundred}}</v-subheader>
            </v-flex>
          </v-layout>

          <template v-for="(field, index) in currentClass.assignments">
            <v-layout row wrap>
              <div v-if="editMode">
                <v-flex xs1>
                  <v-btn @click="removeField(index)" class="remove-button" fab top dark small color="red" style="width: 25px; height: 25px;">
                    <v-icon light>remove</v-icon>
                  </v-btn>
                </v-flex>
              </div>
              <v-flex xs2>
                <v-text-field label="Assignment" v-model="currentClass.assignments[index].aName"></v-text-field>
              </v-flex>
              <v-flex xs2>
                <v-text-field label="% of Final Grade" v-model="currentClass.assignments[index].aPercent" type="number" @focus="storeTempValue(index)" @blur="updateHundred(index)"></v-text-field>
              </v-flex>
            </v-layout>
          </template>

          <v-layout row wrap>
            <v-flex xs1>
              <v-btn raised color="teal lighten-2" @click="addField()">New Field</v-btn>
            </v-flex>
            <v-flex xs1>
              <v-btn raised color="teal lighten-2" @click="edit()">{{modeName}}</v-btn>
            </v-flex>
          </v-layout>

          <template v-for="(grade, index) in currentClass.gradeScales">
            <v-layout row wrap>

              <v-flex xs1>
                <v-text-field type="number" v-model="currentClass.gradeScales[index].highBoundPlus"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-text-field type="number" v-model="currentClass.gradeScales[index].lowBoundPlus"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-chip>{{currentClass.gradeScales[index].letterPlus}}</v-chip>
              </v-flex>

              <v-flex xs1>
                <v-text-field type="number" v-model="currentClass.gradeScales[index].highBound"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-text-field type="number" v-model="currentClass.gradeScales[index].lowBound"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-chip>{{currentClass.gradeScales[index].letter}}</v-chip>
              </v-flex>

              <v-flex xs1>
                <v-text-field type="number" v-model="currentClass.gradeScales[index].highBoundMin"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-text-field type="number" v-model="currentClass.gradeScales[index].lowBoundMin"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-chip>{{currentClass.gradeScales[index].letterMin}}</v-chip>
              </v-flex>
            </v-layout>
          </template>

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

        fGrade: "",
        saveError: false,

        hundred: 100,
        progress: 0,
        tempValue: 0,
        numFields: 1,
        editMode: false,
        modeName: "Edit",


        right: true,
        rightDrawer: false,
        title: 'Grade Checker'
      }
    },
    created() {
      this.hundred -= 100;
      this.setName();
      for (var field in this.currentClass.assignments) {
        this.storeTempValue(field);
        this.updateHundred(field);
      }

    },
    computed: {
      currentClass() {
        return this.$store.getters.loadedClasses[this.$store.getters.currentClassIndex];
      }
    },
    methods: {
      addField: function() {
         this.numFields++;
         this.currentClass.assignments.push(new Object());
      },
      edit: function() {
        if (this.modeName === "Edit") {
          this.editMode = true;
          this.modeName = "Cancel";
        } else {
          this.editMode = false;
          this.modeName = "Edit";
        }
      },
      updateHundred(index) {
        this.hundred += parseInt(this.tempValue);

        if (isNaN(parseInt(this.currentClass.assignments[index].aPercent))) {
          this.currentClass.assignments[index].aPercent = 0;
        }
        this.hundred -= parseInt(this.currentClass.assignments[index].aPercent);
        this.tempValue = 0;
        this.progress = 100 - this.hundred;

        this.$store.commit('setSaveHundred', this.hundred);
      },
      storeTempValue(index) {
        if (isNaN(parseInt(this.currentClass.assignments[index].aPercent))) {
          this.tempValue = 0;
        } else {
          this.tempValue = parseInt(this.currentClass.assignments[index].aPercent);
        }
      },
      removeField(index) {
        this.storeTempValue(index);
        this.currentClass.assignments[index].aPercent = 0;
        this.updateHundred(index);
        this.currentClass.assignments.splice(index, 1);
        this.numFields--;
      },
      setName() {
        this.$store.commit('setSaveClassName', this.currentClass.name);
      },
    }
  }
</script>
