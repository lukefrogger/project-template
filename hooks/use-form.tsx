import { createFormHook } from "@tanstack/react-form";
import { lazy } from "react";
import { fieldContext, formContext, useFormContext } from "./form-context";
import LoadingButton from "@/components/loading-button";

const TextInput = lazy(() => import("@/components/form/text-input"));
const EmailInput = lazy(() => import("@/components/form/email-input"));
const PasswordInput = lazy(() => import("@/components/form/password-input"));
const PhoneInput = lazy(() => import("@/components/form/phone-input"));
const DateInput = lazy(() => import("@/components/form/date-input"));
const SelectPickList = lazy(() => import("@/components/form/select-picklist"));
const TextAreaInput = lazy(() => import("@/components/form/text-area-input"));
const CheckboxInput = lazy(() => import("@/components/form/checkbox-input"));
const NumberInput = lazy(() => import("@/components/form/number-input"));
const DollarInput = lazy(() => import("@/components/form/dollar-input"));

const SubmitButton = ({ label, isLoading = false }: { label: string; isLoading?: boolean }) => {
  const { Subscribe } = useFormContext();

  return (
    <Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <LoadingButton
          isLoading={isSubmitting || isLoading}
          disabled={!canSubmit || isSubmitting || isLoading}
          type="submit"
        >
          {label}
        </LoadingButton>
      )}
    </Subscribe>
  );
};

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextInput,
    EmailInput,
    PasswordInput,
    PhoneInput,
    DateInput,
    SelectPickList,
    TextAreaInput,
    CheckboxInput,
    NumberInput,
    DollarInput,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
