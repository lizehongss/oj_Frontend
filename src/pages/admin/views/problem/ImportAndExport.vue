<template>
  <div>
    <div style="padding-bottom: 10px;">
    </div>
    <panel title="导出问题(beta)">
      <div slot="header">
        <Input
          suffix="ios-search"
          v-model="keyword"
          placeholder="Keywords">
        </Input>
      </div>
      <Table :data="problems"
             :loading="loadingProblems" @on-selection-change="handleSelectionChange" ref="table" :columns="columns">
      <template slot-scope="{ row }" slot="author">
        {{row.created_by.username}}
      </template>
      <template slot-scope="{ row }" slot="create_time">
        {{row.create_time | localtime}}
      </template>
      </Table>
      <!-- <el-table :data="problems"
                v-loading="loadingProblems" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="60">
        </el-table-column>
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
          prop="created_by.username"
          label="Author">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="Create Time">
          <template slot-scope="scope">
            {{scope.row.create_time | localtime }}
          </template>
        </el-table-column>
      </el-table> -->

      <div class="panel-options">
        <Button type="primary" v-show="selected_problems.length"
                   @click="exportProblems" icon="md-arrow-down">Export
        </Button>
        <!-- <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="getProblems"
          :page-size="limit"
          :total="total">
        </el-pagination> -->
        <Page
          :total="total"
          class="page"
          size="small"
          :page-size="limit"
          @on-change="getProblems"
        ></Page>
      </div>
    </panel>
    <!-- <panel title="Import QDUOJ Problems (beta)">
      <el-upload
        ref="QDU"
        action="/api/admin/import_problem"
        name="file"
        :file-list="fileList1"
        :show-file-list="true"
        :with-credentials="true"
        :limit="3"
        :on-change="onFile1Change"
        :auto-upload="false"
        :on-success="uploadSucceeded"
        :on-error="uploadFailed">
        <Button size="small"  type="primary" icon="ios-cloud-upload-outline" slot="trigger">Choose File</Button>
        <Button  size="small" style="margin-left: 10px;"  type="success" @click="submitUpload('QDU')">Upload</Button>
      </el-upload>
      <Upload 
        ref="QDU"
        action="/api/admin/import_problem"
        name="file"
        :default-file-list="fileList1"
        :show-upload-list="true"
        :width-credentials="true"
        :max-size="1024"
        
      >
      </Upload> 
    </panel> -->

    <panel title="导入问题(beta)">
      <el-upload
        ref="FPS"
        action="/api/admin/import_fps"
        name="file"
        :file-list="fileList2"
        :show-file-list="true"
        :with-credentials="true"
        :limit="3"
        :on-change="onFile2Change"
        :auto-upload="false"
        :on-success="uploadSucceeded"
        :on-error="uploadFailed">
        <Button size="small" type="primary" icon="ios-cloud-upload-outline" slot="trigger">选择文件</Button>
        <Button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('FPS')">上传</Button>
      </el-upload>
    </panel>
  </div>
</template>
<script>
  import api from '@admin/api'
  import utils from '@/utils/utils'

  export default {
    name: 'import_and_export',
    data () {
      return {
        fileList1: [],
        fileList2: [],
        page: 1,
        limit: 10,
        total: 0,
        loadingProblems: false,
        loadingImporting: false,
        keyword: '',
        problems: [],
        selected_problems: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: 'DisplayID',
            key: '_id',
            width: 200
          },
          {
            title: 'Title',
            key: 'title'
          },
          {
            title: 'Author',
            key: 'created_by',
            slot: 'author'
          },
          {
            title: 'Create Time',
            key: 'create_time',
            slot: 'create_time'
          }
        ]
      }
    },
    mounted () {
      this.getProblems()
    },
    methods: {
      handleSelectionChange (val) {
        this.selected_problems = val
      },
      getProblems (page = 1) {
        let params = {
          keyword: this.keyword,
          offset: (page - 1) * this.limit,
          limit: this.limit
        }
        this.loadingProblems = true
        api.getProblemList(params).then(res => {
          this.problems = res.data.data.results
          this.total = res.data.data.total
          this.loadingProblems = false
        })
      },
      exportProblems () {
        let params = []
        for (let p of this.selected_problems) {
          params.push('problem_id=' + p.id)
        }
        let url = '/admin/export_problem?' + params.join('&')
        utils.downloadFile(url)
      },
      submitUpload (ref) {
        this.$refs[ref].submit()
      },
      onFile1Change (file, fileList) {
        this.fileList1 = fileList.slice(-1)
      },
      onFile2Change (file, fileList) {
        this.fileList2 = fileList.slice(-1)
      },
      uploadSucceeded (response) {
        if (response.error) {
          this.$error(response.data)
        } else {
          this.$success('Successfully imported ' + response.data.import_count + ' problems')
          this.getProblems()
        }
      },
      uploadFailed () {
        this.$error('Upload failed')
      }
    },
    watch: {
      'keyword' () {
        this.getProblems()
      }
    }
  }
</script>

<style scoped lang="less">

</style>
