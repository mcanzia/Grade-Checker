import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {

    user: null,
    loading: false,
    error: null,
    saveHundred: 100,
    saveClassName: "",
    saveAssignments: [],
    saveGradeScale: [],
    currentClassIndex: -1,
    assignmentScores: [],
    tempGrades: [],
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setUserClasses (state, payload) {
      state.user.registeredClasses = payload
    },
    setSaveHundred (state, payload) {
      state.saveHundred = payload
    },
    setSaveClassName (state, payload) {
      state.saveClassName = payload
    },
    setSaveAssignments (state, payload) {
      state.saveAssignments = payload
    },
    setSaveGradeScale (state, payload) {
      state.saveGradeScale = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    addNewClass (state, payload) {
      state.user.registeredClasses.push(payload)
    },
    setLoadedClasses (state, payload) {
      state.loadedClasses = payload
    },
    setCurrentClassIndex (state, payload) {
      state.currentClassIndex = payload
    },
    setCurrentClassAssignment (state, payload) {
      state.user.registeredClasses[state.currentClassIndex].assignments = payload;
    },
    removeClass(state, payload) {
      state.user.registeredClasses.splice(payload, 1);
    },
    setAssignmentScores(state, payload) {
      state.assignmentScores = payload
    },
    clearAssignmentScores(state) {
      for (var i in state.assignmentScores) {
        state.assignmentScores[i] = "";
      }
    },
    setTempGrades(state, payload) {
      state.tempGrades = payload
    },
    clearTempGrades(state) {
      for (var i in state.tempGrades) {
        state.tempGrades.pop;
      }
    }
  },
  actions: {
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredClasses: []
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ( {commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          const newUser = {
            id: user.uid,
            registeredClasses: []
          }
          commit('setUser', newUser)
          commit('setLoading', false)
        }

      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
        }
      )
    },
    googleSignIn ( {commit} ) {
      commit('setLoading', true)
      commit('clearError')
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);

      firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
          var token = result.credential.accessToken;
        }
        var user = result.user;
        const newUser = {
          id: user.uid,
          registeredClasses: []
        }
        commit('setUser', newUser)
      }).catch(function(error) {
        commit('setLoading', false)
        console.log(error)
      });
    },
    resetSaveStatus ({commit}) {
      commit('setSaveHundred', 100)
      commit('setSaveClassName', "")
    },
    clearError ({commit}) {
      commit('clearError')
    },
    loadClasses ({commit, getters}) {

      if (getters.user === null) {
        return
      }

      firebase.database().ref('/users/' + getters.user.id + '/classes/').once('value')
        .then(data => {
          const classes = []
          const obj = data.val()
          for (let key in obj) {
              classes.push({
                id: key,
                name: obj[key].name,
                assignments: obj[key].assignments,
                gradeScales: obj[key].gradeScales,
                userID: obj[key].userID,
              })
          }
          commit('setUserClasses', classes)
          
        })
        .catch(
          (error) => {
            console.log(error)
          }
        )
    },
    sortClasses(classes) {
      return classes.sort((classA, classB) => {
        return classA.name > classB.name
      })
    },
    addNewClass ({commit, getters}) {
      var tempArray = getters.saveAssignments;
      var newAssignmentArray = [];
      for (var field in tempArray) {
        if (!(tempArray[field].aName === null || isNaN(parseInt(tempArray[field].aPercent)) || parseInt(tempArray[field].aPercent) <= 0)) {
          newAssignmentArray.push(tempArray[field]);
        }
      }
      commit('setSaveAssignments', newAssignmentArray);

      const newClass = {
        name: getters.saveClassName,
        assignments: getters.saveAssignments,
        gradeScales: getters.saveGradeScale,
        userID: getters.user.id
      }
      const user = getters.user;
      firebase.database().ref('/users/' + user.id).child('/classes/').push(newClass)
        .then(data => {
          const key = data.key
          commit('addNewClass', {
            ...newClass,
            id: key
          })

        })
        .catch((error) => {
          console.log(error)
        })
    },
    saveClassEdit({commit, getters}) {
      var tempArray = getters.user.registeredClasses[getters.currentClassIndex].assignments;
      var newAssignmentArray = [];
      for (var field in tempArray) {
        if (!(tempArray[field].aName === null || isNaN(parseInt(tempArray[field].aPercent)) || parseInt(tempArray[field].aPercent) <= 0)) {
          newAssignmentArray.push(tempArray[field]);
        }
      }
      commit('setCurrentClassAssignment', newAssignmentArray);

      const user = getters.user

      const editedClass = {
        name: user.registeredClasses[getters.currentClassIndex].name,
        assignments: user.registeredClasses[getters.currentClassIndex].assignments,
        gradeScales: user.registeredClasses[getters.currentClassIndex].gradeScales,
        userID: getters.user.id,
      }
      console.log(user.id)
      console.log(user.registeredClasses[getters.currentClassIndex].id)

      firebase.database().ref('/users/' + user.id + '/classes/' + user.registeredClasses[getters.currentClassIndex].id).set(editedClass)
        .catch((error) => {
          console.log(error)
        })
    },
    removeClass({commit, getters}, payload) {
      const user = getters.user
      firebase.database().ref('/users/' + user.id + '/classes/' + user.registeredClasses[payload].id).remove()
        .catch((error) => {
          console.log(error)
        })
      commit('removeClass', payload);

    },
    autoSignIn({commit}, payload) {
      commit('setUser', {id: payload.uid, registeredClasses: []})
    },
    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/classes/').once('value')
        .then(data => {
          const classVals = data.val()
          let registeredClasses = []
          for (let key in classVals) {
            registeredClasses.push({...classVals[key], id: key})
          }
          const updatedUser = {
            id: getters.user.id,
            registeredClasses: registeredClasses
          }

          commit('setUser', updatedUser)
        })
        .catch(error => {
          commit('setLoading', false)
          console.log(error)
        })
    },
    logout({commit}) {
      firebase.auth().signOut()
        .then( () => {
          console.log("Logged Out Successfully")
        })
      commit('setLoading', false)
      commit('setUser', null)
    },
  },
  getters: {
    loadedClasses (state) {
      if (state.user === null) {
        return
      }
      return state.user.registeredClasses
    },
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    saveHundred (state) {
      return state.saveHundred
    },
    saveClassName (state) {
      return state.saveClassName
    },
    saveAssignments (state) {
      return state.saveAssignments
    },
    saveGradeScale (state) {
      return state.saveGradeScale
    },
    currentClassIndex (state) {
      return state.currentClassIndex
    },
    assignmentScores (state) {
      return state.assignmentScores
    },
    tempGrades (state) {
      return state.tempGrades
    },
  },
})
