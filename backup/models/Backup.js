const mongoose = require('mongoose')

const { Schema } = mongoose;

const BackupSchema = new Schema({
    backup: { type: String, required: true, unique: true},
})

const BackupModel = mongoose.model('backup', BackupSchema);


module.exports = BackupModel;