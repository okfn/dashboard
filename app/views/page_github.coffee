template = require 'views/templates/page/github'
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

    ## Methods
    ## -------
     
    initialize: ->
        $.ajax
            url: @historyUrl
            dataType: 'jsonp'
            success: @gotHistory
        $.ajax
            url: @activityUrl
            dataType: 'jsonp'
            success: @gotActivity

    gotActivity: (@resultActivity) =>
        @renderActivity()

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
        @renderGraph()

    showGraph: (@graphMode) =>
        @renderGraph()

    renderActivity: =>
        # Redraw activity
        dom = @$el.find('.activity-stream')
        if not @resultActivity
            dom.spin()
            return
        dom.spin( false )
        dom.empty()
        for activity in @resultActivity.data
            dom.append activityView.render(activity)

    renderGraph: =>
        dom = @$el.find('#graphholder')
        # Easy way out
        if not @resultHistory
            @$el.find('h2 small').html 'Loading...'
            dom.spin()
            return
        # Update loading state
        dom.spin(false)
        subtitle = 'Tracking '+Object.keys(@resultHistory.data).length+' repositories'
        @$el.find('h2 small').html subtitle
        # Update internal nav
        @$el.find('.nav li').removeClass 'active'
        @$el.find('.nav li[action="'+@graphMode+'"]').addClass 'active'
        # Redraw graph
        domInner = dom.find '.graph'
        domInner.empty()
        if @graphData[@graphMode]
            filtered = []
            for data in @graphData[@graphMode]
                if _.contains @graphFilter[@graphMode], data.label
                    filtered.push data
            if domInner.width()>0
                $.plot domInner, filtered, { xaxis: { mode: "time" }, legend: { show: true, container: '#legendholder' }}

    renderPage: (target) =>
        renderData = ->
            activityUrl: @activityUrl
            historyUrl: @historyUrl
        @$el.html @template renderData
        target.html @$el
        @renderGraph()
        @renderActivity()

