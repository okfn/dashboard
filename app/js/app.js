var Dashboard = Dashboard || {};

Dashboard.Controller = function($) {
  var my = {};

  my.Workspace = Backbone.Router.extend({
    routes: {
      "": "index",
      "activity": "activity",
      "activity/:projectId": "activity"
    },

    initialize: function(members, customConfig) {
      this.members = members;
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
        collection: this.members
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

  var members = new Dashboard.MemberCollection();
  members.url = '../cache/members.geo.json';
  members.fetch();

  $('.js-debug-map').click(function(e) {
    members.add();
  });

  // Create singleton OpenLayers map
  Dashboard.memberView = new Dashboard.MemberMapView({
    collection: members,
    divName: 'js-member-map'
  });

  var workspace = new Dashboard.Controller.Workspace(members, config);
});


