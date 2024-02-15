const { loader, dispatch } = require('../index.js')

async function main() {
  const app = await loader({ path: 'test/apps/app33' })
  console.log(app.pages.home.toString())
}

main()
