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
import { createCategory } from "@/features/categories/actions";
import { CATEGORY_COLORS, TRANSACTION_TYPES } from "@/constants";

const formSchema = categorySchema;

export default function ManageCategoryForm() {
  const form = useForm<categoryInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "income",
      color: "#75e59f",
    },
  });

  async function onSubmit(data: categoryInput) {
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

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Add Catgory</CardTitle>
          <CardDescription>Create a new category</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="category-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Name */}
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
              {/* Color */}
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
                        className="min-w-30"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {CATEGORY_COLORS.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div
                              className={"p-4 rounded-md"}
                              style={{ backgroundColor: type.value }}
                            ></div>
                            {type.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
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
