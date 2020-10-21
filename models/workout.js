// where the model would go
// looks like a schema for the model with criteria in schema seeders
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    day: Date,
    exercises: Array
}, { timestamps: true });

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;