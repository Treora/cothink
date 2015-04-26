Item = {};

Item.isFocussed = function () {
    return uiCore.state.equals('focussedItem', this.id);
};
