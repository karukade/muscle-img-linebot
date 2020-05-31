const request = require('request')
const subscriptionKey = process.env.BING_SBSCRIPTION_KEY
const searchImg = require('./searchImg')

function getFace(image){
  let options = {
    method: 'POST',
    baseUrl: 'https://japaneast.api.cognitive.microsoft.com',
    url: '/face/v1.0/detect',
    qs: {
      returnFaceAttributes: 'smile,emotion'
    },
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey
    },
    body: {
      'url': image
    },
    json: true
  }
  return req(options, image)
}

function req(options, image) {
  return new Promise(resolve => {
    request(options, (err, res, body) => {
      const result = body[0]
      const happiness = result && result.faceAttributes ? result.faceAttributes.emotion.happiness : false 
      resolve(happiness ? {url: image, happiness} : null)
    })
  })
}

function wait(msec) {
  return new Promise(resolve => {
    setTimeout(resolve, msec)
  })
}

async function sortByHappiness(images) {
  const results = []
  let count = 0
  for (const img of images) {
    ++count
    if (count % 10 === 0) await wait(1000)
    const result = await getFace(img)
    if (!result) continue
    results.push(result)
  }
  return results.sort((a, b) => b.happiness - a.happiness)
}

async function main(q) {
  const images = await searchImg(q, 10)
  const sorted = await sortByHappiness(images)
  return sorted
}


module.exports = main