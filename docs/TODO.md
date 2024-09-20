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
- [x] Remove all of the imports in index.js
- [x] Clean up loader
- [x] Add tools to index
- [x] Move validator.js into tools (_.validate)
- [x] Remove sass and use postCSS instead for build

- [ ] Move all config to waveorb.json or index file?
  - bundle
  - markdown
  - env
  - lang
  - routes
  - sitemap

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