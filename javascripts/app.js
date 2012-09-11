(function(/*! Brunch !*/) {
  'use strict';

  if (!this.require) {
    var modules = {};
    var cache = {};
    var __hasProp = ({}).hasOwnProperty;

    var expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    };

    var getFullPath = function(path, fromCache) {
      var store = fromCache ? cache : modules;
      var dirIndex;
      if (__hasProp.call(store, path)) return path;
      dirIndex = expand(path, './index');
      if (__hasProp.call(store, dirIndex)) return dirIndex;
    };
    
    var cacheModule = function(name, path, contentFn) {
      var module = {id: path, exports: {}};
      try {
        cache[path] = module.exports;
        contentFn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        cache[path] = module.exports;
      } catch (err) {
        delete cache[path];
        throw err;
      }
      return cache[path];
    };

    var require = function(name, root) {
      var path = expand(root, name);
      var fullPath;

      if (fullPath = getFullPath(path, true)) {
        return cache[fullPath];
      } else if (fullPath = getFullPath(path, false)) {
        return cacheModule(name, fullPath, modules[fullPath]);
      } else {
        throw new Error("Cannot find module '" + name + "'");
      }
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle) {
        if (__hasProp.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    };
  }
}).call(this);
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var Router;

  Router = require('router');

  $(function() {
    this.router = new Router();
    return Backbone.history.start();
  });

}).call(this);

  }
}));
(this.require.define({
  "models/person": function(exports, require, module) {
    (function() {
  var PersonModel,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = PersonModel = (function(_super) {

    __extends(PersonModel, _super);

    function PersonModel() {
      PersonModel.__super__.constructor.apply(this, arguments);
    }

    PersonModel.prototype.defaults = {
      'name': 'John Doe',
      'location': 'Nowhere',
      'geolocation': {
        adminCode1: '07',
        adminName1: 'North Rhine-Westphalia',
        countryCode: 'DE',
        countryName: 'Germany',
        fcl: 'P',
        fclName: 'city, village,...',
        fcode: 'PPLA2',
        fcodeName: 'seat of a second-order administrative division',
        geonameId: 2886242,
        lat: 50.9333333,
        lng: 6.95,
        name: 'Cologne',
        population: 963395,
        toponymName: 'Köl'
      }
    };

    return PersonModel;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "models/person_collection": function(exports, require, module) {
    (function() {
  var PersonCollection,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = PersonCollection = (function(_super) {

    __extends(PersonCollection, _super);

    function PersonCollection() {
      PersonCollection.__super__.constructor.apply(this, arguments);
    }

    PersonCollection.prototype.model = Dashboard.Member;

    PersonCollection.prototype.parse = function(data) {
      var key, members, value;
      members = [];
      for (key in data) {
        value = data[key];
        members.push({
          key: key,
          name: value.name,
          location: value.location,
          geolocation: value.spatial
        });
      }
      return members;
    };

    return PersonCollection;

  })(Backbone.Collection);

}).call(this);

  }
}));
(this.require.define({
  "router": function(exports, require, module) {
    (function() {
  var MembersMapView, Router,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  MembersMapView = require('views/members_map_view');

  module.exports = Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      '': 'membersmap',
      'membersmap': 'membersmap'
    };

    Router.prototype.target = function() {
      return $('#content');
    };

    Router.prototype.membersmap = function() {
      var view;
      this.target().empty();
      view = new MembersMapView();
      return view.render(this.target());
    };

    return Router;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "views/members_map_view": function(exports, require, module) {
    (function() {
  var MembersMapView, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('./templates/members_map');

  module.exports = MembersMapView = (function(_super) {

    __extends(MembersMapView, _super);

    function MembersMapView() {
      MembersMapView.__super__.constructor.apply(this, arguments);
    }

    MembersMapView.prototype.id = 'members-map';

    MembersMapView.prototype.template = template;

    MembersMapView.prototype.renderData = function() {};

    MembersMapView.prototype.gotMembers = function(membersData) {
      var dataset, fields, reclineElement, views;
      reclineElement = $('.data-explorer-here');
      fields = [
        {
          id: 'id'
        }, {
          id: 'name'
        }, {
          id: 'location'
        }, {
          id: 'website'
        }, {
          id: 'twitter'
        }, {
          id: 'description'
        }, {
          id: 'spatial',
          type: 'object'
        }
      ];
      dataset = new recline.Model.Dataset({
        records: membersData,
        fields: fields
      });
      dataset.fetch();
      dataset.queryState.set({
        size: 900
      }, {
        silent: true
      });
      views = [
        {
          id: 'grid',
          label: 'Grid',
          view: new recline.View.SlickGrid({
            model: dataset
          })
        }
      ];
      return window.dataExplorer = new recline.View.MultiView({
        el: reclineElement,
        model: dataset,
        views: views,
        sidebarViews: [],
        state: {
          currentView: 'grid'
        }
      });
    };

    MembersMapView.prototype.render = function(target) {
      var membersUrl;
      this.$el.html(this.template(this.renderData));
      target.append(this.$el);
      membersUrl = 'data/members.geojson.json';
      return $.getJSON(membersUrl, null, this.gotMembers);
    };

    return MembersMapView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/templates/member": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<table style=\"display: none;\">\n  <tr class=\"js-template-member\">\n    <td>Member: ${name}</td>\n    <td>Location: ${location}</td>\n    <td>Geolocation: ${geolocation}</td>\n  </tr>\n</table>\n\n\n";});
  }
}));
(this.require.define({
  "views/templates/members_map": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"page-view page-index\">\n  <h2>Open Knowledge Foundation Community Members</h2>\n  <div class=\"data-explorer-here\"></div>\n</div>\n\n<div class=\"page-view page-activity\" style=\"display: none;\">\n  <h2>Activity per month</h2>\n  <div id=\"placeholder\" style=\"width:100%;height:300px;\"></div> \n</div>\n";});
  }
}));
