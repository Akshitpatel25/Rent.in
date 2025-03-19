import MonthlyRent from "@/models/monthlyRent.model";
import { dbConnect } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    let monthNumber = "01";
    try {
        await dbConnect();
        const reqbody = await request.json();
        console.log(reqbody);

        
            let yearNumber = reqbody.M_Y.slice(5);
        switch (reqbody.M_Y.slice(0,3)) {
            case "JAN":
                monthNumber = "01";
                break;
            case "FEB":
                monthNumber = "02";
                break;
            case "MAR":
                monthNumber = "03";
                break;
            case "APR":
                monthNumber = "04";
                break;
            case "MAY":
                monthNumber = "05";
                break;
            case "JUN":
                monthNumber = "06";
                break;
            case "JUL":
                monthNumber = "07";
                break;
            case "AUG":
                monthNumber = "08";
                break;
            case "SEP":
                monthNumber = "09";
                break;
            case "OCT":
                monthNumber = "10";
                break;
            case "NOV":
                monthNumber = "11";
                break;
            case "DEC":
                monthNumber = "12";
                break;
            default:
                monthNumber = "01";
                break;
        }
        // const res = await MonthlyRent.find({user_id: reqbody.user_id, Rent_Paid_date: `01/${monthNumber}/${yearNumber}`});
        const res = await MonthlyRent.find({
            user_id: reqbody.user_id,
            Rent_Paid_date: { $regex: `/${monthNumber}/${yearNumber}$` } 
          });
        return NextResponse.json({data: res}, {status: 200});
                
    } catch (error:any) {
        
        return NextResponse.json({error: "error in get-previous-month-revenue route", status: 500})
    }
}