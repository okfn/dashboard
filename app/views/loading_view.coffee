api = require 'activityapi'
template = require 'views/templates/loading_bar'

module.exports = class LoadingView extends Backbone.View
    highWaterMark: 0
    current: 0
    gotError: false
    dom: -> $('#loading')

    initialize: =>
        api.bind 'ajaxPlusPlus', @plusPlus
        api.bind 'ajaxMinusMinus', @minusMinus
        api.bind 'ajaxError', @error

    percent: =>
        remaining = (@highWaterMark-@current)
        if @highWaterMark>0
            return (3 + Math.ceil((remaining*97)/@highWaterMark)) + '%'
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
            if @gotError
                @gotError = false
            else
                dom.fadeOut(1000)
        dom.find('.bar').css {width:@percent()}
        
    error: =>
        @gotError = true
        dom = @dom()
        dom.stop().show().css({opacity:1})
        dom.find('.bar').css {'background-color':'#c00'}

