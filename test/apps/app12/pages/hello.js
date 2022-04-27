module.exports = async function($) {
  await $.setups(['authenticate', 'nested/logger'])
  return `${$.hello}#${$.logger}`
}
