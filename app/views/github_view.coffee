template = require 'views/templates/github'

module.exports = class GithubView extends Backbone.View
  template: template
  renderData: ->

  render: (target) ->
    @$el.html @template @renderData
    target.append @$el
