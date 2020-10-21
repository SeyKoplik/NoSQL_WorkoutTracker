// where the model would go
// looks like a schema for the model with criteria in schema seeders
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    day: {
        type: Date,
        default: Date.now
    },
    exercises: [
        {
            type: {
                type: String,
                trim: true,
                required: "Must enter a type of exercise!"
            },
            name: {
                type: String,
                trim: true,
                required: "Must enter an execise name!"
            },
            duration: {
                type: Number,
                required: "Must enter how long you exercised!"
            },
            weight: { type: Number },
            reps: { type: Number },
            sets: { type: Number },
            distance: { type: Number },
        }
    ]
}, { timestamps: true });

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;