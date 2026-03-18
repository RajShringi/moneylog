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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import {
  transactionInput,
  transactionSchema,
} from "@/schemas/transactionsSchema";
import { ICategory } from "@/types/category.types";
import { useEffect, useRef } from "react";
import { InputGroup, InputGroupTextarea } from "./ui/input-group";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { TRANSACTION_TYPES } from "@/constants";
import {
  createTransaction,
  editTransaction,
} from "@/features/transactions/actions";
import { ITransaction } from "@/types/transaction.types";
import { useRouter } from "next/navigation";

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
            categoryId: "69a851afc9fce1af13876a85",
            date: new Date(),
          },
  });

  const router = useRouter();

  // Watch the type field to filter categories
  const selectedType = form.watch("type");
  const prevTypeRef = useRef(selectedType);

  // Filter categories based on selected type
  const filteredCategories = allCategories.filter(
    (cat) => cat.type === selectedType,
  );

  // Reset categoryId when type changes
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
        toast.success("Transaction edited successfully");
        router.push("/dashboard/transactions"); // Navigate to transaction page
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error editing transaction",
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
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "Add Transaction" : "Edit Transaction"}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Create a new transaction"
              : "Edit your transaction"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="transaction-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                      aria-invalid={fieldState.invalid}
                      placeholder="please enter the amount"
                      autoComplete="off"
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
                    <FieldLabel htmlFor="form-notes">Note</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-note"
                        placeholder="Write any note for transaction"
                        rows={6}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Transaction Type (Income | Expense) */}
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

              {/* Categories */}
              <Controller
                name="categoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="form-rhf-select-category">
                      Categories
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
                        id="form-rhf-select-category"
                        aria-invalid={fieldState.invalid}
                        className="min-w-30"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {filteredCategories.length === 0 ? (
                          <div className="p-2 text-sm text-gray-500">
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
                  </Field>
                )}
              />

              {/* Date */}
              <Controller
                name="date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <FieldLabel>Date</FieldLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                          data-invalid={fieldState.invalid}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={{ after: new Date() }}
                        />
                      </PopoverContent>
                    </Popover>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
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
              form="transaction-form"
            >
              {form.formState.isSubmitting ? "Loading..." : "Submit"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
