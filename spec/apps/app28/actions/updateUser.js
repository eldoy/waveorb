module.exports = async function($) {
  await $.validate({
    query: {
      id: {
        required: true,
        is: 'id'
      }
    },
    values: {
      email: {
        is: 'email',
        unique: 'user'
      }
    }
  })
  return { hello: 'bye' }
}
