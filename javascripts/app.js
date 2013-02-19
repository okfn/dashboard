(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"activityapi": function(exports, require, module) {
  (function() {
    var ActivityApi,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    ActivityApi = (function(_super) {

      __extends(ActivityApi, _super);

      function ActivityApi() {
        this._error = __bind(this._error, this);
        this._wrapCallback = __bind(this._wrapCallback, this);
        ActivityApi.__super__.constructor.apply(this, arguments);
      }

      ActivityApi.prototype.url = 'http://activityapi.herokuapp.com/api/1';

      ActivityApi.prototype.ajaxHistoryGithub = function(repos, callback) {
        var url;
        if (!repos.length) {
          return callback(null);
        } else {
          url = this.url + '/history/github?repo=' + this._join(repos) + '&per_page=90';
          return this._fetch(url, callback);
        }
      };

      ActivityApi.prototype.ajaxHistoryMailchimp = function(lists, callback) {
        var url;
        if (lists === void 0 || !lists.length) {
          return callback(null);
        } else {
          url = this.url + '/history/mailchimp?list=' + this._join(lists) + '&per_page=26&grain=week';
          return this._fetch(url, callback);
        }
      };

      ActivityApi.prototype.ajaxHistoryMailman = function(lists, callback) {
        var url;
        if (!lists.length) {
          return callback(null);
        } else {
          url = this.url + '/history/mailman?list=' + this._join(lists) + '&per_page=26&grain=week';
          return this._fetch(url, callback);
        }
      };

      ActivityApi.prototype.ajaxHistoryTwitter = function(account, callback) {
        var url;
        if (!account) {
          return callback(null);
        } else {
          url = this.url + '/history/twitter?name=' + account + '&per_page=26&grain=week';
          return this._fetch(url, callback);
        }
      };

      ActivityApi.prototype.ajaxHistoryFacebook = function(boolean, callback) {
        var url;
        if (!boolean) {
          return callback(null);
        } else {
          url = this.url + '/history/facebook?per_page=26&grain=week';
          return this._fetch(url, callback);
        }
      };

      ActivityApi.prototype._wrapCallback = function(url, callback) {
        var _this = this;
        return function(data) {
          _this.trigger('ajaxMinusMinus');
          if (data.ok === true) {
            return callback(data);
          } else {
            return console.error('Could not load', url, data);
          }
        };
      };

      ActivityApi.prototype._join = function(strings) {
        var comma, out, s, _i, _len;
        out = '';
        comma = false;
        for (_i = 0, _len = strings.length; _i < _len; _i++) {
          s = strings[_i];
          if (comma) out += ',';
          comma = true;
          out += s;
        }
        return out;
      };

      ActivityApi.prototype._error = function(a, b) {
        this.trigger('ajaxMinusMinus');
        this.trigger('ajaxError');
        return console.error('AJAX error', a, b);
      };

      ActivityApi.prototype._fetch = function(url, callback) {
        if (!callback) throw 'I require a callback function';
        this.trigger('ajaxPlusPlus');
        return $.ajax({
          url: url,
          success: this._wrapCallback(url, callback),
          dataType: 'jsonp',
          error: this._error
        });
      };

      return ActivityApi;

    })(Backbone.Model);

    module.exports = new ActivityApi();

  }).call(this);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  (function() {
    var LoadingView, Router, projects;

    Router = require('router');

    LoadingView = require('views/loading_view');

    projects = require('projects');

    $(function() {
      var headerLink, item, loadingView, nav, project, projectCategory, projectList, singleLink, _i, _j, _len, _len2, _ref;
      nav = $('ul.nav').empty();
      for (_i = 0, _len = projects.length; _i < _len; _i++) {
        projectCategory = projects[_i];
        if ('item' in projectCategory) {
          item = projectCategory.item;
          singleLink = $('<li action="project/' + item.name + '"><a href="#project/' + item.name + '">' + item.title + '</li>');
          singleLink.appendTo(nav);
        } else {
          headerLink = $('<li class="dropdown" action="project"><a class="dropdown-toggle" data-toggle="dropdown" href="#">' + projectCategory.header + '<b class="caret"></b></a></li>');
          headerLink.appendTo(nav);
          projectList = $('<ul class="dropdown-menu" />').appendTo(headerLink);
          _ref = projectCategory.items;
          for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
            project = _ref[_j];
            projectList.append($('<li action="project/' + project.name + '"><a href="#project/' + project.name + '">' + project.title + '</a></li>'));
          }
        }
      }
      this.router = new Router();
      loadingView = new LoadingView();
      return Backbone.history.start();
    });

  }).call(this);
  
}});

window.require.define({"models/person": function(exports, require, module) {
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
  
}});

window.require.define({"models/person_collection": function(exports, require, module) {
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
  
}});

window.require.define({"projects": function(exports, require, module) {
  (function() {

    module.exports = [
      {
        header: 'Network',
        item: {
          name: 'okfn',
          title: 'Network',
          twitter: 'okfn',
          link: ['http://okfn.org', 'http://blog.okfn.org'],
          mailman: [],
          github: [],
          mailchimp: ['Open Knowledge Foundation Announce Mailing List'],
          facebook: true
        }
      }, {
        header: 'Projects',
        items: [
          {
            name: 'ckan',
            twitter: 'ckanproject',
            title: 'CKAN',
            description: 'CKAN is an open-source data hub. CKAN makes it easy to publish, share and find data. It provides a powerful and extensible system for cataloging and storing datasets, with an intuitive web front-end and API.',
            link: ['http://ckan.org', 'http://wiki.okfn.org/Projects/CKAN'],
            mailman: ['ckan-dev', 'ckan-discuss'],
            github: ['okfn/ckan', 'okfn/ckanclient', 'okfn/dataprotocols', 'okfn/buildkit', 'okfn/webstore', 'okfn/dpm', 'okfn/datahub'],
            headline_github: 'okfn/ckan'
          }, {
            name: 'openspending',
            title: 'OpenSpending',
            twitter: 'openspending',
            link: ['http://openspending.org', 'http://blog.openspending.org/', 'http://twitter.com/openspending', 'http://wiki.openspending.org/Main_Page', 'http://wheredoesmymoneygo.org/blog/'],
            mailman: ['openspending', 'openspending-dev', 'wdmmg-announce'],
            github: ['okfn/dpkg-israel-state-budget', 'okfn/openspending.plugins.datatables', 'okfn/openspending.plugins.treemap']
          }, {
            name: 'schoolofdata',
            title: 'School Of Data',
            twitter: 'schoolofdata',
            link: ['http://schoolofdata.org', 'http://handbook.schoolofdata.org', 'http://opendatahandbook.org', 'http://wiki.okfn.org/Projects/Open_Data_Handbook'],
            mailman: ['School-of-data', 'Scoda-dev', 'open-data-handbook'],
            github: ['okfn/datawrangling', 'okfn/schoolofdata', 'okfn/opendatahandbook'],
            headline_github: 'okfn/schoolofdata'
          }, {
            name: 'lod2',
            title: 'LOD (Linked Open Data)',
            twitter: 'lod2project',
            description: 'LOD2 is an EU-funded project involving a consortium of groups across Europe working to develop linked open data availability and to enable the creation of knowledge from interlinked data.',
            link: ['http://lod2.eu/'],
            mailman: ['lod2'],
            github: []
          }, {
            name: 'recline',
            title: 'Recline.js',
            twitter: 'reclinejs',
            link: ['http://reclinejs.org'],
            mailman: [],
            github: ['okfn/recline'],
            headline_github: 'okfn/recline'
          }, {
            name: 'annotator',
            title: 'Annotator',
            twitter: 'okfnlabs',
            link: ['http://annotateit.org'],
            mailman: ['annotator-dev'],
            github: ['okfn/annotator', 'okfn/annotateit', 'okfn/annotator-store', 'okfn/annotator-wordpress', 'okfn/texts.annotateit.org'],
            headline_github: 'okfn/annotator'
          }, {
            name: 'labs',
            title: 'OKFN Labs',
            twitter: 'okfnlabs',
            link: ['http://annotateit.org', 'http://okfnlabs.org/dashboard', 'http://activityapi.herokuapp.com', 'http://yourtopia.net', 'http://italia.yourtopia.net/'],
            mailman: ['Yourtopia', 'okfn-labs', 'open-history'],
            github: ['okfn/timeliner', 'okfn/activityapi', 'okfn/dashboard', 'okfn/yourtopia', 'okfn/bubbletree', 'okfn/hypernotes', 'okfn/okfn.github.com', 'okfn/sprints.okfnlabs.org', 'okfn/facetview']
          }
        ]
      }, {
        header: 'OKFestival',
        item: {
          name: 'okfestival',
          title: 'OKFestival',
          twitter: 'okfestival',
          link: ['http://okfestival.org'],
          mailman: ['OKFestival-Coord', 'Okfest-opendev'],
          github: []
        }
      }
    ];

  }).call(this);
  
}});

window.require.define({"router": function(exports, require, module) {
  (function() {
    var ProjectPage, Router, content, singletons,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    ProjectPage = require('views/page_project');

    content = function() {
      return $('#content');
    };

    singletons = {
      projectPage: function() {
        return this._project = this._project || new ProjectPage();
      }
    };

    module.exports = Router = (function(_super) {

      __extends(Router, _super);

      function Router() {
        this.setCurrent = __bind(this.setCurrent, this);
        Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.routes = {
        '': 'project',
        'project': 'project',
        'project/:projectName': 'project'
      };

      Router.prototype.initialize = function() {
        var _this = this;
        return this.on('all', function(trigger) {
          var active, location;
          location = (window.location.hash.slice(1)) || 'project/okfn';
          trigger = trigger.split(':');
          if (trigger[0] === 'route') {
            $('.navbar .nav li').removeClass('active');
            active = $('.navbar .nav li[action="' + location + '"]');
            return active.add(active.parents('.dropdown')).addClass('active');
          }
        });
      };

      Router.prototype.setCurrent = function(view) {
        if (!(view === this.currentView)) {
          this.currentView = view;
          return view.renderPage(content());
        }
      };

      Router.prototype.project = function(projectName) {
        var view;
        if (projectName == null) projectName = 'okfn';
        view = singletons.projectPage();
        if (!view === this.currentView) this.currentView = view;
        return view.renderPage(content(), projectName);
      };

      return Router;

    })(Backbone.Router);

  }).call(this);
  
}});

window.require.define({"views/loading_view": function(exports, require, module) {
  (function() {
    var LoadingView, api, template,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    api = require('activityapi');

    template = require('views/templates/loading_bar');

    module.exports = LoadingView = (function(_super) {

      __extends(LoadingView, _super);

      function LoadingView() {
        this.error = __bind(this.error, this);
        this.minusMinus = __bind(this.minusMinus, this);
        this.plusPlus = __bind(this.plusPlus, this);
        this.percent = __bind(this.percent, this);
        this.initialize = __bind(this.initialize, this);
        LoadingView.__super__.constructor.apply(this, arguments);
      }

      LoadingView.prototype.highWaterMark = 0;

      LoadingView.prototype.current = 0;

      LoadingView.prototype.gotError = false;

      LoadingView.prototype.dom = function() {
        return $('#loading');
      };

      LoadingView.prototype.initialize = function() {
        api.bind('ajaxPlusPlus', this.plusPlus);
        api.bind('ajaxMinusMinus', this.minusMinus);
        return api.bind('ajaxError', this.error);
      };

      LoadingView.prototype.percent = function() {
        var percent, remaining;
        remaining = this.highWaterMark - this.current;
        if (this.highWaterMark > 0) {
          return (3 + Math.ceil((remaining * 97) / this.highWaterMark)) + '%';
        }
        return percent = '100%';
      };

      LoadingView.prototype.plusPlus = function() {
        var dom;
        this.current++;
        this.highWaterMark = Math.max(this.highWaterMark, this.current);
        dom = this.dom();
        dom.stop().show().css({
          opacity: 1
        });
        return dom.html(template({
          percent: this.percent()
        }));
      };

      LoadingView.prototype.minusMinus = function() {
        var dom;
        this.current--;
        dom = this.dom();
        if (this.current === 0) {
          this.highWaterMark = 0;
          if (this.gotError) {
            this.gotError = false;
          } else {
            dom.fadeOut(1000);
          }
        }
        return dom.find('.bar').css({
          width: this.percent()
        });
      };

      LoadingView.prototype.error = function() {
        var dom;
        this.gotError = true;
        dom = this.dom();
        dom.stop().show().css({
          opacity: 1
        });
        return dom.find('.bar').css({
          'background-color': '#c00'
        });
      };

      return LoadingView;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/page_project": function(exports, require, module) {
  (function() {
    var ProjectPage, api, project, projectCategory, projectMap, projects, template_page, template_pane, template_pane_facebook, template_pane_github, template_pane_mailchimp, template_pane_mailman, template_pane_twitter, template_rickshaw_graph, _i, _j, _len, _len2, _ref,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template_page = require('views/templates/page_project');

    template_pane = require('views/templates/pane');

    template_pane_mailchimp = require('views/templates/pane_mailchimp');

    template_pane_mailman = require('views/templates/pane_mailman');

    template_pane_twitter = require('views/templates/pane_twitter');

    template_pane_github = require('views/templates/pane_github');

    template_pane_facebook = require('views/templates/pane_facebook');

    template_rickshaw_graph = require('views/templates/rickshaw_graph');

    api = require('activityapi');

    projects = require('projects');

    projectMap = {};

    for (_i = 0, _len = projects.length; _i < _len; _i++) {
      projectCategory = projects[_i];
      if ('item' in projectCategory) {
        projectMap[projectCategory.item.name] = projectCategory.item;
        projectCategory.item.bigTitle = projectCategory.item.title;
        projectCategory.item.smallTitle = '';
      } else if ('items' in projectCategory) {
        _ref = projectCategory.items;
        for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
          project = _ref[_j];
          projectMap[project.name] = project;
          projectMap[project.name].bigTitle = projectCategory.header;
          projectMap[project.name].smallTitle = projectMap[project.name].title;
        }
      } else {
        console.log(projectCategory);
        throw 'No item or items in here';
      }
    }

    module.exports = ProjectPage = (function(_super) {

      __extends(ProjectPage, _super);

      function ProjectPage() {
        this.renderPaneTwitter = __bind(this.renderPaneTwitter, this);
        this.renderPaneFacebook = __bind(this.renderPaneFacebook, this);
        this.renderPaneMailchimp = __bind(this.renderPaneMailchimp, this);
        this.renderPaneMailman = __bind(this.renderPaneMailman, this);
        this.renderPaneGithub = __bind(this.renderPaneGithub, this);
        this.renderPaneBuddypressHistory = __bind(this.renderPaneBuddypressHistory, this);
        this.setPaneWidth = __bind(this.setPaneWidth, this);
        this.addPane = __bind(this.addPane, this);
        this.renderPage = __bind(this.renderPage, this);
        ProjectPage.__super__.constructor.apply(this, arguments);
      }

      ProjectPage.prototype.renderPage = function(target, projectName) {
        var _this = this;
        if (projectName == null) projectName = 'ckan';
        this.project = projectMap[projectName];
        this.$el.html(template_page(this.project));
        target.html(this.$el);
        this.container = this.$el.find('#project-container');
        api.ajaxHistoryTwitter(this.project.twitter, function(resultTwitter) {
          var key, twitter, _ref2;
          _this.resultTwitter = resultTwitter;
          if (_this.resultTwitter && _this.resultTwitter.ok) {
            _ref2 = _this.resultTwitter.data;
            for (key in _ref2) {
              twitter = _ref2[key];
              twitter.data.reverse();
            }
            return _this.addPane('Twitter', _this.renderPaneTwitter);
          }
        });
        api.ajaxHistoryGithub(this.project.github, function(resultGithub) {
          var key, repo, _ref2;
          _this.resultGithub = resultGithub;
          if (_this.resultGithub && _this.resultGithub.ok) {
            _ref2 = _this.resultGithub.data;
            for (key in _ref2) {
              repo = _ref2[key];
              repo.data.reverse();
            }
            if (_this.project.headline_github) {
              return _this.addPane('Github', _this.renderPaneGithub);
            }
          }
        });
        api.ajaxHistoryMailman(this.project.mailman, function(resultMailman) {
          var key, mailman, _ref2;
          _this.resultMailman = resultMailman;
          if (_this.resultMailman && _this.resultMailman.ok) {
            _ref2 = _this.resultMailman.data;
            for (key in _ref2) {
              mailman = _ref2[key];
              mailman.data.reverse();
            }
            return _this.addPane('Mailman', _this.renderPaneMailman);
          }
        });
        api.ajaxHistoryMailchimp(this.project.mailchimp, function(resultMailchimp) {
          var key, value, _ref2;
          _this.resultMailchimp = resultMailchimp;
          if (_this.resultMailchimp && _this.resultMailchimp.ok) {
            _ref2 = _this.resultMailchimp.data;
            for (key in _ref2) {
              value = _ref2[key];
              value.data.reverse();
            }
            return _this.addPane('Mailchimp', _this.renderPaneMailchimp);
          }
        });
        return api.ajaxHistoryFacebook(this.project.facebook, function(resultFacebook) {
          _this.resultFacebook = resultFacebook;
          if (_this.resultFacebook && _this.resultFacebook.ok) {
            _this.resultFacebook.data.history.reverse();
            return _this.addPane('Facebook', _this.renderPaneFacebook);
          }
        });
      };

      ProjectPage.prototype.addPane = function(title, renderCallback) {
        var pane, td;
        td = this.container.find('#project-container-' + title);
        if (td.length === 0) {
          throw 'Could not find a DOM element for pane "' + title + '"';
        }
        pane = $(template_pane({
          title: title
        })).appendTo(td);
        renderCallback(pane.find('.inner'));
        pane.css({
          display: 'none'
        });
        return pane.fadeIn(500);
      };

      ProjectPage.prototype.setPaneWidth = function(pane, columns) {
        var parent, width;
        width = columns * 380 - 30;
        parent = $(pane.parents('.pane')[0]);
        return parent.css('width', width);
      };

      ProjectPage.prototype.renderPaneBuddypressHistory = function(pane) {
        var d, domGraph, graph, hoverDetail, series, time, x_axis, y_axis;
        series = [
          {
            name: 'Members',
            color: 'blue',
            data: (function() {
              var _k, _len3, _ref2, _results;
              _ref2 = this.resultBuddypress.data;
              _results = [];
              for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
                d = _ref2[_k];
                _results.push({
                  x: new Date(d.timestamp).toUnixTimestamp(),
                  y: d.num_users
                });
              }
              return _results;
            }).call(this)
          }
        ];
        domGraph = $(template_rickshaw_graph()).appendTo(pane);
        graph = new Rickshaw.Graph({
          element: domGraph.find('.chart')[0],
          renderer: 'line',
          width: domGraph.width() - 50,
          height: 180,
          series: series
        });
        time = new Rickshaw.Fixtures.Time();
        x_axis = new Rickshaw.Graph.Axis.Time({
          graph: graph,
          timeUnit: time.unit('month')
        });
        y_axis = new Rickshaw.Graph.Axis.Y({
          graph: graph,
          orientation: 'left',
          tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
          element: domGraph.find('.y-axis')[0]
        });
        hoverDetail = new Rickshaw.Graph.HoverDetail({
          graph: graph
        });
        return graph.render();
      };

      ProjectPage.prototype.renderPaneGithub = function(pane) {
        var action, d, data, domGraph, graph, hoverDetail, palette, repodata, reponame, series, time, x, x_axis, y_axis, _k, _len3, _ref2, _ref3, _ref4, _results;
        x = this.resultGithub.data[this.project.headline_github];
        pane.append(template_pane_github({
          'repo': x.repo,
          'data': x.data[x.data.length - 1]
        }));
        _ref2 = ['watchers', 'issues', 'forks'];
        _results = [];
        for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
          action = _ref2[_k];
          $('<h4>History: ' + action + '</h4>').appendTo(pane);
          series = [];
          palette = new Rickshaw.Color.Palette({
            scheme: 'colorwheel'
          });
          _ref3 = this.resultGithub.data;
          for (reponame in _ref3) {
            repodata = _ref3[reponame];
            data = (function() {
              var _l, _len4, _ref4, _results2;
              _ref4 = repodata.data;
              _results2 = [];
              for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
                d = _ref4[_l];
                _results2.push({
                  x: new Date(d.timestamp).toUnixTimestamp(),
                  y: d[action]
                });
              }
              return _results2;
            })();
            series.push({
              name: reponame,
              color: palette.color(),
              data: data
            });
          }
          series.sort(function(x, y) {
            return y.data.length - x.data.length;
          });
          for (x = 1, _ref4 = series.length; 1 <= _ref4 ? x < _ref4 : x > _ref4; 1 <= _ref4 ? x++ : x--) {
            while (series[x].data.length < series[0].data.length) {
              series[x].data.unshift({
                x: series[0].data[series[0].data.length - series[x].data.length - 1].x,
                y: 0
              });
            }
          }
          domGraph = $(template_rickshaw_graph()).appendTo(pane);
          data = series[0].data;
          graph = new Rickshaw.Graph({
            element: domGraph.find('.chart')[0],
            renderer: 'line',
            width: domGraph.width() - 50,
            height: 180,
            series: series
          });
          time = new Rickshaw.Fixtures.Time();
          x_axis = new Rickshaw.Graph.Axis.Time({
            graph: graph,
            timeUnit: time.unit('month')
          });
          y_axis = new Rickshaw.Graph.Axis.Y({
            graph: graph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: domGraph.find('.y-axis')[0]
          });
          hoverDetail = new Rickshaw.Graph.HoverDetail({
            graph: graph
          });
          _results.push(graph.render());
        }
        return _results;
      };

      ProjectPage.prototype.renderPaneMailman = function(pane) {
        var action, d, data, domGraph, graph, hoverDetail, listData, listName, m, palette, series, x, x_axis, y_axis, _k, _l, _len3, _len4, _ref2, _ref3, _ref4, _ref5, _results;
        _ref2 = this.project.mailman;
        for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
          m = _ref2[_k];
          pane.append(template_pane_mailman(this.resultMailman.data[m].mailman));
        }
        _ref3 = ['subscribers', 'posts'];
        _results = [];
        for (_l = 0, _len4 = _ref3.length; _l < _len4; _l++) {
          action = _ref3[_l];
          series = [];
          palette = new Rickshaw.Color.Palette({
            scheme: 'colorwheel'
          });
          _ref4 = this.resultMailman.data;
          for (listName in _ref4) {
            listData = _ref4[listName];
            data = (function() {
              var _len5, _m, _ref5, _results2;
              _ref5 = listData.data;
              _results2 = [];
              for (_m = 0, _len5 = _ref5.length; _m < _len5; _m++) {
                d = _ref5[_m];
                _results2.push({
                  x: new Date(d.timestamp).toUnixTimestamp(),
                  y: d[action]
                });
              }
              return _results2;
            })();
            series.push({
              name: listData.mailman.name,
              color: palette.color(),
              data: data
            });
          }
          series.sort(function(x, y) {
            return y.data.length - x.data.length;
          });
          for (x = 1, _ref5 = series.length; 1 <= _ref5 ? x < _ref5 : x > _ref5; 1 <= _ref5 ? x++ : x--) {
            while (series[x].data.length < series[0].data.length) {
              series[x].data.unshift({
                x: series[0].data[series[0].data.length - series[x].data.length - 1].x,
                y: 0
              });
            }
          }
          $('<h4>History: ' + action + '</h4>').appendTo(pane);
          domGraph = $(template_rickshaw_graph()).appendTo(pane);
          data = series[0].data;
          graph = new Rickshaw.Graph({
            element: domGraph.find('.chart')[0],
            renderer: 'bar',
            width: domGraph.width() - 50,
            height: 180,
            series: series
          });
          x_axis = new Rickshaw.Graph.Axis.Time({
            graph: graph
          });
          y_axis = new Rickshaw.Graph.Axis.Y({
            graph: graph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: domGraph.find('.y-axis')[0]
          });
          hoverDetail = new Rickshaw.Graph.HoverDetail({
            graph: graph
          });
          _results.push(graph.render());
        }
        return _results;
      };

      ProjectPage.prototype.renderPaneMailchimp = function(pane) {
        var d, data, domGraph, graph, hoverDetail, listData, listName, m, palette, series, x_axis, y_axis, _k, _len3, _ref2, _ref3;
        _ref2 = this.project.mailchimp;
        for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
          m = _ref2[_k];
          pane.append(template_pane_mailchimp(this.resultMailchimp.data[m]));
        }
        series = [];
        palette = new Rickshaw.Color.Palette({
          scheme: 'colorwheel'
        });
        _ref3 = this.resultMailchimp.data;
        for (listName in _ref3) {
          listData = _ref3[listName];
          data = (function() {
            var _l, _len4, _ref4, _results;
            _ref4 = listData.data;
            _results = [];
            for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
              d = _ref4[_l];
              _results.push({
                x: new Date(d.timestamp).toUnixTimestamp(),
                y: d['members']
              });
            }
            return _results;
          })();
          series.push({
            name: listData.name,
            color: palette.color(),
            data: data
          });
        }
        domGraph = $(template_rickshaw_graph()).appendTo(pane);
        data = series[0].data;
        graph = new Rickshaw.Graph({
          element: domGraph.find('.chart')[0],
          renderer: 'line',
          width: domGraph.width() - 50,
          height: 180,
          series: series
        });
        x_axis = new Rickshaw.Graph.Axis.Time({
          graph: graph
        });
        y_axis = new Rickshaw.Graph.Axis.Y({
          graph: graph,
          orientation: 'left',
          tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
          element: domGraph.find('.y-axis')[0]
        });
        hoverDetail = new Rickshaw.Graph.HoverDetail({
          graph: graph
        });
        return graph.render();
      };

      ProjectPage.prototype.renderPaneFacebook = function(pane) {
        var d, domGraph, fbdata, graph, hoverDetail, series, time, x_axis, y_axis;
        pane.append(template_pane_facebook(this.resultFacebook.data));
        fbdata = this.resultFacebook.data.history;
        series = [
          {
            name: 'Likes',
            color: 'blue',
            data: (function() {
              var _k, _len3, _results;
              _results = [];
              for (_k = 0, _len3 = fbdata.length; _k < _len3; _k++) {
                d = fbdata[_k];
                _results.push({
                  x: new Date(d.timestamp).toUnixTimestamp(),
                  y: d.likes
                });
              }
              return _results;
            })()
          }
        ];
        domGraph = $(template_rickshaw_graph()).appendTo(pane);
        graph = new Rickshaw.Graph({
          element: domGraph.find('.chart')[0],
          renderer: 'line',
          width: domGraph.width() - 50,
          height: 180,
          series: series
        });
        time = new Rickshaw.Fixtures.Time();
        x_axis = new Rickshaw.Graph.Axis.Time({
          graph: graph,
          timeUnit: time.unit('month')
        });
        y_axis = new Rickshaw.Graph.Axis.Y({
          graph: graph,
          orientation: 'left',
          tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
          element: domGraph.find('.y-axis')[0]
        });
        hoverDetail = new Rickshaw.Graph.HoverDetail({
          graph: graph
        });
        return graph.render();
      };

      ProjectPage.prototype.renderPaneTwitter = function(pane) {
        var d, domGraph, graph, hoverDetail, series, time, twitterdata, x_axis, y_axis;
        pane.append(template_pane_twitter(this.resultTwitter.data[this.project.twitter].account));
        twitterdata = this.resultTwitter.data[this.project.twitter].data;
        series = [
          {
            name: 'Followers',
            color: 'orange',
            data: (function() {
              var _k, _len3, _results;
              _results = [];
              for (_k = 0, _len3 = twitterdata.length; _k < _len3; _k++) {
                d = twitterdata[_k];
                _results.push({
                  x: new Date(d.timestamp).toUnixTimestamp(),
                  y: d.followers
                });
              }
              return _results;
            })()
          }, {
            name: 'Tweets',
            color: 'green',
            data: (function() {
              var _k, _len3, _results;
              _results = [];
              for (_k = 0, _len3 = twitterdata.length; _k < _len3; _k++) {
                d = twitterdata[_k];
                _results.push({
                  x: new Date(d.timestamp).toUnixTimestamp(),
                  y: d.tweets
                });
              }
              return _results;
            })()
          }, {
            name: 'Following',
            color: 'red',
            data: (function() {
              var _k, _len3, _results;
              _results = [];
              for (_k = 0, _len3 = twitterdata.length; _k < _len3; _k++) {
                d = twitterdata[_k];
                _results.push({
                  x: new Date(d.timestamp).toUnixTimestamp(),
                  y: d.following
                });
              }
              return _results;
            })()
          }
        ];
        domGraph = $(template_rickshaw_graph()).appendTo(pane);
        graph = new Rickshaw.Graph({
          element: domGraph.find('.chart')[0],
          renderer: 'line',
          width: domGraph.width() - 50,
          height: 180,
          series: series
        });
        time = new Rickshaw.Fixtures.Time();
        x_axis = new Rickshaw.Graph.Axis.Time({
          graph: graph,
          timeUnit: time.unit('month')
        });
        y_axis = new Rickshaw.Graph.Axis.Y({
          graph: graph,
          orientation: 'left',
          tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
          element: domGraph.find('.y-axis')[0]
        });
        hoverDetail = new Rickshaw.Graph.HoverDetail({
          graph: graph
        });
        return graph.render();
      };

      return ProjectPage;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/templates/loading_bar": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"progress progress-striped active\"><div class=\"bar\" style=\"width: ";
    foundHelper = helpers.percent;
    stack1 = foundHelper || depth0.percent;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "percent", { hash: {} }); }
    buffer += escapeExpression(stack1) + ";\"></div><div class=\"text\">";
    foundHelper = helpers.text;
    stack1 = foundHelper || depth0.text;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "text", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div></div>\n";
    return buffer;});
}});

window.require.define({"views/templates/page_project": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<h1>";
    foundHelper = helpers.bigTitle;
    stack1 = foundHelper || depth0.bigTitle;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bigTitle", { hash: {} }); }
    buffer += escapeExpression(stack1) + " <small>";
    foundHelper = helpers.smallTitle;
    stack1 = foundHelper || depth0.smallTitle;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "smallTitle", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</small></h1>\n<table>\n  <tr id=\"project-container\">\n    <td id=\"project-container-Mailchimp\"></td>\n    <td id=\"project-container-Mailman\"></td>\n    <td id=\"project-container-Facebook\"></td>\n    <td id=\"project-container-Twitter\"></td>\n    <td id=\"project-container-Github\"></td>\n  </tr>\n</table>\n\n\n";
    return buffer;});
}});

window.require.define({"views/templates/pane": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"pane label-pane\">\n    <label>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</label>\n    <div class=\"inner\">";
    foundHelper = helpers.content;
    stack1 = foundHelper || depth0.content;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "content", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n</div>\n";
    return buffer;});
}});

window.require.define({"views/templates/pane_facebook": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"statistics-pane facebook\">\n    <div class=\"statistic-container\">\n        <div class=\"statistic\"><div class=\"top\">";
    foundHelper = helpers.likes;
    stack1 = foundHelper || depth0.likes;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "likes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div><div class=\"bottom\">likes</div></div>\n    </div>\n    <div class=\"clearfix\"> </div>\n  </div>\n</div>\n<div class=\"sub-name\">\n  Group: <a href=\"www.facebook.com/OKFNetwork\">http://www.facebook.com/OKFNetwork</a>\n</div>\n";
    return buffer;});
}});

window.require.define({"views/templates/pane_github": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n        <div class=\"statistic-container\">\n            <div class=\"statistic\"><div class=\"top\">";
    foundHelper = helpers.watchers;
    stack1 = foundHelper || depth0.watchers;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "watchers", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div><div class=\"bottom\">watchers</div></div>\n            <div class=\"statistic\"><div class=\"top\">";
    foundHelper = helpers.issues;
    stack1 = foundHelper || depth0.issues;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "issues", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div><div class=\"bottom\">issues</div></div>\n            <div class=\"statistic\"><div class=\"top\">";
    foundHelper = helpers.forks;
    stack1 = foundHelper || depth0.forks;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "forks", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div><div class=\"bottom\">forks</div></div>\n        </div>\n    ";
    return buffer;}

  function program3(depth0,data) {
    
    
    return "\n    <div class=\"clearfix\"> </div>\n    ";}

  function program5(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n<div class=\"description\">\n  <div class=\"sub-name\">Repo: <a href=\"";
    foundHelper = helpers.html_url;
    stack1 = foundHelper || depth0.html_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "html_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.full_name;
    stack1 = foundHelper || depth0.full_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "full_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></div>\n</div>\n";
    return buffer;}

    buffer += "<div class=\"statistics-pane github\">\n    ";
    foundHelper = helpers.data;
    stack1 = foundHelper || depth0.data;
    stack2 = helpers['with'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n    ";
    foundHelper = helpers.repo;
    stack1 = foundHelper || depth0.repo;
    stack2 = helpers['with'];
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</div>\n";
    foundHelper = helpers.repo;
    stack1 = foundHelper || depth0.repo;
    stack2 = helpers['with'];
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n";
    return buffer;});
}});

window.require.define({"views/templates/pane_mailchimp": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"statistics-pane mailchimp\">\n    <div class=\"statistic-container\">\n        <div class=\"statistic\"><div class=\"top\">";
    foundHelper = helpers.members;
    stack1 = foundHelper || depth0.members;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "members", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div><div class=\"bottom\">members</div></div>\n    </div>\n    <div class=\"clearfix\"></div>\n</div>\n<div class=\"sub-name\">List: <span style=\"color:#000; font-size: 12px;\">\"";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"</span></div>\n";
    return buffer;});
}});

window.require.define({"views/templates/pane_mailman": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div style=\"margin-bottom: 4px;\">\n  <strong><a href=\"";
    foundHelper = helpers.link;
    stack1 = foundHelper || depth0.link;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "link", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></strong>:\n  ";
    foundHelper = helpers.description;
    stack1 = foundHelper || depth0.description;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n</div>\n";
    return buffer;});
}});

window.require.define({"views/templates/pane_twitter": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"statistics-pane twitter\">\n    <div class=\"statistic-container\">\n        <div class=\"statistic\"><div class=\"top\">";
    foundHelper = helpers.followers;
    stack1 = foundHelper || depth0.followers;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "followers", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div><div class=\"bottom\">followers</div></div>\n        <div class=\"statistic\"><div class=\"top\">";
    foundHelper = helpers.following;
    stack1 = foundHelper || depth0.following;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "following", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div><div class=\"bottom\">following</div></div>\n        <div class=\"statistic\"><div class=\"top\">";
    foundHelper = helpers.tweets;
    stack1 = foundHelper || depth0.tweets;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "tweets", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div><div class=\"bottom\">tweets</div></div>\n    </div>\n    <div class=\"clearfix\"> </div>\n</div>\n<div class=\"sub-name\">\n  Screen name: <a href=\"http://twitter.com/";
    foundHelper = helpers.screen_name;
    stack1 = foundHelper || depth0.screen_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "screen_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">@";
    foundHelper = helpers.screen_name;
    stack1 = foundHelper || depth0.screen_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "screen_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a>\n</div>\n";
    return buffer;});
}});

window.require.define({"views/templates/rickshaw_graph": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"rickshaw\">\n  <div class=\"y-axis\"></div>\n  <div class=\"chart\"></div>\n</div>\n";});
}});

