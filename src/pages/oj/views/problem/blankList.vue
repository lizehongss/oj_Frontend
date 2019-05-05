<template>
<Row type="flex" :gutter="18">
  <Col :span="24">
    <Panel shadow>
      <div class="view-blank">
           <Row>
        <Col :span="20">
         <span>选择题列表</span>
         <span> 注:##为留空位置</span>
        </Col>
        <Col :span="4">
         <Input
           v-model="blankkeyword"
           suffix='ios-search'
           placeholder="Keywords">
           </Input>
           </Col>
        </Row>
        <Table style="width: 100%; font-size: 16px;"
               no-data-text="暂无数据"
               :loading="loading"
               ref="table"
               :data="blankList"
               :columns="blankColumns"
               disabled-hover
        >
         <template slot-scope="{row}" slot="operation">
             <Button type="text" @click="seeDetail(row)">查看</Button>
         </template>
        </Table>
        <div class="panel-options">
         <Page
           :total="blankTotal"
           class="page"
           size='small'
           :page-size="blankPageSize"
           @on-change="blankCurrentChange">
         </Page>
         </div>
      </div>
    </Panel>
  </Col>
</Row>
</template>
<script>
import api from '../../api.js'
export default {
  name: 'blankList',
  data () {
    return {
      loading: false,
      blankList: [],
      blankColumns: [
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '问题',
          key: 'question'
        },
        {
          title: '操作',
          slot: 'operation'
        }
      ],
      blankTotal: 0,
      blankPageSize: 5,
      blankCurrentPage: 1,
      blankkeyword: ''
    }
  },
  mounted () {
    this.getblankList(this.blankCurrentPage)
  },
  methods: {
    getblankList (page = 1) {
      this.loading = true
      let params = {
        limit: this.blankPageSize,
        offset: (page - 1) * this.blankPageSize,
        keyword: this.blankkeyword,
        //
        contest_id: 1
      }
      api.getBlankList(params).then(res => {
        this.loading = false
        this.blankList = res.data.data.results
        this.blankTotal = res.data.data.total
      }, res => {
        this.loading = false
      })
    },
    blankCurrentChange (page) {
      this.blankCurrentPage = page
      this.getblankList(page)
    },
    seeDetail (row) {
      this.$router.push({name: 'blank-details', params: {id: row.id}})
    }
  },
  watch: {
    blankkeyword () {
      this.getblankList(1)
    }
  }
}
</script>
<style lang="less" scoped>
.view-blank{
  margin: 20px;
}
</style>


