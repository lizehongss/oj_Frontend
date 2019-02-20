<template>
  <div class="tableExpand">
    <p>{{$t('m.IP')}}:
        <Tag color="success">{{item.ip}}</Tag>&nbsp;&nbsp;
        {{$t('m.Judger_Version')}}:
        <Tag color="success">{{item.judger_version}}</Tag>
    </p>
    <p>{{$t('m.Service_URL')}}:<code>{{item.service_url}}</code></p>
    <p>{{$t('m.Last_Heartbeat')}}: {{item.last_heartbeat | localtime}}</p>
    <p>{{$t('m.Create_Time')}}: {{item.create_time | localtime}}</p>
  </div>
</template>
<script>
  export default {
    name: 'tableExpand',
    props: {
      item: {
        type: Object,
        default: () => {}
      }
    }
  }
</script>
<style lang="less" scoped>
  .tableExpand {
    font-size: 15px;
  }
</style>