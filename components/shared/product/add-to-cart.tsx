'use client'
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Cart, CartItem } from '@/types';
import { Plus, Minus, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useTransition } from 'react';


const AddToCart = ({ item, cart }: { cart?: Cart, item: Omit<CartItem, 'cartId'> }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      // Execute the addItemToCart action
      const res = await addItemToCart(item);
      // Display appropriate toast message based on the result
      if (!res.success) {
        toast.error(res.message);
        return;
      }
       toast.success(`${res.message}`, {
         action: {
           label: 'Go to cart',
           onClick: () => router.push('/cart'),
         },
       });
    })
  }

  //Check if item is in cart
  const existItem = cart && cart.items.find((x) => {
    return x.productId === item.productId
  })


  // Handler remove from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      return;
    })
    
  }
  return existItem ? (
    <div>
      <Button
        type='button'
        variant='outline'
        disabled={isPending}
        onClick={handleRemoveFromCart}
      >
        {isPending ? (
          <Loader className='w-4 h-4  animate-spin' />
        ) : (
          <Minus className='h-4 w-4' />
        )}
      </Button>
      <span className='px-2'>{existItem.qty}</span>
      <Button
        type='button'
        variant='outline'
        disabled={isPending}
        onClick={handleAddToCart}
      >
        {isPending ? (
          <Loader className='w-4 h-4  animate-spin' />
        ) : (
          <Plus className='h-4 w-4' />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className='w-full'
      type='button'
      disabled={isPending}
      onClick={handleAddToCart}
    >
      {isPending ? (
        <Loader className='w-4 h-4 animate-spin' />
      ) : (
        <Plus className='w-4 h-4' />
      )}
      Add to cart 
    </Button>
  );
    
}

export default AddToCart;