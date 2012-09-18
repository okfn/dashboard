ProjectView = require 'views/project_view'
template = require 'views/templates/project_page'

# Project data
projectJson = require 'projects'
projectMap = {}
for category in projectJson
    for project in category.projects
        projectMap[project.name] = project

module.exports = class ProjectPage extends Backbone.View
    active: null
    project: => projectMap[@active]

    ## Methods
    ## -------
    showProject: (@active) ->
        p = @project()
        # Fix up that DOM
        inner = @$el.find('#project-container')
        if @view
            @view.removeFromDom()
        if p
            @view = new ProjectView(p)
            inner.append @view.$el

    renderPage: (target) ->
        renderData = 
            projectJson: projectJson
            subtitle: 'Tracking '+Object.keys(projectMap).length+' projects'
        @$el.html template renderData
        target.html @$el
        # On full-render, scroll the nav-bar
        nav = @$el.find('.nav')
        active = nav.find('.active')
        if active.length
            nav.scrollTop active.position().top
            nav.scrollTop( active.index() * 26 - 50 )
