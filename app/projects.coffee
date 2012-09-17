
###
TODO jpekel (Joris)
TODO naomilillie
TODO lauranewman
TODO noelmas (Sam Leon)
TODO katbraybrooke 
###

module.exports = [
    { 
        category: 'CKAN / The Data Hub'
        projects: [ {
            name: 'ckan'
            title: 'CKAN'
            description: 'CKAN is an open-source data hub. CKAN makes it easy to publish, share and find data. It provides a powerful and extensible system for cataloging and storing datasets, with an intuitive web front-end and API.'
            link: ['http://ckan.org','http://wiki.okfn.org/Projects/CKAN']
            people: ['ross','toby','darwin','markw','seanh','shevski','davidraznick','amercader','johnglover','aron','dread','thejimmyg']
            mailman: ['ckan-dev','ckan-discuss','ckan-changes','ckan-news']
            github: ['okfn/ckan', 'okfn/ckanclient', 'okfn/dataprotocols', 'okfn/buildkit', 'okfn/webstore', 'okfn/dpm' ]
        }
        {
            name: 'datahub'
            title: 'The Data Hub'
            people: []
            mailman: ['datahub-announce','datahub-news']
            github: ['okfn/datahub']
        }
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
        ]
    }
    {
        category: 'Open Data'
        projects: [ {
            name: 'openspending'
            title: 'OpenSpending'
            link: ['http://openspending.org','http://blog.openspending.org/','http://twitter.com/openspending','http://wiki.openspending.org/Main_Page']
            people: ['pudo','lucychambers','grgr','vitorbaptista']
            mailman: ['openspending','openspending-dev']
            github: ['okfn/dpkg-israel-state-budget','okfn/openspending.plugins.datatables','okfn/openspending.plugins.treemap','openspending/openspending','openspending/openspendingjs','openspending/dotorg','openspending/openspending-etl']
        }
        {
            name: 'schoolofdata'
            title: 'School Of Data'
            link: ['http://schoolofdata.org','http://handbook.schoolofdata.org','http://opendatahandbook.org','http://wiki.okfn.org/Projects/Open_Data_Handbook']
            people: ['mihi','jenlowe']
            mailman: ['School-of-data','Scoda-dev','open-data-handbook']
            github: ['okfn/datawrangling','okfn/schoolofdata','okfn/opendatahandbook']
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
            name: 'lod2'
            title: 'LOD (Linked Open Data)'
            description: 'LOD2 is an EU-funded project involving a consortium of groups across Europe working to develop linked open data availability and to enable the creation of knowledge from interlinked data.'
            link: ['http://lod2.eu/']
            people: []
            mailman: ['lod2']
            github: []
        }
        {
            name: 'wdmmg'
            title: 'Where Does My Money Go?'
            description: 'Find out where UK public finance goes with this open-source, embeddable web application. Explore the data using maps, timelines, and best of breed visualisation technologies.'
            link: ['http://wheredoesmymoneygo.org/blog/']
            people: []
            mailman: ['wdmmg-announce']
            github: ['openspending/cameroon.openspending.org','openspending/wheredoesmymoneygo.org']
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
        ]
    }
    {
        category: 'OKFN Labs'
        projects: [ {
            name: 'recline'
            title: 'Recline'
            link: ['http://reclinejs.org']
            people: ['rgrp']
            mailman: []
            github: ['okfn/recline','okfn/timeliner']
        }
        {
            name: 'annotator'
            title: 'Annotator'
            description: 'Annotate any web page simply by incorporating two lines of javascript into your site or running our bookmarklet.'
            link: ['http://annotateit.org']
            people: []
            mailman: ['annotator-dev']
            github: ['okfn/annotator','okfn/annotateit','okfn/annotator-store','okfn/annotator-wordpress','okfn/texts.annotateit.org']
        }
        {
            name: 'dashboard'
            title: 'Dashboard'
            link: ['http://okfnlabs.org/dashboard','http://activityapi.herokuapp.com']
            people: ['zephod']
            mailman: []
            github: ['okfn/activityapi','okfn/dashboard']
        }
        {
            name: 'yourtopia'
            title: 'YourTopia'
            link: ['http://yourtopia.net','http://italia.yourtopia.net/']
            people: ['zephod']
            mailman: ['yourtopia']
            github: ['okfn/yourtopia']
        }
        {
            name: 'labs-projects'
            title: 'Experimental Projects'
            people: ['zephod','rgrp','vndimitrova']
            mailman: ['okfn-labs','open-history']
            github: ['okfn/bubbletree','okfn/hypernotes','okfn/okfn.github.com','sprints.okfnlabs.org','okfn/facetview']
        }
        ]
    }
    {
        category: 'Bibliographic Data'
        projects: [ {
            name: 'openbiblio'
            title: 'Working Group: OpenBiblio'
            description: 'Open Bibliography is a JISC funded project to advocate open access to bibliographic data and to demonstrate ways that such open datasets could be utilised.'
            link: ['openbiblio.net']
            people: ['markmacgillivray','petermr','tomoinn']
            mailman: ['open-bibliography','bibliographica-users','bibliographica-folktales']
            github: []
        }
        {
            name: 'bibserver'
            title: 'BibServer & BibJSON'
            link: ['bibsoup.net']
            people: ['markmacgillivray','petermr','tomoinn']
            mailman: ['Bibjson-dev','openbiblio-dev']
            github: ['okfn/bibserver']
        }
        ]
    }
    {
        category: 'Core'
        projects: [ {
            name: 'okfn.org'
            title: 'OKFN Core'
            link: ['http://okfn.org','http://blog.okfn.org']
            people: ['mintcanary','zephod','noelmas','nilstoedtmann','bobbydonovan']
            mailman: ['okfn-coord','okfn-help','okfn-discuss']
            github: ['okfn/wordpress-theme-okfn','okfn/wordpress-json-api-okfn']
        }
        ]
    }
    {
        category: 'Chapters'
        projects: [ {
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
        ]
    }
    {
        category: 'Working Groups'
        projects: [{
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
        }]
    }
]

