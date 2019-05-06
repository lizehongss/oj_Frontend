<template>
  <Panel>
      <div slot="title">填空题列表</div>
      <div class="blank" v-for="(item, index) in blankList" :key="item.id" v-show="index === blankindex">
          <div class="choice-question">{{item.question}}</div>
          <div class="blankwrite">
              <span>请填空##所代表的内容</span>
              <Input class="blankwrite_input" v-model="inputValue" @on-blur="handleblank(item.id)"></Input>
          </div>
      </div>
      <div class="blank-choose">
          <Button type="primary" :disabled="prevDisabled" @click="handlePrev">上一题</Button>
          <Button type="primary" :disabled="nextDisabled"  @click="handleNext">下一题</Button>
          <Button type="primary" @click="handleSubmite">检验答案</Button>
          <Button type="primary" v-if="!showanswer" @click="handleSeeAnswer">查看答案</Button>
          <Button type="primary" v-else>答案是: {{answer}}</Button>
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
      blankId: '',
      blankindex: 0,
      blankitem: [],
      total: 0,
      prevDisabled: true,
      nextDisabled: false,
      inputValue: '',
      userId: null,
      showanswer: false,
      answer: ''
    }
  },
  created () {
    this.blankId = this.$route.params.id
    this.getBlank(1)
  },
  mounted () {
  },
  methods: {
    getBlank (page = 1) {
      let params = {
        limit: 1000,
        offset: (page - 1) * 1000,
        //
        contest_id: null
      }
      api.getContestBlank(params).then(res => {
        this.blankList = res.data.data.results
        let text = this.blankList.filter(item => { return item.id === this.blankId })
        this.blankindex = this.blankList.indexOf(text[0])
      })
    },
    handlePrev () {
      this.showanswer = false
      this.blankindex = this.blankindex - 1
      if (this.blankitem[this.blankindex] && this.blankitem[this.blankindex].answer) {
        this.inputValue = this.blankitem[this.blankindex].answer
      } else {
        this.inputValue = ''
      }
      if (this.blankindex > 0) {
        this.prevDisabled = false
      } else {
        this.prevDisabled = true
      }
    },
    handleNext () {
    //   if (!(this.blankitem[this.blankindex] && this.blankitem[this.blankindex].id)) {
    //   }
      this.showanswer = false
      this.prevDisabled = false
      this.blankindex = this.blankindex + 1
      this.inputValue = ''
      if (this.blankindex < this.blankList.length - 1) {
        this.nextDisabled = false
      } else {
        this.nextDisabled = true
      }
    },
    handleSubmite () {
      if (this.blankitem[this.blankindex]) {
        if (this.blankitem[this.blankindex].answer === this.blankList[this.blankindex].answer) {
          this.$Notice.success({
            desc: '回答正确'
          })
        } else {
          this.$Notice.error({
            desc: '回答错误'
          })
        }
      } else {
        this.$Notice.warning({
          desc: '请选择答案'
        })
      }
    },
    handleblank (id) {
      console.log('user')
      this.blankitem[this.blankindex] = {
        id: id,
        answer: this.inputValue
      }
    },
    handleSeeAnswer () {
      let answeritem
      if (this.blankitem[this.blankindex]) {
        answeritem = this.blankList.filter(item => { return item.id === this.blankitem[this.blankindex].id })
      } else {
        this.$Notice.warning({
          desc: '请选择答案'
        })
        return
      }
      answeritem = answeritem[0]
      this.answer = answeritem.answer
      this.showanswer = true
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
//   justify-content: space-between;
  button{
    margin: 20px;
  }
}
.noData {
  margin-left: 20px;
  width: 100%;
  padding:  40px;
  height: 200px;
  font-size: 15px;
}
</style>
