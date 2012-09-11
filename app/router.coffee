HomeView = require 'views/home_view'
PersonView = require 'views/person_view'
ProjectView = require 'views/project_view'
GithubView = require 'views/github_view'
MailmanView = require 'views/mailman_view'
TwitterView = require 'views/twitter_view'
ReclineView = require 'views/recline_view'

module.exports = class Router extends Backbone.Router
  routes:
    '': 'home'
    'recline': 'recline'
    'person': 'person'
    'project': 'project'
    'github': 'github'
    'mailman': 'mailman'
    'twitter': 'twitter'

  target: ->
    $('#content')

  home: ->
    @target().empty()
    new HomeView().render @target()

  person: ->
    @target().empty()
    new PersonView().render @target()

  project: ->
    @target().empty()
    new ProjectView().render @target()

  github: ->
    @target().empty()
    new GithubView().render @target()

  mailman: ->
    @target().empty()
    new MailmanView().render @target()

  twitter: ->
    @target().empty()
    new TwitterView().render @target()

  recline: ->
    @target().empty()
    new ReclineView().render @target()
