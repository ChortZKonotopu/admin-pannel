const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the schema for the "grafik" array element
const GrafikElementSchema = new Schema({
    nameOfWorker: { type: String, required: true },
    workingHours: [{ type: String, default: 0, min: 0, max: 24 }],
});

const GrafikSchema = new Schema({
    placowka: { type: String, required: true },
    date: { type: String, required: true }, // You can use the "Date" type for the "date" field
    grafikOpcji: [{
        name: { type: String, required: true },
        value: { type: String, required: true },
    }],
    grafik: [GrafikElementSchema], // Use the defined schema for "grafik" array
});

const GrafikModel = mongoose.model('Grafik', GrafikSchema); // Use 'Grafik' as the model name

module.exports = GrafikModel;
