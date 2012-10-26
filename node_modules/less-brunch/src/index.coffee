less = require 'less'
sysPath = require 'path'

module.exports = class LESSCompiler
  brunchPlugin: yes
  type: 'stylesheet'
  extension: 'less'

  constructor: (@config) ->
    null

  compile: (data, path, callback) ->
    parser = new less.Parser
      paths: [@config.paths.root, (sysPath.dirname path)],
      filename: path
    parser.parse data, (error, tree) =>
      return callback error.message if error?

      try
        callback null, tree.toCSS()
      catch ex
        errStr = "#{ex.type}Error:#{ex.message}"
        if ex.filename
          errStr += " in '#{ex.filename}:#{ex.line}:#{ex.column}'"
        callback errStr
