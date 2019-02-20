<template>
<!-- 学号没完成 -->
  <div class="view">
    <Panel :title="$t('m.User_User') ">
      <div slot="header">
        <Row :gutter="20">
          <Col :span="8">
            <Button v-show="selectedUsers.length"
                       type="warning" icon="el-icon-fa-trash"
                       @click="deleteUsers(selectedUserIDs)">Delete
            </Button>
          </Col>
          <Col :span="selectedUsers.length ? 16: 24">
            <Input suffix="ios-search" placeholder="keywords" v-model="keyword" />
          </Col>
        </Row>
      </div>
      <!-- <el-table
        v-loading="loadingTable"
        element-loading-text="loading"
        @selection-change="handleSelectionChange"
        ref="table"
        :data="userList"
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="id" label="ID"></el-table-column>

        <el-table-column prop="username" label="Username"></el-table-column>

        <el-table-column prop="create_time" label="Create Time">
          <template slot-scope="scope">
            {{scope.row.create_time | localtime }}
          </template>
        </el-table-column>

        <el-table-column prop="last_login" label="Last Login">
          <template slot-scope="scope">
            {{scope.row.last_login | localtime }}
          </template>
        </el-table-column>

        <el-table-column prop="real_name" label="Real Name"></el-table-column>

        <el-table-column prop="email" label="Email"></el-table-column>

        <el-table-column prop="admin_type" label="User Type">
          <template slot-scope="scope">
            {{ scope.row.admin_type }}
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="Option" width="200">
          <template slot-scope="{row}">
            <icon-btn name="Edit" icon="edit" @click.native="openUserDialog(row.id)"></icon-btn>
            <icon-btn name="Delete" icon="trash" @click.native="deleteUsers([row.id])"></icon-btn>
          </template>
        </el-table-column>
      </el-table> -->
      <Table :loading="loadingTable" @on-selection-change="handleSelectionChange" ref="table" :data="userList" :columns="columns">
        <template slot-scope="{ row }" slot="creatTime">
           {{row.create_time | localtime}}
        </template>
        <template slot-scope="{ row }" slot="lastLogin">
            {{row.last_login | localtime}}
        </template>
        <template slot-scope="{ row }" slot="userType">
          {{row.admin_type}}
        </template>
        <template slot-scope="{ row }" slot="option">
          <Button icon="ios-brush" @click.native="openUserDialog(row.id)"></Button>
          <Button icon="ios-trash" @click.native="deleteUsers([row.id])"></Button>
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

    <Panel>
      <span slot="title">{{$t('m.Import_User')}}
        <!-- <el-popover placement="right" trigger="hover">
          <p>Only support csv file without headers, check the <a
            href="http://docs.onlinejudge.me/#/onlinejudge/guide/import_users">link</a> for details</p>
          <i slot="reference" class="el-icon-fa-question-circle import-user-icon"></i>
        </el-popover> -->
        <Poptip trigger="hover" title="" content="仅支持CSV格式">
          <Icon type="ios-help-circle-outline"></Icon>
        </Poptip>
      </span>
      <!-- <el-upload v-if="!uploadUsers.length"
                 action=""
                 :show-file-list="false"
                 accept=".csv"
                 :before-upload="handleUsersCSV">
        <el-button size="small" icon="el-icon-fa-upload" type="primary">Choose File</el-button>
      </el-upload> -->
      <Upload 
        v-if="!uploadUsers.length"
        type="drag"
        action=""
        accept=".csv"
        :before-upload="handleUsersCSV"
        :show-upload-list="false"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="50" style="color: #3399ff"></Icon>
            <p>点击或拖动到这里上传</p>
          </div>
        </Upload>
      <template v-else>
        <!-- <Table :data="uploadUsersPage" :colums="Usercolumns">
        </Table> -->
        <el-table :data="uploadUsersPage">
          <el-table-column label="Username">
            <template slot-scope="{row}">
              {{row[0]}}
            </template>
          </el-table-column>
          <el-table-column label="Password">
            <template slot-scope="{row}">
              {{row[1]}}
            </template>
          </el-table-column>
          <el-table-column label="Email">
            <template slot-scope="{row}">
              {{row[2]}}
            </template>
          </el-table-column>
        </el-table>
        <div class="panel-options">
          <!-- <el-button type="primary" size="small"
                     icon="el-icon-fa-upload"
                     @click="handleUsersUpload">Import All
          </el-button>
          <el-button type="warning" size="small"
                     icon="el-icon-fa-undo"
                     @click="handleResetData">Reset Data
          </el-button> -->
          <!-- <el-pagination
            class="page"
            layout="prev, pager, next"
            :page-size="uploadUsersPageSize"
            :current-page.sync="uploadUsersCurrentPage"
            :total="uploadUsers.length">
          </el-pagination> -->
          <Button type="primary" size="small" @click="handleUsersUpload">Import All</Button>
          <Button type="primary" size="small" @click="handleResetData">Rest Data</Button>
          <Page
            :total='uploadUsers.length'
            class="page"
            :page-size="uploadUsersPageSize"
            @on-change="uploadUsersCurrentPage"
            >
          </Page>
        </div>
      </template>
    </Panel>

    <Panel :title="$t('m.Generate_User')">
      <Form :model="formGenerateUser" ref="formGenerateUser">
        <Row type="flex" justify="space-between">
          <Col :span="4">
            <FormItem label="Prefix" prop="prefix">
              <Input v-model="formGenerateUser.prefix" placeholder="Prefix"></Input>
            </FormItem>
          </Col>
          <Col :span="4">
            <FormItem label="Suffix" prop="suffix">
              <Input v-model="formGenerateUser.suffix" placeholder="Suffix"></Input>
            </FormItem>
          </Col>
          <Col :span="4">
            <FormItem label="Start Number" prop="number_from" required>
              <InputNumber v-model="formGenerateUser.number_from" style="width: 100%"></InputNumber>
            </FormItem>
          </Col>
          <Col :span="4">
            <FormItem label="End Number" prop="number_to" required>
              <InputNumber v-model="formGenerateUser.number_to" style="width: 100%"></InputNumber>
            </FormItem>
          </Col>
          <Col :span="4">
            <FormItem label="Password Length" prop="password_length" required>
              <Input v-model="formGenerateUser.password_length"
                        placeholder="Password Length"></Input>
            </FormItem>
          </Col>
        </Row>

        <FormItem>
          <!-- <el-button type="primary" @click="generateUser" icon="el-icon-fa-users" :loading="loadingGenerate">Generate & Export
          </el-button> -->
          <Button type="primary" @click="generateUser" :loading="loadingGenerate">Generate & Export</Button>
          <span class="userPreview" v-if="formGenerateUser.number_from && formGenerateUser.number_to &&
                                          formGenerateUser.number_from <= formGenerateUser.number_to">
            The usernames will be {{formGenerateUser.prefix + formGenerateUser.number_from + formGenerateUser.suffix}},
            <span v-if="formGenerateUser.number_from + 1 < formGenerateUser.number_to">
              {{formGenerateUser.prefix + (formGenerateUser.number_from + 1) + formGenerateUser.suffix + '...'}}
            </span>
            <span v-if="formGenerateUser.number_from + 1 <= formGenerateUser.number_to">
              {{formGenerateUser.prefix + formGenerateUser.number_to + formGenerateUser.suffix}}
            </span>
          </span>
        </FormItem>
      </Form>
    </Panel>
    <!--对话框-->
    <Modal :title="$t('m.User_Info')" v-model="showUserDialog" :closable="false">
      <Form :model="user" :label-width="120" label-position="left">
        <Row :gutter="20">
          <Col :span="12">
            <FormItem :label="$t('m.User_Username')" required>
              <Input v-model="user.username"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem :label="$t('m.User_Real_Name')" required>
              <Input v-model="user.real_name"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem :label="$t('m.User_Email')" required>
              <Input v-model="user.email"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem :label="$t('m.User_New_Password')">
              <Input v-model="user.password"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem :label="$t('m.User_Type')">
              <Select v-model="user.admin_type">
                <Option label="Regular User" value="Regular User"></Option>
                <Option label="Admin" value="Admin"></Option>
                <Option label="Super Admin" value="Super Admin"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem :label="$t('m.Problem_Permission')">
              <Select v-model="user.problem_permission" :disabled="user.admin_type!=='Admin'">
                <Option label="None" value="None"></Option>
                <Option label="Own" value="Own"></Option>
                <Option label="All" value="All"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem :label="$t('m.Two_Factor_Auth')" :label-width="80">
              <i-switch
                v-model="user.two_factor_auth"
                :disabled="!user.real_tfa">
              </i-switch>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="Open Api" :label-width="80">
              <i-switch
                v-model="user.open_api"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </i-switch>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem :label="$t('m.Is_Disabled')" :label-width="80">
              <i-switch
                v-model="user.is_disabled"
                active-text=""
                inactive-text="">
              </i-switch>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <span slot="footer" class="dialog-footer">
        <Button @click.native="showUserDialog = false">取消</Button>
        <Button @click.native="saveUser()">确定</Button>
        <!-- <cancel @click.native="showUserDialog = false">Cancel</cancel>
        <save @click.native="saveUser()"></save> -->
      </span>
    </Modal>
  </div>
</template>

<script>
  import papa from 'papaparse'
  import api from '../../api.js'
  import utils from '@/utils/utils'

  export default {
    name: 'User',
    data () {
      return {
        // 一页显示的用户数
        pageSize: 10,
        // 用户总数
        total: 0,
        // 用户列表
        userList: [],
        uploadUsers: [],
        uploadUsersPage: [],
        uploadUsersCurrentPage: 1,
        uploadUsersPageSize: 15,
        // 搜索关键字
        keyword: '',
        // 是否显示用户对话框
        showUserDialog: false,
        // 当前用户model
        user: {},
        loadingTable: false,
        loadingGenerate: false,
        // 当前页码
        currentPage: 0,
        selectedUsers: [],
        formGenerateUser: {
          prefix: '',
          suffix: '',
          number_from: 0,
          number_to: 0,
          password_length: 8
        },
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
            title: 'Username',
            key: 'username'
          },
          {
            title: 'Create Time',
            slot: 'creatTime',
            key: 'create_time'
          },
          {
            title: 'Last Login',
            slot: 'lastLogin',
            key: 'last_login'
          },
          {
            title: 'Real Name',
            key: 'real_name'
          },
          {
            title: 'Email',
            key: 'email'
          },
          {
            title: 'User Type',
            slot: 'userType',
            key: 'admin_type'
          },
          {
            title: 'Option',
            slot: 'option'
          }
        ],
        Usercolumns: [
          {
            title: 'UserName',
            key: 'name'
          },
          {
            title: 'PassWord',
            key: 'password'
          },
          {
            title: 'Email',
            key: 'studentNumber'
          }
        ]
      }
    },
    mounted () {
      this.getUserList(1)
    },
    methods: {
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getUserList(page)
      },
      // 提交修改用户的信息
      saveUser () {
        api.editUser(this.user).then(res => {
          // 更新列表
          this.getUserList(this.currentPage)
        }).then(() => {
          this.showUserDialog = false
        }).catch(() => {
        })
      },
      // 打开用户对话框
      openUserDialog (id) {
        this.showUserDialog = true
        api.getUser(id).then(res => {
          this.user = res.data.data
          this.user.password = ''
          this.user.real_tfa = this.user.two_factor_auth
        })
      },
      // 获取用户列表
      getUserList (page) {
        this.loadingTable = true
        api.getUserList((page - 1) * this.pageSize, this.pageSize, this.keyword).then(res => {
          this.loadingTable = false
          this.total = res.data.data.total
          this.userList = res.data.data.results
        }, res => {
          this.loadingTable = false
        })
      },
      deleteUsers (ids) {
        this.$confirm('Sure to delete the user?', 'confirm', {
          type: 'warning'
        }).then(() => {
          api.deleteUsers(ids.join(',')).then(res => {
            this.getUserList(this.currentPage)
          }).catch(() => {
            this.getUserList(this.currentPage)
          })
        }, () => {
        })
      },
      handleSelectionChange (val) {
        this.selectedUsers = val
      },
      generateUser () {
        this.$refs['formGenerateUser'].validate((valid) => {
          if (!valid) {
            this.$error('Please validate the error fields')
            return
          }
          this.loadingGenerate = true
          let data = Object.assign({}, this.formGenerateUser)
          api.generateUser(data).then(res => {
            this.loadingGenerate = false
            let url = '/admin/generate_user?file_id=' + res.data.data.file_id
            utils.downloadFile(url).then(() => {
              this.$alert('All users created successfully, the users sheets have downloaded to your disk.', 'Notice')
            })
            this.getUserList(1)
          }).catch(() => {
            this.loadingGenerate = false
          })
        })
      },
      handleUsersCSV (file) {
        papa.parse(file, {
          complete: (results) => {
            let data = results.data.filter(user => {
              // return user[0] && user[1] && user[2]
              return user[0] && user[1]
            })
            let delta = results.data.length - data.length
            if (delta > 0) {
              this.$warning(delta + ' users have been filtered due to empty value')
            }
            this.uploadUsersCurrentPage = 1
            this.uploadUsers = data
            this.uploadUsersPage = data.slice(0, this.uploadUsersPageSize)
          },
          error: (error) => {
            this.$error(error)
          }
        })
        return false
      },
      handleUsersUpload () {
        api.importUsers(this.uploadUsers).then(res => {
          this.getUserList(1)
          this.handleResetData()
        }).catch(() => {
        })
      },
      handleResetData () {
        this.uploadUsers = []
      }
    },
    computed: {
      selectedUserIDs () {
        let ids = []
        for (let user of this.selectedUsers) {
          ids.push(user.id)
        }
        return ids
      }
    },
    watch: {
      'keyword' () {
        this.currentChange(1)
      },
      'user.admin_type' () {
        if (this.user.admin_type === 'Super Admin') {
          this.user.problem_permission = 'All'
        } else if (this.user.admin_type === 'Regular User') {
          this.user.problem_permission = 'None'
        }
      },
      'uploadUsersCurrentPage' (page) {
        this.uploadUsersPage = this.uploadUsers.slice((page - 1) * this.uploadUsersPageSize, page * this.uploadUsersPageSize)
      }
    }
  }
</script>

<style scoped lang="less">
  .import-user-icon {
    color: #555555;
    margin-left: 4px;
  }

  .userPreview {
    padding-left: 10px;
  }

  .notification {
    p {
      margin: 0;
      text-align: left;
    }
  }
</style>
