'use strict';

require('dotenv').config()
const express = require('express')
const line = require('@line/bot-sdk')
const PORT = process.env.PORT || 3000
const searchImg = require('./searchImg')
const Fukkin = require('./Fukkin')

const config = {
    channelSecret: process.env.LINEBOT_CHANNEL_SECRET,
    channelAccessToken: process.env.LINEBOT_ACCESS_TOKEN
}

const app = express()

const countReply = [
  'どんどんいこ！',
  'いいね！',
  'いいペース!',
  'どんどんいこ！',
  '半分きたよー',
  '割れてきた！',
  'six pad!',
  '駆け抜けろ！',
  'ラスト！',
  'おつ!'
]

app.post('/webhook', line.middleware(config), async (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
})

const client = new line.Client(config);
let fukkin;

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const message = event.message.text
  const replyToken = event.replyToken
  const userId = event.source.userId

  if (/.+でふっきん$/.test(message)) {
    await pushMsg(userId, 'OK準備するね！')
    const q = message.replace(/(.+)でふっきん$/, '$1')
    const images = await searchImg(q, 10)
    await wait(3000)
    await pushMsg(userId, '腹筋スタート!')
    await wait(1000)
    fukkin = new Fukkin(10, async count => {
      const img = images.pop()
      await pushMsg(userId, `${count}!`)
      await pushMsg(userId, countReply[count - 1])
      console.log(img)
      await client.pushMessage(userId, {
        type: 'image',
        originalContentUrl: img,
        previewImageUrl: img
      })
    }, async count => {
      // await pushMsg(userId, `おつ！`)
    })
    return Promise.resolve()
  }

  if (message === "ギブ！") {
    fukkin.stop()
    fukkin = null
    return reply(replyToken, '根性なしが！')
  }

  if (message !== 'ふっきん') return reply(replyToken, '腹筋しようよ〜')

  await pushMsg(userId, '待ってました！')
  return reply(replyToken, '誰に応援してもらう？')
}

async function replyImg(userId, images) {
  for (const img of images) {
    await client.pushMessage(userId, {
      type: 'image',
      originalContentUrl: img,
      previewImageUrl: img
    }).catch(e => {
      console.log(e.originalError.response.data)
    })
  }
}

function reply(replyToken, message) {
  return client.replyMessage(replyToken, {
    type: 'text',
    text: message
  })
}

async function replyTaigigo(userId, message) {
  const taigigo = await getTaigigo(message)
  pushMsg(userId, taigigo)
}

function pushMsg(userId, message) {
  return client.pushMessage(userId, {
    type: 'text',
    text: message,
  })
}

function wait(msec) {
  return new Promise(resolve => {
    setTimeout(resolve, msec)
  })
}

//Error handling
app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})
app.listen(PORT);
console.log(`Server running at ${PORT}`);