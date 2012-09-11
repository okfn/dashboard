template_activity = require 'views/templates/activity'

activityText = (activity) ->
  if activity._activity_type=='github'
    return activityTextGithub(activity)
  if activity._activity_type=='mailman'
    return activityTextMailman(activity)
  if activity._activity_type=='buddypress'
    return activityTextBuddypress(activity)
  if activity._activity_type=='twitter'
    return activityTextTwitter(activity)
  return '(unknown activity type)'

activityTextGithub = (activity) ->
  '(activity on Github)'

activityTextMailman = (activity) ->
  '(activity on Mailman)'

activityTextBuddypress = (activity) ->
  '(activity on Buddypress)'

activityTextTwitter = (activity) ->
  '(activity on Twitter)'

module.exports = 
  stream: (container, activities) ->
    container.addClass 'activity-stream'
    $.each activities, (i,activity)=>
      container.append @render(activity)

  render: (activity) ->
    activity.text = activityText(activity)
    return template_activity activity

