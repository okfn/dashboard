Date.prototype.toUnixTimestamp = function() { return this.getTime()/1000 };

Array.prototype.max = function() { return Math.max.apply(null, this) }

Array.prototype.min = function() { return Math.min.apply(null, this) }
