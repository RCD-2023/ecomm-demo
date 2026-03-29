'use client';
import CheckoutSteps from '@/components/shared/checkout-steps';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldDescription,
  FieldContent,
} from '@/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import { paymentMethodSchema } from '@/lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import z from 'zod';
import { Input } from '@/components/ui/input';

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
//   const { toast } = useToast();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values)
      if (!res.success) {
        toast.error(`${res.message}`)
        return;
      }
       router.push('/place-order')
    })
  };

  return (
    <>
      <CheckoutSteps current={2} />
      <div className='max-w-md mx-auto'>
        <form
          method='post'
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4'
        >
          <FieldGroup>
            <Controller
              name='type'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className='text-xl'>Payment method</FieldLabel>
                  <FieldDescription>Please select a payment method</FieldDescription>
                  
                  <FieldContent>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className='flex flex-col space-y-2'
                    >
                      {PAYMENT_METHODS.map((paymentMethod) => (
                        <label
                          key={paymentMethod}
                          className='flex items-center space-x-3 space-y-0'
                        >
                          <RadioGroupItem value={paymentMethod} />
                          <span className='font-normal'>{paymentMethod}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </FieldContent>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Button type='submit' disabled={isPending}>
            {isPending ? (
              <Loader className='animate-spin w-4 h-4' />
            ) : (
              <ArrowRight className='w-4 h-4' />
            )}
            Continue
          </Button>
        </form>
      </div>
    </>
  );
};

export default PaymentMethodForm;