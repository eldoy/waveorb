* [ ] Env and config
  - Need a sure-fire way to read env and load config
  - revert to merge technique from before?
  - new internal apis:
    - env.set, env.get
    - config.set, config.get
    - version.set, version.get
- [ ] Add an env file to extras:
  extras.env('waveorb', 'production)
  that will read waveorb.yml,json,js if it exists
  and deep merge with waveorb.production.yml,json,js if it exists
  use that in waveorb-server and in waveorb/config, and possibly also in conficurse
  take the code from config.js current


config is used in:
  - scripts/deploy
  - scripts/ping
  - scripts/sitemap
  - scripts/update
  - waveorb-server/deploy
  - waveorb-server/remove

// read env on waveorb-server
read('.env') || process.env.NODE_ENV

// read env on waveorb-server
read('.env') || process.env.NODE_ENV


