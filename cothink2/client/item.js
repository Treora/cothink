Item = {};

itemManager = (function () {

    var getItemById = function (id) {
        var item = Object.create(Item);
        item.id = id;
        item.title = 'lalala';
        item.content = 'bla, my id is ' + id + '.';
        return item;
    };

    return {
        getItemById: getItemById,
    };

})();
