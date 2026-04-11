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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UploadButton } from '@/lib/uploadthing';
import { Checkbox } from '@/components/ui/checkbox';

type Props = {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
};



const ProductForm = ({ type, productId, product }: Props) => {
  const router = useRouter();

  //Varianta Chat-GPT
  const form = useForm<
    z.input<typeof insertProductSchema>,
    unknown,
    z.output<typeof insertProductSchema>
  >({
    resolver: zodResolver(insertProductSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  });


  //Varianta altternativa Will Adams(tot cu eroare)
  // let schemaToUse;
  // if (type === 'Update') {
  //   schemaToUse = updateProductSchema;
  // } else {
  //   schemaToUse = insertProductSchema;
  // }
  // const resolver =zodResolver(schemaToUse)
  // const form = useForm<z.infer<typeof insertProductSchema>>({
  //   resolver,
  //   defaultValues:
  //   product && type === 'Update' ? product : productDefaultValues,
  // });

  //Varianta originala Brad
  // const form = useForm<z.infer<typeof insertProductSchema>>({
  //   resolver:
  //     type === 'Update'
  //       ? zodResolver(updateProductSchema)
  //       : zodResolver(insertProductSchema),
  //   defaultValues: product && type === 'Update' ? product : productDefaultValues
  // });
  //varianta alternativa Claude
  //   const form = useForm<z.infer<typeof insertProductSchema>>({
  //     resolver: zodResolver(insertProductSchema) as Resolver<z.infer<typeof insertProductSchema>>,
  //     defaultValues:
  //       product && type === 'Update' ? product : productDefaultValues,
  //   });

  //varianta alternativa
  // const form = useForm<z.infer<typeof insertProductSchema>>({
  //   resolver: zodResolver(insertProductSchema),
  //   defaultValues: product && type === 'Update' ? product : productDefaultValues,
  // });

  //On submit
  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values,
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
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

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
                  <Input
                    type='number'
                    value={
                      typeof field.value === 'string' ||
                      typeof field.value === 'number'
                        ? field.value
                        : ''
                    }
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    placeholder='Enter product stock'
                  />
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

        <FieldGroup className='upload-field'>
          <Field>
            <FieldLabel>Featured Product</FieldLabel>
            <FieldContent>
              <Card>
                <CardContent className='mt-2 space-y-2'>
                  <Controller
                    control={form.control}
                    name='isFeatured'
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldContent className='flex flex-row w-full  justify-start gap-2'>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className=''
                          />
                          <FieldLabel>Is Featured?</FieldLabel>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </FieldContent>
                      </Field>
                    )}
                  />

                  {isFeatured && banner && (
                    <Image
                      src={banner}
                      alt='banner image'
                      className='w-full rounded-sm object-cover object-center'
                      width={1920}
                      height={680}
                    />
                  )}

                  {isFeatured && !banner && (
                    <Controller
                      control={form.control}
                      name='banner'
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Banner</FieldLabel>
                          <FieldContent>
                            <UploadButton
                              endpoint='imageUploader'
                              onClientUploadComplete={(
                                res: { ufsUrl: string }[],
                              ) => {
                                if (res?.[0]?.ufsUrl) {
                                  field.onChange(res[0].ufsUrl);
                                }
                              }}
                              onUploadError={(error: Error) => {
                                toast.error(error.message);
                              }}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </FieldContent>
          </Field>
        </FieldGroup>

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
};;

export default ProductForm;
