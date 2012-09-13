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
  "activityapi": function(exports, require, module) {
    (function() {

  module.exports = {
    url: 'http://activityapi.herokuapp.com/api/1'
  };

}).call(this);

  }
}));
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
  "projects": function(exports, require, module) {
    
/*
TODO jpekel (Joris)
TODO naomilillie
TODO lauranewman
TODO noelmas (Sam Leon)
TODO katbraybrooke
*/

(function() {

  module.exports = [
    {
      category: 'CKAN / The Data Hub',
      projects: [
        {
          name: 'ckan',
          title: 'CKAN',
          description: 'CKAN is an open-source data hub. CKAN makes it easy to publish, share and find data. It provides a powerful and extensible system for cataloging and storing datasets, with an intuitive web front-end and API.',
          link: ['http://ckan.org', 'http://wiki.okfn.org/Projects/CKAN'],
          people: ['ross', 'toby', 'darwin', 'markw', 'seanh', 'shevski', 'davidraznick', 'amercader', 'johnglover', 'aron', 'dread', 'thejimmyg'],
          mailman: ['ckan-dev', 'ckan-discuss', 'ckan-changes', 'ckan-news'],
          github: ['okfn/ckan', 'okfn/ckanclient', 'okfn/dataprotocols', 'okfn/buildkit', 'okfn/webstore', 'okfn/dpm']
        }, {
          name: 'datahub',
          title: 'The Data Hub',
          people: [],
          mailman: ['datahub-announce', 'datahub-news'],
          github: ['okfn/datahub']
        }, {
          name: 'ckanext',
          title: 'CKAN Extensions',
          people: ['ross', 'toby', 'darwin', 'markw', 'seanh', 'shevski', 'davidraznick', 'amercader', 'johnglover', 'aron', 'dread', 'thejimmyg'],
          mailman: [],
          github: ['okfn/ckanext-webstorer', 'okfn/ckanext-iati', 'okfn/ckanext-archiver', 'okfn/ckanext-wordpresser', 'okfn/ckanext-example', 'okfn/ckanext-qa', 'okfn/ckanext-datacatalogs', 'okfn/ckanext-apps']
        }, {
          name: 'datacatalogs',
          title: 'Data Catalogs',
          link: ['datacatalogs.org'],
          people: [],
          mailman: ['data-catalogs'],
          github: ['okfn/ckanext-datacatalogs']
        }
      ]
    }, {
      category: 'Open Data',
      projects: [
        {
          name: 'openspending',
          title: 'OpenSpending',
          link: ['http://openspending.org', 'http://blog.openspending.org/', 'http://twitter.com/openspending', 'http://wiki.openspending.org/Main_Page'],
          people: ['pudo', 'lucychambers', 'grgr', 'vitorbaptista'],
          mailman: ['openspending', 'openspending-dev'],
          github: ['okfn/dpkg-israel-state-budget', 'okfn/openspending.plugins.datatables', 'okfn/openspending.plugins.treemap', 'openspending/openspending', 'openspending/openspendingjs', 'openspending/dotorg', 'openspending/openspending-etl']
        }, {
          name: 'schoolofdata',
          title: 'School Of Data',
          link: ['http://schoolofdata.org', 'http://handbook.schoolofdata.org', 'http://opendatahandbook.org', 'http://wiki.okfn.org/Projects/Open_Data_Handbook'],
          people: ['mihi', 'jenlowe'],
          mailman: ['School-of-data', 'Scoda-dev', 'open-data-handbook'],
          github: ['okfn/datawrangling', 'okfn/schoolofdata', 'okfn/opendatahandbook']
        }, {
          name: 'opendatacommons',
          title: 'Open Data Commons',
          description: 'Open Data Commons provides legal solutions for open data, including the Public Domain Dedication and License (PDDL) and the Open Database License (ODbL).',
          link: ['http://www.opendatacommons.org/', 'http://wiki.okfn.org/Open_Data_Commons'],
          people: [],
          mailman: ['odc-coord', 'odc-discuss'],
          github: []
        }, {
          name: 'lod2',
          title: 'LOD (Linked Open Data)',
          description: 'LOD2 is an EU-funded project involving a consortium of groups across Europe working to develop linked open data availability and to enable the creation of knowledge from interlinked data.',
          link: ['http://lod2.eu/'],
          people: [],
          mailman: ['lod2'],
          github: []
        }, {
          name: 'wdmmg',
          title: 'Where Does My Money Go?',
          description: 'Find out where UK public finance goes with this open-source, embeddable web application. Explore the data using maps, timelines, and best of breed visualisation technologies.',
          link: ['http://wheredoesmymoneygo.org/blog/'],
          people: [],
          mailman: ['wdmmg-announce'],
          github: ['openspending/cameroon.openspending.org', 'openspending/wheredoesmymoneygo.org']
        }, {
          name: 'publicdomain',
          title: 'Public Domain Works',
          description: 'The Public Domain Works DB is an open registry of artistic works that are in the public domain. It is currently focused on books and sound recordings.',
          link: ['http://publicdomainworks.net', 'http://wiki.okfn.org/Public_Domain_Calculators', 'http://publicdomainreview.org'],
          people: [],
          mailman: ['pd-discuss', 'publicdomainreview'],
          github: ['okfn/pdcalc', 'okfn/pdw2']
        }, {
          name: 'opendefinition',
          title: 'The Open Definition',
          description: 'The Open (Knowledge) Definition (OD) sets out principles to define the \'open\' in open knowledge. The term knowledge is used broadly and it includes all forms of data, content such as music, films or books as well any other types of information.',
          link: ['http://www.opendefinition.org/'],
          people: [],
          mailman: ['od-coord', 'od-discuss'],
          github: ['okfn/licenses', 'okfn/opendefinition']
        }
      ]
    }, {
      category: 'OKFN Labs',
      projects: [
        {
          name: 'recline',
          title: 'Recline',
          link: ['http://reclinejs.org'],
          people: ['rgrp'],
          mailman: [],
          github: ['okfn/recline', 'okfn/timeliner']
        }, {
          name: 'annotator',
          title: 'Annotator',
          description: 'Annotate any web page simply by incorporating two lines of javascript into your site or running our bookmarklet.',
          link: ['http://annotateit.org'],
          people: [],
          mailman: ['annotator-dev'],
          github: ['okfn/annotator', 'okfn/annotateit', 'okfn/annotator-store', 'okfn/annotator-wordpress', 'okfn/texts.annotateit.org']
        }, {
          name: 'dashboard',
          title: 'Dashboard',
          link: ['http://okfnlabs.org/dashboard', 'http://activityapi.herokuapp.com'],
          people: ['zephod'],
          mailman: [],
          github: ['okfn/activityapi', 'okfn/dashboard']
        }, {
          name: 'yourtopia',
          title: 'YourTopia',
          link: ['http://yourtopia.net', 'http://italia.yourtopia.net/'],
          people: ['zephod'],
          mailman: ['yourtopia'],
          github: ['okfn/yourtopia']
        }, {
          name: 'labs-projects',
          title: 'Experimental Projects',
          people: ['zephod', 'rgrp', 'vndimitrova'],
          mailman: ['okfn-labs', 'open-history'],
          github: ['okfn/bubbletree', 'okfn/hypernotes', 'okfn/okfn.github.com', 'sprints.okfnlabs.org', 'okfn/facetview']
        }
      ]
    }, {
      category: 'Bibliographic Data',
      projects: [
        {
          name: 'openbiblio',
          title: 'Working Group: OpenBiblio',
          description: 'Open Bibliography is a JISC funded project to advocate open access to bibliographic data and to demonstrate ways that such open datasets could be utilised.',
          link: ['openbiblio.net'],
          people: ['markmacgillivray', 'petermr', 'tomoinn'],
          mailman: ['open-bibliography', 'bibliographica-users', 'bibliographica-folktales'],
          github: []
        }, {
          name: 'bibserver',
          title: 'BibServer & BibJSON',
          link: ['bibsoup.net'],
          people: ['markmacgillivray', 'petermr', 'tomoinn'],
          mailman: ['Bibjson-dev', 'openbiblio-dev'],
          github: ['okfn/bibserver']
        }
      ]
    }, {
      category: 'Core',
      projects: [
        {
          name: 'okfn.org',
          title: 'OKFN Core',
          link: ['http://okfn.org', 'http://blog.okfn.org'],
          people: ['mintcanary', 'zephod', 'noelmas', 'nilstoedtmann', 'bobbydonovan'],
          mailman: ['okfn-coord', 'okfn-help'],
          github: ['okfn/wordpress-theme-okfn', 'okfn/wordpress-json-api-okfn']
        }
      ]
    }, {
      category: 'Chapters',
      projects: [
        {
          name: 'chapter-austria',
          title: 'OKFN Austria',
          description: 'The Austrian chapter of the OKFN',
          link: [],
          people: [],
          mailman: ['okfn-at'],
          github: []
        }, {
          name: 'chapter-germany',
          title: 'OKFN Germany',
          description: 'The German chapter of the OKFN',
          link: ['http://okfn.de', 'http://wiki.okfn.org/Chapter/Germany'],
          people: [],
          mailman: ['okfn-de'],
          github: []
        }, {
          name: 'chapter-brazil',
          title: 'OKFN Brazil',
          description: 'The Brazilian chapter of the OKFN',
          link: ['http://br.okfn.org', 'http://wiki.okfn.org/Chapter/Brazil'],
          people: [],
          mailman: ['okfn-br'],
          github: []
        }, {
          name: 'chapter-belgium',
          title: 'OKFN Belgium',
          description: 'The Belgian chapter of the OKFN',
          link: ['http://okfn.be', 'http://wiki.okfn.org/Chapter/Belgium'],
          people: [],
          mailman: ['okfn-be'],
          github: []
        }, {
          name: 'chapter-finland',
          title: 'OKFN Finland',
          description: 'The Finnish chapter of the OKFN',
          link: ['http://fi.okfn.org'],
          people: [],
          mailman: ['okfn-fi'],
          github: []
        }, {
          name: 'chapter-italy',
          title: 'OKFN Italy',
          description: 'The Italian chapter of the OKFN',
          link: ['http://it.okfn.org'],
          people: [],
          mailman: ['okfn-it'],
          github: []
        }, {
          name: 'chapter-all',
          title: 'All Chapters',
          description: 'All chapters of the OKFN',
          link: ['http://okfn.de', 'http://br.okfn.org', 'http://okfn.be', 'http://fi.okfn.org', 'http://it.okfn.org'],
          people: [],
          mailman: ['okfn-at', 'okfn-de', 'okfn-be', 'okfn-br', 'okfn-fi', 'okfn-it'],
          github: []
        }
      ]
    }, {
      category: 'Working Groups',
      projects: [
        {
          name: 'wg-eu-open-data',
          title: 'EU Open Data',
          description: 'Working Group on EU Open Data',
          link: ['http://wiki.okfn.org/Wg/euopendata'],
          people: [],
          mailman: ['euopendata'],
          github: []
        }, {
          name: 'wg-open-bibliographic-data',
          title: 'Open Bibliographic Data',
          description: 'Working Group for those interested in Open Bibliographic Data',
          link: ['http://openbiblio.net/', 'http://wiki.okfn.org/OpenBiblio'],
          people: [],
          mailman: [],
          github: []
        }, {
          name: 'wg-open-development',
          title: 'Open Development',
          description: 'Working for Open Knowledge in International Development',
          link: ['http://open-development.okfn.org/', 'http://wiki.okfn.org/Working_Groups/Development'],
          people: [],
          mailman: ['open-development'],
          github: []
        }, {
          name: 'wg-open-economics',
          title: 'Open Economics',
          description: 'Working Group for those interested in Open Data in Economics',
          link: ['http://openeconomics.net/', 'http://wiki.okfn.org/Working_Groups/Economics'],
          people: [],
          mailman: ['open-economics'],
          github: []
        }, {
          name: 'wg-open-government-data',
          title: 'Open Government Data',
          description: 'Working Group for those interested in Open Government Data',
          link: ['http://opengovernmentdata.org/', 'http://wiki.okfn.org/Working_Groups/Government'],
          people: [],
          mailman: ['open-government'],
          github: []
        }, {
          name: 'wg-open-linguistics',
          title: 'Open Linguistics',
          description: 'Working Group for those interested in Open Data about Linguistics',
          link: ['http://linguistics.okfn.org/', 'http://wiki.okfn.org/Working_Groups/linguistics'],
          people: [],
          mailman: ['open-linguistics'],
          github: []
        }, {
          name: 'wg-open-resources-in-the-humanities',
          title: 'Open Resources in the Humanities',
          description: 'Act as a central point of reference and support for people interested in open resources in humanities research and teaching.',
          link: ['http://humanities.okfn.org/', 'http://wiki.okfn.org/Working_Groups/Humanities'],
          people: [],
          mailman: ['open-humanities'],
          github: []
        }, {
          name: 'wg-open-science',
          title: 'Open Science',
          description: 'Our focus is promoting the open availability of scientific data, and we do this by developing guidelines and tools for scientists and publishers, along with other projects related to open scientific data',
          link: ['http://science.okfn.org/', 'http://wiki.okfn.org/Wg/science'],
          people: [],
          mailman: ['open-science'],
          github: []
        }, {
          name: 'wg-open-spending-data',
          title: 'Open Spending Data',
          description: 'Working Group for those interested in Open Spending Data ',
          link: ['http://openspending.org', 'http://wiki.openspending.org/Working_Group'],
          people: [],
          mailman: ['openspending'],
          github: []
        }, {
          name: 'wg-public-domain',
          title: 'Public Domain',
          description: 'Working Group on the Public Domain, including Public Domain Calculators and the Public Domain Review',
          link: ['http://wiki.okfn.org/Working_Groups/publicdomain'],
          people: [],
          mailman: ['pd-discuss'],
          github: []
        }, {
          name: 'wg-open-design',
          title: 'Open Design',
          description: 'A working group for designers and makers',
          link: ['http://design.okfn.org/'],
          people: [],
          mailman: ['opendesign'],
          github: []
        }, {
          name: 'wg-open-glam-and-cultural-heritage',
          title: 'Open GLAM and Cultural Heritage',
          description: '',
          link: ['openglam.org'],
          people: [],
          mailman: ['open-glam'],
          github: []
        }, {
          name: 'wg-open-data-in-archaeology',
          title: 'Open Data in Archaeology',
          description: 'Working Group for Open Data in Archaeology',
          link: ['http://archaeology.okfn.org/', 'http://wiki.okfn.org/Working_Groups/archaeology'],
          people: [],
          mailman: ['open-archaeology'],
          github: []
        }, {
          name: 'wg-open-access',
          title: 'Open @ccess',
          description: 'Sharing the results of scientific research.',
          link: ['http://access.okfn.org/', 'http://wiki.okfn.org/Working_Groups/access'],
          people: [],
          mailman: ['open-access'],
          github: []
        }, {
          name: 'wg-open-climate-science',
          title: 'Open Climate Science',
          description: 'Working Group for those interested',
          link: ['http://wiki.okfn.org/Working_Groups/climatescience'],
          people: [],
          mailman: ['open-climate-science'],
          github: []
        }, {
          name: 'wg-open-hardware',
          title: 'Open Hardware',
          description: 'Working Group for those Interested in Open Hardware',
          link: ['http://wiki.okfn.org/Wg/hardware ', 'http://wiki.okfn.org/Open_Hardware'],
          people: [],
          mailman: ['open-hardware'],
          github: []
        }, {
          name: 'wg-open-legislation',
          title: 'Open Legislation',
          description: 'Working Group for those Interested in Open Legislation',
          link: ['http://wiki.okfn.org/Working_Groups/openlegislation'],
          people: [],
          mailman: ['open-legislation'],
          github: []
        }, {
          name: 'wg-open-transport',
          title: 'Open Transport',
          description: 'Working group for those interested in Open Transport.',
          link: ['http://wiki.okfn.org/Working_Groups/Transport'],
          people: [],
          mailman: ['open-transport'],
          github: []
        }, {
          name: 'wg-open-visualisation-technologies',
          title: 'Open Visualisation Technologies',
          description: 'Working Group for those interested in Open Visualisation Technologies',
          link: ['http://wiki.okfn.org/Working_Groups/Visualization'],
          people: [],
          mailman: ['open-visualisation'],
          github: []
        }, {
          name: 'wg-open-geospatial-data',
          title: 'Open Geospatial Data',
          description: 'Working Group for those interested in Open Geodata',
          link: ['http://wiki.okfn.org/Working_Groups/Geodata'],
          people: [],
          mailman: ['geo-discuss', 'open-geodata'],
          github: []
        }, {
          name: 'wg-open-text-book',
          title: 'Open Text Book',
          description: 'Open Text Book is a registry of textbooks which are free for anyone to use, reuse and redistribute - from mathematics to geology, from engineering to art history.',
          link: ['http://www.opentextbook.org/', 'http://wiki.okfn.org/Wg/opentextbooks'],
          people: [],
          mailman: ['opentextbooks'],
          github: []
        }
      ]
    }
  ];

}).call(this);

  }
}));
(this.require.define({
  "router": function(exports, require, module) {
    (function() {
  var GithubView, MailmanView, PersonView, ProjectView, ReclineView, Router, TwitterView, content, singletons,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  GithubView = require('views/github_view');

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
      return this._github = this._github || new GithubView();
    },
    personView: function() {
      return this._person = this._person || new PersonView();
    },
    projectView: function() {
      return this._project = this._project || new ProjectView();
    },
    mailmanView: function() {
      return this._mailman = this._mailman || new MailmanView();
    },
    twitterView: function() {
      return this._twitter = this._twitter || new TwitterView();
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
      'recline': 'recline',
      'person': 'person',
      'project': 'project',
      'project/:projectName': 'project',
      'github': 'github',
      'github/:graphmode': 'github',
      'mailman': 'mailman',
      'twitter': 'twitter'
    };

    Router.prototype.initialize = function() {
      var _this = this;
      return this.on('all', function(trigger) {
        trigger = trigger.split(':');
        if (trigger[0] === 'route') {
          $('.navbar .nav li').removeClass('active');
          return $('.navbar .nav li[action="' + trigger[1] + '"]').addClass('active');
        }
      });
    };

    Router.prototype.setCurrent = function(view) {
      if (!(view === this.currentView)) {
        this.currentView = view;
        return view.render(content());
      }
    };

    Router.prototype.person = function() {
      return this.setCurrent(singletons.personView());
    };

    Router.prototype.project = function(projectName) {
      if (projectName == null) projectName = 'ckan';
      singletons.projectView().showProject(projectName);
      return this.setCurrent(singletons.projectView());
    };

    Router.prototype.github = function(graphMode) {
      if (graphMode == null) graphMode = 'watchers';
      this.setCurrent(singletons.githubView());
      return singletons.githubView().showGraph(graphMode);
    };

    Router.prototype.mailman = function() {
      return this.setCurrent(singletons.mailmanView());
    };

    Router.prototype.twitter = function() {
      return this.setCurrent(singletons.twitterView());
    };

    Router.prototype.recline = function() {
      return this.setCurrent(singletons.reclineView());
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
      this.renderGraph = __bind(this.renderGraph, this);
      this.renderActivity = __bind(this.renderActivity, this);
      this.showGraph = __bind(this.showGraph, this);
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

    GithubView.prototype.initialize = function() {
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
      return this.renderActivity();
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
      return this.renderGraph();
    };

    GithubView.prototype.showGraph = function(graphMode) {
      this.graphMode = graphMode;
      return this.renderGraph();
    };

    GithubView.prototype.renderActivity = function() {
      var activity, dom, _i, _len, _ref, _results;
      dom = this.$el.find('.activity-stream');
      if (!this.resultActivity) {
        dom.spin();
        return;
      }
      dom.spin(false);
      dom.empty();
      _ref = this.resultActivity.data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        activity = _ref[_i];
        _results.push(dom.append(activityView.render(activity)));
      }
      return _results;
    };

    GithubView.prototype.renderGraph = function() {
      var data, dom, domInner, filtered, subtitle, _i, _len, _ref;
      dom = this.$el.find('#graphholder');
      if (!this.resultHistory) {
        this.$el.find('h2 small').html('Loading...');
        dom.spin();
        return;
      }
      dom.spin(false);
      subtitle = 'Tracking ' + Object.keys(this.resultHistory.data).length + ' repositories';
      this.$el.find('h2 small').html(subtitle);
      this.$el.find('.nav li').removeClass('active');
      this.$el.find('.nav li[action="' + this.graphMode + '"]').addClass('active');
      domInner = dom.find('.graph');
      domInner.empty();
      if (this.graphData[this.graphMode]) {
        filtered = [];
        _ref = this.graphData[this.graphMode];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          data = _ref[_i];
          if (_.contains(this.graphFilter[this.graphMode], data.label)) {
            filtered.push(data);
          }
        }
        return $.plot(domInner, filtered, {
          xaxis: {
            mode: "time"
          },
          legend: {
            show: true,
            container: '#legendholder'
          }
        });
      }
    };

    GithubView.prototype.render = function(target) {
      var renderData;
      renderData = function() {
        return {
          activityUrl: this.activityUrl,
          historyUrl: this.historyUrl
        };
      };
      this.$el.html(this.template(renderData));
      target.html(this.$el);
      this.renderGraph();
      return this.renderActivity();
    };

    return GithubView;

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

    MailmanView.prototype.renderData = function() {};

    MailmanView.prototype.render = function(target) {
      this.$el.html(this.template(this.renderData));
      return target.html(this.$el);
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

    PersonView.prototype.renderData = function() {};

    PersonView.prototype.render = function(target) {
      this.$el.html(this.template(this.renderData));
      return target.html(this.$el);
    };

    return PersonView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/project_view": function(exports, require, module) {
    (function() {
  var ProjectView, api, category, project, projectJson, projectMap, template, _i, _j, _len, _len2, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = {
    page: require('views/templates/project'),
    inner: require('views/templates/project_inner'),
    pane: {
      mailman_details: require('views/templates/mailman_details'),
      person_details: require('views/templates/person_details'),
      github_details: require('views/templates/github_details')
    }
  };

  api = require('activityapi');

  projectJson = require('projects');

  projectMap = {};

  for (_i = 0, _len = projectJson.length; _i < _len; _i++) {
    category = projectJson[_i];
    _ref = category.projects;
    for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
      project = _ref[_j];
      projectMap[project.name] = project;
    }
  }

  module.exports = ProjectView = (function(_super) {

    __extends(ProjectView, _super);

    function ProjectView() {
      this.renderPaneMailman = __bind(this.renderPaneMailman, this);
      this.renderPanePeople = __bind(this.renderPanePeople, this);
      this.renderPaneGithub = __bind(this.renderPaneGithub, this);
      this.renderInner = __bind(this.renderInner, this);
      this.clickNavPeople = __bind(this.clickNavPeople, this);
      this.clickNavGithub = __bind(this.clickNavGithub, this);
      this.clickNavMailman = __bind(this.clickNavMailman, this);
      this.gotPaneMailman = __bind(this.gotPaneMailman, this);
      this.gotPaneGithub = __bind(this.gotPaneGithub, this);
      this.gotPanePeople = __bind(this.gotPanePeople, this);
      this.project = __bind(this.project, this);
      ProjectView.__super__.constructor.apply(this, arguments);
    }

    ProjectView.prototype.active = null;

    ProjectView.prototype.project = function() {
      return projectMap[this.active];
    };

    ProjectView.prototype.showProject = function(active) {
      var ajax_github, ajax_mailman, ajax_people, comma, p, person, _k, _len3, _ref2;
      this.active = active;
      p = this.project();
      this.resultGithub = null;
      this.graphGithub = null;
      this.resultMailman = null;
      this.graphMailman = null;
      ajax_github = api.url + '/history/github';
      ajax_mailman = api.url + '/history/mailman';
      ajax_people = api.url + '/data/person?per_page=' + p.people.length + '&login=';
      comma = false;
      _ref2 = p.people;
      for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
        person = _ref2[_k];
        if (comma) ajax_people += ',';
        comma = true;
        ajax_people += person;
      }
      $.ajax({
        url: ajax_github,
        dataType: 'jsonp',
        success: this.gotPaneGithub
      });
      $.ajax({
        url: ajax_mailman,
        dataType: 'jsonp',
        success: this.gotPaneMailman
      });
      $.ajax({
        url: ajax_people,
        dataType: 'jsonp',
        success: this.gotPanePeople
      });
      p.mailman_url = ajax_mailman;
      return this.renderInner();
    };

    ProjectView.prototype.gotPanePeople = function(resultPeople) {
      this.resultPeople = resultPeople;
      return this.renderPanePeople();
    };

    ProjectView.prototype.gotPaneGithub = function(resultGithub) {
      var color, d, k, name, series, v, _k, _l, _len3, _len4, _ref2, _ref3, _ref4;
      this.resultGithub = resultGithub;
      this.graphGithub = {
        'watchers': [],
        'forks': [],
        'issues': [],
        'size': []
      };
      color = 0;
      _ref2 = this.project().github;
      for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
        name = _ref2[_k];
        color = (color + 1) % 30;
        series = {};
        _ref3 = this.graphGithub;
        for (k in _ref3) {
          v = _ref3[k];
          series[k] = [];
        }
        _ref4 = this.resultGithub.data[name].data;
        for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
          d = _ref4[_l];
          for (k in series) {
            v = series[k];
            v.push([new Date(d.timestamp), d[k]]);
          }
        }
        for (k in series) {
          v = series[k];
          this.graphGithub[k].push({
            label: name,
            data: v,
            color: color
          });
        }
      }
      return this.renderPaneGithub();
    };

    ProjectView.prototype.gotPaneMailman = function(resultMailman) {
      var color, d, k, name, series, v, _k, _l, _len3, _len4, _ref2, _ref3, _ref4;
      this.resultMailman = resultMailman;
      this.graphMailman = {
        'posts': [],
        'subscribers': []
      };
      color = 0;
      _ref2 = this.project().mailman;
      for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
        name = _ref2[_k];
        color = (color + 1) % 30;
        series = {};
        _ref3 = this.graphMailman;
        for (k in _ref3) {
          v = _ref3[k];
          series[k] = [];
        }
        _ref4 = this.resultMailman.data[name].data;
        for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
          d = _ref4[_l];
          for (k in series) {
            v = series[k];
            v.push([new Date(d.timestamp), d[k]]);
          }
        }
        for (k in series) {
          v = series[k];
          this.graphMailman[k].push({
            label: name,
            data: v,
            color: color
          });
        }
      }
      return this.renderPaneMailman();
    };

    ProjectView.prototype.clickNavMailman = function(e) {
      var action;
      action = $($(e.currentTarget).parents('li')[0]).attr('action');
      this.renderPaneMailman(action);
      e.preventDefault();
      return false;
    };

    ProjectView.prototype.clickNavGithub = function(e) {
      var action;
      action = $($(e.currentTarget).parents('li')[0]).attr('action');
      this.renderPaneGithub(action);
      e.preventDefault();
      return false;
    };

    ProjectView.prototype.clickNavPeople = function(e) {
      var action;
      action = $($(e.currentTarget).parents('li')[0]).attr('action');
      this.renderPanePeople(action);
      e.preventDefault();
      return false;
    };

    ProjectView.prototype.render = function(target) {
      var active, nav, renderData;
      renderData = {
        projectJson: projectJson,
        subtitle: 'Tracking ' + Object.keys(projectMap).length + ' projects'
      };
      this.$el.html(template.page(renderData));
      target.html(this.$el);
      this.renderInner();
      nav = this.$el.find('.nav');
      active = nav.find('.active');
      if (active.length) {
        nav.scrollTop(active.position().top);
        return nav.scrollTop(active.index() * 26 - 50);
      }
    };

    ProjectView.prototype.renderInner = function() {
      var renderData;
      this.$el.find('.nav li').removeClass('active');
      this.$el.find('.nav li[action="' + this.active + '"]').addClass('active');
      renderData = {
        active: this.active,
        project: this.project()
      };
      this.$el.find('.active-project-pane').html(template.inner(renderData));
      this.$el.find('#mailman-nav a').on('click', this.clickNavMailman);
      this.$el.find('#github-nav li').not('.dropdown').find('a').on('click', this.clickNavGithub);
      this.$el.find('#people-nav a').on('click', this.clickNavPeople);
      this.renderPaneGithub();
      this.renderPaneMailman();
      return this.renderPanePeople();
    };

    ProjectView.prototype.renderPaneGithub = function(action) {
      var dom, graph, m, _k, _len3, _ref2, _results;
      if (action == null) action = "watchers";
      this.$el.find('#github-nav li').removeClass('active');
      this.$el.find('#github-nav li[action="' + action + '"]').addClass('active');
      dom = this.$el.find('#pane-github');
      dom.empty();
      if (!this.resultGithub) {
        dom.spin();
        return;
      }
      dom.spin(false);
      if (action === 'watchers' || action === 'issues' || action === 'forks' || action === 'size') {
        graph = $('<div/>').css({
          height: 180,
          'margin-top': 10
        }).appendTo(dom);
        return $.plot(graph, this.graphGithub[action], {
          xaxis: {
            mode: "time"
          }
        });
      } else if (action === 'activity') {
        return dom.html('<code>TODO</code> AJAX load Activity');
      } else if (action === 'details') {
        _ref2 = this.project().github;
        _results = [];
        for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
          m = _ref2[_k];
          _results.push(dom.append(template.pane.github_details(this.resultGithub.data[m].repo)));
        }
        return _results;
      } else {
        return dom.html('<code>Bad pathway</code>');
      }
    };

    ProjectView.prototype.renderPanePeople = function(action) {
      var dom, m, _k, _len3, _ref2, _results;
      if (action == null) action = "details";
      this.$el.find('#people-nav li').removeClass('active');
      this.$el.find('#people-nav li[action="' + action + '"]').addClass('active');
      dom = this.$el.find('#pane-people');
      dom.empty();
      if (!this.resultPeople) {
        dom.spin();
        return;
      }
      dom.spin(false);
      if (action === 'details') {
        _ref2 = this.resultPeople.data || [];
        _results = [];
        for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
          m = _ref2[_k];
          _results.push(dom.append(template.pane.person_details(m)));
        }
        return _results;
      } else if (action === 'activity') {
        return dom.html('<code>TODO</code> AJAX load Activity');
      }
    };

    ProjectView.prototype.renderPaneMailman = function(action) {
      var dom, graph, m, _k, _len3, _ref2, _results;
      if (action == null) action = "posts";
      this.$el.find('#mailman-nav li').removeClass('active');
      this.$el.find('#mailman-nav li[action="' + action + '"]').addClass('active');
      dom = this.$el.find('#pane-mailman');
      dom.empty();
      if (!this.resultMailman) {
        dom.spin();
        return;
      }
      dom.spin(false);
      if (action === 'posts' || action === 'subscribers') {
        graph = $('<div/>').css({
          height: 180,
          'margin-top': 10
        }).appendTo(dom);
        return $.plot(graph, this.graphMailman[action], {
          xaxis: {
            mode: "time"
          }
        });
      } else if (action === 'details') {
        _ref2 = this.project().mailman;
        _results = [];
        for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
          m = _ref2[_k];
          _results.push(dom.append(template.pane.mailman_details(this.resultMailman.data[m].mailman)));
        }
        return _results;
      } else {
        return dom.html('<code>TODO</code> ajax grab activity');
      }
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
  
  
  return "\n        <a class=\"avatar\" href=\"images/mm-250.jpeg\"><img src=\"images/mm-50.jpeg\" width=\"50\" height\"50\"/></a>\n      ";}

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
  buffer += escapeExpression(stack1) + "\n  </div>\n  <div class=\"icon\">\n    <img src=\"images/icons/";
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
  "views/templates/github_details": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<div style=\"margin-bottom: 4px;\">\n  <strong><a href=\"";
  foundHelper = helpers.html_url;
  stack1 = foundHelper || depth0.html_url;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "html_url", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.full_name;
  stack1 = foundHelper || depth0.full_name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "full_name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a></strong>:\n  ";
  foundHelper = helpers.description;
  stack1 = foundHelper || depth0.description;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "description", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n  <ul>\n    <li><strong>Language: </strong>";
  foundHelper = helpers.language;
  stack1 = foundHelper || depth0.language;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "language", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</li>\n    <li><strong>Fork: </strong>";
  foundHelper = helpers.fork;
  stack1 = foundHelper || depth0.fork;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "fork", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</li>\n    <li><strong>Homepage: </strong><a href=\"";
  foundHelper = helpers.homepage;
  stack1 = foundHelper || depth0.homepage;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "homepage", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.homepage;
  stack1 = foundHelper || depth0.homepage;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "homepage", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a></li>\n    <li><strong>Created: </strong>";
  foundHelper = helpers.created_at;
  stack1 = foundHelper || depth0.created_at;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "created_at", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</li>\n  </ul>\n</div>\n\n";
  return buffer;});
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
  "views/templates/mailman_details": function(exports, require, module) {
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
  "views/templates/person_details": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<div style=\"margin-bottom: 4px;\">\n<img class=\"pull-left\" src=\"";
  foundHelper = helpers.avatar;
  stack1 = foundHelper || depth0.avatar;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "avatar", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" style=\"margin-right: 8px;\" width=\"50\" height=\"50\"/>\n  <strong><a href=\"";
  foundHelper = helpers.permalink;
  stack1 = foundHelper || depth0.permalink;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "permalink", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.display_name;
  stack1 = foundHelper || depth0.display_name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "display_name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a></strong>:\n  ";
  foundHelper = helpers.about;
  stack1 = foundHelper || depth0.about;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "about", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n  <ul>\n    <li><strong>Homepage: </strong><a href=\"";
  foundHelper = helpers.website;
  stack1 = foundHelper || depth0.website;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "website", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.website;
  stack1 = foundHelper || depth0.website;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "website", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a></li>\n    <li><strong>Github: </strong>";
  foundHelper = helpers.github;
  stack1 = foundHelper || depth0.github;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "github", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</li>\n    <li><strong>Twitter: </strong>";
  foundHelper = helpers.twitter;
  stack1 = foundHelper || depth0.twitter;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "twitter", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</li>\n    <li><strong>Last Active: </strong>";
  foundHelper = helpers.last_active;
  stack1 = foundHelper || depth0.last_active;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "last_active", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</li>\n  </ul>\n</div>\n\n\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/project": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n                <li class=\"nav-header\">";
  foundHelper = helpers.category;
  stack1 = foundHelper || depth0.category;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "category", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</li>\n                ";
  foundHelper = helpers.projects;
  stack1 = foundHelper || depth0.projects;
  stack2 = helpers.each;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            ";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                    <li action=\"";
  foundHelper = helpers.name;
  stack1 = foundHelper || depth0.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\"><a href=\"#project/";
  foundHelper = helpers.name;
  stack1 = foundHelper || depth0.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.title;
  stack1 = foundHelper || depth0.title;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a></li>\n                ";
  return buffer;}

  buffer += "<h1>Projects <small>";
  foundHelper = helpers.subtitle;
  stack1 = foundHelper || depth0.subtitle;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "subtitle", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</small></h1>\n<div class=\"row\">\n    <div class=\"span3\">\n        <ul class=\"nav nav-list well\" style=\"max-height: 400px; overflow: scroll;\">\n            ";
  foundHelper = helpers.projectJson;
  stack1 = foundHelper || depth0.projectJson;
  stack2 = helpers.each;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </ul>\n    </div>\n    <div class=\"active-project-pane\">\n    </div>\n</div>\n\n\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/project_inner": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n";
  foundHelper = helpers.project;
  stack1 = foundHelper || depth0.project;
  stack2 = helpers['with'];
  tmp1 = self.program(2, program2, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n<div class=\"span9\">\n    <h2>";
  foundHelper = helpers.title;
  stack1 = foundHelper || depth0.title;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</h2>\n    <div class=\"row\">\n        <div class=\"span5\">\n            <div class=\"pane label-pane\">\n                <label>Mailing Lists</label>\n                <ul class=\"nav nav-tabs\" id=\"mailman-nav\">\n                    <li action=\"posts\"><a href=\"#\">Posts</a></li>\n                    <li action=\"subscribers\"><a href=\"#\">Subscribers</a></li>\n                    <li action=\"activity\"><a href=\"#\">Activity</a></li>\n                    <li action=\"details\"><a href=\"#\">Details</a></li>\n                </ul>\n                <div id=\"pane-mailman\"></div>\n            </div>\n        </div>\n        <div class=\"span4\">\n            <div class=\"pane label-pane\">\n                <label>Github</label>\n                <ul class=\"nav nav-tabs\" id=\"github-nav\">\n                    <li class=\"dropdown\">\n                    <a class=\"dropdown-toggle\"\n                        data-toggle=\"dropdown\"\n                        href=\"#\">\n                        Graph\n                        <b class=\"caret\"></b>\n                    </a>\n                    <ul class=\"dropdown-menu\">\n                        <li action=\"watchers\"><a href=\"#\">Watchers</a></li>\n                        <li action=\"size\"><a href=\"#\">Size</a></li>\n                        <li action=\"issues\"><a href=\"#\">Issues</a></li>\n                        <li action=\"forks\"><a href=\"#\">Forks</a></li>\n                    </ul>\n                    <li action=\"activity\"><a href=\"#\">Activity</a></li>\n                    <li action=\"details\"><a href=\"#\">Details</a></li>\n                </ul>\n                <div id=\"pane-github\"></div>\n            </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"span4\">\n            <div class=\"pane label-pane\">\n                <label>Recent Events</label>\n                <div id=\"pane-activity\"><code>TODO</code> AJAX load stream</div>\n            </div>\n        </div>\n        <div class=\"span5\">\n            <div class=\"pane label-pane\">\n                <label>People</label>\n                <ul class=\"nav nav-tabs\" id=\"people-nav\">\n                    <li action=\"details\"><a href=\"#\">Details</a></li>\n                    <li action=\"activity\"><a href=\"#\">Activity</a></li>\n                </ul>\n                <div id=\"pane-people\"></div>\n            </div>\n        </div>\n    </div>\n    <div class=\"row\" style=\"margin-top: 40px;\">\n        <div class=\"span8 offset4\">\n            <div class=\"well\">\n                <strong>Description: </strong>";
  foundHelper = helpers.description;
  stack1 = foundHelper || depth0.description;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "description", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n                <ul>";
  foundHelper = helpers.link;
  stack1 = foundHelper || depth0.link;
  stack2 = helpers.each;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</ul>\n            </div>\n        </div>\n    </div>\n</div>\n";
  return buffer;}
function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li><a href=\"";
  stack1 = depth0;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  stack1 = depth0;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a></li>";
  return buffer;}

function program5(depth0,data) {
  
  
  return "\n<div class=\"span9\">\n    <h2>Select a project...</h2>\n</div>\n";}

  foundHelper = helpers.active;
  stack1 = foundHelper || depth0.active;
  stack2 = helpers['if'];
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.program(5, program5, data);
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/project_inner_mailman": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", foundHelper, self=this;


  return buffer;});
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

    TwitterView.prototype.renderData = function() {};

    TwitterView.prototype.render = function(target) {
      this.$el.html(this.template(this.renderData));
      return target.html(this.$el);
    };

    return TwitterView;

  })(Backbone.View);

}).call(this);

  }
}));
