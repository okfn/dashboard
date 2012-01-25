window.Dashboard = window.Dashboard || {};

//
// Member
//

// Backbone model for member
Dashboard.Member = Backbone.Model.extend({
  defaults: {
    'name': 'John Doe',
    'location': 'Nowhere', 
    'geolocation': {
      adminCode1: "07",
      adminName1: "North Rhine-Westphalia",
      countryCode: "DE",
      countryName: "Germany",
      fcl: "P",
      fclName: "city, village,...",
      fcode: "PPLA2",
      fcodeName: "seat of a second-order administrative division",
      geonameId: 2886242,
      lat: 50.9333333,
      lng: 6.95,
      name: "Cologne",
      population: 963395,
      toponymName: "Köln"
    }
  }
});
