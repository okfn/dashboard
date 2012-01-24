describe('Member map view', function() {

    describe('when instantiated', function() {

        var view;

        beforeEach(function() {
            view = new Dashboard.MemberMapView({
                divName: 'map',
                collection: {bind: sinon.spy()}
            });
        });

        afterEach(function() {
            view.map.destroy();
        });

        it('creates a map', function() {
            expect(view.map).toBeInstanceOf(OpenLayers.Map);
        });

        it('adds an OSM layer to the map', function() {
            expect(view.map.layers[0]).toBeInstanceOf(OpenLayers.Layer.OSM);
        });

        it('adds a vector layer to the map', function() {
            expect(view.map.layers[1]).toBeInstanceOf(OpenLayers.Layer.Vector);
        });

        it('stores a reference to the vector layer in the instance', function() {
            expect(view.vectors).toEqual(view.map.layers[1]);
        });

        it('adds a select feature control to the map', function() {
            var selectCtrl = view.map.getControlsByClass(
                    'OpenLayers.Control.SelectFeature')[0];
            expect(selectCtrl).toBeInstanceOf(OpenLayers.Control.SelectFeature);
        });

        it('binds a listener to all events from the collection', function() {
            expect(view.collection.bind)
                .toHaveBeenAlwaysCalledWithExactly('all', view.renderMembers, view);
        });

    });

    describe('when adding two members to the collection', function() {
        var view, spy;

        beforeEach(function() {

            // install a spy on the renderMembers function of the view
            spy = sinon.spy(Dashboard.MemberMapView.prototype, 'renderMembers');

            var MemberCollection = Backbone.Collection.extend({
                model: Dashboard.Member
            });
            var collection = new MemberCollection();

            view = new Dashboard.MemberMapView({
                divName: 'map',
                collection: collection
            });

            // add a feature to the vector layer
            var feature = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point(0, 0));
            feature.id = 'foo';
            view.vectors.addFeatures(feature);

            // add two members, one has a geolocation, the other doesn't
            collection.add([{
                name: 'Jack',
                geolocation: null
            }, {
                name: 'John',
                geolocation: {
                    lng: 5,
                    lat: 45
                }
            }]);
        });

        afterEach(function() {

            // remove the spy
            spy.restore();

            view.map.destroy();
        });

        it('the render function is called twice', function() {
            expect(spy).toHaveBeenCalledTwice();
        });

        it('removes any existing feature from the vector layer', function() {
            expect(view.vectors.getFeatureById('foo')).toBeNull();
        });

        it('adds one feature to the vector layer', function() {
            expect(view.vectors.features.length).toEqual(1);
        });

    });
});
