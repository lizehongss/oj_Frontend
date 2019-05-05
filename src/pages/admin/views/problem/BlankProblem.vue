<template>
  <div class="problem">
    <Panel :title="title">
      <Form ref="form" :model="problem" :rules="rules" label-position="top" width="70">
        <Row :gutter="20">
            <Col :span="24">
            <FormItem prop="question" label="问题描述(需要留空的请用'##')" required>
              <Editor v-model="problem.question"></Editor>
            </FormItem>
            </Col>
            <Col :span="24">
            <FormItem prop="answer" label="答案" required>
              <Editor v-model="problem.answer"></Editor>
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
        answer: {required: true, message: '不能为空', trigger: 'blur'}
      },
      mode: '',
      contest: {},
      problem: {
        question: '',
        answer: '',
        contest_id: ''
      },
      title: ''
    }
  },
  mounted () {
    this.routeName = this.$router.name
    if (this.routeName === 'edit-choice' || this.routeName === 'edit-contest-problem') {
      this.mode = 'edit'
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
    submit () {
      let funcName = {
        'create-blank': 'createBlank',
        'edit-blank': 'editBlank',
        'create-contest-blank': 'createContestBlank',
        'edit-contest-blank': 'editContestBlank'
      }[this.routeName]
      api[funcName](this.problem).then(res => {
        if (this.routeName === 'create-contest-blank' || this.routeName === 'edit-contest-blank') {
          this.$router.push({name: 'contest-problem-choice', params: {contestId: this.$route.params.id}})
        } else {
          this.$route.push({name: 'choice-list'})
        }
      })
    }
  }
}
</script>

