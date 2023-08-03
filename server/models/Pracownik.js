const mongoose = require('mongoose')

const { Schema } = mongoose;

const PracownikSchema = new Schema({
    imie: { type: String, required: true, min: 4},
    nazwisko: { type: String, required: true },
    numer: {type: String, required: true, min: 9}
})

const PracownikModel = mongoose.model('pracownik', PracownikSchema);

module.exports = PracownikModel;