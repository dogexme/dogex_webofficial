import { oversellStyle } from '@/views/SwardpoolBeta/tools'

// 等于流动性/当前余额 ，比如注入了流动性 a ,则 a/当前池子余额a
// 如果超过50%显示提醒色，红色，低于50%大于30%则为黄色，低于30%为绿色
// 然后提示，当超过100%时提示已经超卖，无法撤出

test('out超过50%显示提醒色，红色', () => {
  expect(oversellStyle(0.5)).toStrictEqual(oversellStyle.red)
  expect(oversellStyle(1)).toStrictEqual(oversellStyle.red)
  expect(oversellStyle(1.2)).toStrictEqual(oversellStyle.red)
})

test('out低于50%大于30%则为黄色', () => {
  expect(oversellStyle(0.3)).toStrictEqual(oversellStyle.yellow)
  expect(oversellStyle(0.49)).toStrictEqual(oversellStyle.yellow)
})

test('out低于30%为绿色', () => {
  expect(oversellStyle(0.29)).toStrictEqual(oversellStyle.green)
  expect(oversellStyle(0.2)).toStrictEqual(oversellStyle.green)
})
