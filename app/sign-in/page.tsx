import { signIn } from "@/auth";

export default function SignInPage() {
  async function login(formData: FormData) {
    "use server";

    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Invalid credentials");
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  }

  return (
    <form action={login}>
      <label>
        Email
        <input name="email" type="email" required />
      </label>

      <label>
        Password
        <input name="password" type="password" required />
      </label>

      <button type="submit">Sign In</button>
    </form>
  );
}
