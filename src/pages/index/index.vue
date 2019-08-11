<template>
  <div class="container flex-row-center-center">
    <div class="btn-area flex-row-center-center">
      <img
        class="camera"
        src="../../../static/images/main_btn.jpg"
        @click="clickHandle"
        @longpress="longPress"
      />
      <p class="tips-1">长按可选择聊天图片</p>
    </div>
    <p class="tips-2">上传图片大小存在限制，推荐使用手机或电脑截图进行识别</p>
    <div class="dialog-bg" v-if="dialog_pop" @click="onDialogClick">
      <div class="dialog popIn">
        <div class="dialog-title">每日登录</div>
        <div class="dialog-content">恭喜您获得1次免费次数，立即分享给好友可额外获得免费次数x4</div>
        <button class="dialog-btn" @click="onDialogClose">放弃x1</button>
        <button class="dialog-btn" open-type="share" @click="onDialogShare">分享x5</button>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/utils/config";
import store from "@/utils/store";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      times: 0,
      id: "",
      dialog_pop: false
    };
  },

  components: {},

  methods: {
    // 长按识别聊天图片
    longPress(ev) {
      const db = wx.cloud.database();
      db
        .collection("user")
        .where({
          _openid: store.state.openId
        })
        .get()
        .then(res => {
          store.commit("setUserInfo", res.data[0]);
          this.times = res.data[0].times;
          this.id = res.data[0]._id;
          if (!this.times || this.times <= 0) {
            wx.showToast({
              title: "次数已用尽",
              icon: "none"
            });
            return;
          } else {
            wx.chooseMessageFile({
              count: 1,
              type: "image",
              success: res => {
                wx.showLoading({
                  title: "正在解析图片",
                  mask: true
                });
                if (res.tempFiles[0].size >= 1000000) {
                  console.log("图片过大，正在压缩");
                  wx.compressImage({
                    src: res.tempFiles[0].path,
                    quality: 30,
                    success: res => {
                      this.readFile(res.tempFilePath);
                    },
                    fail: res => {
                      wx.hideLoading();
                      console.log("压缩失败");
                      wx.showToast({
                        title: "图片读取失败",
                        icon: "none"
                      });
                    }
                  });
                } else {
                  this.readFile(res.tempFiles[0].path);
                }
              }
            });
          }
        });
    },

    // 点击识别相册图片
    clickHandle(ev) {
      const db = wx.cloud.database();
      db
        .collection("user")
        .where({
          _openid: store.state.openId
        })
        .get()
        .then(res => {
          store.commit("setUserInfo", res.data[0]);
          this.times = res.data[0].times;
          this.id = res.data[0]._id;
          if (!this.times || this.times <= 0) {
            wx.showToast({
              title: "次数已用尽",
              icon: "none"
            });
            return;
          } else {
            wx.chooseImage({
              count: 1,
              sizeType: ["compressed"],
              success: res => {
                wx.showLoading({
                  title: "正在解析图片",
                  mask: true
                });
                if (res.tempFiles[0].size >= 1000000) {
                  console.log("图片过大，正在压缩");
                  wx.compressImage({
                    src: res.tempFilePaths[0],
                    quality: 30,
                    success: res => {
                      this.readFile(res.tempFilePath);
                    },
                    fail: res => {
                      wx.hideLoading();
                      wx.showToast({
                        title: "图片读取失败",
                        icon: "none"
                      });
                    }
                  });
                } else {
                  this.readFile(res.tempFilePaths[0]);
                }
              }
            });
          }
        });
    },

    readFile(path) {
      wx.getFileSystemManager().readFile({
        filePath: path, //选择图片返回的相对路径
        encoding: "base64", //编码格式
        success: res => {
          //成功的回调
          this.requestApi(res.data);
        },
        fail: res => {
          wx.hideLoading();
          wx.showToast({
            title: "图片读取失败",
            icon: "none"
          });
        }
      });
    },

    // 请求腾讯云api
    requestApi(base64data) {
      const db = wx.cloud.database();
      const _ = db.command;

      wx.cloud.callFunction({
        name: "ocr",
        data: {
          base64: base64data
        },
        success: function(res) {
          wx.hideLoading();
          wx.navigateTo({
            url: `/pages/result/main?result=${res.result}&imgdata=${base64data}`
          });
        },
        fail: res => {
          wx.hideLoading();
          wx.showToast({
            title: "图片尺寸过大",
            icon: "none"
          });
        }
      });
    },

    onDialogClose() {
      this.dialog_pop = false;
    },

    onDialogShare() {
      this.onDialogClose();
      wx.cloud.callFunction({
        name: "shareReward",
        success: res => {
          console.log("获取分享奖励");
        }
      });
    }
  },

  onLoad() {
    wx.showLoading({
      mask: true
    });
    const db = wx.cloud.database();

    wx.cloud.callFunction({
      name: "getOpenId",
      success: res => {
        store.commit("setOpenId", res.result.openid);
        db
          .collection("user")
          .where({
            _openid: store.state.openId
          })
          .get()
          .then(res => {
            wx.hideLoading();
            console.log(res);
            const logged = () => {
              if (res.data.length === 0 || !res.data[0].is_logged) {
                // 当天首次登录
                console.log("首次登录");
                wx.cloud.callFunction({
                  name: "dailyReward",
                  data: {
                    is_new_user: res.data.length === 0
                  },
                  success: res => {
                    if (res.result.code === 0 && res.result.review === false) {
                      this.dialog_pop = true;
                    }
                    store.commit("setIsReview", res.result.review);
                    console.log("获取每日奖励", res);
                  }
                });
                wx.cloud.callFunction({
                  name: "updateUser",
                  data: {
                    info: {
                      is_logged: true
                    }
                  },
                  success: res => {
                    console.log(res);
                    store.commit("setUserInfo", { is_logged: true });
                  },
                  fail: res => {
                    console.log(res);
                  }
                });
              }
            };

            if (res.data.length !== 0) {
              store.commit("setUserInfo", res.data[0]);
              logged();
            } else {
              if (res.data.length === 0) {
                db
                  .collection("user")
                  .add({
                    data: {
                      times: 0
                    }
                  })
                  .then(res => {
                    logged();
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            }
          });
      }
    });
  },

  onShareAppMessage(res) {
    return {
      imageUrl: config.share_path,
      title: config.share_title,
      path: "/pages/index/main"
    };
  }
};
</script>

<style scoped>
.container {
  width: 750rpx;
  height: 100%;
  background-color: white;
  flex-wrap: wrap;
}

.btn-area {
  height: 420rpx;
  flex-wrap: wrap;
}

.camera {
  width: 398rpx;
  height: 364rpx;
}

.tips-1 {
  width: 750rpx;
  text-align: center;
  font-size: 22rpx;
  color: #80848f;
}

.tips-2 {
  position: absolute;
  font-size: 22rpx;
  color: #80848f;
  bottom: 70rpx;
}

.dialog-bg {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog {
  position: absolute;
  top: 0rpx;
  bottom: 0rpx;
  left: 0rpx;
  right: 0rpx;
  margin: auto;
  width: 670rpx;
  height: 460rpx;
  background-color: white;
  border-radius: 16rpx;

  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
}

.dialog-title {
  width: 100%;
  height: 95rpx;
  font-size: 42rpx;
  line-height: 95rpx;
  text-align: center;
  border-bottom: 1rpx solid #d5d5d5;
}

.dialog-content {
  padding-bottom: 30rpx;
  width: 581rpx;
  height: 156rpx;
  color: #747474;
  font-size: 34rpx;
  text-align: center;
}

.dialog-btn {
  width: 256rpx;
  height: 78rpx;
  background-color: #ab70ed;
  font-size: 36rpx;
  color: #fff;
  font-weight: 400rpx;
  text-align: center;
  line-height: 78rpx;
  border-radius: 39rpx;
}
</style>
