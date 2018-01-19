import axios from 'axios'
import qs from 'qs'

export default {

  list_get (callback, options) {
    return axios.get('/api/keyword/list', {params: {adgroupId: options.adgroupId, campaignId: options.campaignId}}).then((response) => {
      callback(response.data)
    }).catch((err) => {
      let msg = {
        code: 1,
        msg: err
      }
      if (err.response) {
        if (err.response.data) {
          msg = err.response.data.code ? err.response.data : {
            code: err.response.data.code,
            msg: err.response.data.msg
          }
        }
        msg = {
          code: err.response.status,
          msg: 'unauthorized'
        }
      }
      callback(msg)
    })
  },

  rpt_get (callback, options) {
    axios.get('/api/keyword/rpt', {params: options}).then((response) => {
      let ret = []
      for (let rpt of response.data) {
        rpt.campaign_id = options.campaignId
        rpt.adgroup_id = options.adgroupId
        ret.push(rpt)
      }
      callback(ret)
    }).catch((err) => {
      let msg = {
        code: 1,
        msg: err
      }
      if (err.response) {
        if (err.response.data) {
          msg = err.response.data.code ? err.response.data : {
            code: err.response.data.code,
            msg: err.response.data.msg
          }
        }
        msg = {
          code: err.response.status,
          msg: 'unauthorized'
        }
      }
      callback(msg)
    })
  },

  add (callback, options) {
    return axios.post('/api/keyword/add', qs.stringify(options), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
      callback(response.data)
    }).catch((err) => {
      let msg = {
        code: 1,
        msg: err
      }
      if (err.response) {
        if (err.response.data) {
          msg = err.response.data.code ? err.response.data : {
            code: err.response.data.code,
            msg: err.response.data.msg
          }
        }
        msg = {
          code: err.response.status,
          msg: 'unauthorized'
        }
      }
      callback(msg)
    })
  },

  delete (callback, options) {
    return axios.post('/api/keyword/delete', qs.stringify(options), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
      callback(response.data)
    }).catch((err) => {
      let msg = {
        code: 1,
        msg: err
      }
      if (err.response) {
        if (err.response.data) {
          msg = err.response.data.code ? err.response.data : {
            code: err.response.data.code,
            msg: err.response.data.msg
          }
        }
        msg = {
          code: err.response.status,
          msg: 'unauthorized'
        }
      }
      callback(msg)
    })
  },

  update (callback, options) {
    return axios.post('/api/keyword/update', qs.stringify(options), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
      callback(response.data)
    }).catch((err) => {
      let msg = {
        code: 1,
        msg: err
      }
      if (err.response) {
        if (err.response.data) {
          msg = err.response.data.code ? err.response.data : {
            code: err.response.data.code,
            msg: err.response.data.msg
          }
        }
        msg = {
          code: err.response.status,
          msg: 'unauthorized'
        }
      }
      callback(msg)
    })
  },

  recommend (callback, options) {
    axios.get('/api/keyword/recommend', {params: options}).then((response) => {
      callback(response.data)
    }).catch((err) => {
      let msg = {
        code: 1,
        msg: err
      }
      if (err.response) {
        if (err.response.data) {
          msg = err.response.data.code ? err.response.data : {
            code: err.response.data.code,
            msg: err.response.data.msg
          }
        }
        msg = {
          code: err.response.status,
          msg: 'unauthorized'
        }
      }
      callback(msg)
    })
  },

  price_suggest (callback, options) {
    return axios.post('/api/keyword/price-suggest', qs.stringify(options), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
      callback(response.data)
    }).catch((err) => {
      let msg = {
        code: 1,
        msg: err
      }
      if (err.response) {
        if (err.response.data) {
          msg = err.response.data.code ? err.response.data : {
            code: err.response.data.code,
            msg: err.response.data.msg
          }
        }
        msg = {
          code: err.response.status,
          msg: 'unauthorized'
        }
      }
      callback(msg)
    })
  }

}