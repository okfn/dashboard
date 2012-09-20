Router = require 'router'
LoadingView = require 'views/loading_view'
projects = require 'projects'

$ ->
  projectList = $('#project-list').empty()
  for project in projects
      projectList.append $('<li><a href="#project/'+project.name+'">'+project.title+'</a>')
  # Hack: Mustache is old news; Handlebars is built-in to this framework.
  @router = new Router()
  loadingView = new LoadingView()
  Backbone.history.start()
