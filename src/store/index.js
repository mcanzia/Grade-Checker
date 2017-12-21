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
            percentage: "",
          }
        ],
        id: '',
      }
    ],
    user: null,
    loading: false,
    error: null,
    saveHundred: 100,
    saveClassName: "",
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
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
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
          } else {
            console.log('User already signed-in Firebase.');
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
    resetSaveStatus ({commit}, payload) {
      commit('setSaveHundred', 100)
      commit('setSaveClassName', "")
    },
    clearError ({commit}) {
      commit('clearError')
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
