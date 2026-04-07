'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldDescription,
  FieldContent,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateProfileSchema } from '@/lib/validator';
import { updateProfile } from '@/lib/actions/user.actions';

const ProfileForm = () => {
  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
    },
  });

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    const res = await updateProfile(values)
    if (!res.success) {
      return toast.error(`${res.message}`)
    }
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    };
    await update(newSession);
    toast(`${res.message}`);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col gap-5'
    >
      <div className='flex flex-col gap-5'>
        <Controller
          name='email'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className='w-full' data-invalid={fieldState.invalid}>
              <FieldLabel>Email</FieldLabel>
              <Input
                disabled
                placeholder='Email'
                {...field}
                className='input-field'
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name='name'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className='w-full' data-invalid={fieldState.invalid}>
              <FieldLabel>Name</FieldLabel>
              <Input
                placeholder='Name'
                {...field}
                className='input-field'
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>
      <Button
        type='submit'
        size='lg'
        disabled={form.formState.isSubmitting}
        className='button col-span-2 w-full'
      >
        {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
      </Button>
    </form>
  );
};
export default ProfileForm;