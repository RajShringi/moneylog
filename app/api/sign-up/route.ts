import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  dbConnect();
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return Response.json({
        success: false,
        message: "Please provide username, email, password",
      });
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return Response.json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = await User.create({ username, email, password });
    return Response.json({
      success: true,
      message: "User created successfully",
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
