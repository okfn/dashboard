template_page = require 'views/templates/page_project'
template_pane = require 'views/templates/pane'
template_pane_mailchimp = require 'views/templates/pane_mailchimp'
template_pane_mailman = require 'views/templates/pane_mailman'
template_pane_twitter = require 'views/templates/pane_twitter'
template_pane_github = require 'views/templates/pane_github'
template_pane_facebook = require 'views/templates/pane_facebook'
template_rickshaw_graph = require 'views/templates/rickshaw_graph'

# Data api
api = require 'activityapi'


# Project data
projects = require 'projects'
projectMap = {}
for projectCategory in projects
    if 'item' of projectCategory
        projectMap[projectCategory.item.name] = projectCategory.item
        projectCategory.item.bigTitle = projectCategory.item.title
        projectCategory.item.smallTitle = ''
    else if 'items' of projectCategory
        for project in projectCategory.items
            projectMap[project.name] = project
            projectMap[project.name].bigTitle = projectCategory.header
            projectMap[project.name].smallTitle = projectMap[project.name].title
    else
        console.log projectCategory
        throw 'No item or items in here'

module.exports = class ProjectPage extends Backbone.View

    renderPage: (target, projectName='ckan') =>
        @project = projectMap[projectName]
        @$el.html template_page @project
        target.html @$el
        @container = @$el.find('#project-container')
        # Fly, my AJAX pretties!
        api.ajaxHistoryTwitter @project.twitter, (@resultTwitter) => 
            if @resultTwitter && @resultTwitter.ok
                # API serves descending order data
                for key, twitter of @resultTwitter.data
                    twitter.data.reverse()
                @addPane 'Twitter', @renderPaneTwitter
        api.ajaxHistoryGithub @project.github, (@resultGithub) => 
            if @resultGithub && @resultGithub.ok
                # API serves descending order data
                for key,repo of @resultGithub.data
                    repo.data.reverse()
                if @project.headline_github
                    @addPane 'Github', @renderPaneGithub
        api.ajaxHistoryMailman @project.mailman, (@resultMailman) => 
            if @resultMailman && @resultMailman.ok
                # API serves descending order data
                for key,mailman of @resultMailman.data
                    mailman.data.reverse()
                @addPane 'Mailman', @renderPaneMailman
        api.ajaxHistoryMailchimp @project.mailchimp, (@resultMailchimp) => 
            if @resultMailchimp && @resultMailchimp.ok
                # API serves descending order data
                for key,value of @resultMailchimp.data
                    value.data.reverse()
                @addPane 'Mailchimp', @renderPaneMailchimp
        api.ajaxHistoryFacebook @project.facebook, (@resultFacebook) => 
            if @resultFacebook && @resultFacebook.ok
                @resultFacebook.data.history.reverse()
                @addPane 'Facebook', @renderPaneFacebook

    
    addPane: (title, renderCallback) =>
        td = @container.find('#project-container-'+title)
        if td.length==0
            throw 'Could not find a DOM element for pane "'+title+'"'
        pane = $(template_pane {title:title}).appendTo td
        # Initial render
        renderCallback(pane.find '.inner')
        pane.css {display:'none'}
        pane.fadeIn(500)

    setPaneWidth: (pane, columns) =>
        # Resize the width of this pane to span multiple columns
        width = columns * 380 - 30
        parent = $( pane.parents('.pane')[0] )
        parent.css 'width', width


    ## Renderers
    ## ---------
    renderPaneBuddypressHistory: (pane) =>
        series = [
            name: 'Members'
            color: 'blue'
            data: (
                { x : new Date(d.timestamp).toUnixTimestamp(), y : d.num_users } for d in @resultBuddypress.data
            )
        ]
        # Build DOM using Rickshaw graphing library
        domGraph = $(template_rickshaw_graph()).appendTo pane
        graph = new Rickshaw.Graph {
                element: domGraph.find('.chart')[0]
                renderer: 'line'
                width: domGraph.width() - 50
                height: 180
                series: series
        }
        time = new Rickshaw.Fixtures.Time()
        x_axis = new Rickshaw.Graph.Axis.Time 
            graph: graph
            timeUnit: time.unit('month')
        y_axis = new Rickshaw.Graph.Axis.Y 
            graph: graph
            orientation: 'left'
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT
            element: domGraph.find('.y-axis')[0]
        hoverDetail = new Rickshaw.Graph.HoverDetail
              graph: graph
        graph.render()


    renderPaneGithub: (pane) =>
        x = @resultGithub.data[ @project.headline_github ]
        pane.append template_pane_github { 'repo':x.repo,'data':x.data[x.data.length-1] }
        for action in ['watchers','issues','forks']
            $('<h4>History: '+action+'</h4>').appendTo pane
            series = []
            palette = new Rickshaw.Color.Palette {scheme:'colorwheel'}
            for reponame,repodata of @resultGithub.data
                data = (
                    { x : new Date(d.timestamp).toUnixTimestamp(), y : d[action] } for d in repodata.data
                )
                series.push 
                    name: reponame
                    color: palette.color()
                    data: data
            # Ensure all series are the same length
            series.sort (x,y)->y.data.length-x.data.length
            for x in [1...series.length]
                while series[x].data.length<series[0].data.length
                    # Pad it with 0s, cloning the x axis values from the longer series
                    series[x].data.unshift {x:series[0].data[series[0].data.length-series[x].data.length-1].x,y:0}
            # Build DOM using Rickshaw graphing library
            domGraph = $(template_rickshaw_graph()).appendTo pane
            data = series[0].data
            graph = new Rickshaw.Graph {
                    element: domGraph.find('.chart')[0]
                    renderer: 'line'
                    width: domGraph.width() - 50
                    height: 180
                    series: series
            }
            time = new Rickshaw.Fixtures.Time()
            x_axis = new Rickshaw.Graph.Axis.Time 
                graph: graph
                timeUnit: time.unit('month')
            y_axis = new Rickshaw.Graph.Axis.Y 
                graph: graph
                orientation: 'left'
                tickFormat: Rickshaw.Fixtures.Number.formatKMBT
                element: domGraph.find('.y-axis')[0]
            hoverDetail = new Rickshaw.Graph.HoverDetail
                graph: graph
            graph.render()




    renderPaneMailman: (pane) =>
        # Header: Broad statistics
        for m in @project.mailman
            pane.append template_pane_mailman @resultMailman.data[m].mailman
        for action in ['subscribers','posts']
            series = []
            palette = new Rickshaw.Color.Palette {scheme:'colorwheel'}
            for listName, listData of @resultMailman.data
                data = (
                    { x : new Date(d.timestamp).toUnixTimestamp(), y : d[action] } for d in listData.data
                )
                series.push 
                    name: listData.mailman.name
                    color: palette.color()
                    data: data
            # Ensure all series are the same length
            series.sort (x,y)->y.data.length-x.data.length
            for x in [1...series.length]
                while series[x].data.length<series[0].data.length
                    # Pad it with 0s, cloning the x axis values from the longer series
                    series[x].data.unshift {x:series[0].data[series[0].data.length-series[x].data.length-1].x,y:0}
            # Build DOM using Rickshaw graphing library
            $('<h4>History: '+action+'</h4>').appendTo pane
            domGraph = $(template_rickshaw_graph()).appendTo pane
            data = series[0].data
            graph = new Rickshaw.Graph {
                    element: domGraph.find('.chart')[0]
                    renderer: 'bar'
                    width: domGraph.width() - 50
                    height: 180
                    series: series
            }
            x_axis = new Rickshaw.Graph.Axis.Time { graph: graph } 
            y_axis = new Rickshaw.Graph.Axis.Y {
              graph: graph
              orientation: 'left'
              tickFormat: Rickshaw.Fixtures.Number.formatKMBT
              element: domGraph.find('.y-axis')[0]
            }
            hoverDetail = new Rickshaw.Graph.HoverDetail {
              graph: graph
            }
            graph.render()


    renderPaneMailchimp: (pane) =>
        # Header: Broad statistics
        for m in @project.mailchimp
            pane.append template_pane_mailchimp @resultMailchimp.data[m]
        series = []
        palette = new Rickshaw.Color.Palette {scheme:'colorwheel'}
        for listName, listData of @resultMailchimp.data
            data = (
                { x : new Date(d.timestamp).toUnixTimestamp(), y : d['members'] } for d in listData.data
            )
            series.push 
                name: listData.name
                color: palette.color()
                data: data
        # Build DOM using Rickshaw graphing library
        domGraph = $(template_rickshaw_graph()).appendTo pane
        data = series[0].data
        graph = new Rickshaw.Graph {
                element: domGraph.find('.chart')[0]
                renderer: 'line'
                width: domGraph.width() - 50
                height: 180
                series: series
        }
        x_axis = new Rickshaw.Graph.Axis.Time { graph: graph } 
        y_axis = new Rickshaw.Graph.Axis.Y {
          graph: graph
          orientation: 'left'
          tickFormat: Rickshaw.Fixtures.Number.formatKMBT
          element: domGraph.find('.y-axis')[0]
        }
        hoverDetail = new Rickshaw.Graph.HoverDetail {
          graph: graph
        }
        graph.render()


    renderPaneFacebook: (pane) =>
        pane.append template_pane_facebook @resultFacebook.data
        fbdata = @resultFacebook.data.history
        series = [
            {
                name: 'Likes'
                color: 'blue'
                data: (
                    { x : new Date(d.timestamp).toUnixTimestamp(), y : d.likes } for d in fbdata
                )
            }
        ]
        # Build DOM using Rickshaw graphing library
        domGraph = $(template_rickshaw_graph()).appendTo pane
        graph = new Rickshaw.Graph {
                element: domGraph.find('.chart')[0]
                renderer: 'line'
                width: domGraph.width() - 50
                height: 180
                series: series
        }
        time = new Rickshaw.Fixtures.Time()
        x_axis = new Rickshaw.Graph.Axis.Time 
            graph: graph
            timeUnit: time.unit('month')
        y_axis = new Rickshaw.Graph.Axis.Y 
            graph: graph
            orientation: 'left'
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT
            element: domGraph.find('.y-axis')[0]
        hoverDetail = new Rickshaw.Graph.HoverDetail
              graph: graph
        graph.render()

    renderPaneTwitter: (pane) =>
        pane.append template_pane_twitter @resultTwitter.data[@project.twitter].account
        twitterdata = @resultTwitter.data[@project.twitter].data
        series = [
            {
                name: 'Followers'
                color: 'orange'
                data: (
                    { x : new Date(d.timestamp).toUnixTimestamp(), y : d.followers } for d in twitterdata
                )
            }
            {
                name: 'Tweets'
                color: 'green'
                data: (
                    { x : new Date(d.timestamp).toUnixTimestamp(), y : d.tweets } for d in twitterdata
                )
            }
            {
                name: 'Following'
                color: 'red'
                data: (
                    { x : new Date(d.timestamp).toUnixTimestamp(), y : d.following } for d in twitterdata
                )
            }
        ]
        # Build DOM using Rickshaw graphing library
        domGraph = $(template_rickshaw_graph()).appendTo pane
        graph = new Rickshaw.Graph {
                element: domGraph.find('.chart')[0]
                renderer: 'line'
                width: domGraph.width() - 50
                height: 180
                series: series
        }
        time = new Rickshaw.Fixtures.Time()
        x_axis = new Rickshaw.Graph.Axis.Time 
            graph: graph
            timeUnit: time.unit('month')
        y_axis = new Rickshaw.Graph.Axis.Y 
            graph: graph
            orientation: 'left'
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT
            element: domGraph.find('.y-axis')[0]
        hoverDetail = new Rickshaw.Graph.HoverDetail
              graph: graph
        graph.render()

