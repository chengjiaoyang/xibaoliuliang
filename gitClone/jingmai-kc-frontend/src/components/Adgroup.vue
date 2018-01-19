<template>
  <div>
    <Breadcrumb style="margin:15px">
        <BreadcrumbItem to="/">智能托管</BreadcrumbItem>
        <BreadcrumbItem :to="campaignLink">计划: {{ campaign.name }}</BreadcrumbItem>
        <BreadcrumbItem >推广单元</BreadcrumbItem>
    </Breadcrumb>
    <div class="box-card" style="text-align:center">
      <h2>{{ adgroup.name }}</h2>
      <p>
        <Tag :color="adgroupStatusTagColor()">{{ adgroupStatusTagText() }}</Tag>
        <Tag v-if="adgroup.strategy_id > 0" color="green">托管中</Tag>
        <Tag v-else color="red">未托管</Tag>
      </p>
    </div>
    <div class="box-card">
      <AdgroupChart ref="adgroupChart" :searchOptions="searchOptions"></AdgroupChart>
    </div>
    <div class="box-card">
      <Row>
        <Col span="12">
          <Button type="ghost">一键优化</Button>
          <Dropdown @on-click="onStrategyUpdate">
            <Button type="success">
              智能托管
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem v-for="item in strategies" :key="item.id" :name="item.id">{{ item.name }}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button type="error" @click="onStrategyDelete">取消托管</Button>
          <Button type="primary" @click="onShowRecommendKeywordModal">添加关键词</Button>
          <ButtonGroup>
            <Button type="success" @click="onChangePrice">批量调价</Button>
            <Button type="error" @click="onDeleteKeyword">删除</Button>
          </ButtonGroup>
        </Col>
        <Col span="12" style="text-align:right">
          <Form ref="searchForm" :model="searchOptions" :rules="ruleInline" inline>
            <FormItem prop="dateRange">
              <DatePicker :value="searchOptions.dateRange" format="yyyy-MM-dd" type="daterange" :options="dateRangeOptions" placement="bottom-end" placeholder="日期范围" @on-change="onDateRangeChange"></DatePicker>
            </FormItem>
            <FormItem prop="platform">
              <Select v-model="searchOptions.platform" @on-change="onUpdateRpt">
                <Option v-for="item in [{value:'all', label:'全平台'}, {value:'pc', label:'PC'}, {value:'mobile', label:'移动'}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="isTodayOr15Days">
              <Select v-model="searchOptions.isTodayOr15Days" @on-change="onUpdateRpt">
                <Option v-for="item in [{value:0, label:'15天效果'}, {value:1, label:'当天效果'}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="isOrderOrClick">
              <Select v-model="searchOptions.isOrderOrClick" @on-change="onUpdateRpt">
                <Option v-for="item in [{value:0, label:'下单口径'}, {value:1, label:'点击口径'}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="title">
                <Input type="text" v-model="searchOptions.title" placeholder="计划标题搜索"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="onSearchKeyword">查询</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <KeywordTable ref="keywordTable" :searchOptions="searchOptions"></KeywordTable>
    </div>
    <Modal
        v-model="showUpdateKeywordsModal"
        title="修改关键词出价"
        @on-ok="onUpdateKeywords"
        @on-cancel="cancelUpdateKeywords">
        <Form ref="updateKeywordsForm" :model="updateKeywordsForm" :rules="ruleInline" inline>
          <FormItem prop="value">
            <Input type="text" v-model="updateKeywordsForm.value">
              <span slot="append">{{ updateKeywordsModalValueAfterFix }}</span>
            </Input>
          </FormItem>
          <FormItem prop="action">
            <Select v-model="updateKeywordsForm.action" style="width:180px">
              <Option v-for="item in updateKeywordsActions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
      </Form>
    </Modal>
    <Modal
        v-model="showRecommendKeywordsModal"
        title="选择关键词"
        width="640"
        @on-ok="onConfirmRecommendKeywords"
        @on-cancel="cancelRecommendKeywords">
        <RecommendKeywordTable ref="recommendKeywordTable"></RecommendKeywordTable>
    </Modal>
    <Modal
        v-model="showAddKeywordsModal"
        title="添加关键词"
        @on-ok="onAddKeywords"
        @on-cancel="cancelAddKeywords">
        <Select v-model="addKeywordsType" style="width:180px">
          <Option v-for="item in [{value: 1, label: '精确匹配'}, {value: 4, label: '短语匹配'}, {value: 8, label: '切词匹配'}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
    </Modal>
  </div>
</template>

<script>
  import * as types from '../store/mutation-types'
  import AdgroupChart from './AdgroupChart'
  import KeywordTable from './KeywordTable'
  import RecommendKeywordTable from './RecommendKeywordTable'

  export default {
    components: {
      AdgroupChart,
      KeywordTable,
      RecommendKeywordTable
    },
    data() {
      return {
        searchOptions: {
          campaignId: 0,
          adgroupId: 0,
          dateRange: [],
          isTodayOr15Days: 0,
          isOrderOrClick: 0,
          valType: '',
          platform: 'all',
          title: ''
        },
        updateKeywordsForm: {
          value: 100,
          action: 1,
          categorySuggestPrice: null
        },
        updateKeywordsActions: [
          {value: 1, label: '按当前出价百分比'},
          {value: 2, label: '按类目建议出价百分比'},
          {value: 3, label: '自定义出价'}
        ],
        addKeywordsType: 8,
        dateRangeOptions: {
          shortcuts: [{
            text: '本周',
            value () {
              const today = new Date()
              let end = new Date()
              end = end.setTime(today.getTime() - 3600 * 1000 * 24)
              const start = new Date(today - (today.getDay() - 1) * 86400000)
              return [start, end]
            }
          }, {
            text: '本月',
            value () {
              const today = new Date() 
              let nowYear = today.getYear()
              nowYear += (nowYear < 2000) ? 1900 : 0
              let start = new Date(nowYear, today.getMonth(), 1)
              let end = new Date()
              end.setTime(today.getTime() - 3600 * 1000 * 24)
              return [start, end]
            }
          }, {
            text: '上周',
            value () {
              const today = new Date() 
              let nowYear = today.getYear()
              nowYear += (nowYear < 2000) ? 1900 : 0
              const nowMonth = today.getMonth()
              const nowDate = today.getDate()
              const nowDayOfWeek = today.getDay()
              const start = new Date(nowYear, nowMonth, nowDate - nowDayOfWeek - 7)
              const end = new Date(nowYear, nowMonth, nowDate - nowDayOfWeek - 1)
              return [start, end]
            }
          }, {
            text: '上月',
            value () {
              const today = new Date() 
              let nowYear = today.getYear()
              nowYear += (nowYear < 2000) ? 1900 : 0

              let lastMonthDate = new Date(); //上月日期
              lastMonthDate.setDate(1)
              lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
              const lastMonth = lastMonthDate.getMonth()
              const start = new Date(nowYear, lastMonth, 1)

              const monthStartDate = new Date(nowYear, lastMonth, 1)
              const monthEndDate = new Date(nowYear, lastMonth + 1, 1)
              const days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
              const end = new Date(nowYear, lastMonth, days)
              return [start, end]
            }
          }],
          disabledDate (date) {
            return date && date.valueOf() > Date.now() - 86400000
          }
        },
        showUpdateKeywordsModal: false,
        showRecommendKeywordsModal: false,
        showAddKeywordsModal: false
      }
    },
    methods: {
      adgroupStatusTagColor() {
        if (this.adgroup.status === 1) {
          return 'red'
        } else if (this.adgroup.status === 2) {
          return 'green'
        } else if (this.adgroup.status === 3) {
          return 'yellow'
        } else if (this.adgroup.status === 4) {
          return 'blue'
        }
      }, 
      adgroupStatusTagText() {
        if (this.adgroup.status === 1) {
          return '暂停中'
        } else if (this.adgroup.status === 2) {
          return '有效'
        } else if (this.adgroup.status === 3) {
          return '预算不足'
        } else if (this.adgroup.status === 4) {
          return '不在投放时间'
        }
      },
      adgroupPutTypeText() {
        if (this.adgroup.putType === 4) {
          return '活动'
        }
        return this.adgroup.putType
      },
      onDateRangeChange(date) {
        this.searchOptions.dateRange = date
        this.onUpdateRpt()
      },
      onUpdateRpt() {
        this.$refs.adgroupChart.onUpdateRpt()
        this.$refs.keywordTable.onUpdateRpt()
      },
      onSearchKeyword() {
        this.$refs.keywordTable.onSearchKeyword()
      },
      onDeleteKeyword() {
        this.$refs.keywordTable.onDeleteKeyword()
      },
      onChangePrice() {
        if (!this.$refs.keywordTable.haveSelectedKeywords()) {
          this.$Modal.error({title: '错误', content: '请先选择要修改的关键词'})
          return
        }
        this.showUpdateKeywordsModal = true
      },
      onUpdateKeywords() {
        if (this.updateKeywordsForm.action === 2 && !this.updateKeywordsForm.categorySuggestPrice) {
          this.$Modal.error({title: '错误', content: '无法获取类目建议出价'})
          return
        }
        this.$refs.keywordTable.onUpdateKeywords(() => {
          this.showUpdateKeywordsModal = false
        }, this.updateKeywordsForm)
      },
      cancelUpdateKeywords () {
        this.showUpdateKeywordsModal = false
      },
      onShowRecommendKeywordModal() {
        if (this.skuId === 0) {
          this.$Modal.error({title: '错误', content: '请先添加创意'})
          return
        }
        this.showRecommendKeywordsModal = true
        this.$refs.recommendKeywordTable.searchRecommends(this.skuId, this.$refs.keywordTable.existsKeywords())
      },
      onConfirmRecommendKeywords() {
        if (!this.$refs.recommendKeywordTable.haveSelectedKeywords()) {
          this.$Modal.error({title: '错误', content: '请先选择要添加的关键词'})
        }
        this.showRecommendKeywordsModal = false
        this.showAddKeywordsModal = true
      },
      cancelRecommendKeywords() {
        this.showRecommendKeywordsModal = false
      },
      onAddKeywords () {
        this.$refs.recommendKeywordTable.onAddKeywords(() => {
          this.showAddKeywordsModal = false
          this.$refs.keywordTable.onUpdateRpt()
        }, {campaignId: this.searchOptions.campaignId, adgroupId: this.searchOptions.adgroupId, type: this.addKeywordsType})
      },
      cancelAddKeywords () {
        this.showAddKeywordsModal = false
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
      onStrategyUpdate(strategyId) {
        this.$refs.keywordTable.onStrategyUpdate(strategyId)
      },
      onStrategyDelete() {
        this.$refs.keywordTable.onStrategyDelete()
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
      getAds() {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.GET_AD_REQUEST, this.searchOptions.adgroupId).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      getCategoryPriceSuggest(cid) {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.KEYWORDS_PRICE_SUGGEST_REQUEST, {cid: cid}).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      }
    },
    computed: {
      adgroup() {
        return this.$store.getters.getAdgroupById(this.searchOptions.adgroupId)
      },
      campaign() {
        return this.$store.getters.getCampaignById(this.searchOptions.campaignId)
      },
      campaignLink() {
        return '/campaign/' + this.searchOptions.campaignId
      },
      strategies() {
        return this.$store.getters['strategies']
      },
      ads() {
        return this.$store.getters.getAdByAdgroupId(this.searchOptions.adgroupId)
      },
      skuId() {
        if (this.ads.length > 0) {
          return this.ads[0].skuId
        }
        return 0
      },
      updateKeywordsModalValueAfterFix() {
        if (this.updateKeywordsForm.action === 3) {
          this.updateKeywordsForm.value = 0.01
          return '元'
        }
        return '%'
      }
    },
    created() {
      this.searchOptions.campaignId = parseInt(this.$route.params.campaignId)
      this.searchOptions.adgroupId = parseInt(this.$route.params.id)
    },
    mounted() {
      this.getStrategies()
      const runner = async() => {
        try {
          const ads = await this.getAds()
          if (ads.length > 0) {
            const cid = ads[0].cid3
            const categorySuggestPrice = await this.getCategoryPriceSuggest(cid)
            this.updateKeywordsForm.categorySuggestPrice = categorySuggestPrice
          }
        } catch (err) {
          if (err.code && err.code === 401) {
            this.$router.push({
              name: 'login'
            })
            return
          }
          this.$Modal.error({title: '错误', content: err.msg ? err.msg : 'unknown error'})
        }
      }
      runner()
      const campaign = this.$store.getters.getCampaignById(this.searchOptions.campaignId)
      if (campaign.id === undefined) {
        this.getCampaigns()
      }
      const adgroup = this.$store.getters.getAdgroupById(this.searchOptions.adgroupId)
      if (adgroup.campaignId === undefined) {
        this.getAdgroups()
      }
    }
  }
</script>