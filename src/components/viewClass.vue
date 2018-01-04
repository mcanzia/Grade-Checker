<template>
  <v-app>
    <router-view :key="$route.fullPath"></router-view>
    <v-content>
      <v-container fluid grid-list-md>

        <v-layout row wrap>
          <v-flex xs12 sm6>
            <h2>{{currentClass.name}}</h2>
          </v-flex>
        </v-layout>

        <v-layout row wrap>
          <v-flex xs12 sm6>
            <v-card flat color="grey lighten-5">
              <v-card-text>
                <template v-for="(field, index) in currentClass.assignments">
                  <v-layout row wrap>
                    <v-text-field label="Assignment" v-model="field.aName" readonly class="pr-3"></v-text-field>
                    <v-text-field label="% of Final Grade" type="number" v-model="field.aPercent.toString()" readonly class="pr-3"></v-text-field>
                    <v-text-field label="Assignment Score" type="number" v-model="assignmentScores[index]" @input="calculateScore"></v-text-field>
                  </v-layout>
                </template>
                <v-card flat color="grey lighten-5">
                  <v-card-text>
                    <v-list two-line subheader v-if="findRemainingGradeMode">
                      <v-subheader><h3>Grade needed on {{emptyFieldName}} for:</h3></v-subheader>
                      <v-list-tile>
                          <v-container fluid grid-list-sm>
                            <v-layout row wrap>
                                <v-flex xs4 v-for="i in 3" :key="i">
                                  <v-layout row wrap>
                                    <h2>A{{gradeSigns[i-1]}} ─</h2>
                                    <h2>──── {{tempGrades[0 + (i-1)]}}</h2>
                                  </v-layout>
                                </v-flex>
                            </v-layout>
                          </v-container>
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile>
                          <v-container fluid grid-list-sm>
                            <v-layout row wrap>
                                <v-flex xs4 v-for="i in 3" :key="i">
                                  <v-layout row wrap>
                                    <h2>B{{gradeSigns[i-1]}} ─</h2>
                                    <h2>──── {{tempGrades[3 + (i-1)]}}</h2>
                                  </v-layout>
                                </v-flex>
                            </v-layout>
                          </v-container>
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile>
                        <v-container fluid grid-list-sm>
                          <v-layout row wrap>
                              <v-flex xs4 v-for="i in 3" :key="i">
                                <v-layout row wrap>
                                  <h2>C{{gradeSigns[i-1]}} ─</h2>
                                  <h2>──── {{tempGrades[6 + (i-1)]}}</h2>
                                </v-layout>
                              </v-flex>
                          </v-layout>
                        </v-container>
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile>
                        <v-container fluid grid-list-sm>
                          <v-layout row wrap>
                              <v-flex xs4 v-for="i in 3" :key="i">
                                <v-layout row wrap>
                                  <h2>D{{gradeSigns[i-1]}} ─</h2>
                                  <h2>──── {{tempGrades[9 + (i-1)]}}</h2>
                                </v-layout>
                              </v-flex>
                          </v-layout>
                        </v-container>
                      </v-list-tile>
                    </v-list>
                    <v-list two-line subheader v-else-if="finalGradeMode">
                      <v-subheader><h3>Your final grade is:</h3></v-subheader>
                      <v-list-tile>
                          <v-container fluid grid-list-sm>
                            <v-layout row wrap>
                                <v-flex xs4 v-for="i in 1" :key="i">
                                  <v-layout row wrap>
                                    <h2>{{finalGrade}}</h2>
                                  </v-layout>
                                </v-flex>
                            </v-layout>
                          </v-container>
                      </v-list-tile>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6>
            <v-card flat color="grey lighten-5">
              <v-card-text>
                <template v-for="(scale, index) in currentClass.gradeScales">
                  <v-layout row wrap>
                      <v-chip color="grey lighten-5"><h3>{{scale.letterPlus}}</h3></v-chip>
                      <v-text-field type="number" readonly v-model="scale.highBoundPlus.toString()" class="pr-2"></v-text-field>
                      <v-text-field type="number" readonly v-model="scale.lowBoundPlus.toString()"></v-text-field>

                      <v-chip color="grey lighten-5"><h3>{{scale.letter}}</h3></v-chip>
                      <v-text-field type="number" readonly v-model="scale.highBound.toString()" class="pr-2"></v-text-field>
                      <v-text-field type="number" readonly v-model="scale.lowBound.toString()"></v-text-field>

                      <v-chip color="grey lighten-5"><h3>{{scale.letterMin}}</h3></v-chip>
                      <v-text-field type="number" readonly v-model="scale.highBoundMin.toString()" class="pr-2"></v-text-field>
                      <v-text-field type="number" readonly v-model="scale.lowBoundMin.toString()"></v-text-field>
                  </v-layout>
                </template>
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
        assignmentScores: [],
        error: false,
        row: null,
        total: 0,

        emptyFieldName: "",
        emptyFieldIndex: 0,
        findRemainingGradeMode: false,
        finalGradeMode: false,
        gradeSigns: ["+","","-"],
        gradeSubtotal: 0,
        finalGrade: 0,
        tempGrades: [],
      }
    },
    created() {
      this.resetArrays();
    },
    watch: {
      '$route.params.id': function (id) {
        this.resetArrays();
      }
    },
    methods: {
      resetArrays() {
        this.assignmentScores = [];
        this.tempGrades = [];
        for (var i in this.currentClass.assignments) {
          this.assignmentScores.push("");
        }
        for (var i in this.currentClass.gradeScales) {
          this.tempGrades.push(0);
          this.tempGrades.push(0);
          this.tempGrades.push(0);
        }
        this.findRemainingGradeMode = false;
        this.finalGradeMode = false;
      },
      calculateScore () {
        this.clearData();
        this.gradeSubtotal = 0;
        this.finalGrade = 0;
        if (this.oneFieldBlank()) {
          this.findRemainingGradeMode = true;
          this.finalGradeMode = false;
          for (var i in this.assignmentScores) {
            if (i !== this.emptyFieldIndex) {
              var score = parseInt(this.assignmentScores[i]);
              var fieldGrade = (score / 100) * parseInt(this.currentClass.assignments[i].aPercent);
              this.gradeSubtotal += fieldGrade;
            }
          }
          var percentRemaining = this.currentClass.assignments[this.emptyFieldIndex].aPercent;

            for (var scale in this.currentClass.gradeScales) {
                var gradeDifference = this.currentClass.gradeScales[scale].lowBoundPlus - this.gradeSubtotal;
                var goalGradeDecimal = gradeDifference / percentRemaining;
                var goalGrade = goalGradeDecimal * 100;
                this.tempGrades[0 + (scale*3)] = goalGrade;

                gradeDifference = this.currentClass.gradeScales[scale].lowBound - this.gradeSubtotal;
                goalGradeDecimal = gradeDifference / percentRemaining;
                goalGrade = goalGradeDecimal * 100;
                this.tempGrades[1 + (scale*3)] = goalGrade;

                gradeDifference = this.currentClass.gradeScales[scale].lowBoundMin - this.gradeSubtotal;
                goalGradeDecimal = gradeDifference / percentRemaining;
                goalGrade = goalGradeDecimal * 100;
                this.tempGrades[2 + (scale*3)] = goalGrade;
            }

          for (var grade in this.tempGrades) {
            var numString = this.tempGrades[grade].toString();
            if (numString.length >= 5) {
              this.tempGrades[grade] = parseFloat(this.tempGrades[grade].toPrecision(4));
            }
            if (numString.indexOf(".") !== -1 && numString.endsWith("0")) {
              var trimmedString = numString.slice(0, -1);
              this.tempGrades[grade] = parseFloat(trimmedString);
            }
            if (parseFloat(numString) < 0) {
              this.tempGrades[grade] = 0;
            }
          }

        } else if (this.allFieldsFilled()) {
          this.findRemainingGradeMode = false;
          this.finalGradeMode = true;
          for (var score in this.assignmentScores) {
            this.finalGrade += (this.assignmentScores[score] / 100) * this.currentClass.assignments[score].aPercent;
          }
          this.finalGrade = this.finalGrade.toPrecision(4);
        } else {
          this.findRemainingGradeMode = false;
          this.finalGradeMode = false;
        }
      },
      oneFieldBlank() {
        var count = 0;
        for (var score in this.assignmentScores) {
          if (isNaN(parseInt(this.assignmentScores[score]))) {
            this.emptyFieldName = this.currentClass.assignments[score].aName;
            this.emptyFieldIndex = score;
            count++;
          }
        }

        if (count === 1) {
          return true;
        }
        return false;
      },
      allFieldsFilled() {
        for (var score in this.assignmentScores) {
          if (isNaN(parseInt(this.assignmentScores[score]))) {
            return false;
          }
        }
        return true;
      },
      clearData() {
        for (var grade in this.tempGrades) {
          this.tempGrades[grade] = 0;
        }
        this.gradeSubtotal = 0;
      },
    },
    computed: {
      currentClass() {
        return this.$store.getters.user.registeredClasses[this.$store.getters.currentClassIndex];
      },
/*
      assignmentScores() {
        return this.$store.getters.assignmentScores;
      },
      tempGrades() {
        return this.$store.getters.tempGrades;
      }
*/
    },
  }
</script>

<style>

</style>

<!-->


<-->
