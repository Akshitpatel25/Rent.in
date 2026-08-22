import { dbConnect } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import MaintanenceModel from "@/models/maintanence.model";
// this route is used for CRD operations
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqbody = await request.json();

    if (reqbody.getAllMaintanence == true) {
        const res = await MaintanenceModel.find({ $or: [{ user_id: reqbody.userID }, { user_id: { $elemMatch: { $eq: reqbody.userID } } }] });
        return NextResponse.json({data: res}, {status: 200});
    }else if (reqbody.userID && reqbody.maintanenceName && reqbody.maintanenceAmount && reqbody.maintanenceM_Y) {
        // Check if user is part of a shared group
        let userId: any = reqbody.userID;
        const existing = await MaintanenceModel.findOne({ user_id: { $elemMatch: { $eq: reqbody.userID } } });
        if (existing && Array.isArray(existing.user_id)) {
            userId = existing.user_id;
        }

        const newMaintanence = new MaintanenceModel({
            user_id: userId,
            maintanence_name: reqbody.maintanenceName,
            maintanence_amount: reqbody.maintanenceAmount,
            maintanence_M_Y: reqbody.maintanenceM_Y,
            maintanence_Day: reqbody.maintanence_Day
          });
          await newMaintanence.save();
          return NextResponse.json(
            { message: "Maintanence added successfully" },
            { status: 200 }
          );
    }else if (reqbody.id && reqbody.deleteMaintanence) {
        await MaintanenceModel.findByIdAndDelete(reqbody.id);
        return NextResponse.json({message: "Maintanence deleted successfully"}, {status: 200});
    }

    
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error in add-maintanence route" },
      { status: 500 }
    );
  }
}
