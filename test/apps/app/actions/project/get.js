module.exports = async function($) {
  await $.filters(['setup'])
  return { hello: 'project/get' }
}