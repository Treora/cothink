/* Item prototype
 * Usual attributes:
 *    id    - the item's id string
 *    el()  - the item's DOM element
 *    data  - the document from the collection
 *    view  - the view returned by Blaze.render
 */
var Item = {
    el: function () {
        var el = document.getElementById(this.id);
        return el;
    }
};

create_item = function (params) {
    var item = Object.create(Item);
    item.id = params.id;
    item.data = params.data;
    item.view = params.view;
    return item;
};

visible_items = {};

Router.route('/', function () {
    this.render('body');
});

Router.route('/item/:_id', function () {
    var params = this.params;
    var id = params._id;
    var item = find_item(id);
    if (item) {
        // Item is already on the screen
        focus_item(item);
    }
    else {
        // Load and render the item
        var data = function () {
          var data = Items.findOne({_id: id});
          return data;
        };
        var view = Blaze.renderWithData(Template.item, data, document.body);
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

var focus_item = function (item) {
    var focussed_item = $(item.el());
    var other_items = $('.item').not(focussed_item);
    focussed_item.addClass('focussed');
    other_items.removeClass('focussed');

    CoLayout.redrawLinks(visible_items);
    CoLayout.transitionToCenter(focussed_item);
};

var unfocus_item = function (item) {
  var focussed_item = $(item.el());
  focussed_item.removeClass('focussed');
  Router.go('/');
};

Template.body.helpers({
    items: function () {
        return Items.find({}, {sort: {createdAt: -1}});
    },
});

Template.body.events({
    'submit .new-item': function (event) {
        // This function is called when the new item form is submitted

        var text = event.target.text.value;

        Items.insert({
            title: text,
            createdAt: new Date(), // current time
            owner: Meteor.userId(),           // _id of logged in user
            username: Meteor.user().username  // username of logged in user
        });

        // Clear form
        event.target.text.value = '';

        // Prevent default form submit
        return false;
    }
});

Template.body.rendered = function () {
    jsPlumb.importDefaults({
        Connector : [ "Bezier", { curviness: 30 } ],
        Anchors : [ "AutoDefault", "AutoDefault" ],
        Endpoint:[ "Dot", { radius: 5 } ]
    });
};


Template.itemtext.helpers({
});


Template.itemtext.events({
    'click .item-text-display': function (event) {
        var inst = Template.instance();
        Session.set('editing', true);
        inst.$('.item-text').addClass('editing-mode');
        inst.$('.item-text-editor').val(this.text).focus();
    },

    'blur .item-text-editor': function (event) {
        var inst = Template.instance();
        Session.set('editing', false);
        inst.$('.item-text').removeClass('editing-mode');
    },

    'keydown .item-text-editor': function(event) {
      if (event.which === 27) { // ESC
        event.preventDefault();
        event.target.blur();
      }
    },

    'keyup .item-text-editor': function (event) {
        Items.update(this._id, {$set: {text: event.target.value}});
    },

});

Template.itemtitle.events({
    'click .item-title-display': function (event) {
        var inst = Template.instance();
        inst.$('.item-title').addClass('editing-mode');
        inst.$('.item-title-editor').val(this.title).focus();
    },

   'blur .item-title-editor': function (event) {
        var inst = Template.instance();
        inst.$('.item-title').removeClass('editing-mode');
    },

    'keydown .item-title-editor': function(event) {
        if (event.which === 27) { // ESC
            event.preventDefault();
            event.target.blur();
        }
    },

    'keyup .item-title-editor': function (event) {
        Items.update(this._id, {$set: {title: event.target.value}});
    },
});


Template.item.events({
    'click': function (event) {
        var focussedItem = $('.item.focussed');
        if (event.shiftKey && this._id != focussedItem[0].id) {
            link_items(focussedItem[0].id, this._id);
        }
    },

    'dblclick': function () {
        Router.go('/item/' + this._id);
    },

    'click .delete': function () {
        Router.go('/');
        Items.remove(this._id);
        hide_item(this._id);
    },

    'click .hide': function () {
        Router.go('/');
        hide_item(this._id);
    },
});

Template.item.rendered = function () {
    CoLayout.positionAtAlmostCenter(this.$('.item'));
    CoLayout.initiateCollision();
    focus_item(find_item(this.data._id));
};

var hide_item = function (id) {
    item = visible_items[id];
    Blaze.remove(item.view);
    delete visible_items[id];
};

var link_items = function (id1, id2) {
    Links.insert({ids: [id1, id2]});
    CoLayout.drawLink(id1, id2);
};

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
});
