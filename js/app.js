var Dashboard = Dashboard || {};

Dashboard.Controller = function($) {
  var my = {};

  my.Workspace = Backbone.Router.extend({
    routes: {
      ".*": "index",
      "activity": "activity",
      "activity/:projectId": "activity"
    },

    initialize: function(customConfig, membersData) {
      var fields = [
        {id: 'id'},
        {id: 'name'},
        {id: 'location'},
        {id: 'website'},
        {id: 'twitter'},
        {id: 'description'},
        {id: 'spatial', type: 'object'}
      ]
      this.dataset = recline.Backend.createDataset(membersData, fields);
      // fix size so we get all members by default
      this.dataset.queryState.set({size: 900}, {silent: true});
      this.config = {};
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
      var $el = $('<div />');
      $el.appendTo($('.data-explorer-here'));
      var views = [
        {
          id: 'grid',
          label: 'Grid',
          view: new recline.View.Grid({
            model: this.dataset
          })
        },
        {
          id: 'map',
          label: 'Map',
          view: new recline.View.Map({
            model: this.dataset
          })
        }
      ];
      window.dataExplorer = new recline.View.DataExplorer({
        el: $el
        , model: this.dataset
        , views: views
        , state: {
          currentView: 'map'
        }
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

  var membersUrl = 'data/members.geojson.json';
  var jqxhr = $.getJSON(membersUrl);
  jqxhr.done(function(membersData) {
    var tmp = membersData.slice(0,5);
    var workspace = new Dashboard.Controller.Workspace(config, membersData);
  });
});


