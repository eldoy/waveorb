# TODO

https://github.com/eldoy/waveorb/issues

### Waveorb 1.0

REFACTOR

- [x] Use var instead of var and let
- [x] Remove use of arrow functions
- [x] Remove Jest, use spekk
- [x] Remove got, use fetch

BREAKING CHANGES

- [x] Rename functions in extras that crash with lodash
  - release across chain
  - isDate can be hybrid? Or does it work with string in lodash?
  - rename transform to convert

- [x] Remove all of the imports in index.js
  - neew to use var loader = require('waveorb/lib/loader.js')
  - include a global.Waveorb object that we return in exports
    - should include all functions from extras

- [ ] Clean up loader
  - refactor all the load functions
  - enable lazy conficurse load in production for faster startup
  - lazy load:
    - var tomarkup = require('tomarkup')
    - var brainmatter = require('brainmatter')
    - var skjema = require('skjema')
    - var lowcode = require('lavkode')

- [ ] Add tools to index
  - [x] include extras
  - [x] include lodash functions
  - [ ] move markdown from loader
  - [ ] add tools to global._ and global.Waveorb
    - [ ] lazy load tools with proxy

- [ ] Move validator.js into tools (_.validate)
  - $.validate throws
  - _.validate doesn't throw

- [ ] Remove sass and use postCSS instead for build
  - get from @waveorb

CLI

- [ ] waveorb update rename to upgrade
  - add warning when upgrading [Y/n]
- [ ] Add waveorb update command
  - updates front-end dependencies

TOOLS

- [x] MongoDB-lib called metaldb

- [ ] Front-end libs
  - [ ] dev.js
  - [ ] haka.js
  - [ ] waveorb-frontend
  - [ ] waveorb-client
    - remove taarn from it
  - [ ] waveorb-form
    - adapt existing repo to new form tags
    - https://vidar.eldoy.com/html6

- Isomorphic / SSR:
  - waveorb-ssr
  - contains the functions from front-end that we can use on the backend
    - esc
    - num
    - time
    - raw
  - if they are global in the front-end, they should be global on the backend, if not they go in _.


DISCUSSION:

- should we have _ on the front-end? and $? env? Some other stuff?