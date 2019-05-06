<template>
  <panel>
    <div slot="title">{{$t('m.Frequently_Asked_Questions')}}</div>
    <div class="content markdown-body">
      <ul>
         使用说明
         <li>1.登录和注册
         <p>如果用户已有账号直接登录,没有账号的分为以下两种情况进行注册
         如果系统开放注册入口，用户可点击右上角的注册按钮进行注册并登录
         如果系统没有开发注册入口，用户需联系管理员获取登录的账号和密码</p>
         </li>
         <li>
         2.公告说明
         <p>用户在使用本系统时，需要认真阅读公告内容，防止误操作</p>
         </li>
         <li>
         3.练习模块说明
         <p>用户可以在练习模块中练习程序设计题，选择题和填空题，其中程序设计题有两种类型，OI类型的题目提交后，会参与用户的提交排名，而ACM类型不会参与用户的提交排名。
         选择题和填空题不参与用户的提交排名,并在练习过程中，可实时查看答案</p></li>
        <li>4.上机实验说明
          <p>学生需要老师提供的密码进入学生需要进行实验的实验内容，并在规定时间内完成作答</p>
          <p>如果实验内容有选择和填空题，请作答完每一部分再进行其它部分作答，中途离开不保存作答成绩</p>
        </li>
        <li>5.判题说明
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
