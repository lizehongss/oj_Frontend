<template>
<Row type="flex" :gutter="18">
    <Col :span="24">
    <Panel shadow>
        <div class="view-choice">
        <Row>
        <Col :span="20">
         <span>选择题列表</span>
        </Col>
        <Col :span="4">
         <Input
           v-model="choicekeyword"
           suffix='ios-search'
           placeholder="Keywords">
           </Input>
           </Col>
        </Row>
        <Table style="width: 100%; font-size: 16px;"
               no-data-text="暂无数据"
               :loading="loading"
               ref="table"
               :data= "choiceList"
               :columns="choiceColumns"
               disabled-hover
        >
         <template slot-scope="{row}" slot="operation">
             <Button type="text" @click="seeDetail(row)">查看</Button>
         </template>
        </Table>
        <div class="panel-options">
         <Page
           :total="choiceTotal"
           class="page"
           size='small'
           :page-size="choicePageSize"
           @on-change="choiceCurrentChange">
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
  name: 'chocieList',
  data () {
    return {
      loading: false,
      choiceList: [],
      choiceColumns: [
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '问题描述',
          key: 'question'
        },
        {
          title: '操作',
          slot: 'operation'
        }
      ],
      choiceTotal: 0,
      choicePageSize: 5,
      choicekeyword: '',
      choiceCurrentPage: 1
    }
  },
  mounted () {
    this.getChoiceList(this.choiceCurrentPage)
  },
  methods: {
    getChoiceList (page = 1) {
      this.loading = true
      let params = {
        limit: this.choicePageSize,
        offset: (page - 1) * this.choicePageSize,
        Keyword: this.choicekeyword,
        //
        contest_id: 1
      }
      api.getChoiceList(params).then(res => {
        this.loading = false
        this.choiceTotal = res.data.data.total
        this.choiceList = res.data.data.results
      }, res => {
        this.laoding = false
      })
    },
    choiceCurrentChange (page) {
      this.choiceCurrentPage = page
      this.getChoiceList(page)
    },
    seeDetail (row) {
      this.$router.push({name: 'choice-details', params: {id: row.id}})
    }
  },
  watch: {
    choicekeyword () {
      this.getChoiceList(1)
    }
  }
}
</script>
<style lang="less" scoped>
.view-choice{
    margin: 20px;
}
</style>

