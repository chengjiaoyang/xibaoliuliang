import adAPI from '../../api/ad'
import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  ads: [],
  adRpts: []
}

// getters
const getters = {
  ads: state => state.ads,
  getAdById: state => (id) => {
    const ret = state.ads.filter(c => c.id === id)
    if (ret.length > 0) {
      return ret[0]
    }
    return {}
  },
  getAdByAdgroupId: state => (adgroupId) => {
    return state.ads.filter(rpt => rpt.adGroupId === adgroupId)
  },
  adsRpts: state => state.adRpts,
  getAdRpt: state => (id) => {
    return state.adRpts.filter(rpt => rpt.adId === id)
  },
  getAdRptByAdgroupId: state => (adgroupId) => {
    return state.adRpts.filter(rpt => rpt.adGroupId === adgroupId)
  }
}

// actions
const actions = {

  [types.GET_AD_REQUEST] ({ commit, state }, adgroupId) {
    return new Promise((resolve, reject) => {
      adAPI.list_get((response) => {
        if (response.code) {
          const msg = response.message ? {
            code: response.code,
            msg: response.message
          } : response
          commit(types.GET_AD_FAILURE, {adgroupId: adgroupId, msg: msg})
          reject(msg)
          return
        }
        commit(types.GET_AD_SUCCESS, {adgroupId: adgroupId, ads: response})
        resolve(response)
      }, adgroupId)
    })
  },

  [types.GET_ADS_RPTS_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      adAPI.rpt_get((response) => {
        if (response.code) {
          const msg = response.message ? {
            code: response.code,
            msg: response.message
          } : response
          commit(types.GET_AD_RPTS_FAILURE, {adgroupId: options.adgroupId, msg: msg})
          reject(msg)
          return
        }
        commit(types.GET_AD_RPTS_SUCCESS, {adgroupId: options.adgroupId, rpts: response})
        resolve(response)
      }, options)
    })
  },

  [types.AD_STATUS_UPDATE_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      adAPI.status_update((response) => {
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


  [types.GET_AD_SUCCESS] (state, res) {
    const restAds = state.ads.filter(ad => ad.adGroupId !== res.adgroupId)
    state.ads = [...restAds, ...res.ads]
  },

  [types.GET_AD_FAILURE] (state, err) {
    const restAds = state.ads.filter(ad => ad.adGroupId !== err.adgroupId)
    state.ads = restAds
  },

  [types.GET_AD_RPTS_SUCCESS] (state, res) {
    const restRpts = state.adRpts.filter(rpt => rpt.adGroupId !== res.adgroupId)
    state.adRpts = [...restRpts, ...res.rpts]
  },

  [types.GET_AD_RPTS_FAILURE] (state, err) {
    const restRpts = state.adRpts.filter(rpt => rpt.adGroupId !== err.adgroupId)
    state.adRpts = restRpts
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
