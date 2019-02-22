<template>
  <div class="view">
    <Panel :title="title">
      <Form label-position="top">
        <Row :gutter="20">
          <Col :span="24">
            <FormItem :label="$t('m.ContestTitle')" required>
              <Input v-model="contest.title" :placeholder="$t('m.ContestTitle')"></Input>
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem :label="$t('m.ContestDescription')" required>
              <Simditor v-model="contest.description"></Simditor>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem :label="$t('m.Contest_Start_Time')" required>
              <DatePicker
                v-model="contest.start_time"
                type="datetime"
                :placeholder="$t('m.Contest_Start_Time')">
              </DatePicker>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem :label="$t('m.Contest_End_Time')" required>
              <DatePicker
                v-model="contest.end_time"
                type="datetime"
                :placeholder="$t('m.Contest_End_Time')">
              </DatePicker>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem :label="$t('m.Contest_Password')">
              <Input v-model="contest.password" :placeholder="$t('m.Contest_Password')"></Input>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem :label="$t('m.Contest_Rule_Type')">
              <RadioGroup v-model="contest.rule_type">
                <Radio label="ACM" :disabled="disableRuleType">ACM</Radio>
                <Radio label="OI" :disabled="disableRuleType">OI</Radio>
              </RadioGroup>
              <!-- <el-radio class="radio" v-model="contest.rule_type" label="ACM" :disabled="disableRuleType">ACM</el-radio>
              <el-radio class="radio" v-model="contest.rule_type" label="OI" :disabled="disableRuleType">OI</el-radio> -->
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem :label="$t('m.Real_Time_Rank')">
              <i-switch>
                v-model="contest.real_time_rank"
              </i-switch>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem :label="$t('m.Contest_Status')">
              <i-switch
                v-model="contest.visible">
              </i-switch>
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem :label="$t('m.Allowed_IP_Ranges')">
              <div v-for="(range, index) in contest.allowed_ip_ranges" :key="index">
                <Row :gutter="20" style="margin-bottom: 15px">
                  <Col :span="8">
                    <Input v-model="range.value" :placeholder="$t('m.CIDR_Network')"></Input>
                  </Col>
                  <Col :span="10">
                    <Button plain icon="md-add" @click="addIPRange"></Button>
                    <Button plain icon="ios-trash" @click="removeIPRange(range)"></Button>
                  </Col>
                </Row>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <!-- <save @click.native="saveContest"></save> -->
      <Button @click.native="saveContest" type="primary">保存</Button>
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'
  import Simditor from '../../components/Simditor.vue'

  export default {
    name: 'CreateContest',
    components: {
      Simditor
    },
    data () {
      return {
        title: '创建实验',
        disableRuleType: false,
        contest: {
          title: '',
          description: '',
          start_time: '',
          end_time: '',
          rule_type: 'ACM',
          password: '',
          real_time_rank: true,
          visible: true,
          allowed_ip_ranges: [{
            value: ''
          }]
        }
      }
    },
    methods: {
      saveContest () {
        let funcName = this.$route.name === 'edit-contest' ? 'editContest' : 'createContest'
        let data = Object.assign({}, this.contest)
        let ranges = []
        for (let v of data.allowed_ip_ranges) {
          if (v.value !== '') {
            ranges.push(v.value)
          }
        }
        data.allowed_ip_ranges = ranges
        api[funcName](data).then(res => {
          this.$router.push({name: 'contest-list', query: {refresh: 'true'}})
        }).catch(() => {
        })
      },
      addIPRange () {
        this.contest.allowed_ip_ranges.push({value: ''})
      },
      removeIPRange (range) {
        let index = this.contest.allowed_ip_ranges.indexOf(range)
        if (index !== -1) {
          this.contest.allowed_ip_ranges.splice(index, 1)
        }
      }
    },
    mounted () {
      if (this.$route.name === 'edit-contest') {
        this.title = '编辑实验'
        this.disableRuleType = true
        api.getContest(this.$route.params.contestId).then(res => {
          let data = res.data.data
          let ranges = []
          for (let v of data.allowed_ip_ranges) {
            ranges.push({value: v})
          }
          if (ranges.length === 0) {
            ranges.push({value: ''})
          }
          data.allowed_ip_ranges = ranges
          this.contest = data
        }).catch(() => {
        })
      }
    }
  }
</script>
