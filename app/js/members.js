	var map = new OpenLayers.Map("map");
	map.addLayer(new OpenLayers.Layer.OSM());
	var url = "./members.json";
	var members;
	var iconokfn = new OpenLayers.StyleMap({
			'pointRadius': 10,
			'externalGraphic': "img/okfn16.png"
		});
	var vectors = new OpenLayers.Layer.Vector("Members",
		{styleMap:iconokfn,strategies: [new OpenLayers.Strategy.Cluster()]});
		OpenLayers.loadURL(url, {}, null, function(r) {
		var p = new OpenLayers.Format.JSON();
		members = p.read(r.responseText);
		var pointList = [];
		for (key in members) {
			var member = members[key];
				if (member.geolocation != undefined) {
					point  = new OpenLayers.Feature.Vector(
								new OpenLayers.Geometry.Point(
										member.geolocation.lng,member.geolocation.lat).transform(
										new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject()));
					point.attributes = {
								userid: key,
								name: member.Name,
								location: member.Location
					};
						pointList.push(point);
				}
			}
		vectors.addFeatures(pointList);
	});
	
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
	map.addPopup(popup);
	}
	
	function onFeatureUnselect(feature) {
		map.removePopup(feature.popup);
		feature.popup.destroy();
		feature.popup = null;
	}
	
	map.addLayers([vectors]);
	selectControl = new OpenLayers.Control.SelectFeature(
	[vectors],{clickout: true, toggle: false, 
				multiple: false, hover: false }
	);
	map.addControl(selectControl);
	selectControl.activate();
	vectors.events.on({
			"featureselected": function(e) {
				onFeatureSelect(e.feature);
			},
			"featureunselected": function(e) {
				onFeatureUnselect(e.feature);
			}
	});

	cp = new OpenLayers.Geometry.Point(0,0).transform(new OpenLayers.Projection("EPSG:4326")); 
	map.setCenter(cp,2);
