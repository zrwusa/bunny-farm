import { Product, Query } from '@/types/generated/graphql';
import { searchProducts } from '@/lib/api/actions';
import ProductsSsrInner from './products-ssr-inner';

export const ProductsSsr = async ({ searchParams = {} }: { searchParams?: { q?: string } }) => {
  const query = searchParams?.q;
  console.log('Search query:', query);

  let products: Query['products'] = [];

  if (query) {
    console.log('Searching for products with query:', query);
    products = await searchProducts(query);
    console.log('Search results:', products);
  } else {
    console.log('Fetching all products');
    products = await searchProducts('');
    console.log('All products:', products);
  }

  return <ProductsSsrInner title={query ? `Search results for "${query}"` : "All Products"} products={products} />;
};

export default ProductsSsr;