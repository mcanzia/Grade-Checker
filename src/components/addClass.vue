<template>
  <v-app>
    <router-view></router-view>
    <v-content>
      <v-container fluid grid-list-md>

          <v-layout row wrap>
            <v-flex xs2>
              <v-text-field name="name-field" label="Name" v-model="className" @blur="setName" required></v-text-field>
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

          <template v-for="(field, index) in assignments">
            <v-layout row wrap>
              <div v-if="editMode">
                <v-flex xs1>
                  <v-btn icon @click="removeField(index)" top small style="width: 25px; height: 25px;">
                    <v-icon color="red">remove_circle_outline</v-icon>
                  </v-btn>
                </v-flex>
              </div>
              <v-flex xs2>
                <v-text-field label="Assignment" v-model="assignments[index].aName"></v-text-field>
              </v-flex>
              <v-flex xs2>
                <v-text-field label="% of Final Grade" v-model="assignments[index].aPercent" type="number" @focus="storeTempValue(index)" @blur="updateHundred(index)"></v-text-field>
              </v-flex>
            </v-layout>
          </template>

          <v-layout row wrap>
            <v-flex xs1>
              <v-btn raised color="teal lighten-2" @click="addField()" name="add-new-field">New Field</v-btn>
            </v-flex>
            <v-flex xs1>
              <v-btn raised color="teal lighten-2" @click="edit()" name="edit-mode">{{modeName}}</v-btn>
            </v-flex>
          </v-layout>

          <template v-for="(grade, index) in gradeScales">
            <v-layout row wrap>

              <v-flex xs1>
                <v-text-field type="number" v-model="gradeScales[index].highBoundPlus"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-text-field type="number" v-model="gradeScales[index].lowBoundPlus"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-chip>{{gradeScales[index].letterPlus}}</v-chip>
              </v-flex>

              <v-flex xs1>
                <v-text-field type="number" v-model="gradeScales[index].highBound"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-text-field type="number" v-model="gradeScales[index].lowBound"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-chip>{{gradeScales[index].letter}}</v-chip>
              </v-flex>

              <v-flex xs1>
                <v-text-field type="number" v-model="gradeScales[index].highBoundMin"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-text-field type="number" v-model="gradeScales[index].lowBoundMin"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-chip>{{gradeScales[index].letterMin}}</v-chip>
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

        assignments: [
          {
            aName: "",
            aPercent: 0,
          }
        ],

        gradeScales: [
          {
            letterMin: "A-",
            letter: "A",
            letterPlus: "A+",
            highBoundPlus: 100,
            lowBoundPlus: 97.0,
            highBound: 96.9,
            lowBound: 93.0,
            highBoundMin: 92.9,
            lowBoundMin: 90.0,
          },
          {
            letterMin: "B-",
            letter: "B",
            letterPlus: "B+",
            highBoundPlus: 89.9,
            lowBoundPlus: 87.0,
            highBound: 86.9,
            lowBound: 83.0,
            highBoundMin: 82.9,
            lowBoundMin: 80.0,
          },
          {
            letterMin: "C-",
            letter: "C",
            letterPlus: "C+",
            highBoundPlus: 79.9,
            lowBoundPlus: 77.0,
            highBound: 76.9,
            lowBound: 73.0,
            highBoundMin: 72.9,
            lowBoundMin: 70.0,
          },
          {
            letterMin: "D-",
            letter: "D",
            letterPlus: "D+",
            highBoundPlus: 69.9,
            lowBoundPlus: 67.0,
            highBound: 66.9,
            lowBound: 63.0,
            highBoundMin: 62.9,
            lowBoundMin: 60.0,
          },
        ],

        fGrade: "",
        className: "",
        saveError: false,

        hundred: 100,
        progress: 0,
        tempValue: 0,
        numFields: 1,
        editMode: false,
        modeName: "Edit",
        newClass: "Add Class",

        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Grade Checker'
      }
    },
    methods: {
      addField: function() {
         this.numFields++;
         this.assignments.push(new Object());
         this.$store.commit('setSaveAssignments', this.assignments);
         this.$store.commit('setSaveGradeScale', this.gradeScales);
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

        if (isNaN(parseInt(this.assignments[index].aPercent))) {
          this.assignments[index].aPercent = 0;
        }
        this.hundred -= parseInt(this.assignments[index].aPercent);
        this.tempValue = 0;
        this.progress = 100 - this.hundred;

        this.$store.commit('setSaveHundred', this.hundred);
        this.$store.commit('setSaveAssignments', this.assignments);
        this.$store.commit('setSaveGradeScale', this.gradeScales);
      },
      storeTempValue(index) {
        if (isNaN(parseInt(this.assignments[index].aPercent))) {
          this.tempValue = 0;
        } else {
          this.tempValue = parseInt(this.assignments[index].aPercent);
        }
      },
      removeField(index) {
        this.storeTempValue(index);
        this.assignments[index].aPercent = 0;
        this.updateHundred(index);
        this.assignments.splice(index, 1);
        this.numFields--;
        this.$store.commit('setSaveAssignments', this.assignments);
        this.$store.commit('setSaveGradeScale', this.gradeScales);
      },
      setName() {
        this.$store.commit('setSaveClassName', this.className);
      },
    }
  }
</script>

<style>
  .remove-button {
    width: 50%;
  }
</style>

<!--
<v-flex xs4>
  <v-select name="test-field" v-bind:items="numTests" label="Number of Tests" v-model="howManyTests"></v-select>
</v-flex>
<v-flex xs4>
    <v-text-field name="test-percent-field" label="Test % (of final)" v-show="howManyTests > 0"></v-text-field>
</v-flex>

-->
