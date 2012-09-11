MembersMapView = require 'views/members_map_view'

module.exports = class Router extends Backbone.Router
  routes:
    '': 'membersmap'
    'membersmap': 'membersmap'

  target: ->
    $('#content')

  membersmap: ->
    @target().empty()
    view = new MembersMapView()
    view.render @target()
