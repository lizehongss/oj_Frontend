<template>
  <div class="view">
    <Panel :title="contestId ? '实验问题列表' : '问题列表'">
      <div slot="header">
        <Input
          v-model="keyword"
          suffix="ios-search"
          placeholder="Keywords">
        </Input>
      </div>
      <Table :loading="loading" ref="table" :data="problemList" @on-row-dblclick="handleDblclick" :columns="columns" style="width: 100%">
        <template slot-scope="{ row }" slot="display_id">
          <span v-show="!row.isEditing">{{row._id}}</span>
          <Input v-show="row.isEditing" v-model="row._id"
                 @on-keyup="handleInlineEdit(row)"></Input>
        </template>
        <template slot-scope="{ row }" slot="title">
          <span v-show="!row.isEditing">{{row.title}}</span>
          <Input v-show="row.isEditing" v-model="row.title"
                @on-keyup="handleInlineEdit(row)"></Input>
        </template>
        <template slot-scope="{ row }" slot="created_by">
          {{row.created_by.username}}
        </template>
        <template slot-scope="{ row }" slot="create_time">
          {{row.create_time | localtime}}
        </template>
        <template slot-scope="{ row }" slot="visible">
          <i-switch v-model="row.visible" @on-change="updateProblem(scope.row)"></i-switch>
        </template>
        <template slot-scope="{ row }" slot='operation'>
          <Button name="Edit" icon="ios-brush" @click.native="goEdit(row.id)"></Button>
          <Button v-if="contestId" name="Make Public" icon="md-git-compare"
                  @click.native="makeContestProblemPublic(row.id)"
          ></Button>
          <Button name="Download TestCase" icon="ios-cloud-download" @click.native="downloadTestCase(row.id)"></Button>
          <Button name="Delete Problem" icon="ios-trash" @click.native="deleteProblem(row.id)"></Button>
        </template>
      </Table>
      <!-- <el-table
        v-loading="loading"
        element-loading-text="loading"
        ref="table"
        :data="problemList"
        @row-dblclick="handleDblclick"
        style="width: 100%">
        <el-table-column
          width="100"
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          width="150"
          label="Display ID">
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{row._id}}</span>
            <el-input v-show="row.isEditing" v-model="row._id"
                      @keyup.enter.native="handleInlineEdit(row)">

            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="Title">
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{row.title}}</span>
            <el-input v-show="row.isEditing" v-model="row.title"
                      @keyup.enter.native="handleInlineEdit(row)">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_by.username"
          label="Author">
        </el-table-column>
        <el-table-column
          width="200"
          prop="create_time"
          label="Create Time">
          <template slot-scope="scope">
            {{scope.row.create_time | localtime }}
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="visible"
          label="Visible">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.visible"
                       active-text=""
                       inactive-text=""
                       @change="updateProblem(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Operation"
          width="250">
          <div slot-scope="scope">
            <icon-btn name="Edit" icon="edit" @click.native="goEdit(scope.row.id)"></icon-btn>
            <icon-btn v-if="contestId" name="Make Public" icon="clone"
                      @click.native="makeContestProblemPublic(scope.row.id)"></icon-btn>
            <icon-btn icon="download" name="Download TestCase"
                      @click.native="downloadTestCase(scope.row.id)"></icon-btn>
            <icon-btn icon="trash" name="Delete Problem"
                      @click.native="deleteProblem(scope.row.id)"></icon-btn>
          </div>
        </el-table-column>
      </el-table> -->
      <div class="panel-options">
        <Button type="primary" 
                   @click="goCreateProblem" icon="md-add">Create
        </Button>
        <Button v-if="contestId" type="primary"
                    icon="el-icon-plus"
                   @click="addProblemDialogVisible = true">Add From Public Problem
        </Button>
        <!-- <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-size="pageSize"
          :total="total">
        </el-pagination> -->
        <Page 
          :total="total"
          class="page"
          size="small"
          :page-size="pageSize"
          @on-change="currentChange"
        ></Page>
      </div>
    </Panel>
    <el-dialog title="Sure to update the problem? "
               width="20%"
               :visible.sync="InlineEditDialogVisible"
               @close-on-click-modal="false">
      <div>
        <p>DisplayID: {{currentRow._id}}</p>
        <p>Title: {{currentRow.title}}</p>
      </div>
      <span slot="footer">
        <cancel @click.native="InlineEditDialogVisible = false; getProblemList(currentPage)"></cancel>
        <save @click.native="updateProblem(currentRow)"></save>
      </span>
    </el-dialog>
    <el-dialog title="Add Contest Problem"
               v-if="contestId"
               width="80%"
               :visible.sync="addProblemDialogVisible"
               @close-on-click-modal="false">
      <add-problem-component :contestID="contestId" @on-change="getProblemList"></add-problem-component>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../api.js'
  import utils from '@/utils/utils'
  import AddProblemComponent from './AddPublicProblem.vue'

  export default {
    name: 'ProblemList',
    components: {
      AddProblemComponent
    },
    data () {
      return {
        pageSize: 10,
        total: 0,
        problemList: [],
        keyword: '',
        loading: false,
        currentPage: 1,
        routeName: '',
        contestId: '',
        // for make public use
        currentProblemID: '',
        currentRow: {},
        InlineEditDialogVisible: false,
        makePublicDialogVisible: false,
        addProblemDialogVisible: false,
        columns: [
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: 'Display ID',
            slot: 'display_id'
          },
          {
            title: 'Title',
            key: 'title',
            slot: 'title'
          },
          {
            title: 'Author',
            key: 'created_by',
            slot: 'created_by'
          },
          {
            title: 'Create Time',
            key: 'create_time',
            slot: 'create_time'
          },
          {
            title: 'Visible',
            key: 'visible',
            slot: 'visible'
          },
          {
            title: 'Operation',
            slot: 'operation',
            width: 250
          }
        ]
      }
    },
    mounted () {
      this.routeName = this.$route.name
      this.contestId = this.$route.params.contestId
      this.getProblemList(this.currentPage)
    },
    methods: {
      handleDblclick (row) {
        row.isEditing = true
      },
      goEdit (problemId) {
        if (this.routeName === 'problem-list') {
          this.$router.push({name: 'edit-problem', params: {problemId}})
        } else if (this.routeName === 'contest-problem-list') {
          this.$router.push({name: 'edit-contest-problem', params: {problemId: problemId, contestId: this.contestId}})
        }
      },
      goCreateProblem () {
        if (this.routeName === 'problem-list') {
          this.$router.push({name: 'create-problem'})
        } else if (this.routeName === 'contest-problem-list') {
          this.$router.push({name: 'create-contest-problem', params: {contestId: this.contestId}})
        }
      },
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getProblemList(page)
      },
      getProblemList (page = 1) {
        this.loading = true
        let funcName = this.routeName === 'problem-list' ? 'getProblemList' : 'getContestProblemList'
        let params = {
          limit: this.pageSize,
          offset: (page - 1) * this.pageSize,
          keyword: this.keyword,
          contest_id: this.contestId
        }
        api[funcName](params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          for (let problem of res.data.data.results) {
            problem.isEditing = false
          }
          this.problemList = res.data.data.results
        }, res => {
          this.loading = false
        })
      },
      deleteProblem (id) {
        this.$confirm('You can only delete the problem that doesn\'t have submissions, continue?', 'Delete Problem', {
          type: 'warning'
        }).then(() => {
          let funcName = this.routeName === 'problem-list' ? 'deleteProblem' : 'deleteContestProblem'
          api[funcName](id).then(() => [
            this.getProblemList(this.currentPage - 1)
          ]).catch(() => {
          })
        }, () => {
        })
      },
      makeContestProblemPublic (problemID) {
        this.$prompt('Please input display id for the public problem', 'confirm').then(({value}) => {
          api.makeContestProblemPublic({id: problemID, display_id: value}).catch()
        }, () => {
        })
      },
      updateProblem (row) {
        let data = Object.assign({}, row)
        let funcName = ''
        if (this.contestId) {
          data.contest_id = this.contestId
          funcName = 'editContestProblem'
        } else {
          funcName = 'editProblem'
        }
        api[funcName](data).then(res => {
          this.InlineEditDialogVisible = false
          this.getProblemList(this.currentPage)
        }).catch(() => {
          this.InlineEditDialogVisible = false
        })
      },
      handleInlineEdit (row) {
        this.currentRow = row
        this.InlineEditDialogVisible = true
      },
      downloadTestCase (problemID) {
        let url = '/admin/test_case?problem_id=' + problemID
        utils.downloadFile(url)
      },
      getPublicProblem () {
        api.getProblemList()
      }
    },
    watch: {
      '$route' (newVal, oldVal) {
        this.contestId = newVal.params.contestId
        this.routeName = newVal.name
        this.getProblemList(this.currentPage)
      },
      'keyword' () {
        this.currentChange()
      }
    }
  }
</script>

<style scoped lang="less">
</style>
