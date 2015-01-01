Items = new Mongo.Collection("items");

// visible_items has no persistent storage
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


if (Meteor.isClient) {
    // This code only runs on the client
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
        "click .delete": function() {
            Items.remove(this._id);
            visible_items.remove(this._id);
        },
        "click .hide": function() {
            Router.go('/');
            visible_items.remove(this._id);
        }
    });

    Template.item.rendered = function () {
        this.$('.item').draggable();
        this.$('.item').position({my:'center', at:'center', of:'body'});
    };

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}


if (Meteor.isServer) {
    Meteor.startup(function () {
    });
}
