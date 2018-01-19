import axios from 'axios'
import qs from 'qs'

export default {

  list_get (callback, options) {
    axios.get('/api/strategy/list').then((response) => {
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

  setup (callback, options) {
    return axios.post('/api/strategy/setup', qs.stringify(options), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
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

  setting_remove (callback, options) {
    return axios.post('/api/strategy/setting-remove', qs.stringify(options), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
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