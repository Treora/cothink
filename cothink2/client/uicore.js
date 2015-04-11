
var UICoreEvents = {
    'routedToItem': function (itemId) {
        var item = items.getItemById(itemId);
        this.setFocussedItem(item);
    }
};

var UICore = {};

UICore.init = function (msgbus) {
    this.state = new ReactiveDict;

    msgbus.on(UICoreEvents, this);
};

UICore.setFocussedItem = function (item) {
    if (item == null) {
        this.state.set('focussedItem', null);
    }
    else {
        assert_type(item, Item);
        itemId = item.id;
        this.state.set('focussedItem', itemId);
    }
};

UICore.getFocussedItem = function () {
    var id = this.state.get('focussedItem');
    if (id == null) {
        return null;
    }
    else {
        return items.getItemById(id);
    }
};

uiCore = Object.create(UICore);

Meteor.startup(function () {
    uiCore.init(msgbus);
});
