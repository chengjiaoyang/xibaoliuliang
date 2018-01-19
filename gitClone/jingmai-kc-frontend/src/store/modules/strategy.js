import strategyAPI from '../../api/strategy'
import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  strategies: []
}

// getters
const getters = {
  strategies: state => state.strategies
}

// actions
const actions = {

  [types.GET_STRATEGY_LIST_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      strategyAPI.list_get((response) => {
        if (response.code) {
          const msg = response.message ? {
            code: response.code,
            msg: response.message
          } : response
          commit(types.GET_STRATEGY_LIST_FAILURE, msg)
          reject(msg)
          return
        }
        commit(types.GET_STRATEGY_LIST_SUCCESS, response)
        resolve(response)
      }, options)
    })
  },

  [types.STRATEGY_SETUP_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      strategyAPI.setup((response) => {
        if (response.code) {
          const msg = response.message ? {
            code: response.code,
            msg: response.message
          } : response
          reject(msg)
          return
        }
        resolve(response)
      }, options)
    })
  },

  [types.REMOVE_STRATEGY_SETUP_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      strategyAPI.setting_remove((response) => {
        if (response.code) {
          const msg = response.message ? {
            code: response.code,
            msg: response.message
          } : response
          reject(msg)
          return
        }
        resolve(response)
      }, options)
    })
  }

}

// mutations
const mutations = {

  [types.GET_STRATEGY_LIST_SUCCESS] (state, res) {
    state.strategies = res
  },

  [types.GET_STRATEGY_LIST_FAILURE] (state, err) {
    state.strategies = []
  }
  
}

export default {
  state,
  getters,
  actions,
  mutations
}
