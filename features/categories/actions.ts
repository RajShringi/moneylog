"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { categoryInput, categorySchema } from "@/schemas/categorySchema";
import { ActionResult } from "@/types/action.type";
import { ICategory, ICategoryDocument } from "@/types/category.types";
import { revalidatePath } from "next/cache";

export async function createCategory(
  data: categoryInput,
): Promise<ActionResult<null>> {
  try {
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
  } catch (error: any) {
    if (error?.code === 11000) {
      return {
        success: false,
        error: "Category with this name already exists",
      };
    }
    return { success: false, error: "Error creating category" };
  }
}

export async function fetchCategories(): Promise<ActionResult<ICategory[]>> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "user is not logged-in" };
    }
    await dbConnect();

    const categories = await Category.find({
      userId: session.user.id,
      isArchived: false,
    }).lean();
    const serializeCategories = categories.map((doc: any): ICategory => {
      return {
        _id: doc._id.toString(),
        name: doc.name,
        type: doc.type,
        color: doc.color || "#000000",
        isArchived: doc.isArchived,
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

export async function fetchCategoryById(
  id: string,
): Promise<ActionResult<ICategory>> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "user is not logged-in" };
    }
    await dbConnect();

    const category = await Category.findOne({
      _id: id,
      userId: session.user.id,
      isArchived: false,
    }).lean<ICategoryDocument>();
    if (!category) {
      return { success: false, error: "Category not found" };
    }
    const serializeCategory: ICategory = {
      _id: category._id.toString(),
      name: category.name,
      type: category.type,
      color: category.color || "#000000",
      isArchived: category.isArchived,
    };
    return {
      success: true,
      data: serializeCategory,
      message: "Category fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Can't fetch category",
    };
  }
}

export async function editCategory(
  id: string,
  data: categoryInput,
): Promise<ActionResult<null>> {
  try {
    const session = await auth();
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

    const category = await Category.findOne({
      _id: id,
      userId: session.user.id,
      isArchived: false,
    });
    if (!category) {
      return { success: false, error: "Category not found" };
    }

    // update category
    category.name = validated.data.name;
    category.type = validated.data.type;
    category.color = validated.data.color;
    await category.save();
    revalidatePath("/dashboard/categories");

    return {
      success: true,
      data: null,
      message: "Category updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Can't fetch category",
    };
  }
}
