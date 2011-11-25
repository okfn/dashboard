This is a custom build of the OpenLayers Javascript mapping library, 
based on Adria's work in the ckanext-spacial project.

dashboard_build.cfg contains a custom build profile of the OpenLayers modules.
We import only what we require, because a full build of OpenLayers is over 1MB.

To add more classes to the build profile (and so expand functionality),
modify dashboard_build.cfg and re-run the OpenLayers build tool.

1. Download OpenLayers source code from http://openlayers.org

2. Look at openlayers/build/README.txt. Follow instructions to install the
   closure compiler.

3. Modify the dashboard_build.cfg, eg. to add files under the [include] header.

4. Go to openlayers/build/ and execute::

    python build.py -c closure {dashboard}/app/js/openlayers/build.dashboard.cfg {dashboard}/app/js/openlayers/openlayers.dashboard.js
    
The theme used for the OpenLayers controls is the "dark" theme made available
by Development Seed under the BSD License:

https://github.com/developmentseed/openlayers_themes/blob/master/LICENSE.txt

