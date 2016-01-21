
var UICoreEvents = {
    'routedToItem': function (itemId) {
        var item = itemManager.getItemById(itemId);
        this.setFocussedItem(item);
    }
};

var UICore = {};

UICore.init = function (msgbus) {
    msgbus.on(UICoreEvents, this);
};

UICore.setFocussedItem = function (item) {
    if (item == null) {
        this.state.set('focussedItem', null);
    }
    else {
        assert_type(item, Item);
        var itemId = item.id;
        this.state.set('focussedItem', itemId);
    }
};

UICore.getFocussedItem = function () {
    var id = this.state.get('focussedItem');
    if (id == null) {
        return null;
    }
    else {
        return itemManager.getItemById(id);
    }
};

uiCore = Object.create(UICore);
uiCore.state = new ReactiveDict;

Meteor.startup(function () {
    uiCore.init(msgbus);
});
