import ProductFormClient from '@/components/cms/product-form-client';
import ProductForm from '@/components/cms/product-form';


const Product = async ({params}: {
    params: Promise<{ id: string }>
}) => {
    const id = (await params).id

    return (
        <div>
            <ProductForm/>
            <ProductFormClient/>
            <h2>Id Param: {id}</h2>
        </div>
    );
}

export default Product;
