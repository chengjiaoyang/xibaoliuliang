<template>
  <div>
      <Table border :columns="campaignRptTableColumns" :data="campaigns" size="small" @on-selection-change="onSelectionChange"></Table>
      <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
  import * as types from '../store/mutation-types'
  import moment from 'moment'

  export default {
    data() {
      return {
        campaignRptTableColumns: [{
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        }, {
          title: '计划名称',
          key: 'name',
          fixed: 'left',
          sortble: true,
          width: 120, 
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'text'
              },
              on: {
                click: (ev) => { 
                  this.onCampaignClick(params.row)
                }
              }
            }, params.row.name);
          }
        }, {
          title: '计划状态',
          key: 'status',
          width: 120,
          filters: [{label: '暂停中', value: 1}, {label: '有效', value: 2}, {label: '预算不足', value: 3}, {label: '不在投放时间', value: 4}],
          filterMultiple: true,
          filterMethod: (value, row) => { return row.status === value },
          render: (h, params) => {
            return h('Tag', {
              props: {
                color: this.campaignStatusTagColor(params.row, params.index)
              }
            }, this.campaignStatusTagText(params.row, params.index))
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
            return h('span', this.campaignPutTypeText(params.row))
          }
        }, {
          title: '投放周期',
          key: 'dateRange',
          width: 120,
          align: 'center',
          render: (h, params) => {
            if (params.row.endTime) {
              return h('div', [
                h('div', moment(params.row.startTime).format('YYYY-MM-DD')),
                h('div', ' 至 '),
                h('div', moment(params.row.endTime).format('YYYY-MM-DD'))]
              )
            }
            return h('span', moment(params.row.startTime).format('YYYY-MM-DD'))
          }
        }, {
          title: '日限额',
          key: 'dayBudgetResult',
          align: 'right',
          sortable: true,
          width: 100,
          render: (h, params) => {
            if (params.row.id === this.editCampaignBudgetForm.campaignId) {
              return h('Input', 
                {
                  props: {
                    value: params.row.dayBudgetResult
                  },
                  on: {
                    input: (val) => {
                      this.editCampaignBudgetForm.budget = parseInt(val)
                    },
                    'on-enter': (val) => {
                      if (this.editCampaignBudgetForm.budget !== parseInt(params.row.dayBudgetResult)) {
                        this.onUpdateCampaignBudget({campaignId: this.editCampaignBudgetForm.campaignId, dayBudget: this.editCampaignBudgetForm.budget})
                      }
                      this.editCampaignBudgetForm.campaignId = 0
                      return false
                    }
                  }
                }
              )
            }
            return h('Button', 
              {
                props: {
                  type: 'text'
                },
                on: {
                  click: (ev) => {
                    ev.stopPropagation()
                    this.editCampaignBudgetForm.budget = parseInt(params.row.dayBudgetResult)
                    this.editCampaignBudgetForm.campaignId = params.row.id
                    return true
                  }
                }
              }, 
              [
                h('span', params.row.dayBudgetResult + ' '),
                h('Icon', {
                  props: {
                    type: 'edit',
                    color: '#2d8cf0'
                  }
                })
              ]
            )
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
        editCampaignBudgetForm: {
          campaignId: 0,
          budget: 0
        },
        spinShow: false
      }
    },
    props: {
      searchOptions: {
        dateRange: [],
        isTodayOr15Days: 0,
        isOrderOrClick: 0,
        platform: 'all',
        title: ''
      }
    },
    methods: {
      campaignStatusTagColor(row, column) {
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
      campaignStatusTagText(row, column) {
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
      campaignPutTypeText(row, column) {
        if (row.putType === 4) {
          return '活动'
        }
        return row.putType
      },
      onUpdateRpt() {
        this.spinShow = true
        this.getCampaignsRpts().then((res) => {
          this.spinShow = false
        }).catch((err) => {
          this.spinShow = false
          if (err.code === 401) {
            this.$router.push({
              name: 'login'
            })
            return
          }
          this.$Modal.error({title: '错误', content: err.msg ? err.msg : 'unknown error'})
        })
      },
      onSearchCampaign() {
        this.$store.dispatch(types.FILTER_CAMPAIGNS_REQUEST).then(res => {
        })
      },
      onSelectionChange(selection) {
        this.multipleSelection = selection
      },
      onDeleteCampaign() {
        if (this.multipleSelection.length === 0) {
          this.$Modal.error({title: '错误', content: '请先选择要删除的推广计划'})
          return
        }
        let idList = []
        for (const campaign of this.multipleSelection) {
          idList.push(campaign.id)
        }
        const runner = async(options) => {
          this.spinShow = true
          try {
            await this.deleteCampaign(options)
            await this.getCampaigns()
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
        runner({idList: idList})
      },
      onAddCampaign(callback, options) {
        const runner = async(options) => {
          this.spinShow = true
          try {
            await this.addCampaign(options)
            await this.getCampaigns()
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
          if (callback) {
            callback()
          }
        }
        runner(options)
      },
      onUpdateCampaignStatusStart() {
        if (this.multipleSelection.length === 0) {
          this.$Modal.error({title: '错误', content: '请先选择要启动的推广计划'})
          return
        }
        let idList = []
        for (const campaign of this.multipleSelection) {
          idList.push(campaign.id)
        }
        const runner = async(options) => {
          this.spinShow = true
          try {
            await this.updateCampaignStatus(options)
            await this.getCampaigns()
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
      onUpdateCampaignStatusStop() {
        if (this.multipleSelection.length === 0) {
          this.$Modal.error({title: '错误', content: '请先选择要暂停的推广计划'})
          return
        }
        let idList = []
        for (const campaign of this.multipleSelection) {
          idList.push(campaign.id)
        }
        const runner = async(options) => {
          this.spinShow = false
          try {
            await this.updateCampaignStatus(options)
            await this.getCampaigns()
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
        runner({idList: idList, status: 1})
      },
      onStrategyUpdate(strategyId) {
        if (this.multipleSelection.length === 0) {
          this.$Modal.error({title: '错误', content: '请先选择要托管的推广计划'})
          return
        }
        let ids = []
        for (const campaign of this.multipleSelection) {
          ids.push(campaign.id)
        }
        const runner = async(options) => {
          this.spinShow = true
          try {
            await this.strategySetup(options)
            await this.getCampaigns()
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
        runner({strategy_id: strategyId, ids: ids})
      },
      onStragetyDelete() {
        if (this.multipleSelection.length === 0) {
          this.$Modal.error({title: '错误', content: '请先选择要取消托管的推广计划'})
          return
        }
        let ids = []
        for (const campaign of this.multipleSelection) {
          ids.push(campaign.id)
        }
        const runner = async(options) => {
          this.spinShow = true
          try {
            await this.strategyRemove(options)
            await this.getCampaigns()
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
        runner({ids: ids})
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
      },
      onCampaignClick(campaign) {
        this.$router.push({name: 'campaign', params: {id: campaign.id}})
      },
      getCampaigns() {
        this.multipleSelection = []
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.GET_CAMPAIGNS_REQUEST).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      getCampaignsRpts() {
        return new Promise((resolve, reject) => {
          let options = JSON.parse(JSON.stringify(this.searchOptions))
          if (options.dataRange > 0) {
            options.dateRange = [moment(options.dateRange[0]).format('YYYY-MM-DD'), moment(options.dateRange[1]).format('YYYY-MM-DD')]
          }
          this.$store.dispatch(types.GET_CAMPAIGNS_RPTS_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      updateCampaignStatus(options) {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.CAMPAIGNS_STATUS_UPDATE_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      onUpdateCampaignBudget(options) {
        const runner = async(options) => {
          this.spinShow = true
          await this.updateCampaignBudget(options)
          await this.getCampaigns()
          this.spinShow = false
        }
        runner(options)
      },
      updateCampaignBudget(options) {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.CAMPAIGN_BUDGET_UPDATE_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      deleteCampaign(options) {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.CAMPAIGN_DELETE_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      addCampaign(options) {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.CAMPAIGN_ADD_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      }
    },
    computed: {
      campaigns() {
        const rawCampaigns = this.$store.getters['campaigns']
        let campaigns = JSON.parse(JSON.stringify(rawCampaigns));
        let ret = []
        const fields = ['impressions', 'clicks', 'ctr', 'cost', 'cpc', 'cpm', 'total_order_sum', 'total_order_cnt', 'total_order_roi']
        for (let campaign of campaigns) {
          if (this.searchOptions.title !== '' && campaign.name.indexOf(this.searchOptions.title) < 0) {
            continue
          }
          let campaignRpt = this.$store.getters.getCampaignRpt(campaign.id)
          if (campaignRpt.length === 0) {
            campaignRpt = {}
          } else {
            campaignRpt = campaignRpt[0]
          }
          for (const field of fields) {
            if (campaignRpt[field] === undefined) {
              campaignRpt[field] = 0
            }
          }
          campaign = {...campaign, ...campaignRpt}
          ret.push(campaign)
        }
        return ret
      }
    },
    mounted() {
      const runner = async() => {
        this.spinShow = true
        try {
          await this.getCampaigns()
          await this.getCampaignsRpts()
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