$(function() {
  var reposUrl = 'https://api.github.com/orgs/okfn/repos?type=public&per_page=100&callback=?';
  var jqxhr = $.getJSON(reposUrl);
  jqxhr.done(function(reposList) {
    var dataset = new recline.Model.Dataset({
      fields: [
        {id: 'full_name', label: 'Full Name'},
        {id: 'watchers', label: 'Watchers'},
        {id: 'created_at', label: 'Created'}
      ],
      records: reposList.data
    });
    dataset.fetch();
    var grid = new recline.View.SlickGrid({
      model: dataset,
      el: $('.grid')
    });
    grid.visible = true;
    grid.render();
  });
});


