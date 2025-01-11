import mongoose from "mongoose";    

const MaintanenceSchema = new mongoose.Schema({
    user_id: {
        type:String,
        required: true
    },
    maintanence_name: {
        type: String,
        required: true
    },
    maintanence_amount: {
        type: String,
        required: true
    },
    maintanence_M_Y: {
        type: String,
        required: true
    },
    maintanence_Day: {
        type: String,
        required: true
    }
})

const MaintanenceModel = mongoose.models.MonthlyMaintanence || mongoose.model("MonthlyMaintanence", MaintanenceSchema);

export default MaintanenceModel;