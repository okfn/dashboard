template = require 'views/templates/twitter'

module.exports = class TwitterView extends Backbone.View
  template: template
  renderData: ->

  render: (target) ->
    @$el.html @template @renderData
    target.html @$el
