template = 
    pane: 
        mailman: require 'views/templates/pane/mailman'
        person: require 'views/templates/pane/people'
        github: require 'views/templates/pane/github'
        project: require 'views/templates/pane/project'
    details: 
        mailman: require 'views/templates/details/mailman'
        person: require 'views/templates/details/person'
        github: require 'views/templates/details/github'

# Data api
api = require 'activityapi'

module.exports = class ProjectView extends Backbone.View

    initialize: (parent, @project) =>
        parent.append @$el
        @$el.masonry
          itemSelector: '.pane'
          columnWidth: 380
        # Fly, my AJAX pretties!
        if @project.description
            @addPane template.pane.project, (pane)=> pane.find('.inner').html(@project.description)
        api.ajaxHistoryGithub @project.github, (@resultGithub) => 
            if @resultGithub && @resultGithub.ok
                @addPane template.pane.github, @renderPaneGithub
        api.ajaxHistoryMailman @project.mailman, (@resultMailman) => 
            if @resultMailman && @resultMailman.ok
                @addPane template.pane.mailman, @renderPaneMailman
        api.ajaxDataPerson @project.people, (@resultPeople) => 
            if @resultPeople && @resultPeople.ok
                @addPane template.pane.person, @renderPanePeople
    
    addPane: (template, renderCallback) =>
        if @$el.parent().length == 0
            # No longer in DOM? Sorry AJAX, you were too slow
            return
        pane = $(template())
        # Useful function
        getIndex = (domElement) -> 
            label = $($(domElement).find('label')[0]).text()
            index = ['Description', 'Mailing Lists', 'Github', 'People'].indexOf label
            return if index==-1 then 999 else index
        # Insertion sort will try to maintain an ordering on added panes
        myIndex = getIndex pane
        for child in @$el.children()
            if myIndex>=0 and myIndex<(getIndex child)
                pane.insertBefore $(child)
                break
        if not pane.parent().length
            @$el.append pane
        # Bind to DOM 
        clickNav = (e) =>
            li = $($(e.currentTarget).parents('li')[0])
            action = li.attr('action')
            renderCallback(pane,action)
            e.preventDefault()
            dropdown = li.parents('.dropdown')
            dropdown.click()
            return false;
        pane.find('.nav li').not('.dropdown').find('a').on('click',clickNav)
        # Initial render
        renderCallback(pane)
        pane.css {display:'none'}
        pane.fadeIn(500)
        if @$el.width()>0
            @$el.masonry 'reload'


    ## Renderers
    ## ---------
    renderPage: (target) ->
        renderData = 
            projectJson: projectJson
            subtitle: 'Tracking '+Object.keys(projectMap).length+' projects'
        @$el.html template.page renderData
        target.html @$el
        # On full-render, scroll the nav-bar
        nav = @$el.find('.nav')
        active = nav.find('.active')
        if active.length
            nav.scrollTop active.position().top
            nav.scrollTop( active.index() * 26 - 50 )

    renderPaneGithub: (pane,action="watchers") =>
        pane_inner = pane.find '.inner'
        pane_inner.empty()
        # Update nav
        pane.find('.nav li').removeClass 'active'
        active = pane.find('.nav li[action="'+action+'"]')
        active.addClass 'active'
        active.parents('li.dropdown').addClass 'active'
        # Render elements
        if action=='watchers' or action=='issues' or action=='forks' or action=='size'
            plotData = []
            color = 0
            for reponame,repodata of @resultGithub.data
                plotData.push 
                    label: reponame
                    data: ([new Date(d.timestamp),d[action]] for d in repodata.data)
                    color: (++color) % 30
            domElement = $('<div/>').css({height:180,'margin-top':10}).appendTo(pane_inner)
            if domElement.width()>0
                $.plot domElement, plotData, { xaxis: { mode: "time" } }
        else if action=='activity'
            pane_inner.html '<code>TODO</code> AJAX load Activity'
        else if action=='details'
            for m in @project().github
                pane_inner.append template.details.github @resultGithub.data[m].repo
        else 
            pane_inner.html '<code>Bad pathway</code>'

    renderPanePeople: (pane,action="details") =>
        pane_inner = pane.find '.inner'
        pane_inner.empty()
        pane.find('.nav li').removeClass 'active'
        pane.find('.nav li[action="'+action+'"]').addClass 'active'
        if action=='details'
            for m in @resultPeople.data or []
                pane_inner.append template.details.person m
        else if action=='activity'
            pane_inner.html '<code>TODO</code> AJAX load Activity'

    renderPaneMailman: (pane,action="posts") =>
        pane_inner = pane.find '.inner'
        pane_inner.empty()
        pane.find('.nav li').removeClass 'active'
        pane.find('.nav li[action="'+action+'"]').addClass 'active'
        if action=='posts' or action=='subscribers'
            plotData = []
            color = 0
            for listName, listData of @resultMailman.data
                color = (color+1) % 30
                series = ([ new Date(d.timestamp), d[action] ] for d in listData.data)
                plotData.push 
                    label: listData.mailman.name
                    data: series
                    color: color
            domElement = $('<div/>').css({height:180,'margin-top':10}).appendTo(pane_inner)
            if domElement.width()>0
                $.plot domElement, plotData, { xaxis: { mode: "time" } }
        else if action=='details'
            for m in @project().mailman
                pane_inner.append template.details.mailman @resultMailman.data[m].mailman
        else 
            pane_inner.html '<code>TODO</code> ajax grab activity'

