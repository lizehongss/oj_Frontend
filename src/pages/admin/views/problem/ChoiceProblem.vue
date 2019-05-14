<template>
  <div class="problem">
    <Panel :title="title">
      <Form ref="form" :model="problem" :rules="rules" label-position="top" width="70">
        <Row :gutter="20">
            <Col :span="24">
            <FormItem prop="question" label="问题描述" required>
              <Editor v-model="problem.question" type="text"></Editor>
            </FormItem>
            </Col>
            <Col :span="24">
            <FormItem prop="item1" label="选项一" required>
              <Editor v-model="problem.item1" type="text"></Editor>
            </FormItem>
            </Col>
            <Col :span="24">
            <FormItem prop="item2" label="选项二" required>
              <Editor v-model="problem.item2" type="text"></Editor>
            </FormItem>
            </Col>
                        <Col :span="24">
            <FormItem prop="item3" label="选项三" required>
              <Editor v-model="problem.item3" type="text"></Editor>
            </FormItem>
            </Col>
                        <Col :span="24">
            <FormItem prop="item4" label="选项四" required>
              <Editor v-model="problem.item4" type="text"></Editor>
            </FormItem>
            </Col>
            <Col :span="24">
            <FormItem prop="answer" label="答案" required>
             <RadioGroup v-model="problem.answer" type="button">
              <Radio label="A"></Radio>
              <Radio label="B"></Radio>
              <Radio label="C"></Radio>
              <Radio label="D"></Radio>
            </RadioGroup>
            </FormItem>
            </Col>
        </Row>
        <Button @click.native="submit()" type="primary">Save</Button>
      </Form>
    </Panel>
  </div>
</template>
<script>
import Editor from '../../components/Editor'
import api from '../../api'

export default {
  name: 'choice',
  components: {
    Editor
  },
  data () {
    return {
      rules: {
        question: {required: true, message: '不能为空', trigger: 'blur'},
        answer: {required: true, message: '不能为空', trigger: 'blur'},
        item1: {required: true, message: '不能为空', trigger: 'blur'},
        item2: {required: true, message: '不能为空', trigger: 'blur'},
        item3: {required: true, message: '不能为空', trigger: 'blur'},
        item4: {required: true, message: '不能为空', trigger: 'blur'}
      },
      mode: '',
      contest: {},
      problem: {
        question: '',
        answer: '',
        contest_id: '',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        id: ''
      },
      title: ''
    }
  },
  mounted () {
    this.routeName = this.$route.name
    if (this.routeName === 'edit-choice' || this.routeName === 'edit-contest-choice') {
      this.mode = 'edit'
      console.log(this.$route.query.question)
      this.problem.question = this.$route.query.question
      this.problem.id = this.$route.query.id
      this.problem.item1 = this.$route.query.item1
      this.problem.item2 = this.$route.query.item2
      this.problem.item3 = this.$route.query.item3
      this.problem.item4 = this.$route.query.item4
      this.problem.answer = this.getAnswerShow(this.$route.query.answer)
      this.problem.contest_id = this.$route.query.contest_id || null
      console.log(this.problem.contest_id)
    } else {
      this.mode = 'add'
    }
    let contestID = this.$route.params.id
    if (contestID) {
      this.problem.contest_id = contestID
    }
    if (this.mode === 'edit') {
      this.title = '编辑问题'
    } else {
      this.title = '添加问题'
    }
  },
  methods: {
    getAnswerShow (ans) {
      let result = ''
      switch (ans) {
        case this.problem.item1:
          result = 'A'
          break
        case this.problem.item2:
          result = 'B'
          break
        case this.problem.item3:
          result = 'C'
          break
        case this.problem.item4:
          result = 'D'
          break
      }
      return result
    },
    getAnswer (answer) {
      let ans = ''
      switch (answer) {
        case 'A':
          ans = this.problem.item1
          break
        case 'B':
          ans = this.problem.item2
          break
        case 'C':
          ans = this.problem.item3
          break
        case 'D':
          ans = this.problem.item4
          break
      }
      return ans
    },
    submit () {
      this.problem.answer = this.getAnswer(this.problem.answer)
      console.log(this.routeName)
      if (this.routeName === 'create-contest-choice') {
        let list = []
        list.push([this.problem.question, this.problem.answer, this.problem.item1, this.problem.item2, this.problem.item3, this.problem.item4])
        console.log(list)
        api.createContestChoice(list, this.problem.contest_id).then(res => {
          if (this.routeName === 'create-contest-choice' || this.routeName === 'edit-contest-choice') {
            this.$router.push({name: 'contest-problem-choice', params: {contestId: this.$route.params.id}})
          } else {
            this.$router.push({name: 'choice-list'})
          }
        })
      }
      if (this.routeName === 'create-choice') {
        console.log(this.problem)
        let list = []
        list.push([this.problem.question, this.problem.answer, this.problem.item1, this.problem.item2, this.problem.item3, this.problem.item4])
        console.log(list)
        api.createContestChoice(list, null).then(res => {
          if (this.routeName === 'create-contest-choice' || this.routeName === 'edit-contest-choice') {
            this.$router.push({name: 'contest-problem-choice', params: {contestId: this.$route.params.id}})
          } else {
            this.$router.push({name: 'choice-list'})
          }
        })
      }
      if (this.routeName === 'edit-contest-choice') {
        console.log(this.problem)
        api.editChoice(this.problem).then(res => {
          if (this.routeName === 'create-contest-choice' || this.routeName === 'edit-contest-choice') {
            this.$router.push({name: 'contest-problem-choice', params: {contestId: this.$route.params.id}})
          } else {
            this.$router.push({name: 'choice-list'})
          }
        })
      }
      if (this.routeName === 'edit-choice') {
        api.editChoice(this.problem).then(res => {
          if (this.routeName === 'create-contest-choice' || this.routeName === 'edit-contest-choice') {
            this.$router.push({name: 'contest-list', params: {contestId: this.$route.params.id}})
          } else {
            this.$router.push({name: 'choice-list'})
          }
        })
      }
    }
  }
}
</script>

