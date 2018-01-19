<template>
  <div>
    <Table border :columns="keywordRptTableColumns" :data="keywords" size="small" @on-selection-change="onSelectionChange"></Table>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
  import * as types from '../store/mutation-types'
  import moment from 'moment'

  export default {
    data() {
      return {
        updateKeywordsForm: {
          value: 100,
          action: 1
        },
        updateKeywordsActions: [
          {value: 1, label: '按当前出价百分比'},
          {value: 2, label: '按建议出价百分比'},
          {value: 3, label: '自定义出价'}
        ],
        keywordRptTableColumns: [{
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        }, {
          title: '关键词名称',
          key: 'keyword',
          fixed: 'left',
          sortble: true,
          width: 180
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
          title: '购买类型',
          key: 'type',
          width: 120,
          filters: [{label: '精准匹配', value: 'exact'}, {label: '智能匹配', value: 'smart'}, {label: '短语匹配', value: 'term'}, {label: '切词匹配', value: 'segment'}],
          filterMultiple: true,
          filterMethod: (value, row) => { return row.type === value },
          render: (h, params) => {
            return h('span', this.keywordTypeText(params.row))
          }
        }, {
          title: 'PC出价',
          key: 'keyword_price',
          width: 100,
          align: 'right',
          sortable: true
        }, {
          title: '无线出价',
          key: 'keyword_price_wireless',
          width: 110,
          align: 'right',
          sortable: true
        }, {
          title: 'PC竞争力指数',
          key: 'current_pc_showq',
          width: 140,
          align: 'right',
          sortable: true
        }, {
          title: '无线竞争力指数',
          key: 'current_wl_showq',
          width: 140,
          align: 'right',
          sortable: true
        }, {
          title: 'PC平均排名',
          key: 'average_current_pc_rank',
          width: 120,
          align: 'right',
          sortable: true
        }, {
          title: '无线平均排名',
          key: 'average_history_wl_rank',
          width: 130,
          align: 'right',
          sortable: true
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
        adgroupId: 0,
        dateRange: [],
        isTodayOr15Days: 0,
        isOrderOrClick: 0,
        valType: '',
        platform: 'all',
        title: ''
      }
    },
    methods: {
      keywordTypeText(row) {
        if (row.type === 'exact') {
          return '精准匹配'
        } else if (row.type === 'smart') {
          return '智能匹配'
        } else if (row.type === 'term') {
          return '短语匹配'
        } else if (row.type === 'segment') {
          return '切词匹配'
        }
      },
      onUpdateRpt() {
        const runner = async() => {
          this.spinShow = true
          try {
            await this.getKeywordsRpts()
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
      onSearchKeyword() {
        this.$store.dispatch(types.FILTER_KEYWORDS_REQUEST).then(res => {})
      },
      onSelectionChange(selection) {
        this.multipleSelection = selection;
      },
      haveSelectedKeywords() {
        return this.multipleSelection.length > 0
      },
      onDeleteKeyword() {
        if (this.multipleSelection.length === 0) {
          this.$Modal.error({title: '错误', content: '请先选择要删除的关键词'})
          return
        }
        let kws = []
        for (const kw of this.multipleSelection) {
          kws.push(kw.keyword)
        }
        const runner = async(options) => {
          this.spinShow = true
          try {
            await this.deleteKeywords(options)
            await this.getKeywordsRpts()
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
        runner({campaign_id: this.searchOptions.campaignId, adgroup_id: this.searchOptions.adgroupId, keywords: kws})
      },
      onChangePrice() {
        if (this.multipleSelection.length === 0) {
          this.$Modal.error({title: '错误', content: '请先选择要修改的关键词'})
          return
        }
        this.showUpdateKeywordsModal = true
      },
      onUpdateKeywords(callback, updateOptions) {
        let kws = []
        for (const kw of this.multipleSelection) {
          let price = kw.keyword_price
          if (updateOptions.action === 1) {
            price = price * updateOptions.value / 100
          } else if (updateOptions.action === 2 && updateOptions.categorySuggestPrice) {
            price = updateOptions.categorySuggestPrice.dayMiddle[0].price * updateOptions.value / 100
            console.log(price)
          } else if (updateOptions.action === 3) {
            price = updateOptions.value
          } 
          let type = '1'
          if (kw.type === 'exact') {
            type = '1'
          } else if (kw.type === 'term') {
            type = '4'
          } else if (kw.type === 'segment') {
            type = '8'
          } else {
            continue
          }
          kws.push({name: kw.keyword, type: type, price: price.toFixed(2)})
        }
        if (kws.length === 0) {
          if (callback) {
            callback()
          }
          return
        }
        const runner = async(options) => {
          this.spinShow = true
          try {
            await this.updateKeywords(options)
            await this.getKeywordsRpts()
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
        runner({campaign_id: this.searchOptions.campaignId, adgroup_id: this.searchOptions.adgroupId, keywords: kws})
      },
      cancelUpdateKeywords () {
        this.showUpdateKeywordsModal = false
      },
      deleteKeywords(options) {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.KEYWORDS_DELETE_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      updateKeywords(options) {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.KEYWORDS_UPDATE_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      getCampaigns() {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.GET_CAMPAIGNS_REQUEST).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      getAdgroups() {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.GET_ADGROUPS_REQUEST, this.searchOptions.campaignId).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      getKeywordsRpts() {
        this.multipleSelection = []
        return new Promise((resolve, reject) => {
          let options = JSON.parse(JSON.stringify(this.searchOptions))
          if (options.dataRange > 0) {
            options.dateRange = [moment(options.dateRange[0]).format('YYYY-MM-DD'), moment(options.dateRange[1]).format('YYYY-MM-DD')]
          }
          this.$store.dispatch(types.GET_KEYWORDS_RPTS_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      onStrategyUpdate(strategyId) {
        if (this.multipleSelection.length === 0) {
          this.$Modal.error({title: '错误', content: '请先选择要托管的关键词'})
          return
        }
        let ids = []
        for (const kw of this.multipleSelection) {
          if (kw.id === 0) {
            continue
          }
          ids.push(kw.id)
        }
        const runner = async(options) => {
          this.spinShow = true
          try {
            await this.strategySetup(options)
            await this.getKeywordsRpts()
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
        runner({strategy_id: strategyId, campaign_id: this.searchOptions.campaignId, adgroup_id: this.searchOptions.adgroupId, ids: ids})
      },
      onStrategyDelete() {
        if (this.multipleSelection.length === 0) {
          this.$Modal.error({title: '错误', content: '请先选择要取消托管的关键词'})
          return
        }
        let ids = []
        for (const kw of this.multipleSelection) {
          if (kw.id === 0) {
            continue
          }
          ids.push(kw.id)
        }
        const runner = async(options) => {
          this.spinShow = true
          try {
            await this.strategyRemove(options)
            await this.getKeywordsRpts()
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
        runner({campaign_id: this.searchOptions.campaignId, adgroup_id: this.searchOptions.adgroupId, ids: ids})
      },
      getStrategies() {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.GET_STRATEGY_LIST_REQUEST).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
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
      keywordsPriceSuggest() {
        return new Promise((resolve, reject) => {
          let kws = []
          for (const kw of this.keywords) {
            let type = 1
            if (kw.type === 'exact') {
              type = 1
            } else if (kw.type === 'term') {
              type = 4
            } else if (kw.type === 'segment') {
              type = 8
            } else {
              continue
            }
            kws.push({type: type, name: kw.keyword})
          }
          if (kws.length === 0) {
            resolve({ret: 'ok'})
            return
          }
          this.$store.dispatch(types.KEYWORDS_PRICE_SUGGEST_REQUEST, {keywords: kws}).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      existsKeywords() {
        return this.keywords
      }
    },
    computed: {
      keywords() {
        const rawKeywords = this.$store.getters.getKeywordRptByAdgroupId(this.searchOptions.adgroupId)
        let ret = []
        const fields = ['impressions', 'clicks', 'ctr', 'cost', 'cpc', 'cpm', 'total_order_sum', 'total_order_cnt', 'total_order_roi', 'current_pc_showq', 'current_wl_showq', 'average_current_pc_rank', 'average_history_wl_rank']
        for (let kw of rawKeywords) {
          if (this.searchOptions.title !== '' && kw.keyword.indexOf(this.searchOptions.title) < 0) {
            continue
          }
          for (const field of fields) {
            if (kw[field] === undefined) {
              kw[field] = 0
            }
          }
          ret.push(kw)
        }
        return ret
      }
    },
    mounted() {
      const runner = async() => {
        try {
          this.spinShow = true
          await this.getKeywordsRpts()
          //await this.keywordsPriceSuggest()
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