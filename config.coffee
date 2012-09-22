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
          'vendor/rickshaw/Rickshaw.js',
          'vendor/rickshaw/Rickshaw.Class.js',
          'vendor/rickshaw/Rickshaw.Compat.ClassList.js',
          'vendor/rickshaw/Rickshaw.Graph.js',
          'vendor/rickshaw/Rickshaw.Graph.Renderer.js',
          'vendor/rickshaw/Rickshaw.Graph.Renderer.Area.js',
          'vendor/rickshaw/Rickshaw.Graph.Renderer.Line.js',
          'vendor/rickshaw/Rickshaw.Graph.Renderer.Bar.js',
          'vendor/rickshaw/Rickshaw.Graph.Renderer.ScatterPlot.js',
          'vendor/rickshaw/Rickshaw.Graph.RangeSlider.js',
          'vendor/rickshaw/Rickshaw.Graph.HoverDetail.js',
          'vendor/rickshaw/Rickshaw.Graph.Annotate.js',
          'vendor/rickshaw/Rickshaw.Graph.Legend.js',
          'vendor/rickshaw/Rickshaw.Graph.Axis.Time.js',
          'vendor/rickshaw/Rickshaw.Graph.Behavior.Series.Toggle.js',
          'vendor/rickshaw/Rickshaw.Graph.Behavior.Series.Order.js',
          'vendor/rickshaw/Rickshaw.Graph.Behavior.Series.Highlight.js',
          'vendor/rickshaw/Rickshaw.Graph.Smoother.js',
          'vendor/rickshaw/Rickshaw.Graph.Unstacker.js',
          'vendor/rickshaw/Rickshaw.Fixtures.Time.js',
          'vendor/rickshaw/Rickshaw.Fixtures.Number.js',
          'vendor/rickshaw/Rickshaw.Fixtures.RandomData.js',
          'vendor/rickshaw/Rickshaw.Fixtures.Color.js',
          'vendor/rickshaw/Rickshaw.Color.Palette.js',
          'vendor/rickshaw/Rickshaw.Graph.Axis.Y.js',
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
