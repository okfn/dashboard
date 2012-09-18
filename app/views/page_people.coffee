template = require 'views/templates/page/people'

module.exports = class PersonView extends Backbone.View
  template: template
  renderData: ->

  renderPage: (target) ->
    @$el.html @template @renderData
    target.html @$el
