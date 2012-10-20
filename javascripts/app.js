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

    ActivityApi.prototype.ajaxTwitter = function(screen_name, callback) {
      var url;
      if (!screen_name) {
        return callback(null);
      } else {
        url = this.url + '/history/twitter/account?name=' + screen_name;
        return this._fetch(url, callback);
      }
    };

    ActivityApi.prototype.ajaxHistoryGithub = function(repos, callback) {
      var url;
      if (!repos.length) {
        return callback(null);
      } else {
        url = this.url + '/history/github?repo=' + this._join(repos) + '&per_page=90';
        return this._fetch(url, callback);
      }
    };

    ActivityApi.prototype.ajaxHistoryBuddypress = function(callback) {
      var url;
      url = this.url + '/history/buddypress?per_page=52&grain=week';
      return this._fetch(url, callback);
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

    ActivityApi.prototype.ajaxDataPerson = function(logins, callback) {
      var url;
      if (!logins.length) {
        return callback(null);
      } else {
        url = this.url + '/data/person?per_page=' + logins.length + '&login=' + this._join(logins);
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

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var LoadingView, Router, projects;

  Router = require('router');

  LoadingView = require('views/loading_view');

  projects = require('projects');

  $(function() {
    var loadingView, project, projectList, _i, _len;
    projectList = $('#project-list').empty();
    for (_i = 0, _len = projects.length; _i < _len; _i++) {
      project = projects[_i];
      projectList.append($('<li action="project/' + project.name + '"><a href="#project/' + project.name + '">' + project.title + '</a>'));
    }
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
    (function() {

  module.exports = [
    {
      name: 'okfn',
      title: 'Open Knowledge Foundation',
      twitter: 'okfn',
      link: ['http://okfn.org', 'http://blog.okfn.org'],
      people: ['mintcanary', 'zephod', 'noelmas', 'nilstoedtmann', 'bobbydonovan'],
      mailman: ['okfn-coord', 'okfn-help', 'okfn-discuss'],
      github: [],
      buddypress_history: true
    }, {
      name: 'ckan',
      twitter: 'ckanproject',
      title: 'CKAN',
      description: 'CKAN is an open-source data hub. CKAN makes it easy to publish, share and find data. It provides a powerful and extensible system for cataloging and storing datasets, with an intuitive web front-end and API.',
      link: ['http://ckan.org', 'http://wiki.okfn.org/Projects/CKAN'],
      people: ['ross', 'toby', 'darwin', 'markw', 'seanh', 'shevski', 'davidraznick', 'amercader', 'johnglover', 'aron', 'dread', 'thejimmyg'],
      mailman: ['ckan-dev', 'ckan-discuss', 'ckan-changes', 'ckan-news', 'datahub-announce', 'datahub-news'],
      github: ['okfn/ckan', 'okfn/ckanclient', 'okfn/dataprotocols', 'okfn/buildkit', 'okfn/webstore', 'okfn/dpm', 'okfn/datahub'],
      headline_github: 'okfn/ckan'
    }, {
      name: 'openspending',
      title: 'OpenSpending',
      twitter: 'openspending',
      link: ['http://openspending.org', 'http://blog.openspending.org/', 'http://twitter.com/openspending', 'http://wiki.openspending.org/Main_Page', 'http://wheredoesmymoneygo.org/blog/'],
      people: ['pudo', 'lucychambers', 'grgr', 'vitorbaptista'],
      mailman: ['openspending', 'openspending-dev', 'wdmmg-announce'],
      github: ['okfn/dpkg-israel-state-budget', 'okfn/openspending.plugins.datatables', 'okfn/openspending.plugins.treemap']
    }, {
      name: 'schoolofdata',
      title: 'School Of Data',
      twitter: 'schoolofdata',
      link: ['http://schoolofdata.org', 'http://handbook.schoolofdata.org', 'http://opendatahandbook.org', 'http://wiki.okfn.org/Projects/Open_Data_Handbook'],
      people: ['mihi', 'jenlowe'],
      mailman: ['School-of-data', 'Scoda-dev', 'open-data-handbook'],
      github: ['okfn/datawrangling', 'okfn/schoolofdata', 'okfn/opendatahandbook'],
      headline_github: 'okfn/schoolofdata'
    }, {
      name: 'lod2',
      title: 'LOD (Linked Open Data)',
      twitter: 'lod2project',
      description: 'LOD2 is an EU-funded project involving a consortium of groups across Europe working to develop linked open data availability and to enable the creation of knowledge from interlinked data.',
      link: ['http://lod2.eu/'],
      people: [],
      mailman: ['lod2'],
      github: []
    }, {
      name: 'recline',
      title: 'Recline.js',
      twitter: 'reclinejs',
      link: ['http://reclinejs.org'],
      people: ['rgrp', 'maxogden'],
      mailman: [],
      github: ['okfn/recline'],
      headline_github: 'okfn/recline'
    }, {
      name: 'annotator',
      title: 'Annotator',
      twitter: 'okfnlabs',
      link: ['http://annotateit.org'],
      people: ['nickstenning'],
      mailman: ['annotator-dev'],
      github: ['okfn/annotator', 'okfn/annotateit', 'okfn/annotator-store', 'okfn/annotator-wordpress', 'okfn/texts.annotateit.org'],
      headline_github: 'okfn/annotator'
    }, {
      name: 'labs',
      title: 'OKFN Labs',
      twitter: 'okfnlabs',
      link: ['http://annotateit.org', 'http://okfnlabs.org/dashboard', 'http://activityapi.herokuapp.com', 'http://yourtopia.net', 'http://italia.yourtopia.net/'],
      people: ['rgrp', 'zephod', 'vndimitrova'],
      mailman: ['Yourtopia', 'okfn-labs', 'open-history'],
      github: ['okfn/timeliner', 'okfn/activityapi', 'okfn/dashboard', 'okfn/yourtopia', 'okfn/bubbletree', 'okfn/hypernotes', 'okfn/okfn.github.com', 'okfn/sprints.okfnlabs.org', 'okfn/facetview']
    }, {
      name: 'openbiblio',
      title: 'OpenBiblio',
      description: 'Open Bibliography is a JISC funded project to advocate open access to bibliographic data and to demonstrate ways that such open datasets could be utilised.',
      link: ['openbiblio.net', 'bibsoup.net'],
      people: ['markmacgillivray', 'petermr', 'tomoinn'],
      mailman: ['open-bibliography', 'bibliographica-users', 'bibliographica-folktales', 'Bibjson-dev', 'openbiblio-dev'],
      github: ['okfn/bibserver'],
      headline_github: 'okfn/bibserver'
    }, {
      name: 'okfestival',
      title: 'OKFestival',
      twitter: 'okfestival',
      link: ['http://okfestival.org'],
      people: ['keyboardkat'],
      mailman: ['OKFestival-Coord', 'Okfest-opendev'],
      github: []
    }
  ];

  /*
  module.exports = [
      {
          name: 'ckanext'
          title: 'CKAN Extensions'
          people: ['ross','toby','darwin','markw','seanh','shevski','davidraznick','amercader','johnglover','aron','dread','thejimmyg']
          mailman: []
          github: ['okfn/ckanext-webstorer', 'okfn/ckanext-iati', 'okfn/ckanext-archiver', 'okfn/ckanext-wordpresser', 'okfn/ckanext-example', 'okfn/ckanext-qa', 'okfn/ckanext-datacatalogs', 'okfn/ckanext-apps']
      }
      {
          name: 'datacatalogs'
          title: 'Data Catalogs'
          link: ['datacatalogs.org']
          people: []
          mailman: ['data-catalogs']
          github: ['okfn/ckanext-datacatalogs']
      }
      {
          name: 'opendatacommons'
          title: 'Open Data Commons'
          description: 'Open Data Commons provides legal solutions for open data, including the Public Domain Dedication and License (PDDL) and the Open Database License (ODbL).'
          link: ['http://www.opendatacommons.org/','http://wiki.okfn.org/Open_Data_Commons']
          people: []
          mailman: ['odc-coord','odc-discuss']
          github: []
      }
      {
          name: 'publicdomain'
          title: 'Public Domain Works'
          description: 'The Public Domain Works DB is an open registry of artistic works that are in the public domain. It is currently focused on books and sound recordings.'
          link: ['http://publicdomainworks.net','http://wiki.okfn.org/Public_Domain_Calculators','http://publicdomainreview.org']
          people: []
          mailman: ['pd-discuss','publicdomainreview']
          github: ['okfn/pdcalc','okfn/pdw2']
      }
      {
          name: 'opendefinition'
          title: 'The Open Definition'
          description: 'The Open (Knowledge) Definition (OD) sets out principles to define the \'open\' in open knowledge. The term knowledge is used broadly and it includes all forms of data, content such as music, films or books as well any other types of information.'
          link: ['http://www.opendefinition.org/']
          people: []
          mailman: ['od-coord','od-discuss']
          github: ['okfn/licenses','okfn/opendefinition']
      }
      {
          name: 'chapter-austria'
          title: 'OKFN Austria'
          description: 'The Austrian chapter of the OKFN'
          link: []
          people: []
          mailman: ['okfn-at']
          github: []
      }
      {
          name: 'chapter-germany'
          title: 'OKFN Germany'
          description: 'The German chapter of the OKFN'
          link: ['http://okfn.de','http://wiki.okfn.org/Chapter/Germany']
          people: []
          mailman: ['okfn-de']
          github: []
      }
      {
          name: 'chapter-brazil'
          title: 'OKFN Brazil'
          description: 'The Brazilian chapter of the OKFN'
          link: ['http://br.okfn.org','http://wiki.okfn.org/Chapter/Brazil']
          people: []
          mailman: ['okfn-br']
          github: []
      }
      {
          name: 'chapter-belgium'
          title: 'OKFN Belgium'
          description: 'The Belgian chapter of the OKFN'
          link: ['http://okfn.be','http://wiki.okfn.org/Chapter/Belgium']
          people: []
          mailman: ['okfn-be']
          github: []
      }
      {
          name: 'chapter-finland'
          title: 'OKFN Finland'
          description: 'The Finnish chapter of the OKFN'
          link: ['http://fi.okfn.org']
          people: []
          mailman: ['okfn-fi']
          github: []
      }
      {
          name: 'chapter-italy'
          title: 'OKFN Italy'
          description: 'The Italian chapter of the OKFN'
          link: ['http://it.okfn.org']
          people: []
          mailman: ['okfn-it']
          github: []
      }
      {
          name: 'chapter-all'
          title: 'All Chapters'
          description: 'All chapters of the OKFN'
          link: ['http://okfn.de','http://br.okfn.org','http://okfn.be','http://fi.okfn.org','http://it.okfn.org']
          people: []
          mailman: ['okfn-at','okfn-de', 'okfn-be', 'okfn-br', 'okfn-fi', 'okfn-it']
          github: []
      }
      {
          name: 'wg-eu-open-data'
          title: 'EU Open Data'
          description: 'Working Group on EU Open Data'
          link: ['http://wiki.okfn.org/Wg/euopendata']
          people: []
          mailman: ['euopendata']
          github: []
      }
      {
          name: 'wg-open-bibliographic-data'
          title: 'Open Bibliographic Data'
          description: 'Working Group for those interested in Open Bibliographic Data'
          link: ['http://openbiblio.net/', 'http://wiki.okfn.org/OpenBiblio']
          people: []
          mailman: []
          github: []
      }
      {
          name: 'wg-open-development'
          title: 'Open Development'
          description: 'Working for Open Knowledge in International Development'
          link: ['http://open-development.okfn.org/', 'http://wiki.okfn.org/Working_Groups/Development']
          people: []
          mailman: ['open-development']
          github: []
      }
      {
          name: 'wg-open-economics'
          title: 'Open Economics'
          description: 'Working Group for those interested in Open Data in Economics'
          link: ['http://openeconomics.net/', 'http://wiki.okfn.org/Working_Groups/Economics']
          people: []
          mailman: ['open-economics']
          github: []
      }
      {
          name: 'wg-open-government-data'
          title: 'Open Government Data'
          description: 'Working Group for those interested in Open Government Data'
          link: ['http://opengovernmentdata.org/', 'http://wiki.okfn.org/Working_Groups/Government']
          people: []
          mailman: ['open-government']
          github: []
      }
      {
          name: 'wg-open-linguistics'
          title: 'Open Linguistics'
          description: 'Working Group for those interested in Open Data about Linguistics'
          link: ['http://linguistics.okfn.org/', 'http://wiki.okfn.org/Working_Groups/linguistics']
          people: []
          mailman: ['open-linguistics']
          github: []
      }
      {
          name: 'wg-open-resources-in-the-humanities'
          title: 'Open Resources in the Humanities'
          description: 'Act as a central point of reference and support for people interested in open resources in humanities research and teaching.'
          link: ['http://humanities.okfn.org/', 'http://wiki.okfn.org/Working_Groups/Humanities']
          people: []
          mailman: ['open-humanities']
          github: []
      }
      {
          name: 'wg-open-science'
          title: 'Open Science'
          description: 'Our focus is promoting the open availability of scientific data, and we do this by developing guidelines and tools for scientists and publishers, along with other projects related to open scientific data'
          link: ['http://science.okfn.org/', 'http://wiki.okfn.org/Wg/science']
          people: []
          mailman: ['open-science']
          github: []
      }
      {
          name: 'wg-open-spending-data'
          title: 'Open Spending Data'
          description: 'Working Group for those interested in Open Spending Data '
          link: ['http://openspending.org', 'http://wiki.openspending.org/Working_Group']
          people: []
          mailman: ['openspending']
          github: []
      }
      {
          name: 'wg-public-domain'
          title: 'Public Domain'
          description: 'Working Group on the Public Domain, including Public Domain Calculators and the Public Domain Review'
          link: ['http://wiki.okfn.org/Working_Groups/publicdomain']
          people: []
          mailman: ['pd-discuss']
          github: []
      }
      {
          name: 'wg-open-design'
          title: 'Open Design'
          description: 'A working group for designers and makers'
          link: ['http://design.okfn.org/']
          people: []
          mailman: ['opendesign']
          github: []
      }
      {
          name: 'wg-open-glam-and-cultural-heritage'
          title: 'Open GLAM and Cultural Heritage'
          description: ''
          link: ['openglam.org']
          people: []
          mailman: ['open-glam']
          github: []
      }
      {
          name: 'wg-open-data-in-archaeology'
          title: 'Open Data in Archaeology'
          description: 'Working Group for Open Data in Archaeology'
          link: ['http://archaeology.okfn.org/', 'http://wiki.okfn.org/Working_Groups/archaeology']
          people: []
          mailman: ['open-archaeology']
          github: []
      }
      {
          name: 'wg-open-access'
          title: 'Open @ccess'
          description: 'Sharing the results of scientific research.'
          link: ['http://access.okfn.org/', 'http://wiki.okfn.org/Working_Groups/access']
          people: []
          mailman: ['open-access']
          github: []
      }
      {
          name: 'wg-open-climate-science'
          title: 'Open Climate Science'
          description: 'Working Group for those interested'
          link: ['http://wiki.okfn.org/Working_Groups/climatescience']
          people: []
          mailman: ['open-climate-science']
          github: []
      }
      {
          name: 'wg-open-hardware'
          title: 'Open Hardware'
          description: 'Working Group for those Interested in Open Hardware'
          link: ['http://wiki.okfn.org/Wg/hardware ', 'http://wiki.okfn.org/Open_Hardware']
          people: []
          mailman: ['open-hardware']
          github: []
      }
      {
          name: 'wg-open-legislation'
          title: 'Open Legislation'
          description: 'Working Group for those Interested in Open Legislation'
          link: ['http://wiki.okfn.org/Working_Groups/openlegislation']
          people: []
          mailman: ['open-legislation']
          github: []
      }
      {
          name: 'wg-open-transport'
          title: 'Open Transport'
          description: 'Working group for those interested in Open Transport.'
          link: ['http://wiki.okfn.org/Working_Groups/Transport']
          people: []
          mailman: ['open-transport']
          github: []
      }
      {
          name: 'wg-open-visualisation-technologies'
          title: 'Open Visualisation Technologies'
          description: 'Working Group for those interested in Open Visualisation Technologies'
          link: ['http://wiki.okfn.org/Working_Groups/Visualization']
          people: []
          mailman: ['open-visualisation']
          github: []
      }
      {
          name: 'wg-open-geospatial-data'
          title: 'Open Geospatial Data'
          description: 'Working Group for those interested in Open Geodata'
          link: ['http://wiki.okfn.org/Working_Groups/Geodata']
          people: []
          mailman: ['geo-discuss', 'open-geodata']
          github: []
      }
      {
          name: 'wg-open-text-book'
          title: 'Open Text Book'
          description: 'Open Text Book is a registry of textbooks which are free for anyone to use, reuse and redistribute - from mathematics to geology, from engineering to art history.'
          link: ['http://www.opentextbook.org/', 'http://wiki.okfn.org/Wg/opentextbooks']
          people: []
          mailman: ['opentextbooks']
          github: []
      }
  ]
  */

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
        var active, location;
        location = window.location.hash.slice(1);
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

    Router.prototype.person = function() {
      return this.setCurrent(singletons.personView());
    };

    Router.prototype.project = function(projectName) {
      var view;
      if (projectName == null) projectName = 'okfn';
      view = singletons.projectPage();
      if (!view === this.currentView) this.currentView = view;
      return view.renderPage(content(), projectName);
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
        if (domInner.width() > 0) {
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
  var ProjectPage, api, project, projectMap, projects, template_details, template_page, template_pane, template_pane_github, template_pane_twitter, template_rickshaw_graph, _i, _len,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template_page = require('views/templates/page/project');

  template_pane = require('views/templates/pane');

  template_pane_twitter = require('views/templates/pane_twitter');

  template_pane_github = require('views/templates/pane_github');

  template_rickshaw_graph = require('views/templates/rickshaw_graph');

  template_details = {
    mailman: require('views/templates/details/mailman'),
    person: require('views/templates/details/person'),
    github: require('views/templates/details/github')
  };

  api = require('activityapi');

  projects = require('projects');

  projectMap = {};

  for (_i = 0, _len = projects.length; _i < _len; _i++) {
    project = projects[_i];
    projectMap[project.name] = project;
  }

  module.exports = ProjectPage = (function(_super) {

    __extends(ProjectPage, _super);

    function ProjectPage() {
      this.renderPaneGithub = __bind(this.renderPaneGithub, this);
      this.renderPaneTwitter = __bind(this.renderPaneTwitter, this);
      this.renderPaneMailmanLists = __bind(this.renderPaneMailmanLists, this);
      this.renderPaneMailmanGraph = __bind(this.renderPaneMailmanGraph, this);
      this.renderPanePeople = __bind(this.renderPanePeople, this);
      this.renderPaneRepositories = __bind(this.renderPaneRepositories, this);
      this.renderPaneGithubGraph = __bind(this.renderPaneGithubGraph, this);
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
      this.$el.html(template_page({
        title: this.project.title
      }));
      target.html(this.$el);
      this.container = this.$el.find('#project-container');
      this.container.masonry({
        itemSelector: '.pane',
        columnWidth: 380
      });
      if (this.project.description) {
        this.addPane('Description', function(pane) {
          return pane.html(_this.project.description);
        });
      }
      api.ajaxTwitter(this.project.twitter, function(resultTwitter) {
        _this.resultTwitter = resultTwitter;
        if (_this.resultTwitter && _this.resultTwitter.ok) {
          return _this.addPane('Twitter', _this.renderPaneTwitter);
        }
      });
      api.ajaxHistoryGithub(this.project.github, function(resultGithub) {
        var key, repo, _ref;
        _this.resultGithub = resultGithub;
        if (_this.resultGithub && _this.resultGithub.ok) {
          _ref = _this.resultGithub.data;
          for (key in _ref) {
            repo = _ref[key];
            repo.data.reverse();
          }
          if (_this.project.headline_github) {
            _this.addPane('Github', _this.renderPaneGithub);
          }
          _this.addPane('Github: Watchers', _this.renderPaneGithubGraph('watchers'));
          _this.addPane('Github: Size', _this.renderPaneGithubGraph('size'));
          _this.addPane('Github: Issues', _this.renderPaneGithubGraph('issues'));
          return _this.addPane('Github: Forks', _this.renderPaneGithubGraph('forks'));
        }
      });
      api.ajaxHistoryMailman(this.project.mailman, function(resultMailman) {
        var key, mailman, _ref;
        _this.resultMailman = resultMailman;
        if (_this.resultMailman && _this.resultMailman.ok) {
          _ref = _this.resultMailman.data;
          for (key in _ref) {
            mailman = _ref[key];
            mailman.data.reverse();
          }
          _this.addPane('Mailman Subscribers', _this.renderPaneMailmanGraph('subscribers'));
          _this.addPane('Mailman Posts', _this.renderPaneMailmanGraph('posts'));
          return _this.addPane('Mailman Lists', _this.renderPaneMailmanLists);
        }
      });
      api.ajaxDataPerson(this.project.people, function(resultPeople) {
        _this.resultPeople = resultPeople;
        if (_this.resultPeople && _this.resultPeople.ok) {
          return _this.addPane('People', _this.renderPanePeople);
        }
      });
      if (this.project.buddypress_history) {
        return api.ajaxHistoryBuddypress(function(resultBuddypress) {
          _this.resultBuddypress = resultBuddypress;
          _this.resultBuddypress.data.reverse();
          return _this.addPane('okfn.org members', _this.renderPaneBuddypressHistory);
        });
      }
    };

    ProjectPage.prototype.addPane = function(title, renderCallback) {
      var pane;
      if (this.container.width() === 0) return;
      pane = $(template_pane({
        title: title
      })).appendTo(this.container);
      renderCallback(pane.find('.inner'));
      pane.css({
        display: 'none'
      });
      pane.fadeIn(500);
      return this.container.masonry('reload');
    };

    ProjectPage.prototype.setPaneWidth = function(pane, columns) {
      var parent, width;
      width = columns * 380 - 30;
      parent = $(pane.parents('.pane')[0]);
      return parent.css('width', width);
    };

    ProjectPage.prototype.renderPaneBuddypressHistory = function(pane) {
      var d, domGraph, graph, hoverDetail, series, time, x_axis, y_axis;
      console.log(this.resultBuddypress);
      series = [
        {
          name: 'Members',
          color: 'blue',
          data: (function() {
            var _j, _len2, _ref, _results;
            _ref = this.resultBuddypress.data;
            _results = [];
            for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
              d = _ref[_j];
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

    ProjectPage.prototype.renderPaneGithubGraph = function(action) {
      var _this = this;
      return function(pane) {
        var d, data, domGraph, graph, hoverDetail, palette, repodata, reponame, series, time, x, x_axis, y_axis, _ref, _ref2;
        series = [];
        palette = new Rickshaw.Color.Palette({
          scheme: 'colorwheel'
        });
        _ref = _this.resultGithub.data;
        for (reponame in _ref) {
          repodata = _ref[reponame];
          data = (function() {
            var _j, _len2, _ref2, _results;
            _ref2 = repodata.data;
            _results = [];
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              d = _ref2[_j];
              _results.push({
                x: new Date(d.timestamp).toUnixTimestamp(),
                y: d[action]
              });
            }
            return _results;
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
        for (x = 1, _ref2 = series.length; 1 <= _ref2 ? x < _ref2 : x > _ref2; 1 <= _ref2 ? x++ : x--) {
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
        return graph.render();
      };
    };

    ProjectPage.prototype.renderPaneRepositories = function(pane) {
      var m, _j, _len2, _ref, _results;
      _ref = this.project.github;
      _results = [];
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        m = _ref[_j];
        _results.push(pane.append(template_details.github(this.resultGithub.data[m].repo)));
      }
      return _results;
    };

    ProjectPage.prototype.renderPanePeople = function(pane) {
      return pane.append(template_details.person({
        person: this.resultPeople.data
      }));
    };

    ProjectPage.prototype.renderPaneMailmanGraph = function(action) {
      var _this = this;
      return function(pane) {
        var d, data, domGraph, graph, hoverDetail, listData, listName, palette, series, x, x_axis, y_axis, _ref, _ref2;
        series = [];
        palette = new Rickshaw.Color.Palette({
          scheme: 'colorwheel'
        });
        _ref = _this.resultMailman.data;
        for (listName in _ref) {
          listData = _ref[listName];
          data = (function() {
            var _j, _len2, _ref2, _results;
            _ref2 = listData.data;
            _results = [];
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              d = _ref2[_j];
              _results.push({
                x: new Date(d.timestamp).toUnixTimestamp(),
                y: d[action]
              });
            }
            return _results;
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
        for (x = 1, _ref2 = series.length; 1 <= _ref2 ? x < _ref2 : x > _ref2; 1 <= _ref2 ? x++ : x--) {
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
        return graph.render();
      };
    };

    ProjectPage.prototype.renderPaneMailmanLists = function(pane) {
      var m, _j, _len2, _ref, _results;
      _ref = this.project.mailman;
      _results = [];
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        m = _ref[_j];
        _results.push(pane.append(template_details.mailman(this.resultMailman.data[m].mailman)));
      }
      return _results;
    };

    ProjectPage.prototype.renderPaneTwitter = function(pane) {
      return pane.html(template_pane_twitter(this.resultTwitter.account));
    };

    ProjectPage.prototype.renderPaneGithub = function(pane) {
      var x;
      x = this.resultGithub.data[this.project.headline_github];
      return pane.html(template_pane_github({
        'repo': x.repo,
        'data': x.data[x.data.length - 1]
      }));
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
  var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <div style=\"margin-bottom: 4px;\">\n  <img class=\"pull-left\" src=\"";
  foundHelper = helpers.avatar;
  stack1 = foundHelper || depth0.avatar;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "avatar", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" style=\"margin-right: 8px;\" width=\"50\" height=\"50\"/>\n    <strong><a href=\"";
  foundHelper = helpers.permalink;
  stack1 = foundHelper || depth0.permalink;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "permalink", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.display_name;
  stack1 = foundHelper || depth0.display_name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "display_name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a></strong>:\n    ";
  foundHelper = helpers.about;
  stack1 = foundHelper || depth0.about;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "about", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n    <ul>\n      <li><strong>Homepage: </strong><a href=\"";
  foundHelper = helpers.website;
  stack1 = foundHelper || depth0.website;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "website", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.website;
  stack1 = foundHelper || depth0.website;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "website", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a></li>\n      <li><strong>Github: </strong>";
  foundHelper = helpers.github;
  stack1 = foundHelper || depth0.github;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "github", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</li>\n      <li><strong>Twitter: </strong>";
  foundHelper = helpers.twitter;
  stack1 = foundHelper || depth0.twitter;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "twitter", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</li>\n      <li><strong>Last Active: </strong>";
  foundHelper = helpers.last_active;
  stack1 = foundHelper || depth0.last_active;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "last_active", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</li>\n    </ul>\n  </div>\n";
  return buffer;}

  foundHelper = helpers.person;
  stack1 = foundHelper || depth0.person;
  stack2 = helpers.each;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n\n";
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
  var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<h1>Projects <small>";
  foundHelper = helpers.title;
  stack1 = foundHelper || depth0.title;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</small></h1>\n<div id=\"project-container\">\n</div>\n\n\n";
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
  "views/templates/pane": function(exports, require, module) {
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
  }
}));
(this.require.define({
  "views/templates/pane_github": function(exports, require, module) {
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
  
  var buffer = "", stack1, stack2;
  buffer += "\n    <div class=\"clearfix\"> </div>\n    <div class=\"description\">\n        ";
  foundHelper = helpers.language;
  stack1 = foundHelper || depth0.language;
  stack2 = helpers['if'];
  tmp1 = self.program(4, program4, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        <span class=\"sub-name\">(<a href=\"";
  foundHelper = helpers.html_url;
  stack1 = foundHelper || depth0.html_url;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "html_url", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.full_name;
  stack1 = foundHelper || depth0.full_name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "full_name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a>)</span>:\n        <span class=\"content\">\"";
  foundHelper = helpers.description;
  stack1 = foundHelper || depth0.description;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "description", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\"</span>\n    </div>\n    ";
  return buffer;}
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"label label-info\">";
  foundHelper = helpers.language;
  stack1 = foundHelper || depth0.language;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "language", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</span>";
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
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/pane_twitter": function(exports, require, module) {
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
  buffer += escapeExpression(stack1) + "</div><div class=\"bottom\">tweets</div></div>\n    </div>\n    <div class=\"clearfix\"> </div>\n    <div class=\"description\">\n    <span class=\"name\">";
  foundHelper = helpers.name;
  stack1 = foundHelper || depth0.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</span>\n    <span class=\"sub-name\">(<a href=\"http://twitter.com/";
  foundHelper = helpers.screen_name;
  stack1 = foundHelper || depth0.screen_name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "screen_name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">@";
  foundHelper = helpers.screen_name;
  stack1 = foundHelper || depth0.screen_name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "screen_name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a>)</span>:\n    <span class=\"content\">\"";
  foundHelper = helpers.description;
  stack1 = foundHelper || depth0.description;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "description", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\"</span>\n    </div>\n</div>\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/rickshaw_graph": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"rickshaw\">\n  <div class=\"y-axis\"></div>\n  <div class=\"chart\"></div>\n</div>\n";});
  }
}));
