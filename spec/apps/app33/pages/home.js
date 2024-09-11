module.exports = async function ($) {
  var products = [{ name: 'Hoover' }, { name: 'Socks' }, { name: 'Janitor' }]
  return /* HTML */ `
    <h3>Listing products</h3>
    <ul>
      <li map="product of products">${product.name}</li>
    </ul>
  `
}
