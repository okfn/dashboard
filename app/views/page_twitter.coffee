template = require 'views/templates/page/twitter'

module.exports = class TwitterView extends Backbone.View
  template: template
  renderData: ->

  renderPage: (target) ->
    @$el.html @template @renderData
    target.html @$el
