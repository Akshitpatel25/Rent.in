import MonthlyRent from "@/models/monthlyRent.model";
import { dbConnect } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqbody = await request.json();

    const response = await MonthlyRent.find({ rent_id: reqbody.id });

    if (!response) {
      return NextResponse.json({ message: "No data found" }, { status: 202 });
    }
    if (!reqbody.user_id && !reqbody.month_year) {
        return NextResponse.json({ data: response }, { status: 200 });
    }
    
    if (reqbody.rent_id && reqbody.user_id && reqbody.month_year) {

      const res = await MonthlyRent.find(
        {
          user_id: reqbody.user_id,
          rent_id: reqbody.rent_id,
        },
        {
          rent_name: 1,
          rent_person_name: 1,
          monthly_rent_price: 1,
          month_year: 1,
          payment_mode: 1,
          _id: 0,
        }
      );

      const filteredRes = res.filter(
        (item) =>
          item.month_year !== reqbody.month_year
      );
    //   console.log("filteredRes:", filteredRes);
      
      const finalRes =
        filteredRes.length > 0
          ? [{
              rent_name: filteredRes[res.length - 1].rent_name,
              rent_person_name: filteredRes[res.length - 1].rent_person_name,
              monthly_rent_price: filteredRes[res.length - 1].monthly_rent_price,
            }]
          : null; 
          
        //   console.log("finalRes: ",finalRes);
          
          return NextResponse.json({ data: finalRes }, { status: 200 }); // ✅ Always return `{ data: ... }`
    }
        
    } catch (error: any) {
    return NextResponse.json(
      { error: "something went wrong in getting-monthly-rent route" },
      { status: 200 }
    );
  }
}
