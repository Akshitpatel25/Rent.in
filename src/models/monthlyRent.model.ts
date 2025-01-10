import mongoose from "mongoose";

const MonthlyRentSchema = new mongoose.Schema({
    rent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rents",
        required: true
    },
    rent_name: {
        type: String,
        required: true
    },
    rent_person_name: {
        type: String,
        required: true
    },
    monthly_rent_price: {
        type: String,
        required: true
    },
    month_year: {
        type: String,
        required: true
    },
    meter_reading: {
        type: String,
    },
    electricity_bill: {
        type: String,
    },
    payment_mode: {
        type: String,
    },
    note: {
        type: String,
    },
    Rent_Paid_date: {
        type: String,
    }
})

const MonthlyRent = mongoose.models.monthlyRent || mongoose.model("monthlyRent", MonthlyRentSchema);

export default MonthlyRent;