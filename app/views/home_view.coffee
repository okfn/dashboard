template = require 'views/templates/home'

module.exports = class HomeView extends Backbone.View
  id: 'home'
  template: template

  renderData: ->

  render: (target) ->
    @$el.html @template @renderData
    target.append @$el
