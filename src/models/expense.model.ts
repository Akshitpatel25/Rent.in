import mongoose from "mongoose";    

const ExpenseSchema = new mongoose.Schema({
    user_id: {
        type:String,
        required: true
    },
    expense_name: {
        type: String,
        required: true
    },
    expense_amount: {
        type: String,
        required: true
    },
    expense_M_Y: {
        type: String,
        required: true
    },
    expense_Day: {
        type: String,
        required: true
    }
})

const ExpenseModel = mongoose.models.MonthlyExpense || mongoose.model("MonthlyExpense", ExpenseSchema);

export default ExpenseModel;