// import sampleData from "@/db/sample-data"; // a fost folosita initial pe local
import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";

const Homepage = async () => {

  const latestProducts = await getLatestProducts()
  return (
      <ProductList data={latestProducts} title="Newest Arrivals" />
  );
}
 
export default Homepage;

// Function to delay rendering page so that you see loader
// const delay = (ms) => new Promise((res) => setTimeout(res,ms) )
//await delay(2000);