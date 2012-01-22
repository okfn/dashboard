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
