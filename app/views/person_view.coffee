template = require 'views/templates/person'

module.exports = class PersonView extends Backbone.View
  template: template
  initialize: (@target) ->
  renderData: ->

  render: ->
    @$el.html @template @renderData
    @target.html @$el
