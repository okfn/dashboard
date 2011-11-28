var Dashboard = Dashboard || {};
Dashboard.Util = Dashboard.Util || {};

// Class: Backbone model for a member
Dashboard.Member = Backbone.Model.extend({
  defaults: {
    'name': 'John Doe',
    'location': 'Nowhere', 
    'geolocation': {}, 
  },
});

// Class: Tabular view for members
Dashboard.MemberTableView = Backbone.View.extend({
  initialize: function() {
    if (this.collection.length>0) 
      throw "Must be initted with an empty collection.";
    this.collection.bind('add', this.render, this);
  },
  events: {
    'submit .js-add-member': 'addMember',
  },
  addMember: function(event) {
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
Dashboard.Util.createMap = function(divName) {
  var my= {};
  var iconokfn = new OpenLayers.StyleMap({
      'pointRadius': 10,
      'externalGraphic': "img/okfn16.png"
  });
  var vectorAttributes = {styleMap:iconokfn,strategies: [new OpenLayers.Strategy.Cluster()]};
  
  // Create my attributes
  my.map = new OpenLayers.Map(divName);
  my.map.addLayer(new OpenLayers.Layer.OSM());
  my.vectors = new OpenLayers.Layer.Vector("Members",vectorAttributes);

  // Function: Add a member point to the map
  my.addMembers = function(memberCollection) {
    var pointList = [];
    memberCollection.each(function(member) {
      var geolocation = member.get('geolocation');
      if (geolocation != undefined) {
        point  = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(
              geolocation.lng,geolocation.lat).transform(
                new OpenLayers.Projection("EPSG:4326"),my.map.getProjectionObject()));
        point.attributes = {
          userid: member.get('key'),
          name: member.get('name'),
          location: member.get('location'),
        };
        pointList.push(point);
      }
    });
    my.vectors.addFeatures(pointList);
  }


  function onPopupClose(evt) {
    selectControl.unselect(selectedFeature);
  }

  function onFeatureSelect(feature){
    selectedFeature = feature;
    var desc = "<html><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'><body>";
    if (feature.cluster.length > 1) {
      desc += "<strong>" + feature.cluster.length + " members in this area</strong><br/>";
    }
    for (var i=0; i < feature.cluster.length; ++i){
      var userlink = 'http://okfn.org/members/' + feature.cluster[i].attributes.userid; 
        desc += '<div style="width:240px;">';
      desc += '<img src="img/okfnlogo.png" align="left"/><a target="_blank" href="' + userlink + '">' + feature.cluster[i].attributes.name + '</a>';
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
        onPopupClose); 

    feature.popup = popup;
    my.map.addPopup(popup);
  }

  function onFeatureUnselect(feature) {
    my.map.removePopup(feature.popup);
    feature.popup.destroy();
    feature.popup = null;
  }

  my.map.addLayers([my.vectors]);
  selectControl = new OpenLayers.Control.SelectFeature(
  [my.vectors],{clickout: true, toggle: false, 
        multiple: false, hover: false }
  );
  my.map.addControl(selectControl);
  selectControl.activate();
  my.vectors.events.on({
      "featureselected": function(e) {
        onFeatureSelect(e.feature);
      },
      "featureunselected": function(e) {
        onFeatureUnselect(e.feature);
      }
  });

  cp = new OpenLayers.Geometry.Point(0,0).transform(new OpenLayers.Projection("EPSG:4326")); 
  my.map.setCenter(cp,2);

  return my;
};


// On document ready, set up the application
$(function() {
  var config = { 
    webstore: 'http://webstore.thedatahub.org/okfn/dashboard-dev'
  };

  var workspace = new Dashboard.Controller.Workspace(config);
  });


Dashboard.Controller = function($) {
  var my = {};

  my.Workspace = Backbone.Router.extend({
    routes: {
      "": "index",
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
      $('#' + view + '-page').show();
    },

    index: function(query, page) {
      // The core collection of members
      var members = new (Backbone.Collection.extend({
        model: Dashboard.Member,
      }))();

      // Initialise the map
      var map = Dashboard.Util.createMap('js-member-map');

      // Bind a view to the DOM
      var memberTableView = new Dashboard.MemberTableView({
        el: $('.js-member-view'),
        collection: members,
      });

      // Generate a dummy member
      members.add();

      // Pull data from the server and load it into the model
      var dataUrl = 'dev.json';
      $.getJSON(dataUrl, function(dataset) {
        for (key in dataset) {
          var memberData = dataset[key];
          members.add({
            key: key,
            name: memberData.Name, 
            location: memberData.Location,
            geolocation: memberData.geolocation,
          });
        }
        map.addMembers(members);
      });
    },

    activity: function(projectId) {
      var $leftpane = $('.left-pane');
      this.$thread = $('<div />').attr('class', '.page-view').attr('id', 'thread-page');
      $leftpane.append(this.$thread);
      var thread = new Dashboard.Model.Thread({
        id: thread.id,
      });
      // hacky but best way to boot it i think
      thread.fetch({
        success: function() {
          thread.updateNoteList();
        }
      });
      my.threadView = new Dashboard.View.ThreadView({
        el: this.$thread,
        model: thread
        });
      my.timemap = new Dashboard.View.TimeMapView({
        el: $('#timemap'),
        collection: thread.notes
      });
      my.timemap.render();
    }
  });

  return my;
}(jQuery);
