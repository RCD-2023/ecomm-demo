'use client';

import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldContent,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { productDefaultValues } from '@/lib/constants';
import { insertProductSchema, updateProductSchema } from '@/lib/validator';
import { Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import slugify from 'slugify';
import { useRouter } from 'next/navigation';
import {
  useForm,
  Controller,
  SubmitHandler,
} from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UploadButton } from '@/lib/uploadthing';

type Props = {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
};


//
const ProductForm = ({ type, productId, product }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === 'Update'
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  });
//On submit 
  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
  values
  ) => {
    //when create a new item
    if (type === 'Create') {
      const res = await createProduct(values);

      if (!res.success) {
        toast.info(res.message);
      } else {
        toast.success(res.message);
        router.push(`/admin/products`);
      }
    }
    //On update when edit an existing item
    if (type === 'Update') {
      if (!productId) {
        router.push(`/admin/products`);
        return;
      }
      const res = await updateProduct({ ...values, id: productId });
      if (!res.success) {
        toast(res.message);
      } else {
        router.push(`/admin/products`);
      }
    }
  };
  //
  const images = form.watch('images');
 
  
  //
  return (
    <form
      method='POST'
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-8'
    >
      <FieldSet>
        <FieldGroup className='flex flex-col gap-5 md:flex-row'>
          {/* Name */}
          <Controller
            control={form.control}
            name='name'
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Name</FieldLabel>
                <FieldContent>
                  <Input {...field} placeholder='Enter product name' />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name='slug'
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Slug</FieldLabel>
                <FieldContent>
                  <div className='relative'>
                    <Input {...field} placeholder='Enter product slug' />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <button
                      type='button'
                      className='bg-gray-500 text-white px-4 py-1 mt-2 hover:bg-gray-600'
                      onClick={() => {
                        form.setValue(
                          'slug',
                          slugify(form.getValues('name'), { lower: true }),
                        );
                      }}
                    >
                      Generate Slug
                    </button>
                  </div>
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup className='flex flex-col gap-5 md:flex-row'>
          {/* Category */}
          <Controller
            control={form.control}
            name='category'
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Category</FieldLabel>
                <FieldContent>
                  <Input {...field} placeholder='Enter category name' />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
          {/* Brand */}
          <Controller
            control={form.control}
            name='brand'
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Brand</FieldLabel>
                <FieldContent>
                  <Input {...field} placeholder='Enter brand name' />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup className='flex flex-col gap-5 md:flex-row'>
          {/* Price */}
          <Controller
            control={form.control}
            name='price'
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Price</FieldLabel>
                <FieldContent>
                  <Input {...field} placeholder='Enter product price' />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
          {/* Stock */}
          <Controller
            control={form.control}
            name='stock'
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Stock</FieldLabel>
                <FieldContent>
                  <Input {...field} placeholder='Enter product stock' />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup className='upload-field flex flex-col gap-5 md:flex-row'>
          {/* Images */}
          <Controller
            control={form.control}
            name='images'
            render={({ fieldState }) => (
              <Field>
                <FieldLabel>Images</FieldLabel>
                <FieldContent>
                  <Card>
                    <CardContent className='space-y-2 mt-2 min-h-48'>
                      <div className='flex items-start space-x-2'>
                        {images.map((image: string) => (
                          <Image
                            key={image}
                            src={image}
                            alt='product image'
                            className='w-20 h-20 object-cover object-center rounded-sm'
                            width={100}
                            height={100}
                          />
                        ))}
                        <UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('images', [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(error.message);
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>

        <Field className='upload-field'>{/* Is Featured */}</Field>

        {/* Description */}
        <Controller
          control={form.control}
          name='description'
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Description</FieldLabel>
              <FieldContent>
                <Textarea
                  {...field}
                  className='resize-none'
                  placeholder='Enter product description'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
        <div>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
          </Button>
        </div>
      </FieldSet>
    </form>
  );
};

export default ProductForm;
