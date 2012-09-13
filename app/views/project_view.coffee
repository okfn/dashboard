template = 
    page: require 'views/templates/project'
    inner: require 'views/templates/project_inner'
    pane: 
        mailman_details: require 'views/templates/mailman_details'

# Data api
api = require 'activityapi'

# Project data
projectJson = require 'projects'
projectMap = {}
for category in projectJson
    for project in category.projects
        projectMap[project.name] = project

module.exports = class ProjectView extends Backbone.View
    active: null
    project: => projectMap[@active]

    ## Methods
    ## -------
    showProject: (@active) ->
        p = @project()
        # Trash cached data
        @resultMailman = null
        @graphMailman = null
        # Download new data
        ajax_mailman = api.url+'/history/mailman?per_page=30&list='
        comma = false
        for l in p.mailman
            if comma
                ajax_mailman += ','
            comma = true
            ajax_mailman += l
        $.ajax
            url: ajax_mailman
            dataType: 'jsonp'
            success: @gotPaneMailman
        p.mailman_url = ajax_mailman
        # Update the DOM
        @renderInner()

    ## Data Receive Hooks
    ## ------------------
    gotPaneMailman: (@resultMailman) =>
        @graphMailman = 
            'posts':[]
            'subscribers':[]
        color = 0
        for name in @project().mailman
            color = (color+1) % 30
            series = {} 
            for k,v of @graphMailman
                series[k] = []
            for d in @resultMailman.data[name].data
                for k,v of series
                    v.push [ new Date(d.timestamp), d[k] ]
            for k,v of series
                @graphMailman[k].push { label: name, data: v, color: color }
        @renderPaneMailman()

    clickNavMailman: (e) =>
        action = $($(e.currentTarget).parents('li')[0]).attr('action')
        @renderPaneMailman(action)
        e.preventDefault()
        return false;

    ## Renderers
    ## ---------
    #
    render: (target) ->
        renderData = 
            projectJson: projectJson
            subtitle: 'Tracking '+Object.keys(projectMap).length+' projects'
        @$el.html template.page renderData
        target.html @$el
        @renderInner()
        # On full-render, scroll the nav-bar
        nav = @$el.find('.nav')
        active = nav.find('.active')
        if active.length
            nav.scrollTop active.position().top
            nav.scrollTop( active.index() * 26 - 10 )

    renderInner: =>
        @$el.find('.nav li').removeClass 'active'
        @$el.find('.nav li[action="'+@active+'"]').addClass 'active'
        renderData = 
            active: @active
            project: @project()
        @$el.find('.active-project-pane').html template.inner(renderData)
        # Bind to nav
        @$el.find('#mailman-nav a').on('click',@clickNavMailman)
        @renderPaneMailman()

    renderPaneMailman: (action="posts") =>
        # Update nav
        @$el.find('#mailman-nav li').removeClass 'active'
        @$el.find('#mailman-nav li[action="'+action+'"]').addClass 'active'
        # Render inner
        dom = @$el.find '#pane-mailman'
        dom.empty()
        # Easy way out
        if not @resultMailman
            dom.spin()
            return
        # Update loading state
        dom.spin(false)
        if action=='posts'
            graph = $('<div/>').css({height:'220'}).appendTo(dom)
            $.plot graph, @graphMailman['posts'], { xaxis: { mode: "time" } }
        else if action=='subscribers'
            graph = $('<div/>').css({height:'220'}).appendTo(dom)
            $.plot graph, @graphMailman['subscribers'], { xaxis: { mode: "time" } }
        else if action=='details'
            for m in @project().mailman
                dom.append template.pane.mailman_details @resultMailman.data[m].mailman
        else 
            dom.html '<code>TODO</code> ajax grab activity'





