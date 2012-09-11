template = require 'views/templates/twitter'

module.exports = class TwitterView extends Backbone.View
  template: template
  initialize: (@target) ->
  renderData: ->

  render: ->
    @$el.html @template @renderData
    @target.html @$el
