Item = {};

items = (function () {

    var getItemById = function (id) {
        item = Object.create(Item);
        item.id = id;
        item.title = 'lalala';
        item.content = 'bla, my id is ' + id + '.';
        return item;
    };

    return {
        getItemById: getItemById,
    };

})();
