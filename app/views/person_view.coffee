template = require 'views/templates/person'

module.exports = class PersonView extends Backbone.View
  template: template
  renderData: ->

  render: (target) ->
    @$el.html @template @renderData
    target.html @$el
