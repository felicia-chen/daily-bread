var mongoose = require('mongoose');

var mealItem = mongoose.model('mealItem', {
	username: {
		type: String,
		required: true
	},
	id: {
		type: String,
		required: true
	}, 
	recipe: {
		type: String,
		required: true
	},
	day: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	}
})

module.exports = mealItem;