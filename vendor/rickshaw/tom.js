window.tom_graph = function(data, element) {
    var seriesData = [ [], [], [], [], [], [], [], [], [] ];
    var random = new Rickshaw.Fixtures.RandomData(150);

    for (var i = 0; i < 150; i++) {
        random.addData(seriesData);
    }

    var palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );

    var convert = function(iso) { return new Date(iso).getTime()/1000; };

    // instantiate our graph!
    var allseries = [
            {
                color: palette.color(),
                data: seriesData[0],
                name: 'Moscow'
            }, {
                color: palette.color(),
                data: seriesData[1],
                name: 'Shanghai'
            }, {
                color: palette.color(),
                data: seriesData[2],
                name: 'Amsterdam'
            }, {
                color: palette.color(),
                data: seriesData[3],
                name: 'Paris'
            }, {
                color: palette.color(),
                data: seriesData[4],
                name: 'Tokyo'
            }, {
                color: palette.color(),
                data: seriesData[5],
                name: 'London'
            }, {
                color: palette.color(),
                data: seriesData[6],
                name: 'New York'
            }]

            seriesData[0] = [];
            $.each(window.data.data['okfn/ckan'].data, function(i, x) {
                seriesData[0].push( { x: convert(x.timestamp), y: x.watchers } );
            });
    var allseries = [
        {
            color: palette.color(),
            data: seriesData[0],
            name: 'okfn/ckan'
        }]

    var graph = new Rickshaw.Graph( {
        element: document.getElementById("chart"),
        width: 900,
        height: 500,
        renderer: 'area',
        stroke: true,
        series: allseries
    } );

    graph.render();

    var slider = new Rickshaw.Graph.RangeSlider( {
        graph: graph,
        element: $('#slider')
    } );

    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: graph
    } );

    var annotator = new Rickshaw.Graph.Annotate( {
        graph: graph,
        element: document.getElementById('timeline')
    } );

    var legend = new Rickshaw.Graph.Legend( {
        graph: graph,
        element: document.getElementById('legend')

    } );

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
        graph: graph,
        legend: legend
    } );

    var order = new Rickshaw.Graph.Behavior.Series.Order( {
        graph: graph,
        legend: legend
    } );

    var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
        graph: graph,
        legend: legend
    } );

    var smoother = new Rickshaw.Graph.Smoother( {
        graph: graph,
        element: $('#smoother')
    } );

    var ticksTreatment = 'glow';

    var xAxis = new Rickshaw.Graph.Axis.Time( {
        graph: graph,
        ticksTreatment: ticksTreatment
    } );

    xAxis.render();

    var yAxis = new Rickshaw.Graph.Axis.Y( {
        graph: graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: ticksTreatment
    } );

    yAxis.render();


    var controls = new RenderControls( {
        element: document.querySelector('form'),
        graph: graph
    } );

    // add some data every so often

    var messages = [
        "Changed home page welcome message",
        "Minified JS and CSS",
        "Changed button color from blue to green",
        "Refactored SQL query to use indexed columns",
        "Added additional logging for debugging",
        "Fixed typo",
        "Rewrite conditional logic for clarity",
        "Added documentation for new methods"
    ];


    function addAnnotation(force) {
        if (messages.length > 0 && (force || Math.random() >= 0.95)) {
            annotator.add(seriesData[2][seriesData[2].length-1].x, messages.shift());
        }
    }

    addAnnotation(true);
    setTimeout( function() { setInterval( addAnnotation, 6000 ) }, 6000 );
};
