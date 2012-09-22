template_page = require 'views/templates/page/project'
template_pane = require 'views/templates/pane'
template_pane_twitter = require 'views/templates/pane_twitter'
template_pane_github = require 'views/templates/pane_github'
template_details = 
    mailman: require 'views/templates/details/mailman'
    person: require 'views/templates/details/person'
    github: require 'views/templates/details/github'

# Data api
api = require 'activityapi'

# Order of panes tries to be consistent
pane_order = [
    'Twitter',
    'People',
    'Github',
    'Description', 
    'Mailman Subscribers', 
    'Mailman Posts', 
    'Mailman Lists', 
    'Github: Watchers', 
    'Github: Issues', 
    'Github: Size', 
    'Github: Forks', 
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
                #@addPane 'Mailman Posts (NVD3)', @renderNvd3MailmanPosts
                #@addPane 'Mailman Posts (flotr2)', @renderFlotr2MailmanPosts
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

    renderPaneTwitter: (pane) =>
        pane.html template_pane_twitter @resultTwitter.account

    renderPaneGithub: (pane) =>
        x = @resultGithub.data[ @project.headline_github ]
        pane.html template_pane_github { 'repo':x.repo,'data':x.data[x.data.length-1] }

