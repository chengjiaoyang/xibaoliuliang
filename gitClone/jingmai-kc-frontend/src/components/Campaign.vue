<template>
  <div>
    <Breadcrumb style="margin:15px">
        <BreadcrumbItem to="/">智能托管</BreadcrumbItem>
        <BreadcrumbItem>计划</BreadcrumbItem>
    </Breadcrumb>
    <div class="box-card" style="text-align:center">
      <h2>{{ campaign.name }}</h2>
      <p>
        <Tag :color="campaignStatusTagColor()">{{ campaignStatusTagText() }}</Tag>
        <Tag v-if="campaign.strategy_id > 0" color="green">托管中</Tag>
        <Tag v-else color="red">未托管</Tag>
        <Button @click="onShowTimeRangeCoefModal" size="small" type="ghost">投放时间</Button>
      </p>
    </div>
    <div class="box-card">
      <CampaignChart :searchOptions="searchOptions" ref="campaignChart"></CampaignChart>
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
          <Button type="error" @click="onStragetyDelete">取消托管</Button>
          <ButtonGroup>
            <Button type="success" @click="onUpdateAdgroupStatusStart">启用</Button>
            <Button type="warning" @click="onUpdateAdgroupStatusStop">暂停</Button>
            <Button type="error" @click="onDeleteAdgroup">删除</Button>
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
                <Button type="primary" @click="onSearchAdgroup">查询</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <AdgroupTable ref="adgroupsTable" :searchOptions="searchOptions"></AdgroupTable>
    </div>
    <Modal
        v-model="showTimeRangeCoefModal"
        title="计划投放时间设置"
        width="95"
        @on-ok="onUpdateTimeRangeCoef"
        @on-cancel="cancelUpdateTimeRangeCoef">
        <Table border :columns="campaignTimeTableColumns" :data="campaignTimeRangeCoef" size="small"></Table>
    </Modal>
  </div>
</template>

<script>
  import * as types from '../store/mutation-types'
  import AdgroupTable from './AdgroupTable'
  import CampaignChart from './CampaignChart'

  export default {
    components: {
      AdgroupTable,
      CampaignChart
    },
    data() {
      return {
        searchOptions: {
          campaignId: 0,
          dateRange: [],
          isTodayOr15Days: 0,
          isOrderOrClick: 0,
          platform: 'all',
          title: ''
        },
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
        showTimeRangeCoefModal: false
      }
    },
    methods: {
      campaignStatusTagColor() {
        if (this.campaign.status === 1) {
          return 'red'
        } else if (this.campaign.status === 2) {
          return 'green'
        } else if (this.campaign.status === 3) {
          return 'yellow'
        } else if (this.campaign.status === 4) {
          return 'blue'
        }
      }, 
      campaignStatusTagText() {
        if (this.campaign.status === 1) {
          return '暂停中'
        } else if (this.campaign.status === 2) {
          return '有效'
        } else if (this.campaign.status === 3) {
          return '预算不足'
        } else if (this.campaign.status === 4) {
          return '不在投放时间'
        }
      },
      campaignPutTypeText() {
        if (this.campaign.putType === 4) {
          return '活动'
        }
        return this.campaign.putType
      },
      weekdayText(week) {
        if (week === '1') {
          return '一'
        } else if (week === '2') {
          return '二'
        } else if (week === '3') {
          return '三'
        } else if (week === '4') {
          return '四'
        } else if (week === '5') {
          return '五'
        } else if (week === '6') {
          return '六'
        } else if (week === '0') {
          return '日'
        }
      },
      onDateRangeChange(date) {
        this.searchOptions.dateRange = date
        this.onUpdateRpt()
      },
      onUpdateRpt() {
        this.$refs.adgroupsTable.onUpdateRpt()
        this.$refs.campaignChart.onUpdateRpt()
      },
      onSearchAdgroup() {
        this.$refs.adgroupsTable.onSearchAdgroup()
      },
      onShowTimeRangeCoefModal() {
        this.showTimeRangeCoefModal = true
      },
      onUpdateTimeRangeCoef() {
        this.showTimeRangeCoefModal = false
      },
      cancelTimeRangeCoef() {
        this.showTimeRangeCoefModal = false
      },
      onUpdateAdgroupStatusStart() {
        this.$refs.adgroupsTable.onUpdateAdgroupStatusStart()
      },
      onUpdateAdgroupStatusStop() {
        this.$refs.adgroupsTable.onUpdateAdgroupStatusStop()
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
      updateAdgroupStatus(options) {
        this.$refs.adgroupsTable.updateAdgroupStatus(options)
      },
      onStrategyUpdate(strategyId) {
        this.$refs.adgroupsTable.onStrategyUpdate(strategyId)
      },
      onStragetyDelete() {
        this.$refs.adgroupsTable.onStragetyDelete()
      },
      getStrategies() {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.GET_STRATEGY_LIST_REQUEST).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      }
    },
    computed: {
      campaign() {
        return this.$store.getters.getCampaignById(this.searchOptions.campaignId)
      },
      campaignTimeTableColumns() { 
        const ret = [{
          title: '星期',
          key: 'week',
          render: (h, params) => {
            return h('span', this.weekdayText(params.row.week))
          }
        }]
        for (let t = 0; t < 24; t += 1) {
          const key = 't' + t
          ret.push({
            title: t + '点',
            key: key,
            render: (h, params) => {
              let p = ''
              if (params.row[key] === 0 || params.row[key] === 100) {
                p = ''
              } else {
                p = params.row[key] / 100
              }
              return h('span', p)
            }
          })
        }
        return ret
      },
      campaignTimeRangeCoef() {
        if (this.campaign.timeRangePriceCoef === undefined) {
          return []
        }
        const timeCoef = JSON.parse(this.campaign.timeRangePriceCoef)
        let ret = []
        for (const weekday in timeCoef.detail) {
          let week = {week: weekday}
          let cellClassName = {}
          const timePrices = timeCoef.detail[weekday].price_coef
          for (const t in timePrices) {
            week['t' + t] = timePrices[t]
            if (timePrices[t] > 0) {
              cellClassName['t' + t] = 'success'
            }
          }
          week.cellClassName = cellClassName
          ret.push(week)
        }
        return ret
      },
      strategies() {
        return this.$store.getters['strategies']
      }
    },
    created() {
      this.searchOptions.campaignId = parseInt(this.$route.params.id)
    },
    mounted() {
      this.getStrategies()
      const campaign = this.$store.getters.getCampaignById(this.searchOptions.campaignId)
      if (campaign.id === undefined) {
        this.getCampaigns()
      }
    }
  }
</script>