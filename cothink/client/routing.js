
Router.route('/', function () {
    this.render('canvas');
});

Router.route('/item/:_id', function () {
    this.render('canvas');
    var params = this.params;
    var id = params._id;
    msgbus.emit('routedToItem', id);
});
