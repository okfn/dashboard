template = require 'views/templates/page/mailman'

module.exports = class MailmanView extends Backbone.View
  template: template
  renderData: ->

  renderPage: (target) ->
    @$el.html @template @renderData
    target.html @$el
