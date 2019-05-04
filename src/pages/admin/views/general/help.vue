<template>
  <panel>
    <div slot="title">操作说明</div>
    <div class="content markdown-body">
      <ul>
        <li>用户导入
            <p>用户导入仅支持csv格式导入，如果出现中文乱码，请用记事本将文件字符改为utf-8</p>
            <p>csv 导入格式如下：</p>
            <p>姓名 学号 年级 专业班级 密码</p>
            <p>管理员用户和外校用户可通过超级管理员开放注册入口，提供详细信息</p>
        </li>
        <li>测试用例上传说明
            <p>对于题目，测试用例文件包括in和out两种拓展名，每个测试用例的文件名须由数字开头，例如有两组测试用例，文件名分别为1.in, 1.out, 2.in, 2.out，其他形式的文件后台均不识别。
压缩时，应该将文件放在压缩包的根目录，而不是包含在某一个文件夹中，应该避免压缩包中有隐藏文件。格式如下:</p>
<p>
-example1</p>
 <p>-1.in</p>
 <p>-1.out</p>
        </li>
        <li>管理员权限说明
            <p>超级管理员可查看所有管理员创建的上机实验或比赛</p>
            <p>普通管理员仅可查看自己创建的上机实验或比赛，方便区分不同年级老师用户</p>
            <p>管理员可通过设置进入上机实验或比赛的密码，用以阻止不同专业班级进入实验</p>
            <p>管理员可通过登录系统前台，进入自己创建的上机实验或比赛查看学生成绩</p>
        </li>
        <li>选择填空上传说明
            <p>选择和填空模板较复杂，请联系超级管理员提供</p>
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
