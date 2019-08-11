// 更新用户信息接口
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return new Promise((resolve, reject) => {
    db.collection("user")
      .where({
        _openid: wxContext.OPENID
      })
      .update({
        data: event.info
      })
      .then(res => {
        resolve({ code: 0 })
      }).catch(res => {
        reject({ code: -1 })
      });
  })
}