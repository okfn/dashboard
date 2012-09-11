Router = require 'router'

$ ->
  # Hack: Mustache is old news; Handlebars is built-in to this framework.
  @router = new Router()
  Backbone.history.start()
