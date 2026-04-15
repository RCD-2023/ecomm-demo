'use client'
import { Button } from "@/components/ui/button"
import { updateUserSchema } from "@/lib/validator"
import { useRouter } from "next/navigation";
import {
    Field,
    FieldError,
    FieldLabel,
    FieldContent,
} from '@/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import { USER_ROLES } from "@/lib/constants";
import { toast } from "sonner";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUser } from "@/lib/actions/user.actions";


type UpdateUserFormProps = {
    user: z.infer<typeof updateUserSchema>;
};


const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });
  // Handle submit
  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
      const res = await updateUser({
        ...values,
        id: user.id,
      });

        if (!res.success) {
            toast.error(res.message);  
            return;
      }
      toast.success(res.message);

      form.reset();
      router.push(`/admin/users`);
    } catch (error) {
if (error instanceof Error) {
  toast.error(error.message);
} else {
  toast.error('Something went wrong');
}    
    }
  };

  //
  return (
    <form
      method='POST'
      className='space-y-4'
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {/* Email field */}
      <Controller
        control={form.control}
        name='email'
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Email</FieldLabel>
            <FieldContent>
              <Input {...field} disabled={true} placeholder='Enter email' />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
          </Field>
        )}
      />
      {/* Name field */}
      <Controller
        control={form.control}
        name='name'
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Name</FieldLabel>
            <FieldContent>
              <Input {...field} placeholder='Enter user name' />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
          </Field>
        )}
      />
      {/* Role */}
      <div>
        <Controller
          control={form.control}
          name='role'
          render={({ field, fieldState }) => (
            <Field className='items-center'>
              <FieldLabel>Role</FieldLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? ''}
              >
                <FieldContent>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      </div>
      <div className='flex-between mt-6'>
        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Submitting...' : `Update User `}
        </Button>
      </div>
    </form>
  );
};;

export default UpdateUserForm;