template = require 'views/templates/github'
activityView = require 'views/activity_view'

module.exports = class GithubView extends Backbone.View
  template: template
  activityUrl: 'http://activityapi.herokuapp.com/api/1/activity/github'
  historyUrl: 'http://activityapi.herokuapp.com/api/1/history/github?grain=week&per_page=20'
  #historyUrl: '/data/github.json'
  # Graph data for four graphs
  graphData:
    'watchers' : []
    'issues' : []
    'forks' : []
    'size' : []
  # Custom filtered list of repo names for each graph
  graphFilter:
    'watchers' : []
    'issues' : []
    'forks' : []
    'size' : []
  # Updates dynamically; affects rendering
  renderData: ->
    activityUrl: @activityUrl
    historyUrl: @historyUrl
    subtitle: if @resultHistory then ('Tracking '+Object.keys(@resultHistory.data).length+' repositories') else 'Loading...'

  ## Methods
  ## -------
   
  initialize: (@target) ->
    $.ajax
      url: @historyUrl
      dataType: 'jsonp'
      success: @gotHistory
    $.ajax
      url: @activityUrl
      dataType: 'jsonp'
      success: @gotActivity

  gotActivity: (@resultActivity) =>
    @render()

  gotHistory: (@resultHistory) =>
    color = 0
    type = ['watchers','issues','forks','size']
    # Process the data into a bunch of timeseries
    for reponame,repodata of @resultHistory.data
        color = (color+1) % 30
        series = 
            'watchers' : []
            'issues' : []
            'forks' : []
            'size' : []
        _.each repodata.data, (d) =>
            for graphType,graphSeries of series
              graphSeries.push [ new Date(d['timestamp']), d[graphType] ]
        for graphType, graphSeries of series
            @graphData[graphType].push { label: reponame, data: graphSeries, color: color}
        # Create filtered name lists to decide who shows up on which graph
        if series['watchers'][0][1] > 50 
          @graphFilter['watchers'].push reponame 
        if series['forks'][0][1] > 5
          @graphFilter['forks'].push reponame 
        if series['issues'][0][1] > 1
          @graphFilter['issues'].push reponame 
        if 1000 < series['size'][0][1] < 10000 
          @graphFilter['size'].push reponame 
    @render()

  render: =>
    @$el.html @template @renderData()
    @target.html @$el
    # Update internal nav
    @$el.find('.nav li').removeClass 'active'
    @$el.find('.nav li[action="'+@graphMode+'"]').addClass 'active'
    # Redraw graph
    dom = @$el.find('.graph')
    dom.empty()
    if @graphData[@graphMode]
      filtered = []
      for data in @graphData[@graphMode]
        if _.contains @graphFilter[@graphMode], data.label
          filtered.push data
      $.plot dom, filtered, { xaxis: { mode: "time" }, legend: { show: true, container: '#legendholder' }}
    @$el.find('#graphholder').spin( !@resultHistory )
    # Redraw activity
    dom = @$el.find('.activity-stream')
    if @resultActivity
      for activity in @resultActivity.data
        dom.append activityView.render(activity)
      dom.spin( false )
    else 
      dom.spin()

