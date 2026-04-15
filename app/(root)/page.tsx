// import sampleData from "@/db/sample-data"; // a fost folosita initial pe local
import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts, getFeaturedProducts } from "@/lib/actions/product.actions";
import { ProductCarousel } from '@/components/shared/product/product-carousel';
import ViewAllProductsButton from "@/components/view-all-products-button";


const Homepage = async () => {
  const latestProducts = await getLatestProducts()
  const featuredProducts = await getFeaturedProducts();
  return (
    <div>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title='Newest Arrivals' />
      <ViewAllProductsButton />
    </div>
  );
}
 
export default Homepage;

// Function to delay rendering page so that you see loader
// const delay = (ms) => new Promise((res) => setTimeout(res,ms) )
//await delay(2000);