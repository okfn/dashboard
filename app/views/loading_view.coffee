api = require 'activityapi'
template = require 'views/templates/loading_bar'

module.exports = class LoadingView extends Backbone.View
    highWaterMark: 0
    current: 0
    dom: -> $('#loading')

    initialize: =>
        api.bind 'ajaxPlusPlus', @plusPlus
        api.bind 'ajaxMinusMinus', @minusMinus

    percent: =>
        remaining = (@highWaterMark-@current)
        if @highWaterMark>0
            return Math.ceil((remaining*100)/@highWaterMark) + '%'
        percent = '100%'

    plusPlus: =>
        @current++
        @highWaterMark = Math.max(@highWaterMark, @current)
        dom = @dom()
        dom.stop().show().css({opacity:1})
        dom.html template {percent: @percent()}

    minusMinus: =>
        @current--
        dom = @dom()
        if @current==0
            @highWaterMark=0
            dom.fadeOut(1000)
        dom.find('.bar').css {width:@percent()}
        
