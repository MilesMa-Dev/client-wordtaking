<template>
  <div class="container flex-row-center-start">
    <img class="bg-img" :src="bg_img" mode="widthFix"/>
    <div class="mask"></div>
    <div class="content flex-row-center-end">
      <textarea :value="result" class="label-result" maxlength="-1" type="text" />
      <!-- <i-input class="label-result" type="textarea" mode="wrapped" :value="result" placeholder="结果显示有误" /> -->
      <div class="btn-area flex-row-around-start">
        <i-button class="btn-clipboard" @click="handleClipboard" type="success" shape="circle" size="small">复制到剪贴板</i-button>
        <i-button open-type="share" class="btn-share" type="info" shape="circle" size="small">分享给好友</i-button>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/utils/config'
export default {
  data() {
    return {
      result: "",
      bg_img: ""
    };
  },

  components: {},

  onLoad(data) {
    this.bg_img = 'data:image/png;base64,' + data.imgdata;
    if (!data.result || data.result === "null") return;
    this.result = this.processResult(data.result);
  },

  methods: {
    processResult(result) {
      let str = '\n'
      result = JSON.parse(result);
      result.TextDetections.forEach(e => {
        str += e.DetectedText + '\n\n';
      });
      return str;
    },

    handleClipboard() {
      wx.setClipboardData({
        data: this.result,
        success: res => {
        }
      })
    },
  },

  onShareAppMessage(res) {
    return {
      imageUrl: config.share_path,
      title: config.share_title,
      path: '/pages/index/main'
    }
  }
};
</script>

<style scoped>
.container {
  width: 750rpx;
  height: 100%;
  flex-wrap: wrap;
}

.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.3;
}

.bg-img {
  width: 750rpx;
  position: fixed;
}

.content {
  position:absolute;
  width: 720rpx;
  flex-wrap: wrap;
  left: 15rpx;
  bottom: 100rpx;
}

.label-result {
  position: relative;
  width: 680rpx;
  padding-top: 20rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
  height: 500rpx;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  overflow-y: scroll;
  z-index: 1;
  background-color: white;
}

.btn-area {
  position: relative;
  width: 720rpx;
  height: 110rpx;
  border-bottom-left-radius: 20rpx;
  border-bottom-right-radius: 20rpx;
  background-color: #f8f8f9;
  z-index: 99;
}
</style>
