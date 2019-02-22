<template>
  <Menu class="vertical_menu" @on-select="handleRoute" :active-name="currentPath">
    <div class="logo">实验平台后台</div>
    <Menu-item name="/"><Icon type=""></Icon>{{$t('m.Dashboard')}}</Menu-item>
    <Submenu v-if="isSuperAdmin" name="general">
      <template slot="title"><Icon type=""></Icon>{{$t('m.General')}}</template>
      <Menu-item name="/user">{{$t('m.User')}}</Menu-item>
      <Menu-item name="/announcement">{{$t('m.Announcement')}}</Menu-item>
      <Menu-item name="/conf">{{$t('m.System_Config')}}</Menu-item>
      <Menu-item name="/judge-server">{{$t('m.Judge_Server')}}</Menu-item>
      <!-- <Menu-item name="/prune-test-case">{{$t('m.Prune_Test_Case')}}</Menu-item> -->
    </Submenu>
    <Submenu name="problem" v-if="hasProblemPermission">
      <template slot="title"><Icon type=""></Icon>{{$t('m.Problem')}}</template>
      <Menu-item name="/problems">{{$t('m.Problem_List')}}</Menu-item>
      <Menu-item name="/problem/create">{{$t('m.Create_Problem')}}</Menu-item>
      <Menu-item name="/problem/batch_ops">{{$t('m.Export_Import_Problem')}}</Menu-item>

    </Submenu>
    <Submenu name="contest">
      <template slot="title"><Icon type=""></Icon>{{$t('m.Contest')}}</template>
      <Menu-item name="/contest">{{$t('m.Contest_List')}}</Menu-item>
      <Menu-item name="/contest/create">{{$t('m.Create_Contest')}}</Menu-item>
    </Submenu>
  </Menu>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'SideMenu',
    data () {
      return {
        currentPath: ''
      }
    },
    mounted () {
      this.currentPath = this.$route.path
    },
    computed: {
      ...mapGetters(['user', 'isSuperAdmin', 'hasProblemPermission'])
    },
    methods: {
      handleRoute (route) {
        this.$router.push(route)
      }
    }
  }
</script>

<style scoped lang="less">
  .vertical_menu {
    overflow: auto;
    width: 205px;
    height: 100%;
    position: fixed !important;
    z-index: 100;
    top: 0;
    bottom: 0;
    left: 0;
    .logo {
      margin: 20px 0;
      text-align: center;
      font-size: 20px;
      color: #2d8cf0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      // img {
      //   background-color: #fff;
      //   border-radius: 50%;
      //   border: 3px solid #fff;
      //   width: 75px;
      //   height: 75px;
      // }
    }
  }
</style>
