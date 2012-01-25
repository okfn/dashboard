describe('Member model', function() {

    describe('when instantiated', function() {

        var member;

        beforeEach(function() {
            member = new Dashboard.Member({'name': 'Jack'});
        });

        it('gets values passed to the constructor', function() {
            expect(member.get('name')).toEqual('Jack');
        });

        it('gets default values', function() {
            expect(member.get('location')).toEqual('Nowhere');
        });

    });

});

describe('Member collection', function() {

    describe('when fetching data', function() {

        var server, collection, resetSpy, addSpy;

        beforeEach(function() {
            server = sinon.fakeServer.create();
            server.respondWith('GET', '/some/url', [
                200,
                {'Content-Type': 'application/json'},
                ['{',
                    '"key_a": {',
                      '"name": "name_a",',
                      '"location": "somewhere_a",',
                      '"spatial": {',
                        '"lng": 5,',
                        '"lat": 45',
                      '}',
                    '},',
                    '"key_b": {',
                      '"name": "name_b",',
                      '"location": "somewhere_b",',
                      '"spatial": {',
                      '}',
                    '}',
                 '}'
                ].join('')
            ]);

            collection = new Dashboard.MemberCollection();
            collection.url = '/some/url';

            resetSpy = sinon.spy();
            collection.bind('reset', resetSpy);
            addSpy = sinon.spy();
            collection.bind('add', addSpy);

            collection.fetch();
            server.respond();
        });

        afterEach(function() {
            server.restore();
        });

        it('adds expected number of members', function() {
            expect(collection.models.length).toEqual(2);
        });

        it('adds member objects', function() {
            expect(collection.at(0)).toBeInstanceOf(Dashboard.Member);
            expect(collection.at(1)).toBeInstanceOf(Dashboard.Member);
        });

        it('adds members with expected properties', function() {
            var m;
            m = collection.at(0);
            expect(m.get('key')).toEqual('key_a');
            expect(m.get('name')).toEqual('name_a');
            expect(m.get('location')).toEqual('somewhere_a');
            expect(m.get('geolocation')).toEqual({lng: 5, lat: 45});
            m = collection.at(1);
            expect(m.get('key')).toEqual('key_b');
            expect(m.get('name')).toEqual('name_b');
            expect(m.get('location')).toEqual('somewhere_b');
            expect(m.get('geolocation')).toEqual({});
        });

        it('triggers expected events', function() {
            expect(resetSpy).toHaveBeenCalledOnce();
            expect(addSpy.called).toBeFalsy();
        });
    });
});
