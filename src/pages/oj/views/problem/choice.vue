<template>
    <Panel>
      <div slot="title">选择题列表</div>
            <div  class="choice" v-for="(item, index) in choiceList" :key ="item.id" v-show="index === choiceindex">
          <div class="choice-question">{{item.question}}</div>
          <div class="choice-item"> 
          <Button :class="{'active': activeA}" @click.stop="handleChoose('A',item.id,item.item1)" shape="circle" size="small">A</Button>
          <p>{{item.item1}}</p>
          </div>
          <div class="choice-item"> 
          <Button :class="{'active': activeB}" @click.stop="handleChoose('B',item.id,item.item2)" shape="circle" size="small">B</Button>
          <p>{{item.item2}}</p>
          </div>
          <div class="choice-item"> 
          <Button :class="{'active': activeC}" @click.stop="handleChoose('C',item.id,item.item3)" shape="circle" size="small">C</Button>
          <p>{{item.item3}}</p>
          </div>
          <div class="choice-item"> 
          <Button :class="{'active': activeD}" @click.stop="handleChoose('D',item.id,item.item4)" shape="circle" size="small">D</Button>
          <p>{{item.item4}}</p>
          </div>
      </div>
      <div class="choice-choose">
          <Button type="primary" :disabled="prevDisabled" @click="handlePrev">上一题</Button>
          <Button type="primary" :disabled="nextDisabled"  @click="handleNext">下一题</Button>
          <Button type="primary" v-show="showSubmit" @click="handleSubmite">检验答案</Button>
          <Button type="primary" v-if="!showanswer" @click="handleSeeAnswer">查看答案</Button>
          <Button v-else>答案为:　{{answer}}</Button>
      </div>
    </Panel>
</template>
<script>
import api from '@oj/api'
export default {
  name: 'choiceDetail',
  data () {
    return {
      choiceList: [],
      choiceitem: [],
      choiceid: '',
      choiceindex: 0,
      activeA: false,
      activeB: false,
      activeC: false,
      activeD: false,
      prevDisabled: false,
      nextDisabled: false,
      showSubmit: true,
      userId: null,
      showanswer: false,
      answer: null
    }
  },
  created () {
    this.choiceid = this.$route.params.id
    this.getChoiceList(1)
  },
  mounted () {
  },
  methods: {
    getChoiceList (page = 1) {
      let params = {
        limit: 1000,
        offset: (page - 1) * 1000,
        contest_id: 1
      }
      api.getContestChoice(params).then(res => {
        this.choiceList = res.data.data.results
        let text = this.choiceList.filter(item => { return item.id === this.choiceid })
        this.choiceindex = this.choiceList.indexOf(text[0])
      })
    },
    handleChoose (cho, id, item) {
      this.resetActive(cho)
      let choseObj = {
        cho: cho,
        id: id,
        item: item
      }
      this.choiceitem[this.choiceindex] = choseObj
    },
    resetActive (cho) {
      this.activeA = false
      this.activeB = false
      this.activeC = false
      this.activeD = false
      switch (cho) {
        case 'A':
          this.activeA = true
          break
        case 'B':
          this.activeB = true
          break
        case 'C':
          this.activeC = true
          break
        case 'D':
          this.activeD = true
          break
      }
    },
    handlePrev () {
      this.showanswer = false
      this.choiceindex = this.choiceindex - 1
      if (this.choiceitem[this.choiceindex] && this.choiceitem[this.choiceindex].cho) {
        this.resetActive(this.choiceitem[this.choiceindex].cho)
      } else {
        this.resetActive()
      }
      if (this.choiceindex > 0) {
        this.prevDisabled = false
      } else {
        this.prevDisabled = true
      }
    },
    handleNext () {
      this.showanswer = false
      this.choiceindex = this.choiceindex + 1
      if (this.choiceitem[this.choiceindex] && this.choiceitem[this.choiceindex].cho) {
        this.resetActive(this.choiceitem[this.choiceindex].cho)
      } else {
        this.resetActive()
      }
      if (this.choiceindex < this.choiceList.length - 1) {
        this.nextDisabled = false
      } else {
        this.nextDisabled = true
      }
    },
    handleSubmite () {
      if (this.choiceitem[this.choiceindex]) {
        if (this.choiceitem[this.choiceindex].item === this.choiceList[this.choiceindex].answer) {
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
    handleSeeAnswer () {
      let answeritem
      if (this.choiceitem[this.choiceindex]) {
        answeritem = this.choiceList.filter(item => { return item.id === this.choiceitem[this.choiceindex].id })
      } else {
        this.$Notice.warning({
          desc: '请选择答案'
        })
        return
      }
      answeritem = answeritem[0]
      switch (answeritem.answer) {
        case answeritem.item1:
          this.answer = 'A'
          break
        case answeritem.item2:
          this.answer = 'B'
          break
        case answeritem.item3:
          this.answer = 'C'
          break
        case answeritem.item4:
          this.answer = 'D'
          break
      }
      this.showanswer = true
    }
  }
}
</script>
<style lang="less" scoped>
.active {
    background-color: #2d8cf0;
    color: #fff;
}
.choice{
 margin-left:  20px;
  .choice-question{
    margin-bottom: 20px;
  }
  .choice-item{
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    p{
     margin-left: 20px;
    }
  }
}
.choice-choose {
  display: flex;
  padding: 20px;
  width: 100%;
  button {
      margin: 20px;
  }
//   justify-content: space-between;
}
</style>
