'use server';

import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';
import { ShippingAddress } from '@/types';
// import { getMyCart } from './cart.actions';
import {
  signInFormSchema,
  signUpFormSchema,
  shippingAddressSchema,
  paymentMethodSchema,
  updateUserSchema
} from '../validator';
import z from 'zod';
import { PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// Sign in the user with credentials
//helper function
function isNextRedirectError(error: unknown): error is { digest: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  );
}
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    await signIn('credentials', user);
    //This line is never reached on success
    return { success: true, message: 'Signed in successfully' };
  } catch (error: unknown) {
    if (isNextRedirectError(error)) {
      throw error;
    }
    return { success: false, message: 'Invalid email or password' };
  }
}

// Sign the user out (functie helper si cu varianta de golire cart  )
export async function signOutUser() {
  // get current users cart and delete it so it does not persist to next user
  // const currentCart = await getMyCart();
  // if (currentCart?.id) {
  //   await prisma.cart.delete({ where: { id: currentCart.id } });
  // } else {
  //   console.warn('No cart found for deletion.');
  // }
  await signOut();
}

//Sign up user (zod)
/**
 * The logic
 * receive form data, validate form data, save plain password temporarily
*hash password, create user in database, sign user in automatically, return *success
* if error happens:
  if it is redirect-related:rethrow it else: return failure
 * 
 */
export async function signUp(prevState: unknown, formData: FormData) {
  try {
    //Reads form data using zod validation
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      confirmPassword: formData.get('confirmPassword'),
      password: formData.get('password'),
    });
    //Hashes the password into the db
    const plainPassword = user.password; // this is temporarly saved not in the db because should use later on autocomplete
    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
    //Sign in the user automatically after creation
    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });
    return { success: true, message: 'User created successfully' };
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get the user by ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error('User not found');
  return user;
}

// Update user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error('User not found');
    const address = shippingAddressSchema.parse(data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address: address },
    });
    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//Update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error('User not found');
    const paymentMethod = paymentMethodSchema.parse(data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });
    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update User Profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();
    //check for user
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });
    if (!currentUser) throw new Error('User not found');
    //update
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });
    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all users (admin area)
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query:string
  }) {
  
  const queryFilter: Prisma.UserWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};
  
  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });
  
  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete user by ID (admin area)
export async function deleteUser(id: string) {
  try {
    // 1. Ia userul din DB
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    // 2. Verifica existenta user
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    // 3. Blocheaza adminii sa nu fie stersi
    if (user.role === 'admin') {
      return {
        success: false,
        message: 'Cannot delete admin users',
      };
    }
    // 4. Stergere
    await prisma.user.delete({
      where: { id },
    });
    // 5. Revalidare cache
    revalidatePath('/admin/users');
    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a user (admin area)
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}