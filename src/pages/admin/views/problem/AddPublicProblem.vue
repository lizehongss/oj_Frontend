<template>
  <div>
    <Input
      v-model="keyword"
      placeholder="Keywords"
      suffix="ios-search">
    </Input>
    <Table :style="{marginTop: 20 + 'px'}" :loading="loading" :data="problems" :columns="columns">
      <template slot-scope="{ row }" slot="option">
        <Button icon="md-add" name="添加问题" @click.native="handleAddProblem(row.id)"></Button>
      </template>
    </Table>
    <!-- <el-table :data="problems" v-loading="loading">
      <el-table-column
        label="ID"
        width="100"
        prop="id">
      </el-table-column>
      <el-table-column
        label="DisplayID"
        width="200"
        prop="_id">
      </el-table-column>
      <el-table-column
        label="Title"
        prop="title">
      </el-table-column>
      <el-table-column
        label="option"
        align="center"
        width="100"
        fixed="right">
        <template slot-scope="{row}">
          <icon-btn icon="plus" name="Add the problem"
                    @click.native="handleAddProblem(row.id)"></icon-btn>
        </template>
      </el-table-column>
    </el-table> -->

    <!-- <el-pagination
      class="page"
      layout="prev, pager, next"
      @current-change="getPublicProblem"
      :page-size="limit"
      :total="total">
    </el-pagination> -->
    <Page
      :total="total"
      class="page"
      :page-size="limit"
      @on-change="getPublicProblem">
    </Page>
  </div>
</template>
<script>
  import api from '@admin/api'

  export default {
    name: 'add-problem-from-public',
    props: ['contestID'],
    data () {
      return {
        page: 1,
        limit: 10,
        total: 0,
        loading: false,
        problems: [],
        contest: {},
        keyword: '',
        columns: [
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: 'DisplayID',
            key: '_id'
          },
          {
            title: 'Title',
            key: 'title'
          },
          {
            title: 'option',
            slot: 'option',
            width: 100
          }
        ]
      }
    },
    mounted () {
      api.getContest(this.contestID).then(res => {
        this.contest = res.data.data
        this.getPublicProblem()
      }).catch(() => {
      })
    },
    methods: {
      getPublicProblem (page) {
        this.loading = true
        let params = {
          keyword: this.keyword,
          offset: (page - 1) * this.limit,
          limit: this.limit,
          rule_type: this.contest.rule_type
        }
        api.getProblemList(params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.problems = res.data.data.results
        }).catch(() => {
        })
      },
      handleAddProblem (problemID) {
        this.$prompt('Please input display id for the contest problem', 'confirm').then(({value}) => {
          let data = {
            problem_id: problemID,
            contest_id: this.contestID,
            display_id: value
          }
          api.addProblemFromPublic(data).then(() => {
            this.$emit('on-change')
          }, () => {
          })
        }, () => {
        })
      }
    },
    watch: {
      'keyword' () {
        this.getPublicProblem(this.page)
      }
    }
  }
</script>
<style scoped>
  .page {
    margin-top: 20px;
    text-align: right
  }

</style>
