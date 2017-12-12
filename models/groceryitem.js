var mongoose = require('mongoose');

//grocerylist item model
var GroceryItem = mongoose.model('GroceryItem', {
	username: {
		type: String,
		required: true
	},
	item: {
		type: String,
		required: true
	}
})

module.exports = GroceryItem;
