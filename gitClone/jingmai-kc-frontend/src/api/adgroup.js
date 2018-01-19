import axios from 'axios'
import qs from 'qs'

export default {

  list_get (callback, campaignId) {
    return axios.get('/api/adgroup/list', {params: {campaignId: campaignId}}).then((response) => {
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

  status_update (callback, options) {
    return axios.post('/api/campaign/status/update', qs.stringify(options), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
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
    axios.get('/api/adgroup/rpt', {params: options}).then((response) => {
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