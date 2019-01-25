<template>
  <div id="sidebar">
    <Menu theme="dark"  @on-select="handleRoute" :active-name="activeMenu" class='oj-sideMenu'>
      <Menu-item name="/">
        <Icon type="home"></Icon>
        {{$t('m.Home')}}
      </Menu-item>
      <Menu-item name="/problems">
        <Icon type="ios-keypad"></Icon>
        {{$t('m.NavProblems')}}
      </Menu-item>
      <Menu-item name="/contests">
        <Icon type="trophy"></Icon>
        {{$t('m.Contests')}}
      </Menu-item>
      <Menu-item name="/status">
        <Icon type="ios-pulse-strong"></Icon>
        {{$t('m.NavStatus')}}
      </Menu-item>
      <Submenu name="rank">
        <template slot="title">
          <Icon type="podium"></Icon>
          {{$t('m.Rank')}}
        </template>
        <Menu-item name="/acm-rank">
          {{$t('m.ACM_Rank')}}
        </Menu-item>
        <Menu-item name="/oi-rank">
          {{$t('m.OI_Rank')}}
        </Menu-item>
      </Submenu>
      <Submenu name="about">
        <template slot="title">
          <Icon type="information-circled"></Icon>
          {{$t('m.About')}}
        </template>
        <Menu-item name="/about">
          {{$t('m.Judger')}}
        </Menu-item>
        <Menu-item name="/FAQ">
          {{$t('m.FAQ')}}
        </Menu-item>
      </Submenu>
    </Menu>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  export default {
    methods: {
      ...mapActions(['getProfile', 'changeModalStatus']),
      handleRoute (route) {
        if (route && route.indexOf('admin') < 0) {
          this.$router.push(route)
        } else {
          window.open('/admin/')
        }
      }
    },
    computed: {
      activeMenu () {
        return '/' + this.$route.path.split('/')[1]
      }
    }
}
</script>

<style lang="less" scoped>
  #sidebar {
    position: fixed;
    top: 80px;
    left: 0;
    z-index:  1000;
    background-color: #fff;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  }
  // 更改侧栏样式
  .ivu-menu-dark {
    background-color: #001529;
  }
  // .ivu-menu-item {
  //   color: #fff;
  // }
  .ivu-menu {
    color: #fff;
  }
  .ivu-menu-vertical .ivu-menu-item:hover {
    background: #000c17;
  }
   .ivu-menu-submenu-title:hover {
    background: #000c17;
  }
</style>
