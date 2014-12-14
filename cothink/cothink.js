Items = new Mongo.Collection("items");

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
    };

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}


if (Meteor.isServer) {
    Meteor.startup(function () {
    });
}
