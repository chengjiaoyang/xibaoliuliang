<template>
  <div>
    <Table border :columns="adgroupRptTableColumns" :data="adgroups" size="small" @on-selection-change="onSelectionChange"></Table>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
  import * as types from '../store/mutation-types'
  import moment from 'moment'

  export default {
    data() {
      return {
        adgroupRptTableColumns: [{
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        }, {
          title: '推广组名称',
          key: 'name',
          fixed: 'left',
          sortble: true,
          width: 180, 
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'text'
              },
              on: {
                click: (ev) => { 
                  this.onAdgroupClick(params.row)
                }
              }
            }, params.row.name);
          }
        }, {
          title: '状态',
          key: 'status',
          width: 120,
          filters: [{label: '暂停中', value: 1}, {label: '有效', value: 2}, {label: '预算不足', value: 3}, {label: '不在投放时间', value: 4}],
          filterMultiple: true,
          filterMethod: (value, row) => { return row.status === value },
          render: (h, params) => {
            return h('Tag', {
              props: {
                color: this.adgroupStatusTagColor(params.row, params.index)
              }
            }, this.adgroupStatusTagText(params.row, params.index))
          }
        }, {
          title: '托管状态',
          key: 'strategy_id',
          width: 120,
          filters: [{label: '已托管', value: true}, {label: '未托管', value: false}],
          filterMultiple: true,
          filterMethod: (value, row) => { return (row.strategy_id !== 0) === value },
          render: (h, params) => {
            return h('Tag', {
              props: {
                color: params.row.strategy_id > 0 ? 'green' : 'red'
              }
            }, params.row.strategy_name ? params.row.strategy_name : '未托管')
          }
        }, {
          title: '推广类型',
          key: 'putType',
          width: 100,
          render: (h, params) => {
            return h('span', this.adgroupPutTypeText(params.row))
          }
        }, {
          title: '计费类型',
          key: 'billingType',
          width: 110,
          filters: [{label: 'CPM', value: 1}, {label: 'CPC', value: 0}],
          filterMultiple: true,
          filterMethod: (value, row) => { return row.billingType === value },
          render: (h, params) => {
            return h('span', params.row.billingType === 1 ? 'CPM' : 'CPC')
          }
        }, {
          title: '站内出价',
          key: 'feeStr',
          width: 110,
          align: 'right',
          sortable: true
        }, {
          title: '站外出价',
          key: 'outerFeeStr',
          width: 110,
          align: 'right',
          sortable: true
        }, {
          title: '更新时间',
          key: 'createdTime',
          width: 210,
          align: 'center',
          sortable: true,
          render: (h, params) => {
            if (params.row.endTime) {
              return h('div', [
                h('div', '创建时间: ' + params.row.createdTime),
                h('div', '修改时间: ' + params.row.modifiedTime)]
              )
            }
            return h('span', '创建时间: ' + params.row.createdTime)
          }
        }, {
          title: '展现量',
          key: 'impressions',
          align: 'right',
          sortable: true,
          width: 100
        }, {
          title: '点击量',
          key: 'clicks',
          align: 'right',
          sortable: true,
          width: 100
        }, {
          title: '点击率(%)',
          key: 'ctr',
          align: 'right',
          sortable: true,
          width: 120
        }, {
          title: '花费',
          key: 'cost',
          align: 'right',
          sortable: true,
          width: 100
        }, {
          title: 'CPM',
          key: 'cpm',
          align: 'right',
          sortable: true,
          width: 90
        }, {
          title: 'CPC',
          key: 'cpc',
          align: 'right',
          sortable: true,
          width: 90
        }, {
          title: '订单数',
          key: 'total_order_cnt',
          align: 'right',
          sortable: true,
          width: 90
        }, {
          title: '订单金额(￥)',
          key: 'total_order_sum',
          align: 'right',
          sortable: true,
          width: 130
        }, {
          title: '投入产出比',
          key: 'total_order_roi',
          align: 'right',
          sortable: true,
          width: 120
        }],
        multipleSelection: [],
        spinShow: false
      }
    },
    props: {
      searchOptions: {
        campaignId: 0,
        dateRange: [],
        isTodayOr15Days: 0,
        isOrderOrClick: 0,
        platform: 'all',
        title: ''
      }
    },
    methods: {
      adgroupStatusTagColor(row, colunm) {
        if (row.status === 1) {
          return 'red'
        } else if (row.status === 2) {
          return 'green'
        } else if (row.status === 3) {
          return 'yellow'
        } else if (row.status === 4) {
          return 'blue'
        }
      }, 
      adgroupStatusTagText(row, column) {
        if (row.status === 1) {
          return '暂停中'
        } else if (row.status === 2) {
          return '有效'
        } else if (row.status === 3) {
          return '预算不足'
        } else if (row.status === 4) {
          return '不在投放时间'
        }
      },
      adgroupPutTypeText(row, column) {
        if (row.putType === 4) {
          return '活动'
        }
        return row.putType
      },
      onUpdateRpt() {
        const runner = async() => {
          this.spinShow = true
          try {
            await this.getAdgroupsRpts()
          } catch (err) {
            if (err.code === 401) {
              this.$router.push({
                name: 'login'
              })
              return
            }
            this.$Modal.error({title: '错误', content: err.msg ? err.msg : 'unknown error'})
          }
          this.spinShow = false
        }
        runner()
      },
      onSearchAdgroup() {
        this.$store.dispatch(types.FILTER_ADGROUPS_REQUEST).then(res => {
        })
      },
      onSelectionChange(selection) {
        this.multipleSelection = selection;
      },
      onUpdateAdgroupStatusStart() {
        if (this.multipleSelection.length === 0) {
          this.$Modal.error({title: '错误', content: '请先选择要启动的推广单元'})
          return
        }
        let idList = []
        for (const campaign of this.multipleSelection) {
          idList.push(campaign.id)
        }
        const runner = async(options) => {
          this.spinShow = true
          try {
            await this.updateAdgroupStatus(options)
            await this.getAdgroups()
          } catch (err) {
            if (err.code === 401) {
              this.$router.push({
                name: 'login'
              })
              return
            }
            this.$Modal.error({title: '错误', content: err.msg ? err.msg : 'unknown error'})
          }
          this.spinShow = false
        }
        runner({idList: idList, status: 2})
      },
      onUpdateAdgroupStatusStop() {
        if (this.multipleSelection.length === 0) {
          this.$Modal.error({title: '错误', content: '请先选择要暂停的推广单元'})
          return
        }
        let idList = []
        for (const campaign of this.multipleSelection) {
          idList.push(campaign.id)
        }
        const runner = async(options) => {
          this.spinShow = true
          try {
            await this.updateAdgroupStatus(options)
            await this.getAdgroups()
          } catch (err) {
            if (err.code === 401) {
              this.$router.push({
                name: 'login'
              })
              return
            }
            this.$Modal.error({title: '错误', content: err.msg ? err.msg : 'unknown error'})
          }
          
          this.spinShow = true
        }
        runner({idList: idList, status: 1})
      },
      onAdgroupClick(adgroup) {
        this.$router.push({name: 'adgroup', params: {campaignId: adgroup.campaignId, id: adgroup.id}})
      },
      getAdgroups() {
        this.multipleSelection = []
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.GET_ADGROUPS_REQUEST, this.searchOptions.campaignId).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      getAdgroupsRpts() {
        return new Promise((resolve, reject) => {
          let options = JSON.parse(JSON.stringify(this.searchOptions))
          if (options.dataRange > 0) {
            options.dateRange = [moment(options.dateRange[0]).format('YYYY-MM-DD'), moment(options.dateRange[1]).format('YYYY-MM-DD')]
          }
          this.$store.dispatch(types.GET_ADGROUPS_RPTS_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      updateAdgroupStatus(options) {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.ADGROUPS_STATUS_UPDATE_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      onStrategyUpdate(strategyId) {
        if (this.multipleSelection.length === 0) {
          this.$Modal.error({title: '错误', content: '请先选择要托管的推广单元'})
          return
        }
        let ids = []
        for (const ad of this.multipleSelection) {
          ids.push(ad.id)
        }
        const runner = async(options) => {
          this.spinShow = true
          await this.strategySetup(options)
          await this.getAdgroups()
          this.spinShow = false
        }
        runner({strategy_id: strategyId, campaign_id: this.searchOptions.campaignId, ids: ids})
      },
      onStragetyDelete() {
        if (this.multipleSelection.length === 0) {
          this.$Modal.error({title: '错误', content: '请先选择要取消托管的推广单元'})
          return
        }
        let ids = []
        for (const ad of this.multipleSelection) {
          ids.push(ad.id)
        }
        const runner = async(options) => {
          this.spinShow = true
          await this.strategyRemove(options)
          await this.getAdgroups()
          this.spinShow = false
        }
        runner({campaign_id: this.searchOptions.campaignId, ids: ids})
      },
      strategySetup(options) {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.STRATEGY_SETUP_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      strategyRemove(options) {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.REMOVE_STRATEGY_SETUP_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      }
    },
    computed: {
      adgroups() {
        const rawAdgroups = this.$store.getters.getAdgroupsByCampaignId(this.searchOptions.campaignId)
        let ret = []
        const fields = ['impressions', 'clicks', 'ctr', 'cost', 'cpc', 'cpm', 'total_order_sum', 'total_order_cnt', 'total_order_roi']
        for (let ad of rawAdgroups) {
          if (this.searchOptions.title !== '' && ad.name.indexOf(this.searchOptions.title) < 0) {
            continue
          }
          let adRpt = this.$store.getters.getAdgroupRptByCampaignId(ad.campaignId)
          if (adRpt.length === 0) {
            adRpt = {}
          } else {
            adRpt = adRpt[0]
          }
          for (const field of fields) {
            if (adRpt[field] === undefined) {
              adRpt[field] = 0
            }
          }
          ad = {...ad, ...adRpt}
          ret.push(ad)
        }
        return ret
      }
    },
    mounted() {
      const runner = async() => {
        this.spinShow = true
        try {
          await this.getAdgroups()
          await this.getAdgroupsRpts()
        } catch (err) {
          if (err.code === 401) {
            this.$router.push({
              name: 'login'
            })
            return
          }
          this.$Modal.error({title: '错误', content: err.msg ? err.msg : 'unknown error'})
        }
        
        this.spinShow = false
      }
      runner()
    }
  }
</script>