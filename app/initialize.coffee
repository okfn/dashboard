Router = require 'router'
LoadingView = require 'views/loading_view'
projects = require 'projects'

$ ->
  nav = $('ul.nav').empty()
  for projectCategory in projects
      if 'item' of projectCategory
          item = projectCategory.item
          singleLink = $('<li action="project/'+item.name+'"><a href="#project/'+item.name+'">'+item.title+'</li>')
          singleLink.appendTo nav
      else
          headerLink = $('<li class="dropdown" action="project"><a class="dropdown-toggle" data-toggle="dropdown" href="#">'+projectCategory.header+'<b class="caret"></b></a></li>')
          headerLink.appendTo nav
          projectList = $('<ul class="dropdown-menu" />').appendTo headerLink
          for project in projectCategory.items
              projectList.append $('<li action="project/'+project.name+'"><a href="#project/'+project.name+'">'+project.title+'</a></li>')
  # Hack: Mustache is old news; Handlebars is built-in to this framework.
  @router = new Router()
  loadingView = new LoadingView()
  Backbone.history.start()
