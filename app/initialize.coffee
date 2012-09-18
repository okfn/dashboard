Router = require 'router'
LoadingView = require 'views/loading_view'

$ ->
  # Hack: Mustache is old news; Handlebars is built-in to this framework.
  @router = new Router()
  loadingView = new LoadingView()
  Backbone.history.start()
