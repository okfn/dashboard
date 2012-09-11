module.exports = class PersonCollection extends Backbone.Collection
  model: Dashboard.Member
  parse: (data) ->
    members = []
    for key,value of data 
        members.push 
          key: key
          name: value.name
          location: value.location
          geolocation: value.spatial
    return members
