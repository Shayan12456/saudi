const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
        sid: {
            type: [Number],
            required: true,
        },
        sname: {
            type: [String],
            required: true,
        },
        cr: {
            type: [Number],
            required: true,
        },
        tel: {
            type: [String],
            required: true,
        },
        fax: {
            type: [String],
            required: true,
        },
        date: {
            type: [String],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        dc: {
            type: [Number],
            required: true,
        },
        noe: {
            type: [String],
            required: true,
        },
        name: {
            type: [String],
            required: true,
        },
        on: {
            type: [Number],
            required: true,
        },
        sn: {
            type: [Number],
            required: true,
        },
    });

module.exports = new mongoose.model("Employee", employeeSchema);