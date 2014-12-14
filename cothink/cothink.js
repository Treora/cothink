Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    // This code only runs on the client
    Template.body.helpers({
        tasks: function () {
            return Tasks.find({}, {sort: {createdAt: -1}});
        },
    });

    Template.body.events({
        "submit .new-task": function (event) {
            // This function is called when the new task form is submitted

            var text = event.target.text.value;

            Tasks.insert({
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

    Template.task.events({
        "click .delete": function() {
            Tasks.remove(this._id);
        }
    });

    Template.task.rendered = function () {
        this.$('.task').draggable();
    };

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}


if (Meteor.isServer) {
    Meteor.startup(function () {
    });
}
