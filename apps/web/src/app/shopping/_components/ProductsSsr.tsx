import { Product, Query } from '@/types/generated/graphql';
import { searchProducts } from '@/lib/api/actions';
import ProductsSsrInner from './ProductsSsrInner';

export const ProductsSsr = async ({ searchParams = {} }: { searchParams?: { q?: string } }) => {
  const query = searchParams?.q;
  console.log('Search query:', query);

  let products: Query['products'] = [];

  if (query) {
    console.log('Searching for products with query:', query);
    products = await searchProducts(query);
    console.log('Search results:', products);
  }

  return <ProductsSsrInner title={query ? `Search results for "${query}"` : "Products"} products={products} />;
};

export default ProductsSsr;