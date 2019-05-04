<template>
  <Panel>
      <div slot="title">填空题列表 <span style="fontSize: 15px">共{{total}}题， 1题4分</span></div>
      <div class="noData" v-if="hasanswer">已作题</div>
      <div v-if="!showBlankList &&!hasanswer" class="noData">该实验无选择题</div>
      <div v-if="showBlankList && !hasanswer">
      <div class="blank" v-for="(item, index) in blankList" :key="item.id" v-show="index === blankindex">
          <div class="choice-question">{{index+1 + '.' +item.question}}</div>
          <div class="blankwrite">
              <span>请填空##所代表的内容</span>
              <Input class="blankwrite_input" v-model="inputValue" @on-blur="handleblank(item.id)"></Input>
          </div>
      </div>
      <div class="blank-choose">
          <Button type="primary" :disabled="prevDisabled" @click="handlePrev">上一题</Button>
          <Button type="primary" :disabled="nextDisabled" v-show="!showSubmit" @click="handleNext">下一题</Button>
          <Button type="primary" v-show="showSubmit" @click="handleSubmite">提交</Button>
      </div>
      </div>
  </Panel>
</template>
<script>
import api from '@oj/api'
export default {
  name: 'blankContest',
  data () {
    return {
      blankList: [],
      contestId: '',
      blankindex: 0,
      blankitem: [],
      total: 0,
      prevDisabled: true,
      nextDisabled: false,
      showSubmit: false,
      inputValue: '',
      userId: null,
      dataScore: [],
      hasanswer: false,
      showBlankList: false
    }
  },
  created () {
    this.contestId = this.$route.params.contestID
    api.getUserInfo().then(res => {
      console.log(res.data.data.user.id)
      this.userId = res.data.data.user.id
    })
    this.getscore()
  },
  mounted () {
    this.getBlank()
  },
  methods: {
    getscore (page = 1) {
      api.getscore(0, 1000, '', this.contestId).then(res => {
        this.dataScore = res.data.data.results
        console.log(this.dataScore, '1')
        let userscore = this.dataScore.filter(item => {
          return item.user.id === this.userId
        })
        console.log(userscore, 'score')
        if (userscore[0].blank_score !== 0) {
          this.hasanswer = true
        }
      })
    },
    getBlank (page = 1) {
      let params = {
        limit: 1000,
        offset: (page - 1) * 1000,
        contest_id: this.contestId
      }
      api.getContestBlank(params).then(res => {
        this.blankList = res.data.data.results
        this.total = res.data.data.total
        if (this.blankList.length === 0) {
          this.showBlankList = false
        } else {
          this.showBlankList = true
        }
      })
    },
    handlePrev () {
      this.showSubmit = false
      this.nextDisabled = false
      this.blankindex = this.blankindex - 1
      console.log(this.blankindex)
      console.log(this.blankitem[this.blankindex])
      this.inputValue = this.blankitem[this.blankindex].answer
      if (this.blankindex > 0) {
        this.prevDisabled = false
      } else {
        this.prevDisabled = true
      }
    },
    handleNext () {
      if (!(this.blankitem[this.blankindex] && this.blankitem[this.blankindex].id)) {
        this.$Notice.warning({
          desc: '请填空'
        })
        return
      }
      this.prevDisabled = false
      this.blankindex = this.blankindex + 1
      this.inputValue = ''
      if (this.blankindex < this.blankList.length - 1) {
        this.nextDisabled = false
      } else {
        this.nextDisabled = true
        this.showSubmit = true
      }
    },
    handleSubmite () {
      let score = 0
      for (let i = 0; i < this.blankitem.length - 1; i++) {
        if (this.blankitem[i].answer === this.blankList[i].answer) {
          score = score + 2
        }
      }
      api.postBlankScore({
        blank_score: 5,
        contest_id: this.contestId
      }).then((res) => {
        this.$Message.success('提交成功')
        this.hasanswer = true
      })
    },
    handleblank (id) {
      this.blankitem[this.blankindex] = {
        id: id,
        answer: this.inputValue
      }
      console.log(this.blankitem)
    }
  }
}
</script>
<style lang="less" scoped>
.blank{
  margin-left: 20px;
  .choice-question {
    margin: 20px;
  }
  .blankwrite {
    margin: 20px;
    display: flex;
    .blankwrite_input{
      width: 50%;
      margin-left: 20px;
    }
  }
}
.blank-choose{
  display: flex;
  padding: 20px;
  width: 100%;
  justify-content: space-between;
}
.noData {
  margin-left: 20px;
  width: 100%;
  padding:  40px;
  height: 200px;
  font-size: 15px;
}
</style>
