template_page = require 'views/templates/page/project'
template_pane = require 'views/templates/pane'
template_details = 
    mailman: require 'views/templates/details/mailman'
    person: require 'views/templates/details/person'
    github: require 'views/templates/details/github'

# Data api
api = require 'activityapi'

# Order of panes tries to be consistent
pane_order = [
    'Mailman Posts (NVD3)', 
    'Mailman Posts (flotr2)', 
    'Description', 
    'Mailman Subscribers', 
    'Mailman Posts', 
    'Mailman Lists', 
    'Github: Watchers', 
    'Github: Issues', 
    'Github: Size', 
    'Github: Forks', 
    'People']

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
        api.ajaxHistoryGithub @project.github, (@resultGithub) => 
            if @resultGithub && @resultGithub.ok
                @addPane 'Github: Watchers', @renderPaneGithubGraph('watchers')
                @addPane 'Github: Size', @renderPaneGithubGraph('size')
                @addPane 'Github: Issues', @renderPaneGithubGraph('issues')
                @addPane 'Github: Forks', @renderPaneGithubGraph('forks')
        api.ajaxHistoryMailman @project.mailman, (@resultMailman) => 
            if @resultMailman && @resultMailman.ok
                @addPane 'Mailman Subscribers', @renderPaneMailmanGraph('subscribers')
                @addPane 'Mailman Posts', @renderPaneMailmanGraph('posts')
                @addPane 'Mailman Lists', @renderPaneMailmanLists
                #@addPane 'Mailman Posts (NVD3)', @renderNvd3MailmanPosts
                @addPane 'Mailman Posts (flotr2)', @renderFlotr2MailmanPosts
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

    ## Renderers
    ## ---------
    renderPaneGithubGraph: (action) =>
        return (pane) =>
            plotData = []
            color = 0
            for reponame,repodata of @resultGithub.data
                plotData.push 
                    label: reponame
                    data: ([new Date(d.timestamp),d[action]] for d in repodata.data)
                    color: (++color) % 30
            domElement = $('<div/>').css({height:180}).appendTo(pane)
            $.plot domElement, plotData, { xaxis: { mode: "time" } }

    renderPaneRepositories: (pane) =>
        for m in @project.github
            pane.append template_details.github @resultGithub.data[m].repo

    renderPanePeople: (pane) =>
        for m in @resultPeople.data.slice(0,3) or []
            pane.append template_details.person m

    renderPaneMailmanGraph: (action) =>
        return (pane) =>
            plotData = []
            color = 0
            for listName, listData of @resultMailman.data
                color = (color+1) % 30
                series = ([ new Date(d.timestamp), d[action] ] for d in listData.data)
                plotData.push 
                    label: listData.mailman.name
                    data: series
                    color: color
            domElement = $('<div/>').css({height:180}).appendTo(pane)
            $.plot domElement, plotData, { xaxis: { mode: "time" } }

    renderPaneMailmanLists: (pane) =>
        for m in @project.mailman
            pane.append template_details.mailman @resultMailman.data[m].mailman

    renderNvd3MailmanPosts: (pane) =>
        test_data = stream_layers(3,128,.1).map( (data, i)->{ key: 'Stream' + i, values: data })
        console.log test_data
        console.log @resultMailman
        pane.append('<div id="nvd3-demo" style="height: 200px;"><svg></svg></div>')

        postGraph = []
        seriesId = 0
        for key, value of @resultMailman.data
            series = { key: key, values: [] }
            postGraph.push series
            $.each value.data, (x, data) =>
                series.values.push 
                    series: seriesId
                    x: x
                    y: data.posts
            seriesId += 1

        nv.addGraph =>
            #chart = nv.models.multiBarChart()
            chart = nv.models.stackedArea()
            chart.width 350
            chart.height 200
            #chart.xAxis.tickFormat(d3.format(',f'))
            #chart.yAxis.tickFormat(d3.format(',i'))
            d3.select('#nvd3-demo svg')
              .datum(postGraph) 
              .transition().duration(100).call(chart)
            return chart



    renderFlotr2MailmanPosts: (pane) =>
        pane.append $('<div id="editor-render-0"/>').css({height:200})
        container = $('#editor-render-0')[0]
        console.log container
        d1    = []
        start = new Date("2009/01/01 01:00").getTime()
        options = null
        graph = null
        i = null
        o = null
        x = null

        for i in [0...100]
            x = start+(i*1000*3600*24*36.5)
            d1.push [x, i+Math.random()*30+Math.sin(i/20+Math.random()*2)*20+Math.sin(i/10+Math.random())*10]
              
        options = 
            xaxis : 
                mode : 'time'
                labelsAngle : 45
            selection : 
                mode : 'x'
            HtmlText : false
            title : 'Time'
              
        # Draw graph with default options, overwriting with passed options
        drawGraph = (opts) => 
            # Clone the options, so the 'options' variable always keeps intact.
            o = Flotr._.extend Flotr._.clone(options), (opts or {})
            # Return a new graph.
            return Flotr.draw container, [ { data: d1, lines: {fill:true}} ], o

        graph = drawGraph()
              
        Flotr.EventAdapter.observe container, 'flotr:select', (area) => 
            # Draw selected area
            graph = drawGraph {
                xaxis : { min : area.x1, max : area.x2, mode : 'time', labelsAngle : 45 }
                yaxis : { min : area.y1, max : area.y2 }
            }
              
        # When graph is clicked, draw the graph with default area.
        callback = => graph = drawGraph()
        Flotr.EventAdapter.observe container, 'flotr:click', callback
