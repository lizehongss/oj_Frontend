<template>
  <div id="sidebar">
    <Menu theme="dark"  @on-select="handleRoute" :active-name="activeMenu" class='oj-sideMenu' width="auto">
      <Menu-item name="/">
        <Icon type="ios-home"></Icon>
        {{$t('m.Home')}}
      </Menu-item>
      <!-- <Menu-item name="/problems">
        <Icon type="ios-keypad"></Icon>
        {{$t('m.NavProblems')}}
      </Menu-item> -->
      <Submenu name="problem">
        <template slot="title">
          <Icon type="ios-keypad"></Icon>
          {{$t('m.NavProblems')}}
        </template>
        <Menu-item name="/problems">程序练习</Menu-item>
        <Menu-item name="/choiceproblem">选择题练习</Menu-item>
        <Menu-item name="/blankproblem">填空题练习</Menu-item>
      </Submenu>
      <Menu-item name="/contests">
        <Icon type="ios-trophy"></Icon>
        {{$t('m.Contests')}}
      </Menu-item>
      <Menu-item name="/status">
        <Icon type="ios-pulse"></Icon>
        {{$t('m.NavStatus')}}
      </Menu-item>
      <Menu-item name="/oi-rank">
        <Icon type="ios-podium"></Icon>
        {{$t('m.OI_Rank')}}
      </Menu-item>
      <!-- <Submenu name="rank">
        <template slot="title">
          <Icon type="ios-podium"></Icon>
          {{$t('m.Rank')}}
        </template>
        <Menu-item name="/acm-rank">
          {{$t('m.ACM_Rank')}}
        </Menu-item>
        <Menu-item name="/oi-rank">
          {{$t('m.OI_Rank')}}
        </Menu-item>
      </Submenu> -->
      <Submenu name="about">
        <template slot="title">
          <Icon type="ios-information-circle"></Icon>
          {{$t('m.About')}}
        </template>
        <Menu-item name="/about">
          {{$t('m.Judger')}}
        </Menu-item>
        <Menu-item name="/FAQ">
          <!-- {{$t('m.FAQ')}} -->
          使用说明
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
    margin-top: 80px;
  }
</style>
