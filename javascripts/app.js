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

    ActivityApi.prototype.ajaxHistoryMailman = function(lists, callback) {
      var url;
      if (!lists.length) {
        return callback(null);
      } else {
        url = this.url + '/history/mailman?list=' + this._join(lists) + '&per_page=90';
        return this._fetch(url, callback);
      }
    };

    ActivityApi.prototype.ajaxDataPerson = function(logins, callback) {
      var url;
      if (!logins.length) {
        return callback(null);
      } else {
        url = this.url + '/data/person?per_page=' + logins.length + '&login=' + this._join(logins);
        return this._fetch(url, callback);
      }
    };

    ActivityApi.prototype._wrapCallback = function(callback) {
      var _this = this;
      return function(data) {
        _this.trigger('ajaxMinusMinus');
        return callback(data);
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
        success: this._wrapCallback(callback),
        dataType: 'jsonp',
        error: this._error
      });
    };

    return ActivityApi;

  })(Backbone.Model);

  module.exports = new ActivityApi();

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var LoadingView, Router;

  Router = require('router');

  LoadingView = require('views/loading_view');

  $(function() {
    var loadingView;
    this.router = new Router();
    loadingView = new LoadingView();
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
          mailman: ['okfn-coord', 'okfn-help', 'okfn-discuss'],
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
  var GithubView, MailmanView, PersonView, ProjectPage, Router, TwitterView, content, singletons,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  GithubView = require('views/page_github');

  PersonView = require('views/page_people');

  ProjectPage = require('views/page_project');

  MailmanView = require('views/page_mailman');

  TwitterView = require('views/page_twitter');

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
    projectPage: function() {
      return this._project = this._project || new ProjectPage();
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
        return view.renderPage(content());
      }
    };

    Router.prototype.person = function() {
      return this.setCurrent(singletons.personView());
    };

    Router.prototype.project = function(projectName) {
      if (projectName == null) projectName = 'ckan';
      this.setCurrent(singletons.projectPage());
      return singletons.projectPage().showProject(projectName);
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
  "views/loading_view": function(exports, require, module) {
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

  }
}));
(this.require.define({
  "views/page_github": function(exports, require, module) {
    (function() {
  var GithubView, activityView, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('views/templates/page/github');

  activityView = require('views/activity_view');

  module.exports = GithubView = (function(_super) {

    __extends(GithubView, _super);

    function GithubView() {
      this.renderPage = __bind(this.renderPage, this);
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

    GithubView.prototype.renderPage = function(target) {
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
  "views/page_mailman": function(exports, require, module) {
    (function() {
  var MailmanView, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('views/templates/page/mailman');

  module.exports = MailmanView = (function(_super) {

    __extends(MailmanView, _super);

    function MailmanView() {
      MailmanView.__super__.constructor.apply(this, arguments);
    }

    MailmanView.prototype.template = template;

    MailmanView.prototype.renderData = function() {};

    MailmanView.prototype.renderPage = function(target) {
      this.$el.html(this.template(this.renderData));
      return target.html(this.$el);
    };

    return MailmanView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/page_people": function(exports, require, module) {
    (function() {
  var PersonView, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('views/templates/page/people');

  module.exports = PersonView = (function(_super) {

    __extends(PersonView, _super);

    function PersonView() {
      PersonView.__super__.constructor.apply(this, arguments);
    }

    PersonView.prototype.template = template;

    PersonView.prototype.renderData = function() {};

    PersonView.prototype.renderPage = function(target) {
      this.$el.html(this.template(this.renderData));
      return target.html(this.$el);
    };

    return PersonView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/page_project": function(exports, require, module) {
    (function() {
  var ProjectPage, ProjectView, category, project, projectJson, projectMap, template, _i, _j, _len, _len2, _ref,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ProjectView = require('views/project_view');

  template = require('views/templates/page/project');

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

  module.exports = ProjectPage = (function(_super) {

    __extends(ProjectPage, _super);

    function ProjectPage() {
      ProjectPage.__super__.constructor.apply(this, arguments);
    }

    ProjectPage.prototype.showProject = function(projectName) {
      var inner;
      inner = this.$el.find('#project-container');
      if (this.view) this.view.removeFromDom();
      if (projectName) {
        this.view = new ProjectView(projectMap[projectName]);
        return inner.append(this.view.$el);
      }
    };

    ProjectPage.prototype.renderPage = function(target) {
      var nav, navActive, renderData;
      renderData = {
        projectJson: projectJson,
        subtitle: 'Tracking ' + Object.keys(projectMap).length + ' projects'
      };
      this.$el.html(template(renderData));
      target.html(this.$el);
      nav = this.$el.find('.nav');
      navActive = nav.find('.active');
      if (navActive.length) {
        nav.scrollTop(navActive.position().top);
        return nav.scrollTop(navActive.index() * 26 - 50);
      }
    };

    return ProjectPage;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/page_twitter": function(exports, require, module) {
    (function() {
  var TwitterView, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('views/templates/page/twitter');

  module.exports = TwitterView = (function(_super) {

    __extends(TwitterView, _super);

    function TwitterView() {
      TwitterView.__super__.constructor.apply(this, arguments);
    }

    TwitterView.prototype.template = template;

    TwitterView.prototype.renderData = function() {};

    TwitterView.prototype.renderPage = function(target) {
      this.$el.html(this.template(this.renderData));
      return target.html(this.$el);
    };

    return TwitterView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/project_view": function(exports, require, module) {
    (function() {
  var ProjectView, api, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = {
    pane: {
      mailman: require('views/templates/pane/mailman'),
      person: require('views/templates/pane/people'),
      github: require('views/templates/pane/github'),
      project: require('views/templates/pane/project')
    },
    details: {
      mailman: require('views/templates/details/mailman'),
      person: require('views/templates/details/person'),
      github: require('views/templates/details/github')
    }
  };

  api = require('activityapi');

  module.exports = ProjectView = (function(_super) {

    __extends(ProjectView, _super);

    function ProjectView() {
      this.renderPaneMailman = __bind(this.renderPaneMailman, this);
      this.renderPanePeople = __bind(this.renderPanePeople, this);
      this.renderPaneGithub = __bind(this.renderPaneGithub, this);
      this.addPane = __bind(this.addPane, this);
      this.removeFromDom = __bind(this.removeFromDom, this);
      this.initialize = __bind(this.initialize, this);
      ProjectView.__super__.constructor.apply(this, arguments);
    }

    ProjectView.prototype.cancel = false;

    ProjectView.prototype.initialize = function(project) {
      var _this = this;
      this.project = project;
      if (this.project.description) {
        this.addPane(template.pane.project, function(pane) {
          return pane.find('.inner').html(_this.project.description);
        });
      }
      api.ajaxHistoryGithub(this.project.github, function(resultGithub) {
        _this.resultGithub = resultGithub;
        if (_this.resultGithub && _this.resultGithub.ok) {
          return _this.addPane(template.pane.github, _this.renderPaneGithub);
        }
      });
      api.ajaxHistoryMailman(this.project.mailman, function(resultMailman) {
        _this.resultMailman = resultMailman;
        if (_this.resultMailman && _this.resultMailman.ok) {
          return _this.addPane(template.pane.mailman, _this.renderPaneMailman);
        }
      });
      return api.ajaxDataPerson(this.project.people, function(resultPeople) {
        _this.resultPeople = resultPeople;
        if (_this.resultPeople && _this.resultPeople.ok) {
          return _this.addPane(template.pane.person, _this.renderPanePeople);
        }
      });
    };

    ProjectView.prototype.removeFromDom = function() {
      this.cancel = true;
      return this.$el.remove();
    };

    ProjectView.prototype.addPane = function(template, renderCallback) {
      var child, clickNav, getIndex, myIndex, pane, _i, _len, _ref,
        _this = this;
      if (this.cancel) return;
      pane = $(template());
      getIndex = function(domElement) {
        var index, label;
        label = $($(domElement).find('label')[0]).text();
        index = ['Description', 'Mailing Lists', 'Github', 'People'].indexOf(label);
        if (index === -1) {
          return 999;
        } else {
          return index;
        }
      };
      myIndex = getIndex(pane);
      _ref = this.$el.children();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (myIndex >= 0 && myIndex < (getIndex(child))) {
          pane.insertBefore($(child));
          break;
        }
      }
      if (!pane.parent().length) this.$el.append(pane);
      clickNav = function(e) {
        var action, dropdown, li;
        li = $($(e.currentTarget).parents('li')[0]);
        action = li.attr('action');
        renderCallback(pane, action);
        e.preventDefault();
        dropdown = li.parents('.dropdown');
        dropdown.click();
        return false;
      };
      pane.find('.nav li').not('.dropdown').find('a').on('click', clickNav);
      renderCallback(pane);
      pane.css({
        display: 'none'
      });
      return pane.fadeIn(500);
    };

    ProjectView.prototype.renderPage = function(target) {
      var active, nav, renderData;
      renderData = {
        projectJson: projectJson,
        subtitle: 'Tracking ' + Object.keys(projectMap).length + ' projects'
      };
      this.$el.html(template.page(renderData));
      target.html(this.$el);
      nav = this.$el.find('.nav');
      active = nav.find('.active');
      if (active.length) {
        nav.scrollTop(active.position().top);
        return nav.scrollTop(active.index() * 26 - 50);
      }
    };

    ProjectView.prototype.renderPaneGithub = function(pane, action) {
      var active, color, d, domElement, m, pane_inner, plotData, repodata, reponame, _i, _len, _ref, _ref2, _results;
      if (action == null) action = "watchers";
      pane_inner = pane.find('.inner');
      pane_inner.empty();
      pane.find('.nav li').removeClass('active');
      active = pane.find('.nav li[action="' + action + '"]');
      active.addClass('active');
      active.parents('li.dropdown').addClass('active');
      if (action === 'watchers' || action === 'issues' || action === 'forks' || action === 'size') {
        plotData = [];
        color = 0;
        _ref = this.resultGithub.data;
        for (reponame in _ref) {
          repodata = _ref[reponame];
          plotData.push({
            label: reponame,
            data: (function() {
              var _i, _len, _ref2, _results;
              _ref2 = repodata.data;
              _results = [];
              for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                d = _ref2[_i];
                _results.push([new Date(d.timestamp), d[action]]);
              }
              return _results;
            })(),
            color: (++color) % 30
          });
        }
        domElement = $('<div/>').css({
          height: 180,
          'margin-top': 10
        }).appendTo(pane_inner);
        return $.plot(domElement, plotData, {
          xaxis: {
            mode: "time"
          }
        });
      } else if (action === 'activity') {
        return pane_inner.html('<code>TODO</code> AJAX load Activity');
      } else if (action === 'details') {
        _ref2 = this.project().github;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          m = _ref2[_i];
          _results.push(pane_inner.append(template.details.github(this.resultGithub.data[m].repo)));
        }
        return _results;
      } else {
        return pane_inner.html('<code>Bad pathway</code>');
      }
    };

    ProjectView.prototype.renderPanePeople = function(pane, action) {
      var m, pane_inner, _i, _len, _ref, _results;
      if (action == null) action = "details";
      pane_inner = pane.find('.inner');
      pane_inner.empty();
      pane.find('.nav li').removeClass('active');
      pane.find('.nav li[action="' + action + '"]').addClass('active');
      if (action === 'details') {
        _ref = this.resultPeople.data || [];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          m = _ref[_i];
          _results.push(pane_inner.append(template.details.person(m)));
        }
        return _results;
      } else if (action === 'activity') {
        return pane_inner.html('<code>TODO</code> AJAX load Activity');
      }
    };

    ProjectView.prototype.renderPaneMailman = function(pane, action) {
      var color, d, domElement, listData, listName, m, pane_inner, plotData, series, _i, _len, _ref, _ref2, _results;
      if (action == null) action = "posts";
      pane_inner = pane.find('.inner');
      pane_inner.empty();
      pane.find('.nav li').removeClass('active');
      pane.find('.nav li[action="' + action + '"]').addClass('active');
      if (action === 'posts' || action === 'subscribers') {
        plotData = [];
        color = 0;
        _ref = this.resultMailman.data;
        for (listName in _ref) {
          listData = _ref[listName];
          color = (color + 1) % 30;
          series = (function() {
            var _i, _len, _ref2, _results;
            _ref2 = listData.data;
            _results = [];
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              d = _ref2[_i];
              _results.push([new Date(d.timestamp), d[action]]);
            }
            return _results;
          })();
          plotData.push({
            label: listData.mailman.name,
            data: series,
            color: color
          });
        }
        domElement = $('<div/>').css({
          height: 180,
          'margin-top': 10
        }).appendTo(pane_inner);
        return $.plot(domElement, plotData, {
          xaxis: {
            mode: "time"
          }
        });
      } else if (action === 'details') {
        _ref2 = this.project().mailman;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          m = _ref2[_i];
          _results.push(pane_inner.append(template.details.mailman(this.resultMailman.data[m].mailman)));
        }
        return _results;
      } else {
        return pane_inner.html('<code>TODO</code> ajax grab activity');
      }
    };

    return ProjectView;

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
  "views/templates/details/github": function(exports, require, module) {
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
  "views/templates/details/mailman": function(exports, require, module) {
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
  "views/templates/details/person": function(exports, require, module) {
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
  "views/templates/loading_bar": function(exports, require, module) {
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
  }
}));
(this.require.define({
  "views/templates/page/github": function(exports, require, module) {
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
  "views/templates/page/mailman": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<code>TODO</code> mailinglist view\n\n";});
  }
}));
(this.require.define({
  "views/templates/page/people": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<code>TODO</code> people directory view\n";});
  }
}));
(this.require.define({
  "views/templates/page/project": function(exports, require, module) {
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
  buffer += escapeExpression(stack1) + "</small></h1>\n<div class=\"row-fluid\">\n    <div class=\"span3\">\n        <ul class=\"nav nav-list well\" style=\"max-height: 400px; overflow: scroll;\">\n            ";
  foundHelper = helpers.projectJson;
  stack1 = foundHelper || depth0.projectJson;
  stack2 = helpers.each;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </ul>\n    </div>\n    <div id=\"project-container\" class=\"span9\">\n    </div>\n</div>\n\n\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/page/twitter": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<code>TODO</code> twitter analytics view\n\n";});
  }
}));
(this.require.define({
  "views/templates/pane/activity": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"pane label-pane\">\n    <label>Recent Events</label>\n    <div id=\"pane-activity\"><code>TODO</code> AJAX load stream</div>\n</div>\n";});
  }
}));
(this.require.define({
  "views/templates/pane/github": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"pane label-pane\">\n    <label>Github</label>\n    <ul class=\"nav nav-tabs\">\n        <li class=\"dropdown\">\n        <a class=\"dropdown-toggle\"\n            data-toggle=\"dropdown\"\n            href=\"#\">\n            Graph\n            <b class=\"caret\"></b>\n        </a>\n        <ul class=\"dropdown-menu\">\n            <li action=\"watchers\"><a href=\"#\">Watchers</a></li>\n            <li action=\"size\"><a href=\"#\">Size</a></li>\n            <li action=\"issues\"><a href=\"#\">Issues</a></li>\n            <li action=\"forks\"><a href=\"#\">Forks</a></li>\n        </ul>\n        <li action=\"activity\"><a href=\"#\">Activity</a></li>\n        <li action=\"details\"><a href=\"#\">Details</a></li>\n    </ul>\n    <div class=\"inner\"></div>\n</div>\n";});
  }
}));
(this.require.define({
  "views/templates/pane/mailman": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"pane label-pane\">\n    <label>Mailing Lists</label>\n    <ul class=\"nav nav-tabs\" id=\"mailman-nav\">\n        <li action=\"posts\"><a href=\"#\">Posts</a></li>\n        <li action=\"subscribers\"><a href=\"#\">Subscribers</a></li>\n        <li action=\"activity\"><a href=\"#\">Activity</a></li>\n        <li action=\"details\"><a href=\"#\">Details</a></li>\n    </ul>\n    <div class=\"inner\"></div>\n</div>\n";});
  }
}));
(this.require.define({
  "views/templates/pane/people": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"pane label-pane\">\n    <label>People</label>\n    <ul class=\"nav nav-tabs\" id=\"people-nav\">\n        <li action=\"details\"><a href=\"#\">Details</a></li>\n        <li action=\"activity\"><a href=\"#\">Activity</a></li>\n    </ul>\n    <div class=\"inner\"></div>\n</div>\n";});
  }
}));
(this.require.define({
  "views/templates/pane/project": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"pane label-pane pane-collapse\">\n    <label>Description</label>\n    <div class=\"inner\"></div>\n</div>\n";});
  }
}));
