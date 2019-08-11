// 更新用户每日首次登录状态
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    db.collection('user').update({
      data: {
        is_logged: false
      }
    }).then(res => {
      resolve({ success: true })
    })
  })
}