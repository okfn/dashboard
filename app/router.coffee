GithubView = require 'views/github_view'
HomeView = require 'views/home_view'
PersonView = require 'views/person_view'
ProjectView = require 'views/project_view'
MailmanView = require 'views/mailman_view'
TwitterView = require 'views/twitter_view'
ReclineView = require 'views/recline_view'

# Function to consistently target the main div
content = -> $('#content')
# Generator of singleton view pages
singletons =
  githubView: -> return @_github = @_github or new GithubView(content())
  homeView: -> return @_home = @_home or new HomeView(content())
  personView: -> return @_person = @_person or new PersonView(content())
  projectView: -> return @_project = @_project or new ProjectView(content())
  mailmanView: -> return @_mailman = @_mailman or new MailmanView(content())
  twitterView: -> return @_twitter = @_twitter or new TwitterView(content())
  reclineView: -> return @_recline = @_recline or new ReclineView(content())

module.exports = class Router extends Backbone.Router
  routes:
    '': 'home'
    'recline': 'recline'
    'person': 'person'
    'project': 'project'
    'github': 'github'
    'github/:graphmode': 'github'
    'mailman': 'mailman'
    'twitter': 'twitter'
  home: ->
    singletons.homeView().render()
  person: ->
    singletons.personView().render()
  project: ->
    singletons.projectView().render()
  github: (graphMode='watchers') ->
    singletons.githubView().graphMode = graphMode
    singletons.githubView().render()
  mailman: ->
    singletons.mailmanView().render()
  twitter: ->
    singletons.twitterView().render()
  recline: ->
    singletons.reclineView().render()
