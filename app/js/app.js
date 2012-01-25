var Dashboard = Dashboard || {};
Dashboard.Util = Dashboard.Util || {};


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
      Backbone.history.start();
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
        collection: Dashboard.members
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
              Date.parse(item.datetime_year_month),
              item._count
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
    model: Dashboard.Member
  }))();
  // Generate a dummy member
  var members = Dashboard.members;

  // Pull data from the server and load it into the model
  var dataUrl = '../cache/members.geo.json';
  $.getJSON(dataUrl, function(dataset) {
    var arr=[];
    for (var key in dataset) {
      if (dataset.hasOwnProperty(key)) {
        var memberData = dataset[key];
        arr.push(new Dashboard.Member({
          key: key,
          name: memberData.name,
          location: memberData.location,
          geolocation: memberData.spatial
        }));
      }
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


