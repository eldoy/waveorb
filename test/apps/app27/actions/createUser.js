module.exports = async function($) {
  await $.validate({
    values: {
      email: {
        unique: {
          model: 'user'
        }
      }
    }
  })
  return { hello: 'bye' }
}
