<template>
  <div class="tableExpand">
    <p>
      <span>选项1</span>
      {{row.item1}}
    </p>
    <p>
      <span>选项2</span>
      {{row.item2}}
    </p>
    <p>
      <span>选项3</span>
      {{row.item3}}
    </p>
    <p>
      <span>选项4</span>
      {{row.item4}}
    </p>
  </div>
</template>
<script>
export default {
  name: 'TableChoice',
  props: {
    row: {
      row: {
        type: Object,
        default: () => {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
.tableExpand {
  font-size: 15px;
  p{
      margin-bottom: 10px;
      span{
          margin-right: 20px;
      }
  }
}
</style>
