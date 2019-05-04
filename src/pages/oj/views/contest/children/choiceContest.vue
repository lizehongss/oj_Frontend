<template>
    <Panel>
      <div slot="title">选择题列表 <span style="fontSize: 15px">共{{total}}题， 1题4分</span></div>
      <div class="noData" v-if="hasanswer">已作题</div>
      <div v-if="!showChoiceList &&!hasanswer" class="noData">该实验无选择题</div>
      <div v-if="showChoiceList && !hasanswer">
      <div  class="choice" v-for="(item, index) in choiceList" :key ="item.id" v-show="index === choiceindex">
          <div class="choice-question">{{index + 1 + '.'+item.question}}</div>
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
          <!-- <span class="choice-choose-click" @click="handleClick(index)" v-for="(item, index) in choiceList" :key="item.id">
            {{index + 1}}
          </span> -->
          <Button type="primary" :disabled="nextDisabled" v-show="!showSubmit" @click="handleNext">下一题</Button>
          <Button type="primary" v-show="showSubmit" @click="handleSubmite">提交</Button>
      </div>
</div>
    </Panel>
</template>
<script>
import api from '@oj/api'
export default {
  name: 'choiceList',
  data () {
    return {
      choiceList: [],
      contestId: '',
      choiceindex: 0,
      choiceitem: [],
      activeA: false,
      activeB: false,
      activeC: false,
      activeD: false,
      prevDisabled: true,
      nextDisabled: false,
      showSubmit: false,
      total: 0,
      showChoiceList: false,
      userId: null,
      dataScore: [],
      hasanswer: false
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
    this.getChoiceList(1)
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
        if (userscore[0].choice_score !== 0) {
          this.hasanswer = true
        }
      })
    },
    getChoiceList (page = 1) {
      let params = {
        limit: 1000,
        offset: (page - 1) * 1000,
        contest_id: this.contestId
      }
      api.getContestChoice(params).then(res => {
        this.choiceList = res.data.data.results
        this.total = res.data.data.total
        if (this.choiceList.length === 0) {
          this.showChoiceList = false
        } else {
          this.showChoiceList = true
        }
        console.log(this.choiceList)
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
      console.log(this.choiceitem)
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
      this.showSubmit = false
      this.nextDisabled = false
      this.choiceindex = this.choiceindex - 1
      console.log(this.choiceitem[this.choiceindex], 'choseitem')
      this.resetActive(this.choiceitem[this.choiceindex].cho)
      if (this.choiceindex > 0) {
        this.prevDisabled = false
      } else {
        this.prevDisabled = true
      }
    },
    handleNext () {
      if (!(this.choiceitem[this.choiceindex] && this.choiceitem[this.choiceindex].id)) {
        this.$Notice.warning({
          desc: '请选择答案'
        })
        return
      }
      this.prevDisabled = false
      this.choiceindex = this.choiceindex + 1
      console.log(this.choiceitem[this.choiceindex])
      if (this.choiceitem[this.choiceindex] && this.choiceitem[this.choiceindex].cho) {
        this.resetActive(this.choiceitem[this.choiceindex].cho)
      } else {
        this.resetActive()
      }
      if (this.choiceindex < this.choiceList.length - 1) {
        this.nextDisabled = false
      } else {
        this.nextDisabled = true
        this.showSubmit = true
      }
    },
    handleClick (index) {
      this.choiceindex = index
    },
    handleSubmite () {
      let socre = 0
      for (let i = 0; i < this.choiceitem.length - 1; i++) {
        console.log(this.choiceitem[i].item, 'item')
        console.log(this.choiceList[i].answer, 'answer')
        if (this.choiceitem[i].item === this.choiceList[i].answer) {
          socre = socre + 4
        }
      }
      console.log(socre)
      api.postChoiceScore({
        choice_score: 4,
        contest_id: this.contestId
      }).then((res) => {
        this.$Message.success('提交成功')
        this.hasanswer = true
      })
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

