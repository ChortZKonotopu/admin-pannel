const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

const Admin = require('./models/Admin');
const Pracownik = require('./models/Pracownik');
const Placowka = require('./models/Placowka')
const Grafik = require('./models/Grafik')
const Backup = require('./models/Backup')


const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://dartem:wertiop2010@cluster0.ofw3dwp.mongodb.net/AdminPanel(Backup)?retryWrites=true&w=majority');

app.post('/backup', async (req, res) => {
    try {
        const { backup } = req.body;
        const newBackup = new Backup({ backup });

        // Attempt to save the new backup
        await newBackup.save();

        res.status(201).json({ message: 'Backup created successfully' });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            res.status(400).json({ message: 'Backup already exists' });
        } else {
            res.status(500).json({ message: 'An error occurred' });
        }
    }
});


app.get('/backup', async (req, res) => {
    res.json(await Backup.find().sort({ createdAt: -1 })
    )
})

app.post('/backupGrafik', async (req, res) => {
    const { grafiks } = req.body;

    try {
        const createdGrafiks = [];
        for (const grafikData of grafiks) {
            const createdGrafik = await Grafik.create(grafikData);
            createdGrafiks.push(createdGrafik);
        }

        res.status(201).json(createdGrafiks);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/add-grafiks', async (req, res) => {
    try {
        const newGrafiks = req.body; // Array of new grafik data

        // Validate and save each new grafik individually
        const createdGrafiks = [];
        for (const grafikData of newGrafiks) {
            const createdGrafik = await GrafikModel.create(grafikData);
            createdGrafiks.push(createdGrafik);
        }

        res.status(201).json(createdGrafiks);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/addworkPlace', async (req, res) => {
    try {
        const {placowkas}  = req.body
        console.log(placowkas)

        const createdPlacowkas = [];
        for (const placowkaData of placowkas) {
            const createdPLacowka = await Placowka.create(placowkaData);
            createdPlacowkas.push(createdPLacowka);
        }

        res.status(201).json(createdPlacowkas);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//get the backup grafik data
app.get('/grafik', async (req, res) => {
    const { backup, placowka, date } = req.query;
    console.log(backup, placowka, date);
    // Process the data and send a response
    try {
        // Assuming 'backup', 'placowka', and 'date' are fields in your Grafik model
        const result = await Grafik.find({ backup, placowka, date });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/workplaces', async (req, res) => {
    try {
        const backupValue = req.query.backup; // Get the backup value from the query parameters

        if (!backupValue) {
            return res.status(400).json({ message: 'Backup value is required in the query parameters' });
        }

        const workplacesWithBackup = await Placowka.find({ backup: backupValue })
            .sort({ createdAt: -1 });

        res.json(workplacesWithBackup);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
});


app.listen(5000, ()=>{console.log("Server running on port 5000...")});


