<template>
  <div class="view">
    <!-- <Panel :title="$t('m.SMTP_Config')">
      <el-form label-position="left" label-width="70px" :model="smtp">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('m.Server')" required>
              <el-input v-model="smtp.server" placeholder="SMTP Server Address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.Port')" required>
              <el-input type="number" v-model="smtp.port" placeholder="SMTP Server Port"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.Email')" required>
              <el-input v-model="smtp.email" placeholder="Account Used To Send Email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.Password')" label-width="90px" required>
              <el-input v-model="smtp.password" type="password" placeholder="SMTP Server Password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="TLS">
              <el-switch
                v-model="smtp.tls"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="primary" @click="saveSMTPConfig">Save</el-button>
      <el-button type="warning" @click="testSMTPConfig"
                 v-if="saved" :loading="loadingBtnTest">Send Test Email</el-button>
    </Panel> -->

    <Panel :title="$t('m.Website_Config')">
      <Form label-position="left" label-width="100px" ref="form" :model="websiteConfig">
        <Row :gutter="20">
          <Col :span="8">
            <FormItem :label="$t('m.Base_Url')" required>
              <Input v-model="websiteConfig.website_base_url" placeholder="Website Base Url"></Input>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem :label="$t('m.Name')" required>
              <Input v-model="websiteConfig.website_name" placeholder="Website Name"></Input>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem :label="$t('m.Shortcut')" required>
              <Input v-model="websiteConfig.website_name_shortcut" placeholder="Website Name Shortcut"></Input>
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem :label="$t('m.Footer')" required>
              <Input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="websiteConfig.website_footer"
                        placeholder="Website Footer HTML"></Input>
            </FormItem>
          </Col>
          <Col :span="24">
            <Col :span="12">
              <FormItem :label="$t('m.Allow_Register')" label-width="200px">
                <i-switch
                  v-model="websiteConfig.allow_register"
                >
                </i-switch>
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="$t('m.Submission_List_Show_All')" label-width="200px">
                <i-switch
                  v-model="websiteConfig.submission_list_show_all"
                >
                </i-switch>
              </FormItem>
            </Col>
          </Col>
        </Row>
      </Form>
      <!-- <save @click.native="saveWebsiteConfig"></save> -->
      <Button @click.native="saveWebsiteConfig" type="primary">保存</Button>
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'

  export default {
    name: 'Conf',
    data () {
      return {
        init: false,
        saved: false,
        loadingBtnTest: false,
        smtp: {
          server: 'smtp.example.com',
          port: 25,
          password: '',
          email: 'email@example.com',
          tls: true
        },
        websiteConfig: {}
      }
    },
    mounted () {
      // api.getSMTPConfig().then(res => {
      //   if (res.data.data) {
      //     this.smtp = res.data.data
      //   } else {
      //     this.init = true
      //     this.$warning('Please setup SMTP config at first')
      //   }
      // })
      api.getWebsiteConfig().then(res => {
        this.websiteConfig = res.data.data
      }).catch(() => {
      })
    },
    methods: {
      saveSMTPConfig () {
        if (!this.init) {
          api.editSMTPConfig(this.smtp).then(() => {
            this.saved = true
          }, () => {
          })
        } else {
          api.createSMTPConfig(this.smtp).then(() => {
            this.saved = true
          }, () => {
          })
        }
      },
      testSMTPConfig () {
        this.$prompt('Please input your email', '', {
          inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: 'Error email format'
        }).then(({value}) => {
          this.loadingBtnTest = true
          api.testSMTPConfig(value).then(() => {
            this.loadingBtnTest = false
          }, () => {
            this.loadingBtnTest = false
          })
        }).catch(() => {
        })
      },
      saveWebsiteConfig () {
        api.editWebsiteConfig(this.websiteConfig).then(() => {
        }).catch(() => {
        })
      }
    }
  }
</script>
