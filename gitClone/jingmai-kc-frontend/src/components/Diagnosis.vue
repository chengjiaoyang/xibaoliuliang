<template>
  <div>
    <div class="box-card">
      <Tabs value="diagnosis">
        <TabPane label="账户诊断" name="diagnosis">
          <div v-if="diagnosis.start">
            <Row type="flex" justify="center" style="text-align:center">
              <Col span="24">
                <i-circle
                  :size="250"
                  :trail-width="4"
                  :stroke-width="5"
                  :percent="diagnosis.percent"
                  stroke-linecap="square"
                  stroke-color="#43a3fb">
                  <div class="diagnosis-circle">
                      <h1>{{ diagnosis.percent }}%</h1>
                      <p>{{ diagnosis.message }}</p>
                      <div>
                        <Button type="warning" size="small" @click="cancelDiagnosis">取消</Button>
                      </div>
                  </div>
                </i-circle>
              </Col>
            </Row>
            <Collapse>
              <Panel v-for="item in diagnosis.result" name="item.name" :key="item.key">
                {{ item.name }}
                <p slot="content">
                  <ul v-if="item.list">
                    <li v-for="i in item.list" :key="i.k">{{ i.c }}</li>
                  </ul>
                  <Table v-if="item.keywords" border :columns="badKeywordsTableColumns" :data="item.keywords" size="small"></Table>
                </p>
              </Panel>
            </Collapse>
          </div>
          <Row v-else type="flex" justify="center" align="middle" gutter="24" style="min-height:400px">
            <Col span="8" style="text-align:right">
              <Icon type="speedometer" size="72" color="#2d8cf0"></Icon>
            </Col>
            <Col span="16" style="line-height: 2.5em">
              <h1>用最低的成本，换取最高的成交回报率；让您的快车飞起来</h1>
              <p class="help">检测并提供性价比最高的【关键词】、回报率最高的【出价】</p>
              <Button type="primary" size="large" @click="runDiagnosis">全面检测</Button>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="优化记录" name="oplogs">
          <Row type="flex" justify="center" align="middle" style="min-height:400px">
            <Col span="24" style="text-align:right">
              <Alert type="warning">暂时还没有优化记录</Alert>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import * as types from '../store/mutation-types'
  import keywordAPI from '../api/keyword'
  import moment from 'moment'

  export default {
    data() {
      return {
        diagnosis: {
          start: false,
          percent: 0,
          message: '',
          result: []
        },
        badKeywordsTableColumns: [{
          title: '关键词名称',
          key: 'keyword',
          sortble: true,
          width: 180
        }, {
          title: '推广单元',
          key: 'adgroup_name',
          sortble: true,
          width: 180
        }, {
          title: '原因',
          key: 'message',
          width: 180
        }, {
          title: '建议',
          key: 'suggest',
          width: 180
        }]
      }
    },
    methods: {
      runDiagnosis() {
        this.diagnosis.start = true
        this.diagnosis.message = '检测开始'
        this.diagnosis.percent = 0
        this.diagnosis.result = []
        let diagnosisTotalTasks = 10
        let diagnosisDoneTasks = 0
        const runner = async() => {
          let diagnosisData = []
          try {
            this.diagnosis.messages = '获取计划'
            if (this.campaigns.length === 0) {
              await this.getCampaigns()
            }
            diagnosisDoneTasks += 1
            diagnosisTotalTasks += this.campaigns.length
            diagnosisData = JSON.parse(JSON.stringify(this.campaigns))
            for (const campaign of diagnosisData) {
              if (campaign.status !== 2) {
                continue
              }
              this.diagnosis.message = '获取推广单元'
              if (this.adgroupsInStore(campaign.id).length === 0) {
                await this.getAdgroups(campaign.id)
              }
              const adgroups = this.adgroupsInStore(campaign.id)
              campaign.adgroups = JSON.parse(JSON.stringify(adgroups))
              diagnosisTotalTasks += adgroups.length
              diagnosisDoneTasks += 1
              this.diagnosis.percent = Math.ceil(diagnosisDoneTasks / diagnosisTotalTasks * 100)
              const dateRange = [moment().add(-8, 'd').format('YYYY-MM-DD'), moment().add(-1, 'd').format('YYYY-MM-DD')]
              for (const ad of campaign.adgroups) {
                if (ad.status !== 2) {
                  continue
                }
                this.diagnosis.message = '获取推广单元关键词'
                ad.keywords = await this.getKeywordsRpts({campaignId: campaign.id, adgroupId: ad.id, dateRange: dateRange})
                diagnosisDoneTasks += 1
                this.diagnosis.percent = Math.ceil(diagnosisDoneTasks / diagnosisTotalTasks * 100)
              }
            }
          } catch (err) { console.log(err) }
          this.diagnosisResult(diagnosisData)
          this.diagnosis.percent = 100
          this.diagnosis.message = '检测结束'
        }
        runner()
      },
      cancelDiagnosis() {
        this.diagnosis.start = false
      },
      diagnosisResult(diagnosisData) {
        let result = []
        let stoppedCampaigns = 0
        let noBudgetCampaigns = 0
        for (const campaign of diagnosisData) {
          if (campaign.status === 1) {
            stoppedCampaigns += 1
          } else if (campaign.status === 3) {
            noBudgetCampaigns += 1
          }
        }
        const li = []
        if (stoppedCampaigns > 0 || noBudgetCampaigns > 0) {
          if (stoppedCampaigns > 0) {
            li.push({c: stoppedCampaigns + '个计划暂停中', k: 'summary-stopped-campaigns'})
          }
          if (noBudgetCampaigns > 0) {
            li.push({c: noBudgetCampaigns + '个计划预算不足', k: 'summary-nobudget-campaigns'})
          }
          result.push({key: 'summary', name: '账户概况', list: li})
        }
        for (const campaign of diagnosisData) {
          let stoppedAdgroups = 0
          let noBudgetAdgroups = 0
          let noEnoughKeywords = 0
          const badKeywords = []
          if (!campaign.adgroups) {
            continue
          }
          for (const ad of campaign.adgroups) {
            if (ad.status === 1) {
              stoppedAdgroups += 1
            } else if (ad.status === 3) {
              noBudgetAdgroups += 1
            }
            if (!ad.keywords || ad.keywords.length < 50) {
              noEnoughKeywords += 1
            }
            if (!ad.keywords) {
              continue
            }
            for (const kw of ad.keywords) {
              if (!kw.impressions) {
                badKeywords.push({id: kw.keyword_id, adgroup_id: ad.id, campaign_id: campaign.id, keyword: kw.keyword, adgroup_name: ad.name, message: '7天无展现', suggest: '删除'})
              } else if (!kw.clicks) {
                badKeywords.push({id: kw.keyword_id, adgroup_id: ad.id, campaign_id: campaign.id, keyword: kw.keyword, adgroup_name: ad.name, message: '7天无点击', suggest: '提价'})
              } else if (kw.cost && (!kw.total_order_roi || kw.total_order_roi < 1)) {
                badKeywords.push({id: kw.keyword_id, adgroup_id: ad.id, campaign_id: campaign.id, keyword: kw.keyword, adgroup_name: ad.name, message: '7天ROI<1', suggest: '降价'})
              }
            }
          }
          const li = []
          if (stoppedAdgroups > 0 || noBudgetAdgroups > 0 || noEnoughKeywords > 0) {
            if (stoppedAdgroups > 0) {
              li.push({c: stoppedAdgroups + '个单元暂停中', k: 'c-stopped-adgroups'})
            }
            if (noBudgetAdgroups > 0) {
              li.push({c: noBudgetAdgroups + '个单元预算不足', k: 'c-nobudget-adgroups'})
            }
            if (noEnoughKeywords > 0) {
              li.push({c: noEnoughKeywords + '个单元关键词数量不足50个, 建议增加关键词', k: 'c-noenough-keywords'})
            }
            result.push({key: 'campaign' + campaign.id, name: campaign.name, list: li, keywords: badKeywords})
          } else if (badKeywords.length > 0) {
            result.push({key: 'campaign' + campaign.id, name: campaign.name, list: [], keywords: badKeywords})
          }
        }
        this.diagnosis.result = result
        return result
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
      getAdgroups(campaignId) {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(types.GET_ADGROUPS_REQUEST, campaignId).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      getCampaignsRpts() {
        return new Promise((resolve, reject) => {
          let options = JSON.parse(JSON.stringify(this.searchCampaignForm))
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
      getKeywordsRpts(options) {
        return new Promise((resolve, reject) => {
          keywordAPI.rpt_get((response) => {
            if (response.code) {
              const msg = response.message ? {
                code: response.code,
                msg: response.message
              } : response
              reject(msg)
              return
            }
            resolve(response)
          }, options)
        })
      },
      adgroupsInStore(campaignId) {
        return this.$store.getters.getAdgroupsByCampaignId(campaignId)
      },
      keywordsInStore(adgroupId) {
        return this.$store.getters.getKeywordRptByAdgroupId(adgroupId)
      }
    },
    computed: {
      campaigns() {
        return this.$store.getters['campaigns']
      }
    }
  }
</script>