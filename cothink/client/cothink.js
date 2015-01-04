/* Item prototype
 * Usual attributes:
 *    id    - the item's id string
 *    el()  - the item's DOM element
 *    data  - the document from the collection
 *    view  - the view returned by Blaze.render
 */
var Item = {
    el: function() {
        el = document.getElementById(this.id);
        console.log(this.id);
        return el;
    }
}

create_item = function (params) {
        item = Object.create(Item);
        item.id = params.id;
        item.data = params.data;
        item.view = params.view;
        return item;
};

visible_items = {};

Router.route('/', function () {
    this.render("body");
});

Router.route('/item/:_id', function () {
    var params = this.params;
    var id = params._id;
    item = find_item(id);
    if (item) {
        // Item is already on the screen
        focus_item(item);
    }
    else {
        // Load and render the item
        data = Items.findOne({_id: id}); // todo: make reactive
        view = Blaze.renderWithData(Template.item, data, document.body);
        item = create_item({id: id, data: data, view: view});
        visible_items[id] = item;
    }
}, {
    name: 'item',
    waitOn: function () {
        return Meteor.subscribe('items');
    },
});


var find_item = function (id) {
    return visible_items[id];
};

var focus_item = function(item) {
    var focussed_item = $(item.el());
    var other_items = $(".item").not(focussed_item);
    focussed_item.addClass('focussed');
    other_items.removeClass('focussed');
    CoLayout.transitionToCenter(focussed_item);
};

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
    "mousedown": function() {
        Router.go('/item/'+this._id);
    },

    "click .delete": function() {
        Router.go('/');
        Items.remove(this._id);
        // TODO
    },
    "click .hide": function() {
        Router.go('/');
        // TODO
    },

    "keyup input[type=text]": function(event) {
        Items.update(this._id, {$set: {text: event.target.value}});
    },
});

Template.item.rendered = function () {
    CoLayout.positionAtAlmostCenter(this.$('.item'));
    CoLayout.initiateCollision();
    focus_item(visible_items[this.data._id]);
};

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});
