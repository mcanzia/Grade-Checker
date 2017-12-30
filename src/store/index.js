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
    loadClasses ({commit}) {
      firebase.database().ref('classes').once('value')
        .then((data) => {
          const classes = []
          const obj = data.val()
          for (let key in obj) {
            //if (obj[key].userID === this.getters.user.id) {
              classes.push({
                id: key,
                name: obj[key].name,
                assignments: obj[key].assignments,
                gradeScales: obj[key].gradeScales,
                userID: obj[key].userID,
              })
            //}
          }
          commit('setLoadedClasses', classes)
        })
        .catch(
          (error) => {
            console.log(error)
          }
        )
    },
    addNewClass ({commit, getters}) {
      const newClass = {
        name: getters.saveClassName,
        assignments: getters.saveAssignments,
        gradeScales: getters.saveGradeScale,
        userID: getters.user.id
      }
      firebase.database().ref('classes').push(newClass)
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
      return state.loadedClasses.sort((classA, classB) => {
        return classA.name > classB.name
      })
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
    }
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
