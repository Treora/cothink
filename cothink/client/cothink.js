/* Item prototype
 * Usual attributes:
 *    id    - the item's id string
 *    el()  - the item's DOM element
 *    data  - the document from the collection
 *    template - the template instance corresponding to this item
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
    item.template = params.template;
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
        item = create_item({id: id, data: data, template: view.template});
        visible_items[id] = item;
    }

    // Small hack to get rid of warning message "Route dispatch never rendered".
    this._rendered = true;

}, {
    name: 'item',
    waitOn: function () {
        return Meteor.subscribe('items');
    },
    loadingTemplate: 'empty',
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


var eventsForEditable = function (fieldName) {
    return {
        'click .editable-display': function (event, template) {
            var inst = Template.instance();
            template.state.set('editingMode', true);
            template.$('.editable-editor').val(this[fieldName]);
            Tracker.afterFlush(function () {
                // Need to wait with focussing until item has become visible.
                template.$('.editable-editor').focus();
            });
        },

        'blur .editable-editor': function (event, template) {
            template.state.set('editingMode', false);
        },

        'keydown .editable-editor': function(event) {
            if (event.which === 27) { // ESC
                event.preventDefault();
                event.target.blur();
            }
        },

        'keyup .editable-editor': function (event) {
            var fieldUpdate = {};
            fieldUpdate[fieldName] = event.target.value;
            Items.update(this._id, {$set: fieldUpdate});
        },
    };
};


Template.itemtext.created = function () {
    this.state = new ReactiveDict();
};

Template.itemtext.helpers({
    editingMode: function (value) {
        return Template.instance().state.get('editingMode');
    },
});

Template.itemtext.events(eventsForEditable('text'));


Template.itemtitle.created = function () {
    this.state = new ReactiveDict();
};

Template.itemtitle.helpers({
    editingMode: function (value) {
        return Template.instance().state.get('editingMode');
    },
});

Template.itemtitle.events(eventsForEditable('title'));


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

    'click .delete': function (event, template) {
        Router.go('/');
        Items.remove(this._id);
        hide_item(template);
    },

    'click .hide': function (event, template) {
        Router.go('/');
        hide_item(template);
    },
});

Template.item.rendered = function () {
    CoLayout.positionAtAlmostCenter(this.$('.item'));
    CoLayout.initiateCollision();
    focus_item(find_item(this.data._id));
};

var hide_item = function (template) {
    Blaze.remove(template.view);
    delete visible_items[template.data._id];
};

var link_items = function (id1, id2) {
    Links.insert({ids: [id1, id2]});
    CoLayout.drawLink(id1, id2);
};

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
});
