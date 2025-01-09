import mongoose from "mongoose";

const RentsSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
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
    rent_person_num: {
        type: String,
        required: true
    },
    rent_person_adhar: {
        type: String,
        required: true
    },
    monthly_rent_price: {
        type: String,
        required: true
    },
    monthly_ele_bill_price: {
        type: String
    },
    ele_unit_price: {
        type: String,
        required: true
    } 
})

const Rents = mongoose.models.rents || mongoose.model("rents", RentsSchema);

export default Rents;