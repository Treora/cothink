Item = {};

itemManager = (function () {

    var getItemById = function (id) {
        var itemData = itemsCollection.findOne(id);
        var item = Object.create(Item);
        item.id = id;
        _.extend(item, itemData);
        return item;
    };

    return {
        getItemById: getItemById,
    };

})();
