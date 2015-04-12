var Layout = {}

var autoruns = {
    'centerFocussedItem': function () {
        var focussedItem = uiCore.getFocussedItem();
        if (focussedItem != null) {
            layout.setVisible(focussedItem);
        }
    },
};

Layout.init = function (msgbus) {
    this.state = {};
    this.state.visibleItems = new Mongo.Collection(null);

    for (func in autoruns) {
        Tracker.autorun(autoruns[func]);
    }
};

Layout.setVisible = function (item) {
    assert_type(item, Item);

    if (this.state.visibleItems.findOne(item.id)) {
        // item is already in visibleItems
    }
    else {
        this.state.visibleItems.insert({_id: item.id});
    }
};

Layout.getVisibleItems = function () {
    var itemIds = this.state.visibleItems.find();
    var items = itemIds.map(function (doc) {
        return itemManager.getItemById(doc._id);
    });
    return items;
};

layout = Object.create(Layout);

Meteor.startup(function () {
    layout.init(msgbus);
});
