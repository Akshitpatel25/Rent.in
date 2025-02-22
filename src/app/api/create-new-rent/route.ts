import { dbConnect } from "@/db/dbConnect";
import Rents from "@/models/rents.model";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const reqbody = await request.json();
        
        
        const {
            user_email,
            rentName,
            rentPersonName,
            rentPersonNum,
            rentPersonAdhar,
            monthlyRentPrice,
            EleBillPrice,
            ElecUnitPrice,
            deposite
        } = reqbody;


        if (!rentName || !rentPersonName || !rentPersonNum || !rentPersonAdhar || !monthlyRentPrice || !EleBillPrice || !ElecUnitPrice || !deposite) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }else if (rentPersonNum.length < 10 || rentPersonAdhar.length < 12) {
            return NextResponse.json(
                { error: "Invalid phone number or Aadhar number" },
                { status: 400 }
            );
        }else if (rentName.charAt(0) !== rentName.charAt(0).toUpperCase()) {
            return NextResponse.json(
                { error: "Rent name should start with a capital letter" },
                { status: 400 }
            );
        }

        
        
        const user = await User.findOne({ email: user_email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        

        const rents = await Rents.find({user_id:user._id,rent_name:rentName});
        if (rents.length > 0) {
            return NextResponse.json(
                { error: "Rent name already exists" },
                { status: 400 }
            );
        }
        

        const newRent = new Rents({
            user_id: user._id,
            rent_name: rentName,
            rent_person_name:rentPersonName,
            rent_person_num: rentPersonNum,
            rent_person_adhar:rentPersonAdhar,
            monthly_rent_price: monthlyRentPrice,
            monthly_ele_bill_price :EleBillPrice,
            ele_unit_price:ElecUnitPrice,
            deposite:deposite
        });

        await newRent.save();

        return NextResponse.json(
            { message: "New Rent Created Successfully"},
            { status: 200 }
        );


    } catch (error: any) {
        console.error("Error in create-new-rent route:", error);
        return NextResponse.json(
            { error: "Something went wrong in create-new-rent route" },
            { status: 500 }
        );
    }
}
