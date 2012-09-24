template_page = require 'views/templates/page/project'
template_pane = require 'views/templates/pane'
template_pane_twitter = require 'views/templates/pane_twitter'
template_pane_github = require 'views/templates/pane_github'
template_rickshaw_graph = require 'views/templates/rickshaw_graph'
template_details = 
    mailman: require 'views/templates/details/mailman'
    person: require 'views/templates/details/person'
    github: require 'views/templates/details/github'

# Data api
api = require 'activityapi'

# Order of panes tries to be consistent
pane_order = [
    'Twitter'
    'People'
    'Github'
    'Description'
    'Mailman Subscribers'
    'Mailman Posts'
    'Mailman Lists'
    'Github: Watchers'
    'Github: Issues'
    'Github: Size'
    'Github: Forks'
]

# Project data
projects = require 'projects'
projectMap = {}
for project in projects
    projectMap[project.name] = project

module.exports = class ProjectPage extends Backbone.View

    renderPage: (target, projectName='ckan') =>
        @project = projectMap[projectName]
        @$el.html template_page { title: @project.title }
        target.html @$el
        @container = @$el.find('#project-container')
        @container.masonry
          itemSelector: '.pane'
          columnWidth: 380
        # Fly, my AJAX pretties!
        if @project.description
            @addPane 'Description', (pane)=> pane.html(@project.description)
        api.ajaxTwitter @project.twitter, (@resultTwitter) => 
            if @resultTwitter && @resultTwitter.ok
                @addPane 'Twitter', @renderPaneTwitter
        api.ajaxHistoryGithub @project.github, (@resultGithub) => 
            if @resultGithub && @resultGithub.ok
                if @project.headline_github
                    @addPane 'Github', @renderPaneGithub
                @addPane 'Github: Watchers', @renderPaneGithubGraph('watchers')
                @addPane 'Github: Size', @renderPaneGithubGraph('size')
                @addPane 'Github: Issues', @renderPaneGithubGraph('issues')
                @addPane 'Github: Forks', @renderPaneGithubGraph('forks')
        api.ajaxHistoryMailman @project.mailman, (@resultMailman) => 
            if @resultMailman && @resultMailman.ok
                @addPane 'Mailman Subscribers', @renderPaneMailmanGraph('subscribers')
                @addPane 'Mailman Posts', @renderPaneMailmanGraph('posts')
                @addPane 'Mailman Lists', @renderPaneMailmanLists
        api.ajaxDataPerson @project.people, (@resultPeople) => 
            if @resultPeople && @resultPeople.ok
                @addPane 'People', @renderPanePeople

    
    addPane: (title, renderCallback) =>
        if @container.width()==0
            # AJAX came too late. DOM was destroyed.
            return
        pane = $(template_pane {title:title})
        # Useful function
        getIndex = (domElement) -> 
            index = pane_order.indexOf title
            if index<0 then throw 'Bad configuration; not found: '+title
            return index
        # Insertion sort will try to maintain an ordering on added panes
        myIndex = getIndex pane
        for child in @container.children()
            if myIndex>=0 and myIndex<(getIndex child)
                pane.insertBefore $(child)
                break
        if not pane.parent().length
            @container.append pane
        # Initial render
        renderCallback(pane.find '.inner')
        pane.css {display:'none'}
        pane.fadeIn(500)
        @container.masonry 'reload'

    setPaneWidth: (pane, columns) =>
        # Resize the width of this pane to span multiple columns
        width = columns * 380 - 30
        parent = $( pane.parents('.pane')[0] )
        parent.css 'width', width


    ## Renderers
    ## ---------
    renderPaneGithubGraph: (action) =>
        return (pane) =>
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
            graph.render();


    renderPaneRepositories: (pane) =>
        for m in @project.github
            pane.append template_details.github @resultGithub.data[m].repo

    renderPanePeople: (pane) =>
        for m in @resultPeople.data.slice(0,3) or []
            pane.append template_details.person m

    renderPaneMailmanGraph: (action) =>
        return (pane) =>
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
            graph.render();

    renderPaneMailmanLists: (pane) =>
        for m in @project.mailman
            pane.append template_details.mailman @resultMailman.data[m].mailman

    renderPaneTwitter: (pane) =>
        pane.html template_pane_twitter @resultTwitter.account

    renderPaneGithub: (pane) =>
        x = @resultGithub.data[ @project.headline_github ]
        pane.html template_pane_github { 'repo':x.repo,'data':x.data[x.data.length-1] }

