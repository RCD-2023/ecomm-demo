import { getAllCategories } from '@/lib/actions/product.actions';
import CategoriesDrawerClient from './categories-drawer-client';

const CategoriesDrawer = async () => {
  const categories = await getAllCategories();
  return <CategoriesDrawerClient categories={categories} />;
};

export default CategoriesDrawer;