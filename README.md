# client-wordtaking

> 基于Mpvue的简易文字识别OCR微信小程序

## Build Setup

``` bash
# 初始化项目
vue init mpvue/mpvue-quickstart myproject
cd myproject

# 安装依赖
npm install

# 填写信息
project.config.json：填入自己申请的小程序appid
cloudfunctions/ocr/index.js：填入腾讯云后台的secretId和secretKey（获取方式见下方腾讯云识别api）

# 开发时构建
npm dev

# 打包构建
npm build

## 技术栈
客户端：微信小程序、[Mpvue](http://mpvue.com/)
UI框架：[iView Weapp](https://weapp.iviewui.com/docs/guide/start)
服务端：[小程序云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
OCR：[腾讯云文字识别api](https://cloud.tencent.com/document/product/866/33519)

## 功能实现
- [x] 微信授权
- [x] 接入腾讯云文字识别api
- [x] 从相册选取照片进行文字识别
- [x] 从微信聊天选取图片进行文字识别
- [x] 文字识别结果展示
- [x] 服务器存储可用识别次数
- [x] 每日恢复可用识别次数

## 功能缺陷
腾讯云文字识别api存在图片大小3M的限制。即使项目中尝试使用了小程序提供的图片压缩接口，对于现在大多数手机拍摄照片来说这个大小也是难以满足需求的。由于对OCR这一块没有深入了解过，不知道大家有没有合适的解决方案？

## 项目展示
微信搜索“取字器”
![image](https://github.com/SujeDeveloper/client-wordtaking/blob/master/static/images/qrcode.jpg)





