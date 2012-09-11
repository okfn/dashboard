template = require 'views/templates/home'

module.exports = class HomeView extends Backbone.View
  id: 'home'
  template: template
  initialize: (@target) ->

  renderData: ->

  render: ->
    @$el.html @template @renderData
    @target.html @$el
