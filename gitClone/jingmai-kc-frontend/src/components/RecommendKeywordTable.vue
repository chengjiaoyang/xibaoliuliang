<template>
  <div>
    <Form ref="searchForm" :model="searchOptions" :rules="ruleInline" inline>
      <FormItem prop="sortType">
        <Select v-model="searchOptions.sortType" @on-change="onUpdateSearch">
          <Option v-for="item in sortTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem prop="keywordType">
        <Select v-model="searchOptions.keywordType" @on-change="onUpdateSearch">
          <Option v-for="item in keywordTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem prop="searchType">
        <Select v-model="searchOptions.searchType" @on-change="onUpdateSearch">
          <Option v-for="item in searchTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem prop="order">
        <Select v-model="searchOptions.order" @on-change="onUpdateSearch">
          <Option v-for="item in [{value: 0, label: '正序'}, {value: 1, label: '倒序'}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
    </Form>
    <Table border :columns="keywordTableColumns" :data="keywords" size="small" @on-selection-change="onSelectionChange"></Table>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
  import * as types from '../store/mutation-types'

  export default {
    data() {
      return {
        searchOptions: {
          order: 1,
          sortType: 1,
          keywordType: 1,
          searchType: 1
        },
        sortTypes: [
          {value: 1, label: '按搜索量排序'},
          {value: 2, label: '按平均出价排序'},
          {value: 3, label: '按竞争激烈程度排序'}
        ],
        keywordTypes: [
          {value: 1, label: '商品关键词'},
          {value: 2, label: '相似商品关键词'},
          {value: 3, label: '行业热词'}
        ],
        searchTypes: [
          {value: 1, label: '全平台'},
          {value: 2, label: '无线端'},
          {value: 3, label: 'PC端'}
        ],
        keywordTableColumns: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '关键词名称',
          key: 'keyWord',
          width: 180
        }, {
          title: '平均出价',
          key: 'avgBigPrice',
          width: 80,
          align: 'right'
        }, {
          title: '30天搜索量',
          key: 'pv',
          width: 100,
          align: 'right'
        }, {
          title: '竞争度',
          key: 'starCount',
          align: 'right',
          render: (h, params) => {
            return h('Rate', {
              props: {
                value: params.row.starCount,
                disabled: true
              }
            })
          }
        }],
        keywords: [],
        multipleSelection: [],
        spinShow: false,
        skuId: 0,
        existsKeywords: []
      }
    },
    methods: {
      onSelectionChange(selection) {
        this.multipleSelection = selection;
      },
      haveSelectedKeywords() {
        return this.multipleSelection.length > 0
      },
      getRecommends(options) {
        this.multipleSelection = []
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.KEYWORDS_RECOMMEND_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      onUpdateSearch() {
        this.searchRecommends(0, null)
      },
      searchRecommends(skuId, existsKeywords) {
        if (!skuId) {
          skuId = this.skuId
        } else {
          this.skuId = skuId
        }
        if (existsKeywords) {
          this.existsKeywords = existsKeywords
        }
        const runner = async() => {
          this.spinShow = true
          try {
            let options = JSON.parse(JSON.stringify(this.searchOptions))
            options.skuId = skuId
            const kws = await this.getRecommends(options)
            let existsKeywords = {}
            for (const kw of this.existsKeywords) {
              existsKeywords[kw.keyword] = true
            }
            let keywords = []
            for (const kw of kws) {
              if (kw.keyWord in existsKeywords) {
                continue
              }
              keywords.push(kw)
            }
            this.keywords = keywords
          } catch (err) {
            if (err.code && err.code === 401) {
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

      onAddKeywords(callback, addOptions) {
        let kws = []
        for (const kw of this.multipleSelection) {
          kws.push({name: kw.keyWord, type: addOptions.type, price: kw.avgBigPrice})
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
            await this.addKeywords(options)
          } catch (err) {
            console.log(err)
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
        runner({campaign_id: addOptions.campaignId, adgroup_id: addOptions.adgroupId, keywords: kws})
      },

      addKeywords(options) {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.KEYWORDS_ADD_REQUEST, options).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      }
    }
  }
</script>