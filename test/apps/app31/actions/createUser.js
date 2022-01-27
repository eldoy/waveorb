module.exports = async function($) {
  await $.validate({
    values: {
      email: {
        unique: {
          in: 'user',
          with: ['site_id']
        }
      }
    }
  })
  return { hello: 'bye' }
}
