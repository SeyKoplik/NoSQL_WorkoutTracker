const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("morgan");
const { Workout } = require("./models");

const app = express();

app.use(logger("dev"));

const PORT = process.env.PORT || 3000;

mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost/workout",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
);

//Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ========= API ROUTES ============= //
// GET == get workouts
app.get("/api/workouts", (req, res) => {
    Workout.find({})
        .then(workoutData => {
            workoutData.forEach(target => {
                var duration = 0;
                var weight = 0;
                target.exercises.forEach(data => {
                    duration += data.duration;
                    weight += data.weight;
                })
                target.totalDuration = duration;
                target.totalWeight = weight
            })
            res.json(workoutData);
        })
        .catch(err => {
            res.json(err)
        })
});

// POST == post new workout plan
app.post("/api/workouts", ({ body }, res) => {
    Workout.create(body)
        .then(newWorkoutData => {
            res.json(newWorkoutData)
        })
        .catch(err => {
            res.json(err)
        })
});

// PUT == updates workouts by id
app.put("/api/workouts/:id", (req, res) => {
    var exerciseData = req.body
    Workout.findByIdAndUpdate({
        _id: req.params.id
    }, {
        $push: {
            exercises: exerciseData 
        },
    }, { new: true }
    ).then(updatedWorkout => {
        res.json(updatedWorkout)
    }).catch(err => {
        res.json(err);
    })
})

// GET api/workout/range (Last 7 days: Thing limit(7))
app.get("/api/workouts/range", (req, res) => {
    Workout.find()
        .limit(7)
        .sort({ day: 'ascending' })
        .then((data) => {
            res.send(data);
            // console.log(data);
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
app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
});