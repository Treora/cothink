visible_items = new Mongo.Collection(null);

Router.route('/', function () {
    this.render("body");
});

Router.route('/item/:_id', function () {
    var params = this.params;
    var id = params._id;
    var item = Items.findOne({_id: id});
    if (visible_items.find({_id: id}).count() == 0) {
        visible_items.insert(item);
    }
}, {
    name: 'item'
});

Template.body.helpers({
    items: function () {
        return Items.find({}, {sort: {createdAt: -1}});
    },
    visible_items: function () {
        return visible_items.find({});
    },
});

Template.body.events({
    "submit .new-item": function (event) {
        // This function is called when the new item form is submitted

        var text = event.target.text.value;

        Items.insert({
            text: text,
            createdAt: new Date(), // current time
            owner: Meteor.userId(),           // _id of logged in user
            username: Meteor.user().username  // username of logged in user
        });

        // Clear form
        event.target.text.value = "";

        // Prevent default form submit
        return false;
    }
});

Template.item.events({
    "mousedown": function() {
        Router.go('/item/'+this._id);
    },

    "click .delete": function() {
        Router.go('/');
        Items.remove(this._id);
        visible_items.remove(this._id);
    },
    "click .hide": function() {
        Router.go('/');
        visible_items.remove(this._id);
    },

    "keyup input[type=text]": function(event) {
        Items.update(this._id, {$set: {text: event.target.value}});
    },
});

Template.item.rendered = function () {
    this.$('.item').position({my:'center', at:'center', of:'body'});
    CoThink.initiateCollision();
};

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});
