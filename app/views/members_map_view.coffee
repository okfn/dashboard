template = require './templates/members_map'

module.exports = class MembersMapView extends Backbone.View
  id: 'members-map'

  template: template

  renderData: ->

  gotMembers: (membersData) ->
    reclineElement = $ '.data-explorer-here'
    fields = [
      {id: 'id'}
      {id: 'name'}
      {id: 'location'}
      {id: 'website'}
      {id: 'twitter'}
      {id: 'description'}
      {id: 'spatial', type: 'object'}
    ]
    dataset = new recline.Model.Dataset
      records: membersData
      fields: fields

    dataset.fetch()
    dataset.queryState.set({size: 900}, {silent: true});
    views = [
      {
        id: 'grid'
        label: 'Grid'
        view: new recline.View.SlickGrid
          model: dataset
      }
    ]
    window.dataExplorer = new recline.View.MultiView
      el: reclineElement
      model: dataset
      views: views
      sidebarViews: []
      state: 
        currentView: 'grid'

  render: (target) ->
    @$el.html @template @renderData
    target.append @$el

    membersUrl = 'data/members.geojson.json';
    $.getJSON(membersUrl,null,@gotMembers);
