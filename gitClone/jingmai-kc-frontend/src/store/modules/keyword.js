import keywordAPI from '../../api/keyword'
import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  keywords: [],
  keywordRpts: [],
  keywordPriceSuggest: []
}

// getters
const getters = {
  keywords: state => state.keywords,
  getKeywordsByAdgroupId: state => (id) => {
    return state.keywords.filter(rpt => rpt.adgroup_id === id)
  },
  getKeywordsByCampaignId: state => (id) => {
    return state.keywords.filter(rpt => rpt.campaign_id === id)
  },
  keywordsRpts: state => state.keywordRpts,
  getKeywordRptByAdgroupId: state => (id) => {
    return state.keywordRpts.filter(rpt => rpt.adgroup_id === id)
  },
  getKeywordRptByCampaignId: state => (id) => {
    return state.keywordRpts.filter(rpt => rpt.campaign_id === id)
  }
}

// actions
const actions = {

  [types.GET_KEYWORDS_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      keywordAPI.list_get((response) => {
        if (response.code) {
          const msg = response.message ? {
            code: response.code,
            msg: response.message
          } : response
          commit(types.GET_KEYWORDS_FAILURE, {campaignId: options.campaignId, adgroupId: options.adgroupId, msg: msg})
          reject(msg)
          return
        }
        commit(types.GET_KEYWORDS_SUCCESS, {campaignId: options.campaignId, adgroupId: options.adgroupId, keywords: response})
        resolve(response)
      }, options)
    })
  },

  [types.GET_KEYWORDS_RPTS_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      keywordAPI.rpt_get((response) => {
        if (response.code) {
          const msg = response.message ? {
            code: response.code,
            msg: response.message
          } : response
          commit(types.GET_KEYWORDS_RPTS_FAILURE, {campaignId: options.campaignId, adgroupId: options.adgroupId, msg: msg})
          reject(msg)
          return
        }
        commit(types.GET_KEYWORDS_RPTS_SUCCESS, {campaignId: options.campaignId, adgroupId: options.adgroupId, rpts: response})
        resolve(response)
      }, options)
    })
  },

  [types.KEYWORDS_ADD_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      keywordAPI.add((response) => {
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

  [types.KEYWORDS_DELETE_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      keywordAPI.delete((response) => {
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

  [types.KEYWORDS_UPDATE_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      keywordAPI.update((response) => {
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

  [types.KEYWORDS_RECOMMEND_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      keywordAPI.recommend((response) => {
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

  [types.KEYWORDS_PRICE_SUGGEST_REQUEST] ({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      keywordAPI.price_suggest((response) => {
        if (response.code) {
          const msg = response.message ? {
            code: response.code,
            msg: response.message
          } : response
          commit(types.KEYWORDS_PRICE_SUGGEST_FAILURE, msg)
          reject(msg)
          return
        }
        commit(types.KEYWORDS_PRICE_SUGGEST_SUCCESS, response)
        resolve(response)
      }, options)
    })
  },

  [types.FILTER_KEYWORDS_REQUEST] ({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit(types.FILTER_KEYWORDS_SUCCESS, state.keywordRpts)
      resolve(state.keywordRpts)
    })
  }

}

// mutations
const mutations = {

  [types.GET_KEYWORDS_SUCCESS] (state, res) {
    const restKws = state.keywords.filter(ad => ad.adgroupId !== res.adgroupId)
    state.keywords = [...restKws, ...res.keywords]
  },

  [types.GET_KEYWORDS_FAILURE] (state, err) {
    const restKws = state.keywords.filter(ad => ad.adgroupId !== err.adgroupId)
    state.keywords = restKws
  },

  [types.GET_KEYWORDS_RPTS_SUCCESS] (state, res) {
    const restRpts = state.keywordRpts.filter(rpt => rpt.adgroup_id !== res.adgroupId)
    state.keywordRpts = [...restRpts, ...res.rpts]
  },

  [types.GET_KEYWORDS_RPTS_FAILURE] (state, err) {
    const restRpts = state.keywordRpts.filter(rpt => rpt.adgroup_id !== err.adgroupId)
    state.keywordRpts = restRpts
  },

  [types.KEYWORDS_PRICE_SUGGEST_SUCCESS] (state, res) {
    state.keywordPriceSuggest = res
  },

  [types.KEYWORDS_PRICE_SUGGEST_FAILURE] (state, err) {
    state.keywordPriceSuggest = []
  },

  [types.FILTER_KEYWORDS_SUCCESS] (state, keywordRpts) {
    state.keywordRpts = keywordRpts
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
