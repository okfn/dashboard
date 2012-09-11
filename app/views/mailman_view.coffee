template = require 'views/templates/mailman'

module.exports = class MailmanView extends Backbone.View
  template: template
  initialize: (@target) ->
  renderData: ->

  render: ->
    @$el.html @template @renderData
    @target.html @$el
