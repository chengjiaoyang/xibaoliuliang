import axios from 'axios'
import qs from 'qs'

export default {

  list_get (callback) {
    return axios.get('/api/campaign/list').then((response) => {
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

  rpt_get (options) {
    return new Promise((resolve, reject) => {
      axios.get('/api/campaign/rpt', {params: options}).then((response) => {
        resolve(response.data)
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
        resolve(msg)
      })
    })
  },

  all_rpts_get(campaigns, options) {
    return new Promise((resolve, reject) => {
      let requests = []
      for (const campaign of campaigns) {
        let opt = JSON.parse(JSON.stringify(options))
        opt.campaignId = campaign.id
        requests.push(this.rpt_get(opt))
      }
      let report = []
      axios.all(requests).then((responses) => {
        responses.forEach((response, idx) => {
          if (response.code > 0) {
            return
          }
          report = [...report, ...response]
        })
        resolve(report)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  add (callback, options) {
    return axios.post('/api/campaign/add', qs.stringify(options), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
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

  budget_update (callback, options) {
    return axios.post('/api/campaign/budget-update', qs.stringify(options), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
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
    return axios.post('/api/campaign/delete', qs.stringify(options), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
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