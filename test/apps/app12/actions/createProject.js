/* createProject */
module.exports = async function($) {
  await $.filters(['authenticate', 'nested/logger'])
  return { hello: $.hello, logger: $.logger }
}
