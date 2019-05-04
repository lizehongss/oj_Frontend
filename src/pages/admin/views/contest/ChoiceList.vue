<template>
  <div class="view">
     <Panel title="选择填空列表">
       <div slot="header">
       </div>
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
       <div class="view-blank">
          <Row>
        <Col :span="20">
         <span>填空题列表</span>
         <span>  注:##为留空位置</span>
        </Col>
        <Col :span="4">
         <Input
           v-model="blankkeyword"
           suffix='ios-search'
           placeholder="Keywords">
           </Input>
           </Col>
        </Row>
        <br>
         <Table :loading="loadingblankTable" @on-selection-change="handleSelectionBlankChange" ref="blankTable" :data="blankList" :columns="blankColumns">
           <template slot-scope="{row}" slot="operation">
             <Button type="text" @click="deleteblank(row.id)">删除</Button>
           </template>
         </Table>
       </div>
       <div class="panel-options">
         <Page
         :total="blankTotal"
         class="page"
         size="small"
         :page-size="blankPageSize"
         @on-change="blankCurrentChange">

         </Page>
       </div>
       <el-upload 
          action=""
          :show-file-list="false"
          accept=".csv"
          :before-upload="handleUploadCsv">
        <el-button size="small" icon="el-icon-fa-upload" type="primary">上传选择题和填空</el-button>
        </el-upload>
     </Panel>
  </div>
</template>

<script>
  import papa from 'papaparse'
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
            title: '答案',
            key: 'answer'
          },
          {
            title: '操作',
            slot: 'operation'
          }
        ],
        chooiceAnalay: [],
        blankAnalay: [],
        choiceTotal: 0,
        choicePageSize: 5,
        choicekeyword: '',
        contestId: '',
        choiceCurrentPage: 1,
        blankTotal: 0,
        blankPageSize: 5,
        blankCurrentPage: 1,
        blankkeyword: ''
      }
    },
    mounted () {
      this.contestId = this.$route.params.contestId
      this.getChoiceList(this.choiceCurrentPage)
      this.getblankList(this.blankCurrentPage)
    },
    methods: {
      getChoiceList (page = 1) {
        this.loadingChoiceTable = true
        let params = {
          limit: this.choicePageSize,
          offset: (page - 1) * this.choicePageSize,
          keyword: this.choicekeyword,
          contest_id: this.contestId
        }
        api.getContestChoice(params).then(res => {
          this.loadingChoiceTable = false
          this.choiceTotal = res.data.data.total
          this.choiceList = res.data.data.results
        }, res => {
          this.loadingChoiceTable = false
        })
      },
      getblankList (page = 1) {
        this.loadingblankTable = true
        let params = {
          limit: this.blankPageSize,
          offset: (page - 1) * this.blankPageSize,
          keyword: this.blankkeyword,
          contest_id: this.contestId
        }
        api.getContestBlank(params).then(res => {
          this.loadingblankTable = false
          this.blankList = res.data.data.results
          this.blankTotal = res.data.data.total
        }, res => {
          this.loadingblankTable = false
        })
      },
      handleSelectionChoiceChange () {
      },
      handleSelectionBlankChange () {
      },
      handleUploadCsv (file) {
        papa.parse(file, {
          complete: (results) => {
            for (let item of results.data) {
              if (item[0].indexOf('##') === -1) {
                console.log(item)
                this.chooiceAnalay.push([item[0], item[1], item[2], item[3], item[4], item[5]])
              } else {
                this.blankAnalay.push([item[0], item[1]])
              }
            }
            api.createContestChoice(this.chooiceAnalay, this.$route.params.contestId)
            api.createContestBlank(this.blankAnalay, this.$route.params.contestId)
          }
        })
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
