<template>
  <div>
    <NavBar></NavBar>
    <Row>
    <Col span="4">
    <SideBar></SideBar>
    </Col>
    <Col span="20">
    <div class="content-app" >
      <transition name="fadeInUp" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    </Col>
    </Row>
    <div class="footer">
      <p v-html="website.website_footer"></p>
      <!-- <p>Powered by <a href="https://github.com/QingdaoU/OnlineJudge">lizehong</a> -->
        <span v-if="version">&nbsp; Version: {{ version }}</span>
      </p>
    </div>
    <BackTop></BackTop>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import NavBar from '@oj/components/NavBar.vue'
  import SideBar from '@oj/components/SideBar.vue'

  export default {
    name: 'app',
    components: {
      NavBar,
      SideBar
    },
    data () {
      return {
        version: process.env.VERSION
      }
    },
    created () {
      try {
        document.body.removeChild(document.getElementById('app-loader'))
      } catch (e) {
      }
    },
    mounted () {
      this.getWebsiteConfig()
    },
    methods: {
      ...mapActions(['getWebsiteConfig', 'changeDomTitle'])
    },
    computed: {
      ...mapState(['website'])
    },
    watch: {
      'website' () {
        this.changeDomTitle()
      },
      '$route' () {
        this.changeDomTitle()
      }
    }
  }
</script>

<style lang="less" scoped>

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    background-color: transparent;
    &:active, &:hover {
      outline-width: 0;
    }
  }


  .content-app {
    margin-top: 80px;
    // padding: 0  2% 0 20%;
    padding: 0 2% 0 0;
    margin-left:20px;
  }

  .footer {
    // position: fixed;
    // bottom: 2%;
    // left: 50%;
    margin-top: 20px;
    margin-bottom: 10px;
    text-align: center;
    font-size: small;
  }

  .fadeInUp-enter-active {
    animation: fadeInUp .8s;
  }


</style>
