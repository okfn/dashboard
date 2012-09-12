template = require 'views/templates/project'
templateInner = require 'views/templates/project_inner'

# Project data
projectJson = require 'projects'
projectMap = {}
for category in projectJson
    for project in category.projects
        projectMap[project.name] = project

module.exports = class ProjectView extends Backbone.View
    template: template
    active: null

    ## Methods
    ## -------
    showProject: (@active) ->
        # Trash cached data
        # Download new data
        # Update the DOM
        @renderProject()

    render: (target) ->
        renderData = 
            projectJson: projectJson
            subtitle: 'Tracking '+Object.keys(projectMap).length+' projects'
        @$el.html @template renderData
        target.html @$el
        @renderProject()
        # On full-render, scroll the nav-bar
        nav = @$el.find('.nav')
        active = nav.find('.active')
        if active.length
            nav.scrollTop active.position().top
            nav.scrollTop( active.index() * 26 - 10 )

    renderProject: =>
        @$el.find('.nav li').removeClass 'active'
        @$el.find('.nav li[action="'+@active+'"]').addClass 'active'
        renderData = 
            active: @active
            project: projectMap[@active]
        @$el.find('.active-project-pane').html templateInner(renderData)

