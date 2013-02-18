class ActivityApi extends Backbone.Model
    url: 'http://activityapi.herokuapp.com/api/1'
    #url: 'http://localhost:5000/api/1'


    ## Methods
    ## =======
    ajaxHistoryGithub: (repos, callback) ->
        if not repos.length
            callback null
        else 
            url = @url + '/history/github?repo=' + @_join(repos) + '&per_page=90'
            return @_fetch url, callback

    ajaxHistoryMailman: (lists, callback) ->
        if not lists.length
            callback null
        else 
            url = @url + '/history/mailman?list=' + @_join(lists) + '&per_page=26&grain=week'
            return @_fetch url, callback

    ajaxHistoryTwitter: (account, callback) ->
        if not account
            callback null
        else 
            url = @url + '/history/twitter/account?name=' + account + '&per_page=26&grain=week'
            return @_fetch url, callback


    ## Private Methods
    ## ===============
    _wrapCallback: (url,callback) =>
        return (data) =>
            @trigger 'ajaxMinusMinus'
            if (data.ok is true)
                callback(data)
            else
                console.error 'Could not load',url,data

    _join: (strings) ->
        out = ''
        comma = false
        for s in strings
            if comma
                out+=','
            comma=true
            out += s
        return out

    _error: (a,b) =>
        @trigger 'ajaxMinusMinus'
        @trigger 'ajaxError'
        console.error 'AJAX error',a,b

    _fetch: (url, callback) ->
        # TODO could implement caching here
        if not callback 
            throw 'I require a callback function'
        @trigger 'ajaxPlusPlus'
        $.ajax 
            url: url
            success: @_wrapCallback url, callback
            dataType: 'jsonp'
            error: @_error

module.exports = new ActivityApi()
