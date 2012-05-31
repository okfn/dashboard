
_jsonp_members = function(data) {
    /* Called when we AJAX in the members */
    $('.loading').hide();
    $('.loaded').show();
    var twitters = [];
    for (var i=0;i<data.length;i++) {
        var twitter = data[i].twitter;
        if (twitter=='NULL') continue;
        twitter = twitter.substring(twitter.lastIndexOf('/')+1);
        if (twitter.charAt(0)=='@') {
            twitter = twitter.substring(1);
        }
        twitters.push(twitter.toLowerCase());
    }
    for (var i=0;i<twitters.length;i++) {
        var el = $('<a href="#"/>').html('@'+twitters[i]);
        el.addClass('namelink');
        el.attr('data-twitter',twitters[i]);
        $('.list').append(el);
    }
};

$(function() {
    $.ajax({
        dataType: 'jsonp',
        callback: '_jsonp_members',
        url: 'https://raw.github.com/gist/2839389/members.jsonp'
    });
    $('.namelink').live('click',function(e) {
        e.preventDefault();
        var account = $(e.target).attr('data-twitter');
        twitterWidget.render().setUser(account).start();
    });
});
