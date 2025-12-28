import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Please provide username, email, password",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return Response.json(
        {
          success: false,
          message: "User already exists with this username or email",
        },
        { status: 409 }
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return Response.json(
      {
        success: true,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Error creating user",
      },
      { status: 500 }
    );
  }
}
