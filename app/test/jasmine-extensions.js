beforeEach(function() {
    var parent = this.getMatchersClass_();
    this.addMatchers({
        toBeInstanceOf: function(type) {
            return this.actual instanceof type;
        }
    });
});
