module.exports = async function($) {
  await $.validate({
    values: {
      email: {
        unique: 'user'
      }
    }
  })
  return { hello: 'bye' }
}
