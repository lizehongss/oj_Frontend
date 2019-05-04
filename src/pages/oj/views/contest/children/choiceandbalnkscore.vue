<template>
 <Panel>
    <div slot="title">
      <Row>
        <Col :span="16"><span>选择和填空分数</span></Col>
        <Col :span="8">
         <Input suffx="ios-search" placeholder="keywords" v-model = "keyword"></Input>
        </Col>
      </Row>
      </div>
    <Table :loading="loadingTable" ref="table" :data="scoreList" :columns="columns">
      <template slot-scope="{ row }" slot="name">
        {{row.user.username}}
      </template>
      <template slot-scope="{ row }" slot="major">
        {{row.user.user_student_major}}
      </template>
      <template slot-scope="{ row }" slot="grade">
        {{row.user.user_student_grade}}
      </template>
      <template slot-scope="{ row }" slot="number">
        {{row.user.user_student_number}}
      </template>
    </Table>
          <div class="panel-options">
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
    
 </Panel>
</template>
<script>
import api from '@oj/api'
export default {
  data () {
    return {
      contestId: '',
      total: 0,
      pageSize: 10,
      currentPage: 0,
      keyword: '',
      scoreList: [],
      loadingTable: false,
      columns: [
        {
          title: '姓名',
          slot: 'name'
        },
        {
          title: '班级',
          slot: 'major'
        },
        {
          title: '年级',
          slot: 'grade'
        },
        {
          title: '学号',
          slot: 'number'
        },
        {
          title: '选择题分数',
          key: 'choice_score'
        },
        {
          title: '填空题分数',
          key: 'blank_score'
        }
      ]
    }
  },
  mounted () {
    this.contestId = this.$route.params.contestID
    this.getscore(1)
  },
  methods: {
    getscore (page) {
      this.loadingTable = true
      api.getscore((page - 1) * this.pageSize, this.pageSize, this.keyword, this.contestId).then(res => {
        this.loadingTable = false
        this.total = res.data.data.total
        this.scoreList = res.data.data.results
      }, res => {
        this.loadingTable = false
      })
    },
    currentChange (page) {
      this.currentPage = page
      this.getscore(page)
    }
  },
  watch: {
    'keyword' () {
      this.getscore(1)
    }
  }
}
</script>
<style lang="less" scoped>
  .panel-options {
    background-color: transparent;
    position: relative;
    height: 50px;
    button {
      margin-top: 18px;
      margin-right: 10px;
    }
    > .page {
      position: absolute;
      right:20px;
      top: 20px;
    }
  }
</style>

