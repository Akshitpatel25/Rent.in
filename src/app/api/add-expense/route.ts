import { dbConnect } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import ExpenseModel from "@/models/expense.model";
// this route is used for CRD operations
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqbody = await request.json();

    if (reqbody.getAllExpense == true) {
        const res = await ExpenseModel.find({ $or: [{ user_id: reqbody.userID }, { user_id: { $elemMatch: { $eq: reqbody.userID } } }] });
        return NextResponse.json({data: res}, {status: 200});
    }else if (reqbody.userID && reqbody.expenseName && reqbody.expenseAmount && reqbody.expenseM_Y) {
        // Check if user is part of a shared group by looking for array user_id
        let userId: any = reqbody.userID;
        const existing = await ExpenseModel.findOne({ user_id: { $elemMatch: { $eq: reqbody.userID } } });
        if (existing && Array.isArray(existing.user_id)) {
            userId = existing.user_id;
        }

        const newExpense = new ExpenseModel({
            user_id: userId,
            expense_name: reqbody.expenseName,
            expense_amount: reqbody.expenseAmount,
            expense_M_Y: reqbody.expenseM_Y,
            expense_Day: reqbody.expense_Day
          });
          await newExpense.save();
          return NextResponse.json(
            { message: "Expense added successfully" },
            { status: 200 }
          );
    }else if (reqbody.id && reqbody.deleteExpense) {
        await ExpenseModel.findByIdAndDelete(reqbody.id);
        return NextResponse.json({message: "Expense deleted successfully"}, {status: 200});
    }

    
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error in add-expense route" },
      { status: 500 }
    );
  }
}
