import userAPI from '../../api/user'
import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  id: 0,
  name: '',
  telephone: '',
  nick: ''
}

// getters
const getters = {
  loggedIn: state => state.id > 0,
  userInfo: state => state
}

// actions
const actions = {

  [types.LOGIN_REQUEST] ({ commit, state }, userInfo) {
    return new Promise((resolve, reject) => {
      userAPI.login(userInfo, (response) => {
        if (response.code) {
          const msg = response.message ? {
            code: response.code,
            msg: response.message
          } : response
          commit(types.LOGIN_FAILURE, msg)
          reject(msg)
          return
        }
        commit(types.LOGIN_SUCCESS, response)
        resolve(response)
      })
    })
  },

  [types.GET_USER_INFO_REQUEST] ({ commit, state }) {
    return new Promise((resolve, reject) => {
      userAPI.info((response) => {
        if (response.code) {
          const msg = response.message ? {
            code: response.code,
            msg: response.message
          } : response
          commit(types.GET_USER_INFO_FAILURE, msg)
          reject(msg)
          return
        }
        commit(types.GET_USER_INFO_SUCCESS, response)
        resolve(response)
      })
    })
  }

}

// mutations
const mutations = {


  [types.LOGIN_SUCCESS] (state, userInfo) {
    state.id = userInfo.id
    state.name = userInfo.name
    state.telephone = userInfo.telephone
    state.nick = userInfo.nick
  },

  [types.LOGIN_FAILURE] (state, err) {
    // rollback to the cart saved before sending the request
    state.id = 0
    state.name = ''
    state.telephone = ''
    state.nick = ''
  },

  [types.GET_USER_INFO_SUCCESS] (state, userInfo) {
    state.id = userInfo.id
    state.name = userInfo.name
    state.telephone = userInfo.telephone
    state.nick = userInfo.nick
  },

  [types.GET_USER_INFO_FAILURE] (state, err) {
    // rollback to the cart saved before sending the request
    state.id = 0
    state.name = ''
    state.telephone = ''
    state.nick = ''
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
