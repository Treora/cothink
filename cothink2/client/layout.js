var Layout = {}

var autoruns = {
    'centerFocussedItem': function () {
        var focussedItem = uiCore.getFocussedItem();
        if (focussedItem != null) {
            layout.render(focussedItem);
        }
    },
};

Layout.init = function (msgbus) {
    for (func in autoruns) {
        Tracker.autorun(autoruns[func]);
    }
};

Layout.render = function (item) {
    assert_type(item, Item);

    console.log('render item #' + item.id);
};

layout = Object.create(Layout);

Meteor.startup(function () {
    layout.init(msgbus);
});
