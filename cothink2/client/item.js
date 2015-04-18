Item = {};

Template.item.helpers({
    focussed: function () {
        return uiCore.state.equals('focussedItem', this._id);
    },
});
