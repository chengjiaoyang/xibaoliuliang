<template>
  <div>
    <Row>
      <Col span="20">
        <h2>单元报表</h2>
      </Col>
      <Col span="4">
        <Select v-model="chartSerieName" @on-change="onChangeChartSerieName">
          <Option v-for="item in chartSelectOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
    </Row>
    <IEcharts :option="dailyRptOptions" @ready="onChartReady" styles="{ width: 100%; height: 200px; }"></IEcharts>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
  import moment from 'moment'
  import adgroupAPI from '../api/adgroup'
  import IEcharts from 'vue-echarts-v3/src/lite.js'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/component/tooltip'

  export default {
    components: {
      IEcharts
    },
    data() {
      return {
        chartSelectOptions: [
          {
            value: 'impressions', 
            label: '展现量'
          },
          {
            value: 'clicks',
            label: '点击量'
          }, 
          {
            value: 'ctr',
            label: '点击率'
          },
          {
            value: 'cost',
            label: '花费'
          },
          {
            value: 'cpc',
            label: 'CPC'
          },
          {
            value: 'cpm',
            label: 'CPM'
          },
          {
            value: 'total_order_sum',
            label: '订单金额'
          },
          {
            value: 'total_order_cnt',
            label: '订单量'
          },
          {
            value: 'total_order_roi',
            label: 'ROI'
          }
        ],
        adgroupDailyRpts: [],
        chartSerieName: 'impressions',
        echart: null,
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
      onChartReady(instance) {
        this.echart = instance
      },
      onUpdateRpt() {
        const runner = async() => {
          this.spinShow = true
          try {
            await this.getAdgroupRptsDaily()
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
      getAdgroupRptsDaily() {
        return new Promise((resolve, reject) => {
          let options = JSON.parse(JSON.stringify(this.searchOptions))
          if (options.dataRange > 0) {
            options.dateRange = [moment(options.dateRange[0]).format('YYYY-MM-DD'), moment(options.dateRange[1]).format('YYYY-MM-DD')]
          }
          options.isDaily = true
          adgroupAPI.rpt_get((response) => {
            if (response.code) {
              const msg = response.message ? {
                code: response.code,
                msg: response.message
              } : response
              this.adgroupDailyRpts = []
              reject(msg)
              return
            }
            this.adgroupDailyRpts = response
            resolve(response)
          }, options)
        })
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
      },
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
      updateKeywordsModalValueAfterFix() {
        if (this.updateKeywordsForm.action === 3) {
          this.updateKeywordsForm.value = 0.01
          return '元'
        }
        return '%'
      },
      dailyRptOptions() {
        let ret = {
          color: ['#2d8cf0'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            data: []
          },
          yAxis: {},
          series: []
        }
        let serieName = ''
        for (const i of this.chartSelectOptions) {
          if (i.value === this.chartSerieName) {
            serieName = i.label
            break
          }
        }
        let xAxis = []
        let data = []
        let d = 0
        let dataMap = {}
        for (const line of this.adgroupDailyRpts) {
          dataMap[moment(line.date).format('YYYY-MM-DD')] = line[this.chartSerieName] ? line[this.chartSerieName] : 0
        }
        let endDay = moment(this.searchOptions.dateRange[1]).format('YYYY-MM-DD')
        let startDay = moment(this.searchOptions.dateRange[0]).format('YYYY-MM-DD')
        if (this.searchOptions.dateRange.length === 0) {
          endDay = moment(new Date()).add(-1, 'd').format('YYYY-MM-DD')
          startDay = moment(new Date()).add(-31, 'd').format('YYYY-MM-DD')
        }
        while (true) {
          const day = moment(startDay).add(d, 'd').format('YYYY-MM-DD')
          xAxis.push(day)
          data.push(dataMap[day] === undefined ? 0 : dataMap[day])
          if (endDay === day) {
            break
          }
          d += 1
        }
        ret.xAxis.data = xAxis
        ret.series = [{name: serieName, data: data, type: 'bar'}]
        return ret
      }
    },
    mounted() {
      const runner = async() => {
        try {
          this.spinShow = true
          await this.getAdgroupRptsDaily()
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