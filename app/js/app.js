var Dashboard = Dashboard || {};
Dashboard.Util = Dashboard.Util || {};

// Class: Backbone model for a member
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
  },
});

// Class: Tabular view for members
Dashboard.MemberTableView = Backbone.View.extend({
  initialize: function() {
    this.collection.bind('all', this.render, this);
    this.render();
  },
  events: {
    'submit .js-add-member': 'addMember',
  },
  addMember: function(event) {
    console.log('added member');
    var inputBox = this.$('.js-add-member-name');
    var name = inputBox.val();
    inputBox.val('');
    this.collection.add({name: name});
    return false;
  },
  render: function() {
    var table = $(this.el).find('.js-member-table');
    var template = $('tr.js-template-member');
    if (table.length==0) throw "Can't find view";
    if (template.length==0) throw "Can't find template";
    
    // Reflow the table rows
    table.find('tr').remove();
    this.collection.each(function(member) {
      var entry = $('<tr />');
      entry.html($.tmpl(template.html(), member.attributes));
      table.append(entry);
    });
  }
});


// Utility function to create a map
Dashboard.MemberMapView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this,'onPopupClose');
    this.collection.bind('all', this.renderMembers, this);

    // Mapping attributes
    var vectorAttributes = {
      styleMap: new OpenLayers.StyleMap({
        'pointRadius': 10,
        'externalGraphic': "img/okfn16.png"
      }),
      strategies: [new OpenLayers.Strategy.Cluster()]
    };
    // Create the map
    this.map = new OpenLayers.Map(this.options.divName);
    this.map.addLayer(new OpenLayers.Layer.OSM());
    this.vectors = new OpenLayers.Layer.Vector("Members",vectorAttributes);

    this.map.addLayers([this.vectors]);
    this.selectControl = new OpenLayers.Control.SelectFeature(
      [this.vectors],
      {clickout: true, 
       toggle: false, 
       multiple: false, 
       hover: false 
      }
    );
    this.map.addControl(this.selectControl);
    this.selectControl.activate();
    var context = this;
    this.vectors.events.on({
        "featureselected": function(e) {
          context.onFeatureSelect(e.feature);
        },
        "featureunselected": function(e) {
          context.onFeatureUnselect(e.feature);
        }
    });

    var cp = new OpenLayers.Geometry.Point(0,0).transform(new OpenLayers.Projection("EPSG:4326")); 
    this.map.setCenter(cp,2);
  },

  // Function: Add member points to the map
  renderMembers: function() {
    console.log('renderMembers');
    var context = this;
    var pointList = [];
    this.collection.each(function(member) {
      var geolocation = member.get('geolocation');
      if (geolocation != undefined) {
        var point  = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(
              geolocation.lng,geolocation.lat).transform(
                new OpenLayers.Projection("EPSG:4326"),context.map.getProjectionObject()));
        point.attributes = {
          userid: member.get('key'),
          name: member.get('name'),
          location: member.get('location'),
        };
        pointList.push(point);
      }
    });
    this.vectors.removeAllFeatures();
    this.vectors.addFeatures(pointList);
  },

  onPopupClose: function(evt) {
    this.selectControl.unselect(selectedFeature);
  },

  onFeatureSelect: function(feature) {
    selectedFeature = feature;
    var desc = "<html><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'><body>";
    if (feature.cluster.length > 1) {
      desc += "<strong>" + feature.cluster.length + " members in this area</strong><br/>";
    }
    for (var i=0; i < feature.cluster.length; ++i){
      var userlink = 'http://okfn.org/members/' + feature.cluster[i].attributes.userid; 
        desc += '<div style="width:240px;" class"popup-content">';
        desc += '<img src="img/okfnlogo.png" align="left" class="popup-image"/><a target="_blank" href="' + userlink + '">' + feature.cluster[i].attributes.name + '</a>';
        desc += '<br/>' + feature.cluster[i].attributes.location;
        desc += '</div>';
    }
    if (feature.cluster.length > 1) {
      desc += "<br/><em>tip: increase the zoom level</em>";
    }
    desc += "</body></html>";
    popup = new OpenLayers.Popup.FramedCloud("chicken", 
        feature.geometry.getBounds().getCenterLonLat(),
        new OpenLayers.Size(1000,500),
        desc,
        null,
        true,
        this.onPopupClose); 

    feature.popup = popup;
    this.map.addPopup(popup);
  },

  onFeatureUnselect: function(feature) {
    this.map.removePopup(feature.popup);
    feature.popup.destroy();
    feature.popup = null;
  }
});

Dashboard.Controller = function($) {
  var my = {};

  my.Workspace = Backbone.Router.extend({
    routes: {
      "": "index",
      "activity": "activity",
      "activity/:projectId": "activity"
    },

    initialize: function(customConfig) {
      this.config = {
        webstore: 'http://localhost:5000/'
      };
      _.extend(this.config, customConfig);
      Backbone.history.start()
    },

    switchView: function(view) {
      $('.page-view').hide();
      $('.page-' + view).show();
      $('.topbar li').removeClass('active');
      $('.topbar li[action="'+view+'"]').addClass('active');
    },

    index: function(query, page) {
      this.switchView('index');

      // Bind a view to the DOM
      var memberTableView = new Dashboard.MemberTableView({
        el: $('.js-member-view'),
        collection: Dashboard.members,
      });

    },

    activity: function(projectId) {
      this.switchView('activity');

      var $el = $('.page-activity');

      var url = 'http://webstore.thedatahub.org/okfn/dashboard-dev/activity/distinct/datetime_year_month.json?_sort=asc:datetime_year_month';
      $.getJSON(url, function(data) {
        var d = [];
        $.each(data.data, function(idx, item) {
          var _out = [
              Date.parse(item.datetime_year_month)
            , item._count
          ];
          d.push(_out);
        });
        var options = {
            xaxis: { mode: "time" }
        };
        var plot = $.plot($el.find("#placeholder"), [
            {
              data: d,
              bars: { show: true, barWidth:  15 * 24 * 60 * 60 * 1000, fillColor: '#404040', lineWidth: 0 }
            }
          ],
          options);
      });
    }
  });

  return my;
}(jQuery);


// On document ready, set up the application
$(function() {
  var config = { 
    webstore: 'http://webstore.thedatahub.org/okfn/dashboard-dev'
  };

  // The core collection of members
  Dashboard.members = new (Backbone.Collection.extend({
    model: Dashboard.Member,
  }))();
  // Generate a dummy member
  var members = Dashboard.members;

  // Pull data from the server and load it into the model
  var dataUrl = '../cache/members.geo.json';
  $.getJSON(dataUrl, function(dataset) {
    var arr=[];
    for (key in dataset) {
      var memberData = dataset[key];
      arr.push(new Dashboard.Member({
        key: key,
        name: memberData.name, 
        location: memberData.location,
        geolocation: memberData.spatial
      }));
    }
    // Add them all at once, then trigger an update event
    members.add(arr, {silent: true});
    members.trigger('add');
  });

  $('.js-debug-map').click(function(e) {
    members.add();
  });

  // Create singleton OpenLayers map
  Dashboard.memberView = new Dashboard.MemberMapView({
    collection: Dashboard.members,
    divName: 'js-member-map'
  });

  var workspace = new Dashboard.Controller.Workspace(config);
});


