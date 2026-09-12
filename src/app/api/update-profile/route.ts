import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqbody = await request.json();
    const { user_id, whatsapp_numbers } = reqbody;

    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Validate WhatsApp numbers
    if (whatsapp_numbers !== undefined) {
      if (!Array.isArray(whatsapp_numbers)) {
        return NextResponse.json({ error: "whatsapp_numbers must be an array" }, { status: 400 });
      }
      if (whatsapp_numbers.length > 3) {
        return NextResponse.json({ error: "Maximum 3 WhatsApp numbers allowed" }, { status: 400 });
      }
      // Validate each number format (Indian: 10 digits)
      for (const num of whatsapp_numbers) {
        if (num && !/^\d{10,12}$/.test(num)) {
          return NextResponse.json({ error: `Invalid number format: ${num}` }, { status: 400 });
        }
      }
    }

    const updateData: any = {};
    if (whatsapp_numbers !== undefined) {
      updateData.whatsapp_numbers = whatsapp_numbers.filter((n: string) => n.trim() !== "");
    }

    const user = await User.findByIdAndUpdate(user_id, updateData, { new: true });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        whatsapp_numbers: user.whatsapp_numbers,
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error updating profile" }, { status: 500 });
  }
}
