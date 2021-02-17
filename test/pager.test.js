const pager = require('../lib/pager.js')
const loader = require('../lib/loader.js')

describe('pager', () => {
  afterEach(() => {
    delete process.env.WAVEORB_APP
  })

  it('should find a page without routemap', async () => {
    process.env.WAVEORB_APP = 'test/apps/app18'
    const app = await loader()
    const $ = { app }

    let page = pager('about', $)
    expect(page).toBeDefined()

    page = pager('index', $)
    expect(page).toBeDefined()

    page = pager('notfound', $)
    expect(page).toBeUndefined()

    page = pager('no/index', $)
    expect(page).toBeUndefined()

    page = pager('no/om-oss', $)
    expect(page).toBeUndefined()
  })

  it('should find a page with routemap', async () => {
    process.env.WAVEORB_APP = 'test/apps/app17'
    const app = await loader()
    const $ = { app }

    let page = pager('about', $)
    expect(page).toBeDefined()

    page = pager('index', $)
    expect(page).toBeDefined()

    page = pager('notfound', $)
    expect(page).toBeUndefined()

    page = pager('no/index', $)
    expect(page).toBeDefined()

    page = pager('no/om-oss', $)
    expect(page).toBeDefined()
  })
})