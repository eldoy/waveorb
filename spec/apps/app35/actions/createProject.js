module.exports = async function ($) {
  await $.validate(['userCreate', 'userProject'])
  return { hello: 'bye' }
}
