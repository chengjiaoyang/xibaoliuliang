<template>
  <div>
    <div class="box-card">
      <h2>智能托管<Button type="text">什么是智能托管</Button></h2>
      <p>请在下方京准通投放计划列表中勾选需要托管的计划，然后点击【智能托管】开启自动化智能投放模式</p>
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
            <Button type="primary" @click="onShowAddCampaign">创建计划</Button>
            <Button type="success" @click="onUpdateCampaignStatusStart">启用</Button>
            <Button type="warning" @click="onUpdateCampaignStatusStop">暂停</Button>
            <Button type="error" @click="onDeleteCampaign">删除</Button>
          </ButtonGroup>
        </Col>
        <Col span="12" style="text-align:right">
          <Form ref="searchForm" :model="searchCampaignForm" :rules="ruleInline" inline>
            <FormItem prop="dateRange">
              <DatePicker :value="searchCampaignForm.dateRange" format="yyyy-MM-dd" type="daterange" :options="dateRangeOptions" placement="bottom-end" placeholder="日期范围" @on-change="onDateRangeChange"></DatePicker>
            </FormItem>
            <FormItem prop="platform">
              <Select v-model="searchCampaignForm.platform" @on-change="onUpdateRpt">
                <Option v-for="item in [{value:'all', label:'全平台'}, {value:'pc', label:'PC'}, {value:'mobile', label:'移动'}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="isTodayOr15Days">
              <Select v-model="searchCampaignForm.isTodayOr15Days" @on-change="onUpdateRpt">
                <Option v-for="item in [{value:0, label:'15天效果'}, {value:1, label:'当天效果'}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="isOrderOrClick">
              <Select v-model="searchCampaignForm.isOrderOrClick" @on-change="onUpdateRpt">
                <Option v-for="item in [{value:0, label:'下单口径'}, {value:1, label:'点击口径'}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="title">
                <Input type="text" v-model="searchCampaignForm.title" placeholder="计划标题搜索"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="onSearchCampaign">查询</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <CampaignTable ref="campaignsTable" :searchOptions="searchCampaignForm"></CampaignTable>
    </div>
    <Modal
        v-model="showAddCampaignModel"
        title="创建计划"
        @on-ok="onAddCampaign"
        @on-cancel="onCancelAddCampaign">
        <Form ref="addCampaignForm" :rules="ruleInline" inline>
          <FormItem label="计划名称">
            <Input type="text" v-model="addCampaignForm.name"></Input>
          </FormItem>
          <FormItem label="日限额">
            <InputNumber :max="1000" :min="1" v-model="addCampaignForm.dayBudget"></InputNumber>
          </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import * as types from '../store/mutation-types'
  import CampaignTable from './CampaignTable'

  export default {
    components: {
      CampaignTable
    },
    data() {
      return {
        searchCampaignForm: {
          dateRange: [],
          isTodayOr15Days: 0,
          isOrderOrClick: 0,
          platform: 'all',
          title: ''
        },
        addCampaignForm: {
          name: '',
          dayBudget: 100
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
        showAddCampaignModel: false
      }
    },
    methods: {
      onDateRangeChange(date) {
        this.searchCampaignForm.dateRange = date
        this.onUpdateRpt()
      },
      onUpdateRpt() {
        this.$refs.campaignsTable.onUpdateRpt()
      },
      onSearchCampaign() {
        this.$refs.campaignsTable.onSearchCampaign()
      },
      onShowAddCampaign() {
        this.showAddCampaignModel = true
      },
      onAddCampaign() {
        this.$refs.campaignsTable.onAddCampaign(() => {
          this.showAddCampaignModel = false
        }, {name: this.addCampaignForm.name, dayBudget: this.addCampaignForm.dayBudget})
      },
      onDeleteCampaign() {
        this.$refs.campaignsTable.onDeleteCampaign()
      },
      onUpdateCampaignStatusStart() {
        this.$refs.campaignsTable.onUpdateCampaignStatusStart()
      },
      onUpdateCampaignStatusStop() {
        this.$refs.campaignsTable.onUpdateCampaignStatusStop()
      },
      onStrategyUpdate(strategyId) {
        this.$refs.campaignsTable.onStrategyUpdate(strategyId)
      },
      onStragetyDelete() {
        this.$refs.campaignsTable.onStragetyDelete()
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
      strategies() {
        return this.$store.getters['strategies']
      }
    },
    mounted() {
      this.getStrategies()
    }
  }
</script>