import { dbConnect } from "@/db/dbConnect";
import MonthlyRent from "@/models/monthlyRent.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        

        const res = await MonthlyRent.findById(reqbody.id);

        if (!res) {
            return NextResponse.json({message: "Rent Id not found"}, {status: 400});
        }



        if (reqbody.noteValue) {
            await MonthlyRent.findByIdAndUpdate(reqbody.id, {note: reqbody.noteValue});
            return NextResponse.json({message: "successfull note updated"}, {status: 200});
        }else if (reqbody.delete) {
            await MonthlyRent.findByIdAndDelete(reqbody.id);
            return NextResponse.json({message: "successfull month deleted"}, {status: 200});
        }else if (reqbody.addPaymentMode, reqbody.formattedDate) {
            await MonthlyRent.findByIdAndUpdate(reqbody.id, {payment_mode: reqbody.addPaymentMode, Rent_Paid_date: reqbody.formattedDate});
            return NextResponse.json({message: "successfull payment mode updated"}, {status: 200});
        } else if (reqbody.amount) {
            await MonthlyRent.findByIdAndUpdate(reqbody.id, { monthly_rent_price: reqbody.amount });            
            return NextResponse.json({message: "successfull amount updated"}, {status: 200}); 
        }

    } catch (error:any) {
        return NextResponse.json({error: "something went wrong in update-monthly-rent route"}, {status: 500});
    }
}
