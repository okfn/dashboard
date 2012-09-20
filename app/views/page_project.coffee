ProjectView = require 'views/project_view'
template = require 'views/templates/page/project'

# Project data
projects = require 'projects'
projectMap = {}
for project in projects
    projectMap[project.name] = project

module.exports = class ProjectPage extends Backbone.View
    showProject: (projectName) =>
        inner = @$el.find('#project-container')
        inner.empty()
        title = 'Select a project...'
        if projectName
            view = new ProjectView(inner, projectMap[projectName])
            title = projectMap[projectName].title
        @$el.find('h1 .subtitle').html title


    renderPage: (target) =>
        @$el.html template()
        target.html @$el
        # On full-render, scroll the nav-bar
        nav = @$el.find('.nav')
        navActive = nav.find('.active')
        if navActive.length
            nav.scrollTop navActive.position().top
            nav.scrollTop( navActive.index() * 26 - 50 )
