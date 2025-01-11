import { dbConnect } from "@/db/dbConnect";
import ExpenseModel from "@/models/expense.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        const {user_id, M_Y} = reqbody;
                

        const res = await ExpenseModel.find({user_id: user_id, expense_M_Y: M_Y});
        if (!res) {
            return NextResponse.json({message: "No data found"}, {status: 202});
        }
        
        return NextResponse.json({data: res}, {status: 200});
        
    } catch (error:any) {
        
        return NextResponse.json({error: "error in get-previous-month-expense route", status: 500})
    }
}