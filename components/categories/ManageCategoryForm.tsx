"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { categoryInput, categorySchema } from "@/schemas/categorySchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { createCategory, editCategory } from "@/features/categories/actions";
import { CATEGORY_COLORS, TRANSACTION_TYPES } from "@/constants";
import { CategoryColorKey, ICategory } from "@/types/category.types";
import { useRouter } from "next/navigation";

const formSchema = categorySchema;
const defaultColor = Object.keys(CATEGORY_COLORS)[0] as CategoryColorKey;

interface ManageCategoryFormProps {
  mode: "create" | "edit";
  category?: ICategory;
}

export default function ManageCategoryForm({
  mode,
  category,
}: ManageCategoryFormProps) {
  const form = useForm<categoryInput>({
    resolver: zodResolver(formSchema),
    defaultValues:
      mode === "edit" && category
        ? {
            name: category.name,
            type: category.type,
            color: category.color as CategoryColorKey,
          }
        : {
            name: "",
            type: "income",
            color: defaultColor,
          },
  });
  const router = useRouter();

  async function handleCreateCategory(data: categoryInput) {
    try {
      const response = await createCategory(data);
      if (response.success) {
        toast.success("Category created successfully");
        router.push("/dashboard/categories");
        form.reset();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error creating transaction",
      );
    }
  }

  async function handleEditCategory(data: categoryInput) {
    try {
      if (!category) {
        toast.error("Category not found");
        return;
      }
      const response = await editCategory(category._id, data);
      if (response.success) {
        toast.success("Category updated successfully");
        router.push("/dashboard/categories");
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error updating transaction",
      );
    }
  }

  async function onSubmit(data: categoryInput) {
    if (mode === "create") {
      handleCreateCategory(data);
    } else {
      handleEditCategory(data);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8 sm:px-6">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold text-neutral-700">
            {mode === "create" ? "Add Category" : "Edit Category"}
          </CardTitle>

          <CardDescription className="text-sm leading-6">
            {mode === "create"
              ? "Create a new category."
              : "Update your category."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="category-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FieldGroup>
              {/* Name + Color */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name" className="text-neutral-700">
                          Category Name
                        </FieldLabel>

                        <Input
                          {...field}
                          id="name"
                          placeholder="Enter category name"
                          autoComplete="off"
                          aria-invalid={fieldState.invalid}
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="sm:w-28">
                  <Controller
                    name="color"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="category-color">Color</FieldLabel>

                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="category-color"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>

                          <SelectContent position="item-aligned">
                            {Object.keys(CATEGORY_COLORS).map((color) => (
                              <SelectItem key={color} value={color}>
                                <span
                                  className="rounded-full px-3 font-bold text-neutral-700"
                                  style={{
                                    background:
                                      CATEGORY_COLORS[color as CategoryColorKey]
                                        .bg,
                                  }}
                                >
                                  A
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>

              {mode === "create" && (
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FieldSet>
                      <FieldLabel>Type</FieldLabel>

                      <FieldDescription>
                        Select the transaction type.
                      </FieldDescription>

                      <RadioGroup
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-col gap-3 sm:flex-row sm:gap-6"
                      >
                        {TRANSACTION_TYPES.map((type) => (
                          <FieldLabel key={type} htmlFor={`type-${type}`}>
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{type}</FieldTitle>
                              </FieldContent>

                              <RadioGroupItem
                                id={`type-${type}`}
                                value={type}
                              />
                            </Field>
                          </FieldLabel>
                        ))}
                      </RadioGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldSet>
                  )}
                />
              )}
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            variant="brand"
            disabled={form.formState.isSubmitting}
            type="submit"
            form="category-form"
          >
            {form.formState.isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create Category"
                : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
