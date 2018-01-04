import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedClasses: [
      {
        name: '',
        assignments: [
          {
            title: "",
            percentage: 0,
          }
        ],
        gradeScales: [],
      }
    ],
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
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    addNewClass (state, payload) {
      state.loadedClasses.push(payload)
    },
    setLoadedClasses (state, payload) {
      state.loadedClasses = payload
    },
    setCurrentClassIndex (state, payload) {
      state.currentClassIndex = payload
    },
    setCurrentClassAssignment (state, payload) {
      state.loadedClasses[state.currentClassIndex].assignments = payload;
    },
    removeClass(state, payload) {
      state.loadedClasses.splice(payload, 1);
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
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = {
              id: user.uid,
              registeredClasses: []
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ( {commit}, payload) {
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          const newUser = {
            id: user.uid,
            registeredClasses: []
          }
          commit('setUser', newUser)
        }
      )
      .catch(
        error => {
          commit('setError', error)
        }
      )
    },
    googleSignIn ( {commit}, payload ) {
      console.log('Google Auth Response', payload);
      // We need to register an Observer on Firebase Auth to make sure auth is initialized.
      var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(payload, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.getAuthResponse().id_token);
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
            const newUser = {
              id: firebaseUser.uid,
              registeredClasses: []
            }
            commit('setUser', newUser)
          } else {
            console.log('User already signed-in Firebase.');
            const oldUser = {
              id: firebaseUser.uid,
              registeredClasses: []
            }
            commit('setUser', oldUser)
          }
        });
    },
    isUserEqual(googleUser, firebaseUser) {
      if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
          if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
              providerData[i].uid === googleUser.getBasicProfile().getId()) {
            // We don't need to reauth the Firebase connection.
            return true;
          }
        }
      }
      return false;
    },
    resetSaveStatus ({commit}) {
      commit('setSaveHundred', 100)
      commit('setSaveClassName', "")
    },
    clearError ({commit}) {
      commit('clearError')
    },
    loadClasses ({commit, getters}) {
      const user = getters.user;
      firebase.database().ref('/users/' + user.id).child('/classes/').once('value')
        .then((data) => {
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
          commit('setLoadedClasses', classes)
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
        .then((data) => {
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
      var tempArray = getters.loadedClasses[getters.currentClassIndex].assignments;
      var newAssignmentArray = [];
      for (var field in tempArray) {
        if (!(tempArray[field].aName === null || isNaN(parseInt(tempArray[field].aPercent)) || parseInt(tempArray[field].aPercent) <= 0)) {
          newAssignmentArray.push(tempArray[field]);
        }
      }
      commit('setCurrentClassAssignment', newAssignmentArray);

      const editedClass = {
        name: getters.loadedClasses[getters.currentClassIndex].name,
        assignments: getters.loadedClasses[getters.currentClassIndex].assignments,
        gradeScales: getters.loadedClasses[getters.currentClassIndex].gradeScales,
        userID: getters.user.id
      }
      const user = getters.user;
      firebase.database().ref('classes/' + getters.loadedClasses[getters.currentClassIndex].id).set(editedClass)
        .catch((error) => {
          console.log(error)
        })
    },
    removeClass({commit, getters}, payload) {
      firebase.database().ref('classes/' + getters.loadedClasses[payload].id).remove()
        .catch((error) => {
          console.log(error)
        })
      commit('removeClass', payload);
    },
    autoSignIn({commit}, payload) {
      commit('setUser', {id: payload.uid, registeredClasses: []})
    },
    logout({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
  },
  getters: {
    loadedClasses (state) {
      return state.loadedClasses
    },
    user (state) {
      return state.user
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

    /*
    loadedClass (state) {
      return (classId) => {
        return state.loadedClass.find((class) => {
          return class.id === classId
        })
      }
    }
    */
  },
})
