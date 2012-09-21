exports.config =
  # See docs at http://brunch.readthedocs.org/en/latest/config.html.

  # Edit the next line to change default build path.
  paths:
    public: 'public'

  files:
    javascripts:
      # Defines what file will be generated with `brunch generate`.
      defaultExtension: 'coffee'
      # Describes how files will be compiled & joined together.
      # Available formats:
      # * 'outputFilePath'
      # * map of ('outputFilePath': /regExp that matches input path/)
      # * map of ('outputFilePath': function that takes input path)
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor/
      # Defines compilation order.
      # `vendor` files will be compiled before other ones
      # even if they are not present here.
      order:
        before: [
          'vendor/scripts/console-helper.js',
          'vendor/scripts/jquery-1.7.2.js',
          'vendor/scripts/underscore-1.3.3.js',
          'vendor/scripts/backbone-0.9.2.js'
          'vendor/nvd3/d3.v2.js'
          'vendor/nvd3/nv.d3.js'
          'vendor/nvd3/tooltip.js'
          'vendor/nvd3/legend.js'
          'vendor/nvd3/axis.js'
          'vendor/nvd3/multiBar.js'
          'vendor/nvd3/multiBarChart.js'
          'vendor/nvd3/stream_layers.js'
        ]

    stylesheets:
      defaultExtension: 'css'
      joinTo: 'stylesheets/app.css'
      order:
        before: ['vendor/styles/bootstrap.min.css']
        after: []

    templates:
      defaultExtension: 'hbs'
      joinTo: 'javascripts/app.js'

  # Change this if you're using something other than backbone (e.g. 'ember').
  # Content of files, generated with `brunch generate` depends on the setting.
  # framework: 'backbone'

  # Settings of web server that will run with `brunch watch [--server]`.
  # server:
  #   # Path to your server node.js module.
  #   # If it's commented-out, brunch will use built-in express.js server.
  #   path: 'server.coffee'
  #   port: 3333
  #   # Run even without `--server` option?
  #   run: yes
