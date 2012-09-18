ProjectView = require 'views/project_view'
template = require 'views/templates/page/project'

# Project data
projectJson = require 'projects'
projectMap = {}
for category in projectJson
    for project in category.projects
        projectMap[project.name] = project

module.exports = class ProjectPage extends Backbone.View
    showProject: (projectName) ->
        # Fix up that DOM
        inner = @$el.find('#project-container')
        if @view
            @view.removeFromDom()
        if projectName
            @view = new ProjectView(projectMap[projectName])
            inner.append @view.$el

    renderPage: (target) ->
        renderData = 
            projectJson: projectJson
            subtitle: 'Tracking '+Object.keys(projectMap).length+' projects'
        @$el.html template renderData
        target.html @$el
        # On full-render, scroll the nav-bar
        nav = @$el.find('.nav')
        navActive = nav.find('.active')
        if navActive.length
            nav.scrollTop navActive.position().top
            nav.scrollTop( navActive.index() * 26 - 50 )
