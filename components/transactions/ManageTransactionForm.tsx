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

import {
  transactionInput,
  transactionSchema,
} from "@/schemas/transactionsSchema";

import { useEffect, useRef } from "react";
import { format } from "date-fns";

import { TRANSACTION_TYPES } from "@/constants";

import {
  createTransaction,
  editTransaction,
} from "@/features/transactions/actions";

import { ITransaction } from "@/types/transaction.types";
import { useRouter } from "next/navigation";
import { ICategory } from "@/types/category.types";

import { InputGroup, InputGroupTextarea } from "../ui/input-group";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Calendar } from "../ui/calendar";

interface ManageTransactionFormProps {
  allCategories: ICategory[];
  mode: "create" | "edit";
  transaction: ITransaction | null;
}

export default function ManageTransactionForm({
  allCategories,
  transaction,
  mode,
}: ManageTransactionFormProps) {
  const form = useForm<transactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      mode === "edit" && transaction
        ? {
            amount: `${transaction.amount / 100}`,
            note: transaction.note || "",
            type: transaction.type,
            categoryId: transaction.categoryId || "",
            date: transaction.date,
          }
        : {
            amount: "",
            note: "",
            type: "income",
            categoryId: "",
            date: new Date(),
          },
  });

  const router = useRouter();

  const selectedType = form.watch("type");
  const prevTypeRef = useRef(selectedType);

  const filteredCategories = allCategories.filter(
    (cat) => cat.type === selectedType,
  );

  useEffect(() => {
    if (prevTypeRef.current !== selectedType) {
      prevTypeRef.current = selectedType;
      form.setValue("categoryId", "");
    }
  }, [selectedType, form]);

  async function handleCreateTransaction(data: transactionInput) {
    try {
      const response = await createTransaction(data);

      if (response.success) {
        toast.success("Transaction created successfully");
        form.reset();
        router.push("/dashboard/transactions");
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error creating transaction",
      );
    }
  }

  async function handleEditTransaction(data: transactionInput) {
    try {
      if (!transaction?._id) return;

      const response = await editTransaction(transaction._id, data);

      if (response.success) {
        toast.success("Transaction updated successfully");
        router.push("/dashboard/transactions");
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error updating transaction",
      );
    }
  }

  async function onSubmit(data: transactionInput) {
    if (mode === "create") {
      await handleCreateTransaction(data);
    } else {
      await handleEditTransaction(data);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8 sm:px-6">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">
            {mode === "create" ? "Add Transaction" : "Edit Transaction"}
          </CardTitle>

          <CardDescription className="text-sm leading-6">
            {mode === "create"
              ? "Record a new transaction."
              : "Update your transaction."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="transaction-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FieldGroup>
              {/* Amount */}
              <Controller
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="amount">Amount</FieldLabel>

                    <Input
                      {...field}
                      id="amount"
                      placeholder="Enter amount"
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Note */}
              <Controller
                name="note"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-note">Note</FieldLabel>

                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-note"
                        rows={5}
                        className="min-h-24 resize-none"
                        placeholder="Write a note (optional)"
                        aria-invalid={fieldState.invalid}
                      />
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Type */}
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
                        <FieldLabel
                          key={type}
                          htmlFor={`transaction-type-${type}`}
                        >
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>{type}</FieldTitle>
                            </FieldContent>

                            <RadioGroupItem
                              id={`transaction-type-${type}`}
                              value={type}
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

              {/* Category */}
              <Controller
                name="categoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="category">Category</FieldLabel>

                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="category"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>

                      <SelectContent position="item-aligned">
                        {filteredCategories.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            No categories found
                          </div>
                        ) : (
                          filteredCategories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Date */}
              <Controller
                name="date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Date</FieldLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          aria-invalid={fieldState.invalid}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={{ after: new Date() }}
                        />
                      </PopoverContent>
                    </Popover>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            variant="brand"
            disabled={form.formState.isSubmitting}
            type="submit"
            form="transaction-form"
          >
            {form.formState.isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create Transaction"
                : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
