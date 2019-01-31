<template>
  <Panel shadow :padding="10">
    <div slot="title">
      <Icon type="calendar"></Icon>
      {{title}}
    </div>
    <div slot="extra">
      <Button v-if="listVisible"  :loading="btnLoading" type="primary" @click="init"  icon="ios-loading">
      </Button>
      <Button v-else type="primary" icon="ios-arrow-back" @click="goBack"></Button>
    </div>

    <transition-group name="announcement-animate" mode="in-out">
      <div class="no-announcement" v-if="!announcements.length" key="no-announcement">
        <p>{{$t('m.No_Announcements')}}</p>
      </div>
      <template v-if="listVisible">
        <ul class="announcements-container" key="list">
          <li v-for="announcement in announcements" :key="announcement.title" @click="goAnnouncement(announcement)">
            <div class="flex-container">
            <Icon type="ios-briefcase-outline" size="40" />
            <div class="container-right">
               <div class="title">{{announcement.title}}</div>
               <div class="info">
                 <span class="date">{{announcement.create_time | localtime}}</span>
                 <span class="creator">By {{announcement.created_by.username}}</span>
               </div>
            </div>
            </div>
          </li>
        </ul>
        <Pagination v-if="!isContest"
                    key="page"
                    :total="total"
                    :page-size="limit"
                    @on-change="getAnnouncementList">
        </Pagination>
      </template>

      <template v-else>
        <div v-katex v-html="announcement.content" key="content" class="content-container markdown-body"></div>
      </template>
    </transition-group>
  </Panel>
</template>

<script>
  import api from '@oj/api'
  import Pagination from '@oj/components/Pagination'

  export default {
    name: 'Announcement',
    components: {
      Pagination
    },
    data () {
      return {
        limit: 10,
        total: 10,
        btnLoading: false,
        announcements: [],
        announcement: '',
        listVisible: true
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        if (this.isContest) {
          this.getContestAnnouncementList()
        } else {
          this.getAnnouncementList()
        }
      },
      getAnnouncementList (page = 1) {
        let params = {
          limit: this.limit,
          offset: (page - 1) * this.limit
        }
        this.btnLoading = true
        api.getAnnouncementList(params).then(res => {
          this.btnLoading = false
          this.announcements = res.data.data.results
          this.total = res.data.data.total
        }, () => {
          this.btnLoading = false
        })
      },
      getContestAnnouncementList () {
        this.btnLoading = true
        api.getContestAnnouncementList(this.$route.params.contestID).then(res => {
          this.btnLoading = false
          this.announcements = res.data.data
        }, () => {
          this.btnLoading = false
        })
      },
      goAnnouncement (announcement) {
        this.announcement = announcement
        this.listVisible = false
      },
      goBack () {
        this.listVisible = true
        this.announcement = ''
      }
    },
    computed: {
      title () {
        if (this.listVisible) {
          return this.isContest ? '比赛公告' : '公告'
        } else {
          return this.announcement.title
        }
      },
      isContest () {
        return !!this.$route.params.contestID
      }
    }
  }
</script>

<style scoped lang="less">
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
  .announcements-container {
    margin-top: -10px;
    margin-bottom: 10px;
    li {
      list-style: none;
      padding: 10px 10px;
      margin-left: 20px;
      margin-bottom: 10px;
      font-size: 16px;
      // border: 1px solid #dddee1;
      border-radius:  1%;
      color: #2d8cf0;
      cursor: pointer;
      &:hover {
        box-shadow: 0 1px 6px rgba(0,0,0,.2)
      }
      .flex-container {
        display: flex;
        width: 100%;
        max-width: 100%;
        justify-content: flex-start;
        align-items: center;
        flex-flow: row nowrap;
        .container-right{
          margin-left: 20px;
          .title{
            font-size: 20px;
          }
          .info{
            font-size: 14px; 
            color: #000;
          }
        }
      }
    }
  }

  .content-container {
    padding: 0 20px 20px 20px;
  }

  .no-announcement {
    text-align: center;
    font-size: 16px;
  }changeLocale

  .announcement-animate-enter-active {
    animation: fadeIn 1s;
  }
</style>
