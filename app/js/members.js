var OKFN = {};

OKFN.Dashboard = function($) {
  var my = {};

  var geocoder;
  var map;
  my.membersMap = function() {
    var latlng = new google.maps.LatLng(30, -20);
    var myOptions = {
      zoom: 3,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    $.getJSON('members.json', function(members) {
      for (key in members) {
        var member = members[key];
        member.userid = key;
        if (member.geolocation != undefined) { 
          displayAddress(member);
        }
      }
    });
  };
 
  function displayAddress(member) {
    var marker = new google.maps.Marker({
      map: map, 
      position: new google.maps.LatLng(member.geolocation.lat,
        member.geolocation.lng),
      title: member.Name
    });
    var userlink = 'http://okfn.org/members/' + member.userid; 
      var html = '<div style="width:240px;"><a target="_blank" href="' + userlink + '">' +
      member.Name + '</a>';
      html += '<br />Location: ' + member.Location;
      html += '</div>';
    var infowindow = new google.maps.InfoWindow({
      content: html,
      size: new google.maps.Size(50,50)
    });

    google.maps.event.addListener(marker, "click", function() {
      infowindow.open(map,marker);
    });
  }

  return my;

}(jQuery);
