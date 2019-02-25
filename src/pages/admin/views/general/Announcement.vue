<template>
  <div class="announcement view">
    <Panel :title="$t('m.General_Announcement')">
      <div class="list">
        <Table ref="table" :data="announcementList" :loading="loading" :columns="columns">
          <template slot-scope="{ row }" slot="create_time">
            {{row.create_time | localtime}}
          </template>
          <template slot-scope="{ row }" slot="last_update_time">
            {{row.last_update_time | localtime}}
          </template>
          <template slot-scope="{ row }" slot="author">
            {{row.created_by.username}}
          </template>
          <template slot-scope="{ row }" slot="visible">
            <i-switch v-model="row.visible"
                      @on-change="handleVisibleSwitch(row)">
            </i-switch>
          </template>
          <template slot-scope="{ row }" slot="option">
            <Button name="Edit" icon="ios-brush" @click.native="openAnnouncementDialog(row.id)"/>
            <Button name="Delete" icon='ios-trash' @click.native="deleteAnnouncement(row.id)"/>
          </template>
        </Table>
        <!-- <el-table
          v-loading="loading"
          element-loading-text="loading"
          ref="table"
          :data="announcementList"
          style="width: 100%">
          <el-table-column
            width="100"
            prop="id"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="title"
            label="Title">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="CreateTime">
            <template slot-scope="scope">
              {{ scope.row.create_time | localtime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="last_update_time"
            label="LastUpdateTime">
            <template slot-scope="scope">
              {{scope.row.last_update_time | localtime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="created_by.username"
            label="Author">
          </el-table-column>
          <el-table-column
            width="100"
            prop="visible"
            label="Visible">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.visible"
                         active-text=""
                         inactive-text=""
                         @change="handleVisibleSwitch(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="Option"
            width="200">
            <div slot-scope="scope">
              <icon-btn name="Edit" icon="edit" @click.native="openAnnouncementDialog(scope.row.id)"></icon-btn>
              <icon-btn name="Delete" icon="trash" @click.native="deleteAnnouncement(scope.row.id)"></icon-btn>
            </div>
          </el-table-column>
        </el-table> -->
        <div class="panel-options">
          <!-- <el-button type="primary" size="small" @click="openAnnouncementDialog(null)" icon="el-icon-plus">Create</el-button> -->
          <Button type="primary"  @click="openAnnouncementDialog(null)" icon="ios-add">Create</Button>
          <!-- <el-pagination
            v-if="!contestID"
            class="page"
            layout="prev, pager, next"
            @current-change="currentChange"
            :page-size="pageSize"
            :total="total">
          </el-pagination> -->
          <Page
            v-if="!contestID"
            class="page"
            size="small"
            :page-size="pageSize"
            @on-change="currentChange"
            :total="total"
          ></Page>
        </div>
      </div>
    </Panel>
    <!--对话框-->
    <Modal :title="announcementDialogTitle" v-model="showEditAnnouncementDialog"
               @on-visible-change="onOpenEditDialog" :close-on-click-modal="false" :width="700">
      <Form label-position="top">
        <FormItem :label="$t('m.Announcement_Title')" required>
          <Input
            v-model="announcement.title"
            :placeholder="$t('m.Announcement_Title')" class="title-input">
          </Input>
        </FormItem>
        <FormItem :label="$t('m.Announcement_Content')" required>
          <!-- <Simditor v-model="announcement.content"></Simditor> -->
          <Editor v-model="announcement.content"></Editor>
        </FormItem>
        <div class="visible-box">
          <span>{{$t('m.Announcement_Status')}}</span>
          <i-switch
            v-model="announcement.visible"
            >
          </i-switch>
        </div>
      </Form>
      <span slot="footer" class="dialog-footer">
          <!-- <cancel @click.native="showEditAnnouncementDialog = false"></cancel>
          <save type="primary" @click.native="submitAnnouncement"></save> -->
          <Button type="primary" @click.native="showEditAnnouncementDialog=false">取消</Button>
          <Button type="primary" @click.native="submitAnnouncement">确定</Button>
        </span>
    </Modal>
  </div>
</template>

<script>
  import Simditor from '../../components/Simditor.vue'
  import Editor from '../../components/Editor.vue'
  import api from '../../api.js'

  export default {
    name: 'Announcement',
    components: {
      Simditor,
      Editor
    },
    data () {
      return {
        contestID: '',
        // 显示编辑公告对话框
        showEditAnnouncementDialog: false,
        // 公告列表
        announcementList: [],
        // 一页显示的公告数
        pageSize: 15,
        // 总公告数
        total: 0,
        // 当前公告id
        currentAnnouncementId: null,
        mode: 'create',
        // 公告 (new | edit) model
        announcement: {
          title: '',
          visible: true,
          content: ''
        },
        // 对话框标题
        announcementDialogTitle: 'Edit Announcement',
        // 是否显示loading
        loading: true,
        // 当前页码
        currentPage: 0,
        columns: [
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: 'Title',
            key: 'title'
          },
          {
            title: 'CreateTime',
            key: 'create_time',
            slot: 'create_time'
          },
          {
            title: 'LastUpdateTime',
            key: 'last_update_time',
            slot: 'last_update_time'
          },
          {
            title: 'Author',
            key: 'created_by',
            slot: 'author'
          },
          {
            title: 'Visible',
            key: 'visible',
            slot: 'visible'
          },
          {
            title: 'Option',
            slot: 'option'
          }
        ]
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.contestID = this.$route.params.contestId
        if (this.contestID) {
          this.getContestAnnouncementList()
        } else {
          this.getAnnouncementList(1)
        }
      },
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getAnnouncementList(page)
      },
      getAnnouncementList (page) {
        this.loading = true
        api.getAnnouncementList((page - 1) * this.pageSize, this.pageSize).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.announcementList = res.data.data.results
        }, res => {
          this.loading = false
        })
      },
      getContestAnnouncementList () {
        this.loading = true
        api.getContestAnnouncementList(this.contestID).then(res => {
          this.loading = false
          this.announcementList = res.data.data
        }).catch(() => {
          this.loading = false
        })
      },
      // 打开编辑对话框的回调
      onOpenEditDialog (value) {
        // todo 优化
        // 暂时解决 文本编辑器显示异常bug
        if (value) {
          setTimeout(() => {
            if (document.createEvent) {
              let event = document.createEvent('HTMLEvents')
              event.initEvent('resize', true, true)
              window.dispatchEvent(event)
            } else if (document.createEventObject) {
              window.fireEvent('onresize')
            }
          }, 0)
        }
      },
      // 提交编辑
      // 默认传入MouseEvent
      submitAnnouncement (data = undefined) {
        let funcName = ''
        if (!data.title) {
          data = {
            id: this.currentAnnouncementId,
            title: this.announcement.title,
            content: this.announcement.content,
            visible: this.announcement.visible
          }
        }
        if (this.contestID) {
          data.contest_id = this.contestID
          funcName = this.mode === 'edit' ? 'updateContestAnnouncement' : 'createContestAnnouncement'
        } else {
          funcName = this.mode === 'edit' ? 'updateAnnouncement' : 'createAnnouncement'
        }
        api[funcName](data).then(res => {
          this.showEditAnnouncementDialog = false
          this.init()
        }).catch()
      },
      // 删除公告
      deleteAnnouncement (announcementId) {
        this.$confirm('Are you sure you want to delete this announcement?', 'Warning', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.loading = true
          let funcName = this.contestID ? 'deleteContestAnnouncement' : 'deleteAnnouncement'
          api[funcName](announcementId).then(res => {
            this.loading = true
            this.init()
          })
        }).catch(() => {
          this.loading = true
        })
      },
      openAnnouncementDialog (id) {
        this.showEditAnnouncementDialog = true
        if (id !== null) {
          this.currentAnnouncementId = id
          this.announcementDialogTitle = 'Edit Announcement'
          this.announcementList.find(item => {
            if (item.id === this.currentAnnouncementId) {
              this.announcement.title = item.title
              this.announcement.visible = item.visible
              this.announcement.content = item.content
              this.mode = 'edit'
            }
          })
        } else {
          this.announcementDialogTitle = 'Create Announcement'
          this.announcement.title = ''
          this.announcement.visible = true
          this.announcement.content = ''
          this.mode = 'create'
        }
      },
      handleVisibleSwitch (row) {
        this.mode = 'edit'
        this.submitAnnouncement({
          id: row.id,
          title: row.title,
          content: row.content,
          visible: row.visible
        })
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>

<style lang="less" scoped>
  .title-input {
    margin-bottom: 20px;
  }

  .visible-box {
    margin-top: -10px;
    width: 205px;
    float: left;
  }
</style>
