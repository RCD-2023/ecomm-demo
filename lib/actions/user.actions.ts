'use server';

import { shippingAddressSchema, signInFormSchema, signUpFormSchema } from '../validator';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';
import { ShippingAddress } from '@/types';

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

// Sign the user out
export async function signOutUser() {
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

//// Update user's address
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
      data: { address:address },
    });
    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}