template = require 'views/templates/project'

module.exports = class ProjectView extends Backbone.View
  template: template
  initialize: (@target) ->
  renderData: ->

  render: ->
    @$el.html @template @renderData
    @target.html @$el
