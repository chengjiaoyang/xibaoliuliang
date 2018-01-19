import axios from 'axios'
import qs from 'qs'

export default {

  list_get (callback, adgroupId) {
    return axios.get('/api/ad/list', {params: {adgroupId: adgroupId}}).then((response) => {
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
    return axios.post('/api/ad/status/update', qs.stringify(options), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
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
    axios.get('/api/ad/rpt', {params: options}).then((response) => {
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