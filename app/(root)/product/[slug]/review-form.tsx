'use client';

import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldLabel,
  FieldContent,
} from '@/components/ui/field'; 
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { reviewFormDefaultValues } from '@/lib/constants';
import { insertReviewSchema } from '@/lib/validator';
import { z } from 'zod';
import { StarIcon } from 'lucide-react';
import { createUpdateReview, getReviewByProductId } from '@/lib/actions/review.action';


//
const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
}) => {
  const [open, setOpen] = useState(false);

  //am folosit z.input pt ca z.infer genereaza eroare
 const form = useForm<
   z.input<typeof insertReviewSchema>,
   unknown,
   z.output<typeof insertReviewSchema>
 >({
   resolver: zodResolver(insertReviewSchema),
   defaultValues: reviewFormDefaultValues,
 });

  // Form submit handler
  const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (values) => {
    const res = await createUpdateReview({ ...values, productId });

    if (!res.success)
      return toast.error('Review has not been created');

    setOpen(false);

    onReviewSubmitted();

    toast.success(res.message);
  };

  //Open form handler
  const handleOpenForm = async () => {
    form.setValue('productId',productId)
    form.setValue('userId', userId)
    
    const review = await getReviewByProductId({ productId });

    if (review) {
      form.setValue('title', review.title);
      form.setValue('description', review.description);
      form.setValue('rating', review.rating);
    }
    setOpen(true);
  };

  //
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant='default'>
        Write a review
      </Button>
      <DialogContent className='sm:max-w-[425px]'>
        <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Write a review</DialogTitle>
            <DialogDescription>
              Share your thoughts with other customers
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <Controller
              control={form.control}
              name='title'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <FieldContent>
                    <Input placeholder='Enter title' {...field} />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='description'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <FieldContent>
                    <Textarea placeholder='Enter description' {...field} />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='rating'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Rating</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field?.value?.toString()}
                  >
                    <FieldContent>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a rating' />
                      </SelectTrigger>
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                    <SelectContent>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <SelectItem key={index} value={(index + 1).toString()}>
                          {index + 1} <StarIcon className='inline h-4 w-4' />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </div>
          <DialogFooter>
            <Button
              type='submit'
              size='lg'
              className='w-full'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};;

export default ReviewForm;
