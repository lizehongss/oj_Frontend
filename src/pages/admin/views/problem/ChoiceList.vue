<template>
  <div class="view">
     <Panel title="选择题列表">
       <div slot="header">
       </div>
       <div class="view-choice">
         <Row>
        <Col :span="20">
        </Col>
        <Col :span="4">
         <Input
           v-model="choicekeyword"
           suffix='ios-search'
           placeholder="Keywords">
           </Input>
           </Col>
        </Row>
        <br>
         <Table :loading="loadingChoiceTable" @on-selection-change="handleSelectionChoiceChange" ref="choiceTable" :data="choiceList" :columns="choiceColumns">
           <template slot-scope="{ row }" slot="operation">
             <Button type="text" @click="deletechoice(row.id)" name="delete">删除</Button>
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
        <Button type="primary" @click.native="goCreateChoice">创建选择题</Button>
     </Panel>
  </div>
</template>

<script>
//   import papa from 'papaparse'
  import api from '../../api.js'
  import TableChoice from '../../components/TableChoice.vue'
//   import utils from '@/utils/utils'
  export default {
    name: 'choiceandblankList',
    compontents: {
      TableChoice
    },
    data () {
      return {
        loadingChoiceTable: false,
        loadingblankTable: false,
        choiceList: [],
        blankList: [],
        choiceColumns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(TableChoice, {
                props: {
                  row: params.row
                }
              })
            }
          },
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: '问题',
            key: 'question'
          },
          {
            title: '答案',
            key: 'answer'
          },
          {
            title: '操作',
            slot: 'operation'
          }
        ],
        chooiceAnalay: [],
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
        this.loadingChoiceTable = true
        let params = {
          limit: this.choicePageSize,
          offset: (page - 1) * this.choicePageSize,
          keyword: this.choicekeyword,
          contest_id: null
        }
        api.getContestChoice(params).then(res => {
          this.loadingChoiceTable = false
          this.choiceTotal = res.data.data.total
          this.choiceList = res.data.data.results
        }, res => {
          this.loadingChoiceTable = false
        })
      },
      handleSelectionChoiceChange () {
      },
      handleSelectionBlankChange () {
      },
      choiceCurrentChange (page) {
        this.choiceCurrentPage = page
        this.getChoiceList(page)
      },
      blankCurrentChange (page) {
        this.blankCurrentPage = page
        this.getblankList(page)
      },
      deletechoice (id) {
        this.$confirm('是否确定删除', {
          type: 'warning'
        }).then(() => {
          api.deleteContestChoice(id).then(() => {
            this.getChoiceList(this.choiceCurrentPage - 1)
          }).catch(() => {
          })
        }, () => {
        })
      },
      deleteblank (id) {
        this.$confirm('是否确定删除', {
          type: 'warning'
        }).then(() => {
          api.deleteContestBlank(id).then(() => {
            this.getblankList(this.blankCurrentPage - 1)
          }).catch(() => {
          })
        }, () => {
        })
      },
      goCreateChoice () {
        this.$router.push({name: 'create-choice'})
      }
    },
    watch: {
      choicekeyword () {
        this.getChoiceList(1)
      },
      blankkeyword () {
        this.getblankList(1)
      }
    }
  }
</script>
<style lang="less" scoped>
.view-choice{
  margin-bottom: 20px;
}
</style>
