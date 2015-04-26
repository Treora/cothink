itemManager = (function () {

    var getItemById = function (id) {
        var item = Object.create(Item);
        item.id = id;
        return item;
    };

    return {
        getItemById: getItemById,
    };

})();
