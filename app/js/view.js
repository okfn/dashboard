window.Dashboard = window.Dashboard || {};

Dashboard.MemberTableView = Backbone.View.extend({
  initialize: function() {
    this.collection.bind('all', this.render, this);
    this.render();
  },
  events: {
    'submit .js-add-member': 'addMember'
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
    if (table.length === 0) {
      throw "Can't find view";
    }
    if (template.length === 0) {
      throw "Can't find template";
    }
    
    // Reflow the table rows
    table.find('tr').remove();
    this.collection.each(function(member) {
      var entry = $('<tr />');
      entry.html($.tmpl(template.html(), member.attributes));
      table.append(entry);
    });
  }
});

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
    this.map = new OpenLayers.Map(this.options.divName, {theme: null});
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
      if (geolocation) {
        var point  = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(
              geolocation.lng,geolocation.lat).transform(
                new OpenLayers.Projection("EPSG:4326"),context.map.getProjectionObject()));
        point.attributes = {
          userid: member.get('key'),
          name: member.get('name'),
          location: member.get('location')
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
