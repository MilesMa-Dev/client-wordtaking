<template>
  <div class="container flex-row-center-start">
    <div class="user-box flex-row-between-start">
      <div class="user-box-head-box flex-row-start-center">
        <image :src="img_head" class="user-box-head-box-img" />
        <div class="user-name-box">
          <p>{{nick}}</p>
        </div>
      </div>
    </div>
    <div class="times">
      <p class="times-value">{{'可用次数 '+ times +'次'}}</p>
      <p class="times-tip">{{'（每日赠送'+ init_times +'次）'}}</p>
    </div>
    <i-button
      v-if="!is_login"
      open-type="getUserInfo"
      class="btn-userInfo"
      type="success"
      shape="circle"
      @getuserinfo="onUserInfo"
    >微信登录</i-button>
    <p class="statement">诚挚声明：本产品坚决不会保存用户所上传图片等隐私信息</p>
  </div>
</template>

<script>
import config from "@/utils/config";
import store from "@/utils/store";
export default {
  data() {
    return {
      init_times: 3,
      times: 0,
      img_head: "/static/images/head_default.png",
      nick: "未登录用户",
      is_login: false,
      openId: null
    };
  },

  components: {},

  onLoad(data) {
    this.openId = store.state.openId;
  },

  onShow() {
    this.updateUserAccount();
  },

  methods: {
    onUserInfo(e) {
      console.log(e);
      let userInfo = e.mp.detail.userInfo;
      if (userInfo) {
        this.img_head = userInfo.avatarUrl;
        this.nick = userInfo.nickName;
        this.is_login = true;
        wx.cloud.callFunction({
          name: "getOpenId",
          complete: res => {
            this.openId = res.result.openid;
            store.commit("setOpenId", this.openId);
            this.updateUserAccount();
          }
        });
      } else {
        console.log("拒绝授权");
      }
    },

    updateUserAccount() {
      const db = wx.cloud.database();
      const info = {
        times: this.init_times,
        nick: this.nick,
        avatarUrl: this.img_head
      };

      db
        .collection("user")
        .where({
          _openid: this.openId
        })
        .get()
        .then(res => {
          if (res.data.length === 0) {
            db
              .collection("user")
              .add({
                data: info
              })
              .then(res => {
                this.updateUserAccount();
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            console.log("data", res);
            store.commit("setUserInfo", res.data[0]);
            this.times = res.data[0].times;
          }
        });
    }
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
  flex-wrap: wrap;
}

.times {
  position: absolute;
  top: 260rpx;
  width: 710rpx;
  height: 134rpx;
  background-color: white;
  border-radius: 20rpx;
}

.times > p {
  display: inline;
  position: absolute;
  color: #80848f;
}

.times-value {
  top: 40rpx;
  text-align: center;
  left: 0rpx;
  right: 0;
}

.times-tip {
  font-size: 22rpx;
  text-align: center;
  left: 0;
  right: 0;
  bottom: 0;
}

.user-box {
  width: 100%;
  height: 330rpx;
  background-color: #19be6b;
}

.user-box-head-box {
  width: 450rpx;
  height: 143rpx;
  margin-left: 22rpx;
  margin-top: 56rpx;
}

.user-box-head-box-img {
  width: 143rpx;
  height: 143rpx;
  border-radius: 72rpx;
}

.user-name-box {
  margin-left: 40rpx;
  color: white;
}

.btn-userInfo {
  position: absolute;
  bottom: 120rpx;
  width: 700rpx;
}

.statement {
  position: absolute;
  font-size: 22rpx;
  color: #80848f;
  bottom: 70rpx;
}
</style>
