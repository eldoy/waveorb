* [x] Remove middleware
* [x] Remove plugins
* [x] Hooks
  - init
  - before request
  - after request
  - error
* [x] Remove redirect
* [x] Remove web socket support
* [x] Remove default functions
* [x] Re-add middleware
* [x] Re-add plugins
* [x] Generate routes from pages

* [ ] Set validations, allow and deny before actions

* [-] Replace sirloin with Furu
  - [x] Lang ($.lang)
  - [ ] Load routes, run pages and actions
    - Write more tests for reqroutes to make sure pages matches (tests commented out in reqlang.test.js)
    - Write a pager that received a req.route, app.pages and looks up the page
    - Use the same for action lookup

  - [ ] Remove markup, actions, pager
* Fix page redirect
  - should also work for actions?
  - should probably throw and abort