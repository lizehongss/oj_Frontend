<template>
  <Card :body-style="{padding: 0, height: '100%'}" class="info-card">
    <Row type="flex" class="info-card-container">
      <Col :span="8" :style="{'background-color': color}" class="height-100">
        <!-- <i :class="['ivu-icon', icon]" :size="iconSize"></i> -->
        <Icon :type="icon" :size="iconSize"></Icon>
      </Col>
      <Col :span="16" class="info-card-text">
        <p :style="textStyle">{{value}}</p>
        <p style="font-weight: 300;">{{message}}</p>
      </Col>
    </Row>
  </Card>
</template>

<script>
  export default {
    name: 'inforCard',
    props: {
      value: [String, Number],
      color: String,
      message: String,
      icon: String,
      iconSize: {
        type: String,
        default: '60'
      },
      countSize: {
        type: String,
        default: '25px'
      },
      countWeight: {
        type: Number,
        default: 700
      }
    },
    computed: {
      textStyle () {
        return {
          'font-size': this.countSize,
          'font-weight': this.countWeight,
          color: this.color
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @card-height: 90px;
  .height-100 {
    height: 100%;
  }

  .info-card {
    display: inline-block;
    margin-right: 10px;
    width: 250px;
    height: @card-height;
    text-align: center;
    vertical-align: middle;

    &-container {
      height: 100%;
      align-items: center;
      justify-content: center;
    }
    &-icon {
      line-height: @card-height;
      color: white;
    }
    &-text {
      p {
        margin: 0;
        .minor-text {
          font-weight: 300;
          margin-top: 2px;
          font-size: 20px;
        }
      }
    }
  }
</style>
