// 云函数入口文件
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
        data: {
          is_logged: true
        }
      })
      .then(res => {
        resolve({ success: true })
      }).catch(res => {
        reject({ fail: true })
      });
  })
}