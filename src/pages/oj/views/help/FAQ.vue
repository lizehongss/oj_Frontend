<template>
  <panel>
    <div slot="title">{{$t('m.Frequently_Asked_Questions')}}</div>
    <div class="content markdown-body">
      <ul>
        <li>问题列表说明
          <p>问题主要用来给学生练习使用，暂时未开放选择和填空题</p>
        </li>
        <li>上机实验说明
          <p>学生需要老师提供的密码进入学生需要进行实验的实验内容，并在规定时间内完成作答</p>
          <p>如果实验内容有选择和填空题，请作答完每一部分再进行其它部分作答，中途离开不保存作答成绩</p>
        </li>
        <li>判题说明
          <p>学生可在提交状态中，查询自己的答题状态</p>
        </li>
      </ul>
    </div>
  </panel>
</template>

<script>
</script>

<style lang="less" scoped>
  .content {
    font-size: 16px;
    margin: 0 50px 40px 50px;
    > ul {
      list-style: disc;
      li {
        font-size: 16px;
        margin-top: 20px;
        &:first-child {
          margin-top: 0;
        }
        p {
          font-size: 14px;
          margin-top: 5px;
        }
      }
    }
  }
</style>
