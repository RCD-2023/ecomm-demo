'use client'

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from "@/lib/validator";
import { updateShippingAddress } from "@/lib/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {z} from "zod";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { updateUserAddress } from "@/lib/actions/user.actions";


const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof shippingAddressSchema>>({
      resolver: zodResolver(shippingAddressSchema),
      defaultValues: address || shippingAddressDefaultValues
    });
    const [isPending, startTransition] = useTransition();
    const onSubmit:SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values) => {
       startTransition(async () => {
         const res = await updateUserAddress(values);
        if (!res.success) {
            toast.error(`${res.message}`);
            return;
        }
         router.push('/payment-method');
       });
    }
    //
    return (
      <>
        <div className='max-w-md mx-auto space-y-4'>
          <h1 className='h2-bold mt-4'>Shipping Address</h1>
          <p className='text-sm text-muted-foreground'>
            Please enter the address that you want to ship to
          </p>
          <form
            method='post'
            className='flex flex-col gap-6'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='flex flex-col gap-5 md:flex-row'>
              <FieldGroup className='w-full space-y-4'>
                <Controller
                  name='fullName'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Full Name</FieldLabel>
                      <Input
                        placeholder='Enter full name'
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name='streetAddress'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Address</FieldLabel>
                      <Input
                        {...field}
                        placeholder='Enter address'
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name='city'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>City</FieldLabel>
                      <Input
                        {...field}
                        placeholder='Enter city'
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name='country'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Country</FieldLabel>
                      <Input
                        {...field}
                        placeholder='Enter address'
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name='postalCode'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Postal Code</FieldLabel>
                      <Input
                        {...field}
                        placeholder='Enter address'
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
            <div className='flex gap-2'>
              <Button type='submit' disabled={isPending}>
                {isPending ? (
                  <Loader className='animate-spin w-4 h-4' />
                ) : (
                  <ArrowRight className='w-4 h-4' />
                )}
                Continue
              </Button>
            </div>
          </form>
        </div>
      </>
    );
}
 
export default ShippingAddressForm;