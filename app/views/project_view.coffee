template = require 'views/templates/project'

module.exports = class ProjectView extends Backbone.View
  template: template
  renderData: ->

  render: (target) ->
    @$el.html @template @renderData
    target.append @$el
