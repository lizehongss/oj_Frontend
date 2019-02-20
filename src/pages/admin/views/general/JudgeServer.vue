<template>
  <div class="view">
    <Panel :title="$t('m.Judge_Server_Token')">
      <code>{{ token }}</code>
    </Panel>
    <Panel :title="$t('m.Judge_Server_Info')">
      <Table :data="servers" border :columns="columns ">
        <template slot-scope="{ row }" slot="status">
          <Tag v-if="row.status === 'normal'" color="success">Normal</Tag>
          <Tag v-else color="error">Abnormal</Tag>
        </template>
        <template slot-scope="{ row }" slot="cpu_usage">
          {{ row.cpu_usage }}%
        </template>
        <template slot-scope="{ row }" slot="memory_usage">
          {{ row.memory_usage }} %
        </template>
        <template slot-scope="{ row }" slot="disabled">
          <i-switch v-model="row.is_disabled" @on-change="handleDisabledSwitch(row.id, row.is_disabled)"></i-switch>
        </template>
        <template slot-scope="{ row }" slot="options">
          <Button name="Deleete" icon="ios-trash" @click.native="deleteJudgeServer(row.hostname)"></Button>
        </template>
      </Table>
      <!-- <el-table
        :data="servers"
        :default-expand-all="true"
        border>
        <el-table-column
          type="expand">
          <template slot-scope="props">
            <p>{{$t('m.IP')}}:
              <el-tag type="success">{{ props.row.ip }}</el-tag>&nbsp;&nbsp;
              {{$t('m.Judger_Version')}}:
              <el-tag type="success">{{ props.row.judger_version }}</el-tag>
            </p>
            <p>{{$t('m.Service_URL')}}: <code>{{ props.row.service_url }}</code></p>
            <p>{{$t('m.Last_Heartbeat')}}: {{ props.row.last_heartbeat | localtime}}</p>
            <p>{{$t('m.Create_Time')}}: {{ props.row.create_time | localtime }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="Status">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 'normal' ? 'success' : 'danger'">
              {{ scope.row.status === 'normal' ? 'Normal' : 'Abnormal' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="hostname"
          label="Hostname">
        </el-table-column>
        <el-table-column
          prop="task_number"
          label="Task Number">
        </el-table-column>
        <el-table-column
          prop="cpu_core"
          label="CPU Core">
        </el-table-column>
        <el-table-column
          prop="cpu_usage"
          label="CPU Usage">
          <template slot-scope="scope">{{ scope.row.cpu_usage }}%</template>
        </el-table-column>
        <el-table-column
          prop="memory_usage"
          label="Memory Usage">
          <template slot-scope="scope">{{ scope.row.memory_usage }}%</template>
        </el-table-column>
        <el-table-column label="Disabled">
          <template slot-scope="{row}">
            <el-switch v-model="row.is_disabled" @change="handleDisabledSwitch(row.id, row.is_disabled)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Options">
          <template slot-scope="scope">
            <icon-btn name="Delete" icon="trash" @click.native="deleteJudgeServer(scope.row.hostname)"></icon-btn>
          </template>
        </el-table-column>
      </el-table> -->
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'
  import Tableexpand from '../../components/Tableexpand.vue'

  export default {
    name: 'JudgeServer',
    components: {
      Tableexpand
    },
    data () {
      return {
        servers: [],
        token: '',
        intervalId: -1,
        columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(Tableexpand, {
                props: {
                  item: params.row
                }
              })
            }
          },
          {
            title: 'Status',
            key: 'status',
            slot: 'status'
          },
          {
            title: 'Hostname',
            key: 'hostname'
          },
          {
            title: 'Task Number',
            key: 'task_number'
          },
          {
            title: 'CPU Core',
            key: 'cpu_core'
          },
          {
            title: 'CPU Usage',
            key: 'cpu_usage',
            slot: 'cpu_usage'
          },
          {
            title: 'Memory Usage',
            key: 'memory_usage',
            slot: 'memory_usage'
          },
          {
            title: 'Disabled',
            slot: 'disabled'
          },
          {
            title: 'Options',
            slot: 'options'
          }
        ]
      }
    },
    mounted () {
      this.refreshJudgeServerList()
      this.intervalId = setInterval(() => {
        this.refreshJudgeServerList()
      }, 5000)
    },
    methods: {
      refreshJudgeServerList () {
        api.getJudgeServer().then(res => {
          this.servers = res.data.data.servers
          this.token = res.data.data.token
        })
      },
      deleteJudgeServer (hostname) {
        this.$confirm('If you delete this judge server, it can\'t be used until next heartbeat', 'Warning', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          api.deleteJudgeServer(hostname).then(res =>
            this.refreshJudgeServerList()
          )
        }).catch(() => {
        })
      },
      handleDisabledSwitch (id, value) {
        let data = {
          id,
          is_disabled: value
        }
        api.updateJudgeServer(data).catch(() => {})
      }
    },
    beforeRouteLeave (to, from, next) {
      clearInterval(this.intervalId)
      next()
    }
  }
</script>
