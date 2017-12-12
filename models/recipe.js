var mongoose = require('mongoose');

var Recipe = mongoose.model('Recipe', {
	username: {
		type: String,
		required: true
	},
	recipe: {
		type: String,
		required: true
	},
	Category: {
		type: String,
		required: true
	},
	servingsize: {
		type: String,
		required: true
	},
	ingredient: {
		type: Array,
		required: true
	},
	step: {
		type: Array,
		required: true
	},
	stepCount: {
		type: Array,
		required: true
	},
	preptime: {
		type: String,
		required: true
	},
	cooktime: {
		type: String,
		required: true
	},
	picture: {
		type: Array,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	notes: {
		type: String,
		required: true
	},
	rating: {
		type: String,
		required: true
	}
})

module.exports = Recipe;