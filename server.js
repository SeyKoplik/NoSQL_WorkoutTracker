const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("morgan");
const { db } = require("./models/workout");
const { Workout } = require("./models");

const app = express();

app.use(logger("dev"));

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/dbExample", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.use(express.static("public"));

// API ROUTES
// POST
app.post("/api/workouts", (req, res) => {
    const newWorkout = new Workout(req.body); 
    newWorkout.save(newWorkout)
    .then(data => {
        console.log(data)
        res.send(data);
    });
})

// PUT
app.put("/api/workouts/:id", (req, res) => {
    let updates = req.body

    Workout.findOneAndUpdate({
        _id: req.params.id
    }, updates, {new: true} )
    .then(updatedWorkout => res.json(updatedWorkout))
})

// GET api/workout
app.get("/api/workouts/range", (req, res) => {

})


// HTML ROUTES
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "public/exercise.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "public/stats.html"));
});


// Listen on port 3000
app.listen(3000, () => {
    console.log(`App running on http://localhost:${PORT}`);
});