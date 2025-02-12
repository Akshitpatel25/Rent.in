import { dbConnect } from "@/db/dbConnect";
import Rents from "@/models/rents.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        
        const rent = await Rents.findById(reqbody.rentData.rent_id)
        
        const updatedRent = {
            ...rent._doc,
            rent_name: reqbody.rentData.rent_name,
            rent_person_name: reqbody.rentData.rent_person_name,
            rent_person_num: reqbody.rentData.rent_person_num,
            rent_person_adhar: reqbody.rentData.rent_person_adhar,
            monthly_rent_price: reqbody.rentData.monthly_rent_price,
            monthly_ele_bill_price: reqbody.rentData.monthly_ele_bill_price,
            ele_unit_price: reqbody.rentData.ele_unit_price,
            deposite: reqbody.rentData.deposite
        }
        

        await Rents.findByIdAndUpdate(reqbody.rentData.rent_id, updatedRent);
        
        return NextResponse.json({message: "edit successfully"}, {status: 200})



    } catch (error:any) {
        return NextResponse.json({error: "Unable to edit property, Edit-rent-details route"}, {status: 500})
    }
}