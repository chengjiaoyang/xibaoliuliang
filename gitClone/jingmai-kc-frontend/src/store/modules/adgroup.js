import adgroupAPI from '../../api/adgroup'
import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  adgroups: [],
  adgroupRpts: []
}

// getters
const getters = {
  adgroups: state => state.adgroups,
  getAdgroupsByCampaignId: state => (id) => {
    return state.adgroups.filter(c => c.campaignId === id)
  },
  getAdgroupById: state => (id) => {
    const ret = state.adgroups.filter(c => c.id === id)
    if (ret.length > 0) {
      return ret[0]
    }
    return {}
  },
  adgroupsRpts: state => state.adgroupRpts,
  getAdgroupRpt: state => (id) => {
    return state.adgroupRpts.filter(rpt => rpt.adgroup_id === id)
  },
  getAdgroupRptByCampaignId: state => (id) => {
    return state.adgroupRpts.filter(rpt => rpt.campaign_id === id)
  }
}

// actions
const actions = {

  [types.GET_ADGROUPS_REQUEST] ({ commit, state }, campaignId) {
    return new Promise((resolve, reject) => {
      adgroupAPI.list_get((response) => {
        if (response.code) {
          const msg = response.message ? {
            code: response.code,
            msg: response.message
          } : response
          commit(types.GET_ADGROUPS_FAILURE, {campaignId: campaignId, msg: msg})
          reject(msg)
          return
        }
        commit(types.GET_ADGROUPS_SUCCESS, {campaignId: campaignId, adgroups: response})
        resolve(response)
      }, campaignId)
    })
  },

  [types.GET_ADGROUPS_RPTS_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      adgroupAPI.rpt_get((response) => {
        if (response.code) {
          const msg = response.message ? {
            code: response.code,
            msg: response.message
          } : response
          commit(types.GET_ADGROUPS_RPTS_FAILURE, {campaignId: options.campaignId, msg: msg})
          reject(msg)
          return
        }
        commit(types.GET_ADGROUPS_RPTS_SUCCESS, {campaignId: options.campaignId, rpts: response})
        resolve(response)
      }, options)
    })
  },

  [types.ADGROUPS_STATUS_UPDATE_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      adgroupAPI.status_update((response) => {
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

  [types.FILTER_ADGROUPS_REQUEST] ({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit(types.FILTER_ADGROUPS_SUCCESS, state.adgroups)
      resolve(state.adgroups)
    })
  }

}

// mutations
const mutations = {


  [types.GET_ADGROUPS_SUCCESS] (state, res) {
    const restAds = state.adgroups.filter(ad => ad.campaignId !== res.campaignId)
    state.adgroups = [...restAds, ...res.adgroups]
  },

  [types.GET_ADGROUPS_FAILURE] (state, err) {
    const restAds = state.adgroups.filter(ad => ad.campaignId !== err.campaignId)
    state.adgroups = restAds
  },

  [types.GET_ADGROUPS_RPTS_SUCCESS] (state, res) {
    const restRpts = state.adgroupRpts.filter(rpt => rpt.campaign_id !== res.campaignId)
    state.adgroupRpts = [...restRpts, ...res.rpts]
  },

  [types.GET_ADGROUPS_RPTS_FAILURE] (state, err) {
    const restRpts = state.adgroupRpts.filter(rpt => rpt.campaign_id !== err.campaignId)
    state.adgroupRpts = restRpts
  },

  [types.FILTER_ADGROUPS_SUCCESS] (state, adgroups) {
    state.adgroups = adgroups
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
