import campaignAPI from '../../api/campaign'
import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  campaigns: [],
  campaignRpts: []
}

// getters
const getters = {
  campaigns: state => state.campaigns,
  getCampaignById: state => (id) => {
    const ret = state.campaigns.filter(c => c.id === id)
    if (ret.length > 0) {
      return ret[0]
    }
    return {}
  },
  campaignsRpts: state => state.campaignRpts,
  getCampaignRpt: state => (id) => {
    return state.campaignRpts.filter(rpt => rpt.campaign_id === id)
  }
}

// actions
const actions = {

  [types.GET_CAMPAIGNS_REQUEST] ({ commit, state }) {
    return new Promise((resolve, reject) => {
      campaignAPI.list_get((response) => {
        if (response.code) {
          const msg = response.message ? {
            code: response.code,
            msg: response.message
          } : response
          commit(types.GET_CAMPAIGNS_FAILURE, msg)
          reject(msg)
          return
        }
        commit(types.GET_CAMPAIGNS_SUCCESS, response)
        resolve(response)
      })
    })
  },

  [types.GET_CAMPAIGNS_RPTS_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      campaignAPI.all_rpts_get(state.campaigns, options).then((response) => {
        commit(types.GET_CAMPAIGNS_RPTS_SUCCESS, response)
        resolve(response)
      }).catch((err) => {
        commit(types.GET_CAMPAIGNS_RPTS_FAILURE, err)
        reject(err)
      })
    })
  },

  [types.CAMPAIGNS_STATUS_UPDATE_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      campaignAPI.status_update((response) => {
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

  [types.CAMPAIGN_ADD_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      campaignAPI.add((response) => {
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

  [types.CAMPAIGN_DELETE_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      campaignAPI.delete((response) => {
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

  [types.CAMPAIGN_BUDGET_UPDATE_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      campaignAPI.budget_update((response) => {
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

  [types.FILTER_CAMPAIGNS_REQUEST] ({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit(types.FILTER_CAMPAIGNS_SUCCESS, state.campaigns)
      resolve(state.campaigns)
    })
  }

}

// mutations
const mutations = {


  [types.GET_CAMPAIGNS_SUCCESS] (state, campaigns) {
    state.campaigns = campaigns
  },

  [types.GET_CAMPAIGNS_FAILURE] (state, err) {
    state.campaigns = []
  },

  [types.GET_CAMPAIGNS_RPTS_SUCCESS] (state, rpts) {
    state.campaignRpts = rpts
  },

  [types.GET_CAMPAIGNS_RPTS_FAILURE] (state, err) {
    state.campaignRpts = []
  },

  [types.FILTER_CAMPAIGNS_SUCCESS] (state, campaigns) {
    state.campaigns = campaigns
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
