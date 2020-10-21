const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("morgan");
// const { db } = require("./models/workout");
const { Workout } = require("./models");

const app = express();

app.use(logger("dev"));

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

//Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ========= API ROUTES ============= //
// GET == get workouts
app.get("/api/workouts", (req, res) => {
    Workout.find()
        .then(workoutData => {
            workoutData.forEach(workout => {
                var totalWeight = 0;
                var totalDuration = 0;
                workout.exercises.forEach(target => {
                    totalWeight += target.weight;
                    totalDuration += target.duration;
                });
                workout.totalWeight = totalWeight;
                workout.totalDuration = totalDuration;
            });
            res.json(workoutData);
        })
        .catch(err => {
            res.json(err)
        })
});

// POST == post new workout plan
app.post("/api/workouts", (req, res) => {
    const newWorkout = req.body;

    Workout.create({ newWorkout })
        .then(newWorkoutData => {
            res.json(newWorkoutData)
        })
        .catch(err => {
            res.json(err)
        })
});

// PUT == updates workouts by id
app.put("/api/workouts/:id", (req, res) => {
    let updates = req.body

    Workout.findOneAndUpdate({
        _id: req.params.id
    }, {
        $inc: {
            totalWeight: req.body.weight,
            totalDuration: req.body.duration
        },
        $push: { exercises: updates }
    },
        { new: true }
    ).then(updatedWorkout => {
        res.json(updatedWorkout)
    }).catch(err => {
        res.json(err);
    })
})

// GET api/workout/range (Last 7 days: Thing limit(7))
app.get("/api/workouts/range", (req, res) => {
    Workout.find({}).limit(7)
        .sort({ day: 'ascending' })
        .then((data) => {
            res.send(data);
            console.log(data);
        })
});


// ========= HTML ROUTES ============= //
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