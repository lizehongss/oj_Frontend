<template>
  <div class="problem">

    <Panel :title="title">
      <Form ref="form" :model="problem" :rules="rules" label-position="top" width="70">
        <Row :gutter="20">
          <Col :span="6">
            <FormItem prop="_id" :label="$t('m.Display_ID')"
                          :required="this.routeName === 'create-contest-problem' || this.routeName === 'edit-contet-problem'">
              <Input :placeholder="$t('m.Display_ID')" v-model="problem._id"></Input>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem prop="title" :label="$t('m.Title')" required>
              <Input :placeholder="$t('m.Title')" v-model="problem.title"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col :span="24">
            <FormItem prop="description" :label="$t('m.Description')" required>
              <!-- <Simditor v-model="problem.description"></Simditor> -->
              <Editor v-model="problem.description"></Editor>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col :span="24">
            <FormItem prop="input_description" :label="$t('m.Input_Description')" required>
              <!-- <Simditor v-model="problem.input_description"></Simditor> -->
              <Editor v-model="problem.input_description"></Editor>
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem prop="output_description" :label="$t('m.Output_Description')" required>
              <!-- <Simditor v-model="problem.output_description"></Simditor> -->
              <Editor v-model="problem.output_description"></Editor>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col :span="8">
            <FormItem :label="$t('m.Time_Limit') + ' (ms)' " required>
              <InputNumber :placeholder="$t('m.Time_Limit')" v-model="problem.time_limit"></InputNumber>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem :label="$t('m.Memory_limit') + ' (MB)' " required>
              <InputNumber :placeholder="$t('m.Memory_limit')" v-model="problem.memory_limit"></InputNumber>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem :label="$t('m.Difficulty')">
              <Select class="difficulty-select" size="small" :placeholder="$t('m.Difficulty')" v-model="problem.difficulty">
                <Option label="Low" value="Low"></Option>
                <Option label="Mid" value="Mid"></Option>
                <Option label="High" value="High"></Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col :span="6">
            <FormItem :label="$t('m.Visible')">
              <i-switch
                v-model="problem.visible"
              >
              </i-switch>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="Tag" :error="error.tags" required>
              <span class="tags">
                <Tag
                  v-for="tag in problem.tags"
                  closable
                  :key="tag"
                  color ="success"
                  @on-close="closeTag(tag)"
                >{{tag}}</Tag>
              </span>
              <!-- <el-autocomplete
                v-if="inputVisible"
                size="mini"
                class="input-new-tag"
                v-model="tagInput"
                :trigger-on-focus="false"
                @keyup.enter.native="addTag"
                @blur="addTag"
                @select="addTag"
                :fetch-suggestions="querySearch">
              </el-autocomplete> -->
              <Input v-if="inputVisible" 
                     class="input-new-tag" 
                     v-model="tagInput" 
                     @on-enter='addTag'
                     @on-blur='addTag'
                     >
              </Input>
              <Button class="button-new-tag" v-else size="small" @click="inputVisible = true">+ New Tag</Button>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem :label="$t('m.Languages')" :error="error.languages" required>
              <CheckboxGroup v-model="problem.languages">
                <Tooltip class="spj-radio" v-for="lang in allLanguage.languages" :key="'spj'+lang.name" theme="light"
                            :content="lang.description" placement="top-start">
                  <Checkbox :label="lang.name"></Checkbox>
                </Tooltip>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <div>
          <FormItem v-for="(sample, index) in problem.samples" :key="'sample'+index">
            <Accordion :title="'Sample' + (index + 1)">
              <Button  type="warning"  icon="ios-trash" slot="header" @click="deleteSample(index)">
                Delete
              </Button>
              <Row :gutter="20">
                <Col :span="12">
                  <FormItem :label="$t('m.Input_Samples')" required>
                    <Input
                      :rows="5"
                      type="textarea"
                      :placeholder="$t('m.Input_Samples')"
                      v-model="sample.input">
                    </Input>
                  </FormItem>
                </Col>
                <Col :span="12">
                  <FormItem :label="$t('m.Output_Samples')" required>
                    <Input
                      :rows="5"
                      type="textarea"
                      :placeholder="$t('m.Output_Samples')"
                      v-model="sample.output">
                    </Input>
                  </FormItem>
                </Col>
              </Row>
            </Accordion>
          </FormItem>
        </div>
        <div class="add-sample-btn">
          <Button  class="add-samples" @click="addSample()" icon="md-add">{{$t('m.Add_Sample')}}
          </Button>
        </div>
        <FormItem style="margin-top: 20px" :label="$t('m.Hint')">
          <!-- <Simditor v-model="problem.hint" placeholder=""></Simditor> -->
          <Editor v-model="problem.hint"></Editor>
        </FormItem>
        <FormItem :label="$t('m.Code_Template')">
          <Row>
            <Col :span="24" v-for="(v, k) in template" :key="'template'+k">
              <FormItem>
                <Checkbox v-model="v.checked">{{ k }}</Checkbox>
                <div v-if="v.checked">
                  <code-mirror v-model="v.code" :mode="v.mode"></code-mirror>
                </div>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('m.Special_Judge')" :error="error.spj">
          <Col :span="24">
            <Checkbox v-model="problem.spj" @click.native.prevent="switchSpj()">{{$t('m.Use_Special_Judge')}}</Checkbox>
          </Col>
        </FormItem>
        <FormItem v-if="problem.spj">
          <Accordion :title="$t('m.Special_Judge_Code')">
            <template slot="header">
              <span>{{$t('m.SPJ_language')}}</span>
              <RadioGroup v-model="problem.spj_language">
                <Tooltip class="spj-radio" v-for="lang in allLanguage.spj_languages" :key="lang.name" theme="dark"
                            :content="lang.description" placement="top-start">
                  <Radio :label="lang.name">{{ lang.name }}</Radio>
                </Tooltip>
              </RadioGroup>
              <Button type="primary"  icon="md-shuffle" @click="compileSPJ"
                         :loading="loadingCompile">
                {{$t('m.Compile')}}
              </Button>
            </template>
            <code-mirror v-model="problem.spj_code" :mode="spjMode"></code-mirror>
          </Accordion>
        </FormItem>
        <Row :gutter="20">
          <Col :span="6">
            <FormItem :label="$t('m.Type')">
              <RadioGroup v-model="problem.rule_type" :disabled="disableRuleType">
                <Radio label="ACM">ACM</Radio>
                <Radio label="OI">OI</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem :label="$t('m.TestCase')" :error="error.testcase">
              <el-upload
                action="/api/admin/test_case"
                name="file"
                :data="{spj: problem.spj}"
                :show-file-list="true"
                :on-success="uploadSucceeded"
                :on-error="uploadFailed">
                <el-button size="small" type="primary" icon="el-icon-fa-upload">Choose File</el-button>
              </el-upload>
              <!-- <Upload
                type="drag"
                action="/api/admin/text_case"
                :data="{spj: problem.spj}"
                :show-upload-list="true"
                name="file"
                :on-success="uploadSucceeded"
                :on-error="uploadFailed">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                  <p>点击或拖动到这里上传</p>
              </Upload> -->
            </FormItem>
          </Col>

          <Col :span="24">
            <!-- <Table :data="problem.test_case_score"
                   style="width: 100%"
                   :columns="columns"
            >
            <template slot-scope="{ row }" slot="score">
              <Input size="small" 
                     :placeholder="$t('m.Score')"
                     v-model="row.score"
                     :disabled="problem.rule_type !=='OI'"></Input>
            </template>
            </Table> -->
            <el-table
              :data="problem.test_case_score"
              style="width: 100%">
              <el-table-column
                prop="input_name"
                :label="$t('m.Input')">
              </el-table-column>
              <el-table-column
                prop="output_name"
                :label="$t('m.Output')">
              </el-table-column>
              <el-table-column
                prop="score"
                :label="$t('m.Score')">
                <template slot-scope="scope">
                  <Input
                    size="small"
                    :placeholder="$t('m.Score')"
                    v-model="scope.row.score"
                    :disabled="problem.rule_type !== 'OI'">
                  </Input>
                </template>
              </el-table-column>
            </el-table>
          </Col>
        </Row>
        <FormItem :label="$t('m.Source')" :style="{marginTop: 20 + 'px'}">
          <Input :placeholder="$t('m.Source')" v-model="problem.source"></Input>
        </FormItem>
        <!-- <save @click.native="submit()">Save</save> -->
        <Button @click.native="submit()" type="primary">Save</Button>
      </Form>
    </Panel>
  </div>
</template>

<script>
  import Simditor from '../../components/Simditor'
  import Editor from '../../components/Editor'
  import Accordion from '../../components/Accordion'
  import CodeMirror from '../../components/CodeMirror'
  import api from '../../api'

  export default {
    name: 'Problem',
    components: {
      Simditor,
      Accordion,
      CodeMirror,
      Editor
    },
    data () {
      return {
        rules: {
          _id: {required: true, message: 'Display ID is required', trigger: 'blur'},
          title: {required: true, message: 'Title is required', trigger: 'blur'},
          input_description: {required: true, message: 'Input Description is required', trigger: 'blur'},
          output_description: {required: true, message: 'Output Description is required', trigger: 'blur'}
        },
        loadingCompile: false,
        mode: '',
        contest: {},
        problem: {
          languages: []
        },
        reProblem: {
          languages: []
        },
        testCaseUploaded: false,
        allLanguage: {},
        inputVisible: false,
        tagInput: '',
        template: {},
        title: '',
        spjMode: '',
        disableRuleType: false,
        routeName: '',
        error: {
          tags: '',
          spj: '',
          languages: '',
          testCase: ''
        },
        columns: [
          {
            title: this.$t('m.Input'),
            key: 'input_name'
          },
          {
            title: this.$t('m.Output'),
            key: 'output_name'
          },
          {
            title: this.$t('m.Score'),
            key: 'score',
            slot: 'score'
          }
        ]
      }
    },
    mounted () {
      this.routeName = this.$route.name
      if (this.routeName === 'edit-problem' || this.routeName === 'edit-contest-problem') {
        this.mode = 'edit'
      } else {
        this.mode = 'add'
      }
      api.getLanguages().then(res => {
        this.problem = this.reProblem = {
          _id: '',
          title: '',
          description: '',
          input_description: '',
          output_description: '',
          time_limit: 1000,
          memory_limit: 256,
          difficulty: 'Low',
          visible: true,
          tags: [],
          languages: [],
          template: {},
          samples: [{input: '', output: ''}],
          spj: false,
          spj_language: '',
          spj_code: '',
          spj_compile_ok: false,
          test_case_id: '',
          test_case_score: [],
          rule_type: 'ACM',
          hint: '',
          source: ''
        }
        let contestID = this.$route.params.contestId
        if (contestID) {
          this.problem.contest_id = this.reProblem.contest_id = contestID
          this.disableRuleType = true
          api.getContest(contestID).then(res => {
            this.problem.rule_type = this.reProblem.rule_type = res.data.data.rule_type
            this.contest = res.data.data
          })
        }

        this.problem.spj_language = 'C'

        let allLanguage = res.data.data
        this.allLanguage = allLanguage

        // get problem after getting languages list to avoid find undefined value in `watch problem.languages`
        if (this.mode === 'edit') {
          this.title = '编辑问题'
          let funcName = {'edit-problem': 'getProblem', 'edit-contest-problem': 'getContestProblem'}[this.routeName]
          api[funcName](this.$route.params.problemId).then(problemRes => {
            let data = problemRes.data.data
            if (!data.spj_code) {
              data.spj_code = ''
            }
            data.spj_language = data.spj_language || 'C'
            this.problem = data
            this.testCaseUploaded = true
          })
        } else {
          this.title = '添加问题'
          for (let item of allLanguage.languages) {
            this.problem.languages.push(item.name)
          }
        }
      })
    },
    watch: {
      '$route' () {
        this.$refs.form.resetFields()
        this.problem = this.reProblem
      },
      'problem.languages' (newVal) {
        let data = {}
        // use deep copy to avoid infinite loop
        let languages = JSON.parse(JSON.stringify(newVal)).sort()
        for (let item of languages) {
          if (this.template[item] === undefined) {
            let langConfig = this.allLanguage.languages.find(lang => {
              return lang.name === item
            })
            if (this.problem.template[item] === undefined) {
              data[item] = {checked: false, code: langConfig.config.template, mode: langConfig.content_type}
            } else {
              data[item] = {checked: true, code: this.problem.template[item], mode: langConfig.content_type}
            }
          } else {
            data[item] = this.template[item]
          }
        }
        this.template = data
      },
      'problem.spj_language' (newVal) {
        this.spjMode = this.allLanguage.spj_languages.find(item => {
          return item.name === this.problem.spj_language
        }).content_type
      }
    },
    methods: {
      switchSpj () {
        if (this.testCaseUploaded) {
          this.$confirm('If you change problem judge method, you need to re-upload test cases', 'Warning', {
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.problem.spj = !this.problem.spj
            this.resetTestCase()
          }).catch(() => {
          })
        } else {
          this.problem.spj = !this.problem.spj
        }
      },
      querySearch (queryString, cb) {
        api.getProblemTagList().then(res => {
          let tagList = []
          for (let tag of res.data.data) {
            tagList.push({value: tag.name})
          }
          cb(tagList)
        }).catch(() => {
        })
      },
      resetTestCase () {
        this.testCaseUploaded = false
        this.problem.test_case_score = []
        this.problem.test_case_id = ''
      },
      addTag () {
        let inputValue = this.tagInput
        if (inputValue) {
          this.problem.tags.push(inputValue)
        }
        this.inputVisible = false
        this.tagInput = ''
      },
      closeTag (tag) {
        this.problem.tags.splice(this.problem.tags.indexOf(tag), 1)
      },
      addSample () {
        this.problem.samples.push({input: '', output: ''})
      },
      deleteSample (index) {
        this.problem.samples.splice(index, 1)
      },
      uploadSucceeded (response) {
        if (response.error) {
          this.$error(response.data)
          return
        }
        let fileList = response.data.info
        for (let file of fileList) {
          file.score = (100 / fileList.length).toFixed(0)
          if (this.problem.spj) {
            file.output_name = '-'
          }
        }
        this.problem.test_case_score = fileList
        this.testCaseUploaded = true
        this.problem.test_case_id = response.data.id
      },
      uploadFailed () {
        this.$error('Upload failed')
      },
      compileSPJ () {
        let data = {
          id: this.problem.id,
          spj_code: this.problem.spj_code,
          spj_language: this.problem.spj_language
        }
        this.loadingCompile = true
        api.compileSPJ(data).then(res => {
          this.loadingCompile = false
          this.problem.spj_compile_ok = true
          this.error.spj = ''
        }, err => {
          this.loadingCompile = false
          this.problem.spj_compile_ok = false
          const h = this.$createElement
          this.$msgbox({
            title: 'Compile Error',
            type: 'error',
            message: h('pre', err.data.data),
            showCancelButton: false,
            closeOnClickModal: false,
            customClass: 'dialog-compile-error'
          })
        })
      },
      submit () {
        if (!this.problem.samples.length) {
          this.$error('Sample is required')
          return
        }
        for (let sample of this.problem.samples) {
          if (!sample.input || !sample.output) {
            this.$error('Sample input and output is required')
            return
          }
        }
        if (!this.problem.tags.length) {
          this.error.tags = 'Please add at least one tag'
          this.$error(this.error.tags)
          return
        }
        if (this.problem.spj) {
          if (!this.problem.spj_code) {
            this.error.spj = 'Spj code is required'
            this.$error(this.error.spj)
          } else if (!this.problem.spj_compile_ok) {
            this.error.spj = 'SPJ code has not been successfully compiled'
          }
          if (this.error.spj) {
            this.$error(this.error.spj)
            return
          }
        }
        if (!this.problem.languages.length) {
          this.error.languages = 'Please choose at least one language for problem'
          this.$error(this.error.languages)
          return
        }
        if (!this.testCaseUploaded) {
          this.error.testCase = 'Test case is not uploaded yet'
          this.$error(this.error.testCase)
          return
        }
        if (this.problem.rule_type === 'OI') {
          for (let item of this.problem.test_case_score) {
            try {
              if (parseInt(item.score) <= 0) {
                this.$error('Invalid test case score')
                return
              }
            } catch (e) {
              this.$error('Test case score must be an integer')
              return
            }
          }
        }
        this.problem.languages = this.problem.languages.sort()
        this.problem.template = {}
        for (let k in this.template) {
          if (this.template[k].checked) {
            this.problem.template[k] = this.template[k].code
          }
        }
        let funcName = {
          'create-problem': 'createProblem',
          'edit-problem': 'editProblem',
          'create-contest-problem': 'createContestProblem',
          'edit-contest-problem': 'editContestProblem'
        }[this.routeName]
        // edit contest problem 时, contest_id会被后来的请求覆盖掉
        if (funcName === 'editContestProblem') {
          this.problem.contest_id = this.contest.id
        }
        api[funcName](this.problem).then(res => {
          if (this.routeName === 'create-contest-problem' || this.routeName === 'edit-contest-problem') {
            this.$router.push({name: 'contest-problem-list', params: {contestId: this.$route.params.contestId}})
          } else {
            this.$router.push({name: 'problem-list'})
          }
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .problem {
    .difficulty-select {
      width: 120px;
    }
    .spj-radio {
      margin-left: 10px;
      &:last-child {
        margin-right: 20px;
      }
    }
    .input-new-tag {
      width: 78px;
    }
    .button-new-tag {
      height: 24px;
      line-height: 22px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .tags {
      .el-tag {
        margin-right: 10px;
      }
    }
    .accordion {
      margin-bottom: 10px;
    }
    .add-samples {
      width: 100%;
      background-color: #fff;
      border: 1px dashed #aaa;
      outline: none;
      cursor: pointer;
      color: #666;
      height: 35px;
      font-size: 14px;
      &:hover {
        background-color: #f9fafc;
      }
      i {
        margin-right: 10px;
      }
    }
    .add-sample-btn {
      margin-bottom: 10px;
    }

  }
</style>

<style>
  .dialog-compile-error {
    width: auto;
    max-width: 80%;
    overflow-x: scroll;
  }
  
</style>

