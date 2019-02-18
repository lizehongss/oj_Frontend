<template>
  <Row type="flex" :gutter="20">
    <Col :md="10" :lg="8">
      <Card class="admin-info">
        <Row :gutter="20">
          <Col :span="10">
            <img class="avatar" :src="profile.avatar"/>
          </Col>
          <Col :span="14">
            <p class="admin-info-name">{{user.username}}</p>
            <p>{{user.admin_type}}</p>
          </Col>
        </Row>
        <hr/>
        <div class="last-info">
          <p class="last-info-title">{{$t('m.Last_Login')}}</p>
          <Form :label-width="80" class="last-info-body">
            <FormItem label="Time:">
              <span>{{session.last_activity | localtime}}</span>
            </FormItem>
            <FormItem label="IP:">
              <span>{{session.ip}}</span>
            </FormItem>
            <FormItem label="OS:">
              <span>{{os}}</span>
            </FormItem>
            <FormItem label="Browser:">
              <span>{{browser}}</span>
            </FormItem>
          </Form>
        </div>
      </Card>
      <panel :title="$t('m.System_Overview')" v-if="isSuperAdmin">
        <p>{{$t('m.DashBoardJudge_Server')}}:  {{infoData.judge_server_count}}</p>
        <p>{{$t('m.HTTPS_Status')}}:
          <Tag :color="httpsColor" size="small">
            {{ https ? 'Enabled' : 'Disabled'}}
          </Tag>
        </p>
        <p>{{$t('m.Force_HTTPS')}}:
          <Tag :color="foreceHttpsColor" size="small">
            {{forceHttps ? 'Enabled' : 'Disabled'}}
          </Tag>
        </p>
        <p>{{$t('m.CDN_HOST')}}:
          <Tag :color="cdnColor" size="small">
            {{cdn ? cdn : 'Not Use'}}
          </Tag>
        </p>
      </panel>
    </Col>

    <Col :md="14" :lg="16" v-if="isSuperAdmin">
      <div class="info-container">
        <info-card color="#909399" icon="ios-contact" message="Total Users" iconSize="65" class="info-item"
                   :value="infoData.user_count"></info-card>
        <info-card color="#67C23A" icon="ios-list" message="Today Submissions" class="info-item"
                   :value="infoData.today_submission_count"></info-card>
        <info-card color="#409EFF" icon="ios-apps" message="Recent Contests" class="info-item"
                   :value="infoData.recent_contest_count"></info-card>
      </div>
      <!-- <panel style="margin-top: 5px">
        <span slot="title" v-loading="loadingReleases">Release Notes
        <el-popover placement="right" trigger="hover">
          <i slot="reference" class="el-icon-fa-question-circle import-user-icon"></i>
          <p>Please upgrade to the latest version to enjoy the new features. </p>
          <p>Reference: <a href="http://docs.onlinejudge.me/#/onlinejudge/guide/upgrade" target="_blank">
          http://docs.onlinejudge.me/#/onlinejudge/guide/upgrade</a>
          </p>
        </el-popover>
        </span>

        <el-collapse v-model="activeNames" v-for="(release, index) of releases" :key="'release' + index">
          <el-collapse-item :name="index+1">
            <template slot="title">
              <div v-if="release.new_version">{{release.title}}
                <el-tag size="mini" type="success">New Version</el-tag>
              </div>
              <span v-else>{{release.title}}</span>
            </template>
            <p>Level: {{release.level}}</p>
            <p>Details: </p>
            <div class="release-body">
              <ul v-for="detail in release.details" :key="detail">
                <li v-html="detail"></li>
              </ul>
            </div>
          </el-collapse-item>
        </el-collapse>
      </panel> -->
    </Col>
  </Row>
</template>


<script>
  import { mapGetters } from 'vuex'
  import browserDetector from 'browser-detect'
  import InfoCard from '@admin/components/infoCard.vue'
  import api from '@admin/api'

  export default {
    name: 'dashboard',
    components: {
      InfoCard
    },
    data () {
      return {
        infoData: {
          user_count: 0,
          recent_contest_count: 0,
          today_submission_count: 0,
          judge_server_count: 0,
          env: {}
        },
        activeNames: [1],
        session: {},
        loadingReleases: true,
        releases: [],
        httpsColor: this.https ? 'success' : 'error',
        foreceHttpsColor: this.forceHttps ? 'success' : 'error',
        cdnColor: this.cdn ? 'success' : 'warning'
      }
    },
    mounted () {
      api.getDashboardInfo().then(resp => {
        this.infoData = resp.data.data
      }, () => {
      })
      api.getSessions().then(resp => {
        this.parseSession(resp.data.data)
      }, () => {
      })
      api.getReleaseNotes().then(resp => {
        this.loadingReleases = false
        let data = resp.data.data
        if (!data) {
          return
        }
        let currentVersion = data.local_version
        data.update.forEach(release => {
          if (release.version > currentVersion) {
            release.new_version = true
          }
        })
        this.releases = data.update
      }, () => {
        this.loadingReleases = false
      })
    },
    methods: {
      parseSession (sessions) {
        let session = sessions[0]
        if (sessions.length > 1) {
          session = sessions.filter(s => !s.current_session).sort((a, b) => {
            return a.last_activity < b.last_activity
          })[0]
        }
        this.session = session
      }
    },
    computed: {
      ...mapGetters(['profile', 'user', 'isSuperAdmin']),
      cdn () {
        return this.infoData.env.STATIC_CDN_HOST
      },
      https () {
        return document.URL.slice(0, 5) === 'https'
      },
      forceHttps () {
        return this.infoData.env.FORCE_HTTPS
      },
      browser () {
        let b = browserDetector(this.session.user_agent)
        if (b.name && b.version) {
          return b.name + ' ' + b.version
        } else {
          return 'Unknown'
        }
      },
      os () {
        let b = browserDetector(this.session.user_agent)
        return b.os ? b.os : 'Unknown'
      }
    }
  }
</script>

<style lang="less">
  .admin-info {
    margin-bottom: 20px;
    &-name {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 10px;
      color: #409EFF;
    }
    .avatar {
      max-width: 100%;
    }
    .last-info {
      // margin-top: 5px; 
      &-title {
        font-size: 16px;
      }
    }
  }

  .info-container {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .info-item {
      flex: 1 0 auto;
      min-width: 200px;
      margin-bottom: 10px;
    }
  }

</style>
