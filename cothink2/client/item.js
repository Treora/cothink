Item = {};

Item.isFocussed = function () {
    return uiCore.state.equals('focussedItem', this.id);
};

Item.getData = function () {
    return itemsCollection.findOne(this.id);
};
