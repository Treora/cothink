var Layout = {}

Layout.init = function (msgbus) {

};

layout = Object.create(Layout);

Meteor.startup(function () {
    layout.init(msgbus);
});
