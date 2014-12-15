Items = new Mongo.Collection("items");

Router.route('/', function () {
    this.render("body");
});

Router.route('/item/:_id', function () {
    var params = this.params;
    var id = params._id;
    this.render('item', {
        data: function () {
            return Items.findOne({_id: id});
        }
    });
}, {
    name: 'item'
});


if (Meteor.isClient) {
    // This code only runs on the client
    Template.body.helpers({
        items: function () {
            return Items.find({}, {sort: {createdAt: -1}});
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
