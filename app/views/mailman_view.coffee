template = require 'views/templates/mailman'

module.exports = class MailmanView extends Backbone.View
  template: template
  renderData: ->

  render: (target) ->
    @$el.html @template @renderData
    target.html @$el
