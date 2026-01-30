"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { categoryInput, categorySchema } from "@/schemas/categorySchema";
import { ActionResult } from "@/types/action.type";
import { ICategory } from "@/types/category.types";
import { revalidatePath } from "next/cache";

export async function createCategory(
  data: categoryInput,
): Promise<ActionResult<null>> {
  const session = await auth();
  // if user is not logged in
  if (!session || !session.user) {
    return { success: false, error: "user is not logged-in" };
  }
  await dbConnect();
  // validate the data using zod.
  const validated = categorySchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: "invalid data",
    };
  }

  // create category
  await Category.create({
    name: data.name,
    type: data.type,
    userId: session.user.id,
    color: data.color,
  });

  revalidatePath("/dashboard/categories");

  return {
    success: true,
    data: null,
    message: "Category created successfully",
  };
}

export async function fetchCategories(): Promise<ActionResult<ICategory[]>> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "user is not logged-in" };
    }
    await dbConnect();

    const categories = await Category.find({ userId: session.user.id }).lean();
    const serializeCategories = categories.map((doc: any): ICategory => {
      return {
        _id: doc._id.toString(),
        name: doc.name,
        type: doc.type,
        color: doc.color || "#000000",
      };
    });
    return {
      success: true,
      data: serializeCategories,
      message: "Categories fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Can't fetch categories",
    };
  }
}
