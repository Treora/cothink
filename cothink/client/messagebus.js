/* Simple messagebus/pubsub thingy.
 */

msgbus = function (jQuery) {
    channels = {}

    on_single = function (channel, method, self) {
        if (self===undefined) {
            self = this;
        }
        if (!(channel in channels)) {
            channels[channel] = [];
        }
        channels[channel].push({method: method, self: self});
    };

    on_multi = function (mapping, self) {
        for (event in mapping) {
            this.on(event, mapping[event], self);
        }
    };

    on = function() {
        if (typeof arguments[0] === 'string') {
            on_single.apply(this, arguments);
        }
        else {
            on_multi.apply(this, arguments);
        }
    };

    emit = function (channel) {
        args = [].splice.call(arguments, 1);
        for (var i=0; i<channels[channel].length; i++) {
            subscriber = channels[channel][i]
            subscriber.method.apply(subscriber.self, args);
        }
    };

    return {
        on: on,
        emit: emit,
    };
}(jQuery);
