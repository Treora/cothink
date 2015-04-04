
var UICoreEvents = {
    'routedToItem': function (itemId) {
        this.setFocussedItem(itemId);
    }
};

var UICore = {};

UICore.init = function (msgbus) {
    this.state = new ReactiveDict;

    msgbus.on(UICoreEvents, this);
};

UICore.setFocussedItem = function (itemId) {
    this.state.set('focussedItem', itemId);
};

uiCore = Object.create(UICore);

Meteor.startup(function () {
    uiCore.init(msgbus);
});
