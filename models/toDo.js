var mongoose = require("mongoose");

var toDoSchema = mongoose.Schema({
	date: Date,
	toDo: String,
	isCompleted: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now},
	author: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			},
			username: String
	}
});

module.exports = mongoose.model("ToDo", toDoSchema);