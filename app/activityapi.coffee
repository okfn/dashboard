module.exports = 
    url: 'http://activityapi.herokuapp.com/api/1'
    #url: 'http://localhost:5000/api/1'

    ## Methods
    ## =======
    ajaxHistoryGithub: (repos, callback) ->
        if not repos.length
            callback null
        else 
            url = @url + '/history/github?repo=' + @_join(repos) + '&per_page=90'
            @_fetch url, callback

    ajaxHistoryMailman: (lists, callback) ->
        if not lists.length
            callback null
        else 
            url = @url + '/history/mailman?list=' + @_join(lists) + '&per_page=90'
            @_fetch url, callback

    ajaxDataPerson: (logins, callback) ->
        if not logins.length
            callback null
        else
            url = @url + '/data/person?per_page=' + logins.length + '&login=' + @_join(logins)
            @_fetch url, callback


    ## Private Methods
    ## ===============
    _join: (strings) ->
        out = ''
        comma = false
        for s in strings
            if comma
                out+=','
            comma=true
            out += s
        return out

    _error: (a,b) ->
        console.err 'AJAX error',a,b

    _fetch: (url, callback) ->
        # TODO could implement caching here
        if not callback 
            throw 'I require a callback function'
        $.ajax 
            url: url
            success: callback
            dataType: 'jsonp'
            error: @_error
