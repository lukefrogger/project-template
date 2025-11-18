"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectablePaymentMethodCard } from "@/components/payment/payment-method-card";
import { api } from "@/services/api";
import { Separator } from "@/components/ui/separator";
import { ApplyPaymentMethodSelect } from "./apply-payment-method-select";
import SectionHeading from "../headings/section-heading";
import { newPaymentMethodSettings } from "@/services/stripe-elements";
import { initStripe, StripeContext } from "@/hooks/use-stripe";
import LoadingButton from "../loading-button";
import Message, { MessageWithChildren } from "../message";
import { CheckCircle, CurrencyCircleDollar } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import dayjs, { Dayjs } from "dayjs";
import { usePaymentMethods } from "@/hooks/use-payment-methods";
import Link from "next/link";

interface PaymentFormProps {
  programTuition: number;
  totalPaid: number;
  programId: string;
  depositDueDate: Dayjs | null;
  fullPaymentDueDate: Dayjs | null;
  minAmount: number;
  paymentState: "deposit" | "full" | "open";
}

export function ProgramPaymentForm({
  programTuition,
  totalPaid,
  programId,
  depositDueDate,
  fullPaymentDueDate,
  minAmount,
  paymentState,
}: PaymentFormProps) {
  const stripe = initStripe();
  const [amount, setAmount] = useState(minAmount);
  const [payError, setPayError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successfulPayment, setSuccessfulPayment] = useState(false);
  const [justPaidAmount, setJustPaidAmount] = useState(0);

  const { selectedPaymentMethod, setSelectedPaymentMethod, paymentMethods, isLoading } = usePaymentMethods();

  const formatDollars = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (minAmount && value < minAmount) {
      setPayError(`Please pay at least ${formatDollars(minAmount)}`);
    } else {
      setPayError(null);
    }
    setAmount(value);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (successfulPayment) {
      console.warn("Attempted another payment after successful payment");
      return;
    }

    if (minAmount && amount < minAmount) {
      setPayError(`Please pay at least ${formatDollars(minAmount)}`);
      return;
    }

    if (isLoading) {
      return;
    }

    setPayError(null);
    setLoading(true);
    setSuccessfulPayment(false);
    try {
      if (!programId || !selectedPaymentMethod) {
        setPayError("Missing required payment parameters.");
        return;
      }

      if (!amount) {
        setPayError("Please enter an amount to pay.");
        return;
      }
      if (amount > programTuition - totalPaid) {
        setPayError("The amount you entered is greater than the balance remaining.");
        return;
      }

      const resp = await api.payments.payProgramTuition(programId, selectedPaymentMethod.Id, amount);
      if (resp.error) {
        console.warn("> Payment Error", resp.error);
        setPayError(resp.error || "Payment failed");
      } else {
        setSuccessfulPayment(true);
        setJustPaidAmount(amount);
        setAmount(0);
      }
    } catch (error) {
      console.warn("> Payment Error", error);
      setPayError("There was an error processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startOfToday = dayjs().endOf("day");

  return (
    <StripeContext stripe={stripe} elementOptions={newPaymentMethodSettings}>
      <div className="mx-auto max-w-xl px-4 pb-8">
        <form onSubmit={handleSubmitPayment} className="flex flex-col gap-4 p-4">
          {!isLoading && paymentMethods && (
            <div className="flex flex-col gap-2">
              <SectionHeading title="Payment Method">
                <ApplyPaymentMethodSelect
                  defaultSelected={selectedPaymentMethod}
                  paymentMethods={paymentMethods}
                  onSelect={setSelectedPaymentMethod}
                />
              </SectionHeading>
              {paymentMethods?.length > 0 ? (
                <SelectablePaymentMethodCard {...selectedPaymentMethod} isSelected={true} onClick={() => {}} />
              ) : (
                <div className="py-4">No payment methods found. Please add a payment method to continue.</div>
              )}
            </div>
          )}

          <Separator className="mt-2" />
          <section className="flex flex-col gap-4">
            <SectionHeading title="Payment Amount" className="mt-0" />
            <div className="flex flex-col gap-2 mb-1 ">
              <LineItem label="Program Tuition" description="Does not include the application fee">
                {formatDollars(programTuition)}
              </LineItem>
              <LineItem label="Amount Paid">{formatDollars(totalPaid + justPaidAmount)}</LineItem>
              <div className="flex justify-between font-bold mt-2">
                <div>Balance Remaining</div>
                <div>{formatDollars(programTuition - totalPaid - justPaidAmount)}</div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            {!successfulPayment ? (
              <>
                <Separator />
                <div className="flex flex-col gap-1 pt-2">
                  <Label htmlFor="amount">Enter an Amount to Pay Today</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 mt-[1px]">$</span>
                    <Input
                      id="amount"
                      type="number"
                      step="1.0"
                      value={amount || ""}
                      onChange={handleAmountChange}
                      placeholder="200.00"
                      disabled={successfulPayment}
                      min={minAmount}
                      className="pl-6"
                    />
                  </div>
                </div>
                {payError && <Message variant="destructive" description={payError} />}
                <MessageWithChildren icon={<CurrencyCircleDollar />} variant="warning" className="inline">
                  {paymentState === "deposit" && depositDueDate && (
                    <>
                      A minimum payment of {formatDollars(minAmount)} is due by {depositDueDate?.format("MMMM D, YYYY")}{" "}
                      to secure your spot in this program.
                    </>
                  )}
                  {paymentState === "open" && (
                    <>Reminder, tuition is due in full by {fullPaymentDueDate?.format("MMMM D, YYYY")}.</>
                  )}
                  {paymentState === "full" && fullPaymentDueDate?.isAfter(startOfToday) && <>Tuition is due in full.</>}
                  {paymentState === "full" && !fullPaymentDueDate?.isAfter(startOfToday) && (
                    <>Tuition is due in full by {fullPaymentDueDate?.format("MMMM D, YYYY")}.</>
                  )}
                </MessageWithChildren>
                <LoadingButton type="submit" isLoading={loading} disabled={loading || amount < minAmount}>
                  Submit Payment
                </LoadingButton>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <Message
                  variant="success"
                  title="Payment Completed"
                  icon={<CheckCircle />}
                  description={`Your payment of ${formatDollars(justPaidAmount)} was successful.`}
                />

                <Button variant="outline" asChild>
                  <Link href={`/programs/${programId}`}>Return to Program</Link>
                </Button>
              </div>
            )}
          </section>
        </form>
      </div>
    </StripeContext>
  );
}

function LineItem({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between text-[14px]">
      <div>
        <span className="font-medium">{label}</span>
        {description && <div className="text-sm text-gray-500">{description}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
