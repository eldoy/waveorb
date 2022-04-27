module.exports = async function($) {
  await $.setups(['authenticate', 'nested/logger'])
  return { hello: $.hello, logger: $.logger }
}
