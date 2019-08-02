<template>
  <div class="container flex-row-center-center">
    <div class="btn-area flex-row-center-center">
      <img class="camera" src="../../../static/images/main_btn.jpg" @click="clickHandle" @longpress='longPress' />
      <p class="tips-1">长按可选择聊天图片</p>
    </div>
    <p class="tips-2">上传图片大小存在限制，推荐使用手机或电脑截图进行识别</p>
  </div>
</template>

<script>
import config from "@/utils/config";
import store from "@/utils/store";
import { setTimeout } from 'timers';

export default {
  data() {
    return {
      times: 0,
      id: ""
    };
  },

  components: {},

  methods: {
    longPress(ev) {
            // 要求用户登录
      if (!store.state.openId || store.state.openId === "") {
        wx.showToast({
          title: "请先登录",
          icon: "none"
        });
        setTimeout(() => {
          wx.switchTab({
            url: "/pages/mine/main"
          });
        }, 800)

        return;
      }

      const db = wx.cloud.database();
      db.collection("user")
        .where({
          _openid: store.state.openId
        })
        .get()
        .then(res => {
          store.commit("setUserInfo", res.data[0]);
          console.log(res.data[0])
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
              type: 'image',
              success: res => {
                wx.showLoading({
                  title: "正在解析图片",
                  mask: true
                });
                if (res.tempFiles[0].size >= 1000000) {
                  console.log("图片过大，正在压缩")
                  wx.compressImage({
                    src: res.tempFiles[0].path,
                    quality: 30,
                    success: res => {
                      this.readFile(res.tempFilePath);
                    },
                    fail: res => {
                      wx.hideLoading();
                      console.log("压缩失败", res);
                      wx.showToast({
                        title: "图片读取失败",
                        icon: "none"
                      });
                    }
                  })
                }else {
                  this.readFile(res.tempFiles[0].path);
                }
              }
            })
          }
        });

    },

    clickHandle(ev) {
      // 要求用户登录
      if (!store.state.openId || store.state.openId === "") {
        wx.showToast({
          title: "请先登录",
          icon: "none"
        });
        setTimeout(() => {
          wx.switchTab({
            url: "/pages/mine/main"
          });
        }, 800)

        return;
      }

      const db = wx.cloud.database();
      db.collection("user")
        .where({
          _openid: store.state.openId
        })
        .get()
        .then(res => {
          store.commit("setUserInfo", res.data[0]);
          console.log(res.data[0])
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
                  console.log("图片过大，正在压缩")
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
                  })
                }else {
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
          // console.log(res.data);
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

    requestApi(base64data) {
      const db = wx.cloud.database();
      const _ = db.command;

      wx.cloud.callFunction({
        name: 'ocr',
        data: {
          base64: base64data
        },
        success: function(res) {
          console.log(res)
          wx.hideLoading();
          wx.navigateTo({
            url: `/pages/result/main?result=${res.result}&imgdata=${base64data}`
          });
        },
        fail: res => {
          wx.hideLoading();
          console.log(res)
          wx.showToast({
            title: "图片尺寸过大",
            icon: 'none'
          })
        }
      })
    }
  },

  onShow() {},

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
</style>
