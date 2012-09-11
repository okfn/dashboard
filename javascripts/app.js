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
  var GithubView, HomeView, MailmanView, PersonView, ProjectView, ReclineView, Router, TwitterView, content, singletons,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  GithubView = require('views/github_view');

  HomeView = require('views/home_view');

  PersonView = require('views/person_view');

  ProjectView = require('views/project_view');

  MailmanView = require('views/mailman_view');

  TwitterView = require('views/twitter_view');

  ReclineView = require('views/recline_view');

  content = function() {
    return $('#content');
  };

  singletons = {
    githubView: function() {
      return this._github = this._github || new GithubView(content());
    },
    homeView: function() {
      return this._home = this._home || new HomeView(content());
    },
    personView: function() {
      return this._person = this._person || new PersonView(content());
    },
    projectView: function() {
      return this._project = this._project || new ProjectView(content());
    },
    mailmanView: function() {
      return this._mailman = this._mailman || new MailmanView(content());
    },
    twitterView: function() {
      return this._twitter = this._twitter || new TwitterView(content());
    },
    reclineView: function() {
      return this._recline = this._recline || new ReclineView(content());
    }
  };

  module.exports = Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      '': 'home',
      'recline': 'recline',
      'person': 'person',
      'project': 'project',
      'github': 'github',
      'github/:graphmode': 'github',
      'mailman': 'mailman',
      'twitter': 'twitter'
    };

    Router.prototype.home = function() {
      return singletons.homeView().render();
    };

    Router.prototype.person = function() {
      return singletons.personView().render();
    };

    Router.prototype.project = function() {
      return singletons.projectView().render();
    };

    Router.prototype.github = function(graphMode) {
      if (graphMode == null) graphMode = 'watchers';
      singletons.githubView().graphMode = graphMode;
      return singletons.githubView().render();
    };

    Router.prototype.mailman = function() {
      return singletons.mailmanView().render();
    };

    Router.prototype.twitter = function() {
      return singletons.twitterView().render();
    };

    Router.prototype.recline = function() {
      return singletons.reclineView().render();
    };

    return Router;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "views/activity_view": function(exports, require, module) {
    (function() {
  var activityText, activityTextBuddypress, activityTextGithub, activityTextMailman, activityTextTwitter, template_activity;

  template_activity = require('views/templates/activity');

  activityText = function(activity) {
    if (activity._activity_type === 'github') return activityTextGithub(activity);
    if (activity._activity_type === 'mailman') {
      return activityTextMailman(activity);
    }
    if (activity._activity_type === 'buddypress') {
      return activityTextBuddypress(activity);
    }
    if (activity._activity_type === 'twitter') {
      return activityTextTwitter(activity);
    }
    return '(unknown activity type)';
  };

  activityTextGithub = function(activity) {
    return '(activity on Github)';
  };

  activityTextMailman = function(activity) {
    return '(activity on Mailman)';
  };

  activityTextBuddypress = function(activity) {
    return '(activity on Buddypress)';
  };

  activityTextTwitter = function(activity) {
    return '(activity on Twitter)';
  };

  module.exports = {
    stream: function(container, activities) {
      var _this = this;
      container.addClass('activity-stream');
      return $.each(activities, function(i, activity) {
        return container.append(_this.render(activity));
      });
    },
    render: function(activity) {
      activity.text = activityText(activity);
      return template_activity(activity);
    }
  };

}).call(this);

  }
}));
(this.require.define({
  "views/github_view": function(exports, require, module) {
    (function() {
  var GithubView, activityView, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('views/templates/github');

  activityView = require('views/activity_view');

  module.exports = GithubView = (function(_super) {

    __extends(GithubView, _super);

    function GithubView() {
      this.render = __bind(this.render, this);
      this.gotHistory = __bind(this.gotHistory, this);
      this.gotActivity = __bind(this.gotActivity, this);
      GithubView.__super__.constructor.apply(this, arguments);
    }

    GithubView.prototype.template = template;

    GithubView.prototype.activityUrl = 'http://activityapi.herokuapp.com/api/1/activity/github';

    GithubView.prototype.historyUrl = 'http://activityapi.herokuapp.com/api/1/history/github?grain=week&per_page=20';

    GithubView.prototype.graphData = {
      'watchers': [],
      'issues': [],
      'forks': [],
      'size': []
    };

    GithubView.prototype.graphFilter = {
      'watchers': [],
      'issues': [],
      'forks': [],
      'size': []
    };

    GithubView.prototype.renderData = function() {
      return {
        activityUrl: this.activityUrl,
        historyUrl: this.historyUrl,
        subtitle: this.resultHistory ? 'Tracking ' + Object.keys(this.resultHistory.data).length + ' repositories' : 'Loading...'
      };
    };

    GithubView.prototype.initialize = function(target) {
      this.target = target;
      $.ajax({
        url: this.historyUrl,
        dataType: 'jsonp',
        success: this.gotHistory
      });
      return $.ajax({
        url: this.activityUrl,
        dataType: 'jsonp',
        success: this.gotActivity
      });
    };

    GithubView.prototype.gotActivity = function(resultActivity) {
      this.resultActivity = resultActivity;
      return this.render();
    };

    GithubView.prototype.gotHistory = function(resultHistory) {
      var color, graphSeries, graphType, repodata, reponame, series, type, _ref, _ref2,
        _this = this;
      this.resultHistory = resultHistory;
      color = 0;
      type = ['watchers', 'issues', 'forks', 'size'];
      _ref = this.resultHistory.data;
      for (reponame in _ref) {
        repodata = _ref[reponame];
        color = (color + 1) % 30;
        series = {
          'watchers': [],
          'issues': [],
          'forks': [],
          'size': []
        };
        _.each(repodata.data, function(d) {
          var graphSeries, graphType, _results;
          _results = [];
          for (graphType in series) {
            graphSeries = series[graphType];
            _results.push(graphSeries.push([new Date(d['timestamp']), d[graphType]]));
          }
          return _results;
        });
        for (graphType in series) {
          graphSeries = series[graphType];
          this.graphData[graphType].push({
            label: reponame,
            data: graphSeries,
            color: color
          });
        }
        if (series['watchers'][0][1] > 50) {
          this.graphFilter['watchers'].push(reponame);
        }
        if (series['forks'][0][1] > 5) this.graphFilter['forks'].push(reponame);
        if (series['issues'][0][1] > 1) this.graphFilter['issues'].push(reponame);
        if ((1000 < (_ref2 = series['size'][0][1]) && _ref2 < 10000)) {
          this.graphFilter['size'].push(reponame);
        }
      }
      return this.render();
    };

    GithubView.prototype.render = function() {
      var activity, data, dom, filtered, _i, _j, _len, _len2, _ref, _ref2;
      this.$el.html(this.template(this.renderData()));
      this.target.html(this.$el);
      this.$el.find('.nav li').removeClass('active');
      this.$el.find('.nav li[action="' + this.graphMode + '"]').addClass('active');
      dom = this.$el.find('.graph');
      dom.empty();
      if (this.graphData[this.graphMode]) {
        filtered = [];
        _ref = this.graphData[this.graphMode];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          data = _ref[_i];
          if (_.contains(this.graphFilter[this.graphMode], data.label)) {
            filtered.push(data);
          }
        }
        $.plot(dom, filtered, {
          xaxis: {
            mode: "time"
          },
          legend: {
            show: true,
            container: '#legendholder'
          }
        });
      }
      this.$el.find('#graphholder').spin(!this.resultHistory);
      dom = this.$el.find('.activity-stream');
      if (this.resultActivity) {
        _ref2 = this.resultActivity.data;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          activity = _ref2[_j];
          dom.append(activityView.render(activity));
        }
        return dom.spin(false);
      } else {
        return dom.spin();
      }
    };

    return GithubView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/home_view": function(exports, require, module) {
    (function() {
  var HomeView, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('views/templates/home');

  module.exports = HomeView = (function(_super) {

    __extends(HomeView, _super);

    function HomeView() {
      HomeView.__super__.constructor.apply(this, arguments);
    }

    HomeView.prototype.id = 'home';

    HomeView.prototype.template = template;

    HomeView.prototype.initialize = function(target) {
      this.target = target;
    };

    HomeView.prototype.renderData = function() {};

    HomeView.prototype.render = function() {
      this.$el.html(this.template(this.renderData));
      return this.target.html(this.$el);
    };

    return HomeView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/mailman_view": function(exports, require, module) {
    (function() {
  var MailmanView, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('views/templates/mailman');

  module.exports = MailmanView = (function(_super) {

    __extends(MailmanView, _super);

    function MailmanView() {
      MailmanView.__super__.constructor.apply(this, arguments);
    }

    MailmanView.prototype.template = template;

    MailmanView.prototype.initialize = function(target) {
      this.target = target;
    };

    MailmanView.prototype.renderData = function() {};

    MailmanView.prototype.render = function() {
      this.$el.html(this.template(this.renderData));
      return this.target.html(this.$el);
    };

    return MailmanView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/person_view": function(exports, require, module) {
    (function() {
  var PersonView, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('views/templates/person');

  module.exports = PersonView = (function(_super) {

    __extends(PersonView, _super);

    function PersonView() {
      PersonView.__super__.constructor.apply(this, arguments);
    }

    PersonView.prototype.template = template;

    PersonView.prototype.initialize = function(target) {
      this.target = target;
    };

    PersonView.prototype.renderData = function() {};

    PersonView.prototype.render = function() {
      this.$el.html(this.template(this.renderData));
      return this.target.html(this.$el);
    };

    return PersonView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/project_view": function(exports, require, module) {
    (function() {
  var ProjectView, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('views/templates/project');

  module.exports = ProjectView = (function(_super) {

    __extends(ProjectView, _super);

    function ProjectView() {
      ProjectView.__super__.constructor.apply(this, arguments);
    }

    ProjectView.prototype.template = template;

    ProjectView.prototype.initialize = function(target) {
      this.target = target;
    };

    ProjectView.prototype.renderData = function() {};

    ProjectView.prototype.render = function() {
      this.$el.html(this.template(this.renderData));
      return this.target.html(this.$el);
    };

    return ProjectView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/recline_view": function(exports, require, module) {
    (function() {
  var MembersMapView, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('./templates/recline');

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
  "views/templates/activity": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n    <div class=\"person\">\n      ";
  foundHelper = helpers.avatar;
  stack1 = foundHelper || depth0.avatar;
  stack2 = helpers['if'];
  tmp1 = self.program(2, program2, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.program(4, program4, data);
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      <a class=\"name\" href=\"";
  foundHelper = helpers.permalink;
  stack1 = foundHelper || depth0.permalink;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "permalink", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.display_name;
  stack1 = foundHelper || depth0.display_name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "display_name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a>\n      <span class=\"github\">(@<a href=\"http://github.com/";
  foundHelper = helpers.github;
  stack1 = foundHelper || depth0.github;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "github", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.github;
  stack1 = foundHelper || depth0.github;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "github", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a>)</span>\n    </div>\n\n    <div style=\"display:none;\">\n      twitter: ";
  foundHelper = helpers.twitter;
  stack1 = foundHelper || depth0.twitter;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "twitter", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n      last_active: ";
  foundHelper = helpers.last_active;
  stack1 = foundHelper || depth0.last_active;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "last_active", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n      website: ";
  foundHelper = helpers.website;
  stack1 = foundHelper || depth0.website;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "website", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n      about: ";
  foundHelper = helpers.about;
  stack1 = foundHelper || depth0.about;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "about", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n      registered: ";
  foundHelper = helpers.registered;
  stack1 = foundHelper || depth0.registered;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "registered", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n      location: ";
  foundHelper = helpers.location;
  stack1 = foundHelper || depth0.location;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "location", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n      login: ";
  foundHelper = helpers.login;
  stack1 = foundHelper || depth0.login;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "login", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n      _opinion: ";
  foundHelper = helpers._opinion;
  stack1 = foundHelper || depth0._opinion;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "_opinion", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n      avatar: ";
  foundHelper = helpers.avatar;
  stack1 = foundHelper || depth0.avatar;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "avatar", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n    </div>\n  ";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <a class=\"avatar\" href=\"";
  foundHelper = helpers.avatar;
  stack1 = foundHelper || depth0.avatar;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "avatar", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\"><img src=\"";
  foundHelper = helpers.avatar;
  stack1 = foundHelper || depth0.avatar;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "avatar", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" width=\"50\" height\"50\"/></a>\n      ";
  return buffer;}

function program4(depth0,data) {
  
  
  return "\n        <a class=\"avatar\" href=\"/images/mm-250.jpeg\"><img src=\"/images/mm-50.jpeg\" width=\"50\" height\"50\"/></a>\n      ";}

  buffer += "<div class=\"activity\">\n  ";
  foundHelper = helpers.person;
  stack1 = foundHelper || depth0.person;
  stack2 = helpers['with'];
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <div class=\"middle\">\n    ";
  foundHelper = helpers.text;
  stack1 = foundHelper || depth0.text;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "text", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n  </div>\n  <div class=\"icon\">\n    <img src=\"/images/icons/";
  foundHelper = helpers._activity_type;
  stack1 = foundHelper || depth0._activity_type;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "_activity_type", { hash: {} }); }
  buffer += escapeExpression(stack1) + ".png\" width=\"40\" height=\"40\"/>\n  </div>\n  <div class=\"clearfix\"></div>\n</div>\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/github": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<h1>Github <small>";
  foundHelper = helpers.subtitle;
  stack1 = foundHelper || depth0.subtitle;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "subtitle", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</small></h1>\n<div class=\"row\">\n  <div class=\"span7\">\n    <ul class=\"nav nav-tabs\">\n      <li action=\"watchers\"><a href=\"#github/watchers\">Watchers</a></li>\n      <li action=\"forks\"><a href=\"#github/forks\">Forks</a></li>\n      <li action=\"issues\" style=\"text-decoration: line-through;\"><a href=\"#github/issues\">Issues</a></li>\n      <li action=\"size\"><a href=\"#github/size\">Size</a></li>\n    </ul>\n    <div id=\"graphholder\" style=\"min-height:400px;\">\n      <div class=\"graph\" style=\"height: 400px;\"></div>\n      <div id=\"legendholder\"></div>\n    </div>\n  </div>\n  <div class=\"span5\">\n    <div class=\"activity-stream\" style=\"min-height:500px;\"></div>\n  </div>\n</div>\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/home": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "\nHome view\n";});
  }
}));
(this.require.define({
  "views/templates/mailman": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<code>TODO</code> mailinglist view\n\n";});
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
  "views/templates/person": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<code>TODO</code> people directory view\n";});
  }
}));
(this.require.define({
  "views/templates/project": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<code>TODO</code> project view\n\n";});
  }
}));
(this.require.define({
  "views/templates/recline": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"page-view page-index\">\n  <h2>Open Knowledge Foundation Community Members</h2>\n  <div class=\"data-explorer-here\"></div>\n</div>\n\n<div class=\"page-view page-activity\" style=\"display: none;\">\n  <h2>Activity per month</h2>\n  <div id=\"placeholder\" style=\"width:100%;height:300px;\"></div> \n</div>\n";});
  }
}));
(this.require.define({
  "views/templates/twitter": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<code>TODO</code> twitter analytics view\n\n";});
  }
}));
(this.require.define({
  "views/twitter_view": function(exports, require, module) {
    (function() {
  var TwitterView, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('views/templates/twitter');

  module.exports = TwitterView = (function(_super) {

    __extends(TwitterView, _super);

    function TwitterView() {
      TwitterView.__super__.constructor.apply(this, arguments);
    }

    TwitterView.prototype.template = template;

    TwitterView.prototype.initialize = function(target) {
      this.target = target;
    };

    TwitterView.prototype.renderData = function() {};

    TwitterView.prototype.render = function() {
      this.$el.html(this.template(this.renderData));
      return this.target.html(this.$el);
    };

    return TwitterView;

  })(Backbone.View);

}).call(this);

  }
}));
