ProjectPage = require 'views/page_project'

# Function to consistently target the main div
content = -> $('#content')
# Generator of singleton view pages
singletons =
    projectPage: -> return @_project = @_project or new ProjectPage()

module.exports = class Router extends Backbone.Router
    routes:
        '': 'project'
        'project': 'project'
        'project/:projectName': 'project'

    initialize: ->
        # Trigger nav updates
        @on 'all', (trigger) =>
            location = (window.location.hash.slice(1)) or 'project/okfn'
            trigger = trigger.split(':')
            if trigger[0]=='route'
              $('.navbar .nav li').removeClass 'active'
              active = $('.navbar .nav li[action="'+location+'"]')
              active.add( active.parents('.dropdown') ).addClass 'active'

    setCurrent: (view) =>
        if not (view==@currentView)
            @currentView = view
            view.renderPage content()

    ## Router Paths
    ## ------------
    #
    project: (projectName='okfn') ->
        view = singletons.projectPage()
        if not view==@currentView
            @currentView = view
        view.renderPage content(), projectName
