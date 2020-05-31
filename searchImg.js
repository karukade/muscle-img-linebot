const request = require('request')
const _  = require('lodash') 
const subscriptionKey = process.env.BING_SBSCRIPTION_KEY

function searchImage(q, howManyGet){
  let options = {
    method: 'GET',
    baseUrl: 'https://api.cognitive.microsoft.com',
    url: '/bing/v7.0/images/search',
    qs: {
      'q': q,
      'cc': 'JP',
    },
    headers: {
      'Accept-Language': 'ja,en',
      'Ocp-Apim-Subscription-Key': subscriptionKey
    },
    json: true
  }
  return req(options, howManyGet)
}

function req(options, howManyGet) {
  return new Promise(resolve => {
    request(options, (err, res, body) => {
      const images = body.value.map(item => item.contentUrl).filter(url => /^https/.test(url))
      const shuffled = _.shuffle(images).slice(0, howManyGet)
      console.log(shuffled)
      resolve(shuffled)
    })
  })
}
module.exports = searchImage