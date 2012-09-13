template = 
    page: require 'views/templates/project'
    inner: require 'views/templates/project_inner'
    pane: 
        mailman_details: require 'views/templates/mailman_details'
        person_details: require 'views/templates/person_details'
        github_details: require 'views/templates/github_details'

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
        @resultGithub = null
        @graphGithub = null
        @resultMailman = null
        @graphMailman = null
        # Download new data
        ajax_github = api.url+'/history/github'
        ajax_mailman = api.url+'/history/mailman'
        ajax_people = api.url+'/data/person?per_page='+p.people.length+'&login='
        comma = false
        for person in p.people
            if comma
                ajax_people+=','
            comma = true
            ajax_people += person

        $.ajax
            url: ajax_github
            dataType: 'jsonp'
            success: @gotPaneGithub
        $.ajax
            url: ajax_mailman
            dataType: 'jsonp'
            success: @gotPaneMailman
        $.ajax
            url: ajax_people
            dataType: 'jsonp'
            success: @gotPanePeople
        p.mailman_url = ajax_mailman
        # Update the DOM
        @renderInner()

    ## Data Receive Hooks
    ## ------------------
    gotPanePeople: (@resultPeople) =>
        @renderPanePeople()

    gotPaneGithub: (@resultGithub) =>
        @graphGithub = 
            'watchers':[]
            'forks':[]
            'issues':[]
            'size':[]
        color = 0
        for name in @project().github
            color = (color+1) % 30
            series = {} 
            for k,v of @graphGithub
                series[k] = []
            for d in @resultGithub.data[name].data
                for k,v of series
                    v.push [ new Date(d.timestamp), d[k] ]
            for k,v of series
                @graphGithub[k].push { label: name, data: v, color: color }
        @renderPaneGithub()

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

    clickNavGithub: (e) =>
        action = $($(e.currentTarget).parents('li')[0]).attr('action')
        @renderPaneGithub(action)
        e.preventDefault()
        return false;

    clickNavPeople: (e) =>
        action = $($(e.currentTarget).parents('li')[0]).attr('action')
        @renderPanePeople(action)
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
            nav.scrollTop( active.index() * 26 - 50 )

    renderInner: =>
        @$el.find('.nav li').removeClass 'active'
        @$el.find('.nav li[action="'+@active+'"]').addClass 'active'
        renderData = 
            active: @active
            project: @project()
        @$el.find('.active-project-pane').html template.inner(renderData)
        # Bind to nav
        @$el.find('#mailman-nav a').on('click',@clickNavMailman)
        @$el.find('#github-nav li').not('.dropdown').find('a').on('click',@clickNavGithub)
        @$el.find('#people-nav a').on('click',@clickNavPeople)
        # Subrender
        @renderPaneGithub()
        @renderPaneMailman()
        @renderPanePeople()

    renderPaneGithub: (action="watchers") =>
        # Update nav
        @$el.find('#github-nav li').removeClass 'active'
        @$el.find('#github-nav li[action="'+action+'"]').addClass 'active'
        # Render inner
        dom = @$el.find '#pane-github'
        dom.empty()
        # Easy way out
        if not @resultGithub
            dom.spin()
            return
        # Update loading state
        dom.spin(false)
        if action=='watchers' or action=='issues' or action=='forks' or action=='size'
            graph = $('<div/>').css({height:180,'margin-top':10}).appendTo(dom)
            $.plot graph, @graphGithub[action], { xaxis: { mode: "time" } }
        else if action=='activity'
            dom.html '<code>TODO</code> AJAX load Activity'
        else if action=='details'
            for m in @project().github
                dom.append template.pane.github_details @resultGithub.data[m].repo
        else 
            dom.html '<code>Bad pathway</code>'


    renderPanePeople: (action="details") =>
        # Update nav
        @$el.find('#people-nav li').removeClass 'active'
        @$el.find('#people-nav li[action="'+action+'"]').addClass 'active'
        # Render inner
        dom = @$el.find '#pane-people'
        dom.empty()
        # Easy way out
        if not @resultPeople
            dom.spin()
            return
        # Update loading state
        dom.spin(false)
        if action=='details'
            for m in @resultPeople.data or []
                dom.append template.pane.person_details m
        else if action=='activity'
            dom.html '<code>TODO</code> AJAX load Activity'

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
        if action=='posts' or action=='subscribers'
            graph = $('<div/>').css({height:180,'margin-top':10}).appendTo(dom)
            $.plot graph, @graphMailman[action], { xaxis: { mode: "time" } }
        else if action=='details'
            for m in @project().mailman
                dom.append template.pane.mailman_details @resultMailman.data[m].mailman
        else 
            dom.html '<code>TODO</code> ajax grab activity'

