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
} from "./ui/select";

import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
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
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "Add Category" : "Edit Category"}
          </CardTitle>
          <CardDescription>
            {mode === "create" ? "Create a new category" : "Edit your category"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="category-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex items-start justify-between gap-4">
                {/* Name */}
                <div className="flex-1">
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name">Category Name</FieldLabel>
                        <Input
                          {...field}
                          id="name"
                          aria-invalid={fieldState.invalid}
                          placeholder="please enter your category name"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* color */}
                <div className="">
                  <Controller
                    name="color"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        orientation="responsive"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="form-rhf-select-color">
                          Color
                        </FieldLabel>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}

                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="form-rhf-select-color"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            {Object.keys(CATEGORY_COLORS).map((color) => (
                              <SelectItem key={color} value={color}>
                                <span
                                  className="px-3 font-bold rounded-full text-neutral-600"
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
                      </Field>
                    )}
                  />
                </div>
              </div>

              {/* type */}
              {mode === "create" && (
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FieldSet>
                      <FieldLabel>Type</FieldLabel>
                      <FieldDescription>
                        Select transaction type Income | Expense
                      </FieldDescription>
                      <RadioGroup
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex gap-4"
                      >
                        {TRANSACTION_TYPES.map((type) => (
                          <FieldLabel
                            key={type}
                            htmlFor={`form-rhf-radiogroup-${type}`}
                          >
                            <Field
                              orientation="horizontal"
                              data-invalid={fieldState.invalid}
                            >
                              <FieldContent>
                                <FieldTitle>{type}</FieldTitle>
                              </FieldContent>
                              <RadioGroupItem
                                value={type}
                                id={`form-rhf-radiogroup-${type}`}
                                aria-invalid={fieldState.invalid}
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
          <Field orientation="horizontal">
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              form="category-form"
            >
              {form.formState.isSubmitting ? "Loading..." : "Submit"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
