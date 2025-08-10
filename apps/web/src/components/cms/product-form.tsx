import {createProduct} from '@/lib/api/server-actions';
import SubmitButton from '@/components/cms/submit-button';
import {Input} from '@/components/ui/input';
import {Card} from '@/components/ui/card';

export const ProductForm = () => {
    return (
        <Card className="p-4">
            <form action={async (formData: FormData) => {
                'use server'
                await createProduct(formData);
            }}>
                <Input type="text" name="name" id="name" placeholder="name"/>
                <Input type="text" name="brand" id="brand" placeholder="brand"/>
                <Input type="number" name="price" id="price" placeholder="price"/>
                <Input type="text" name="description" id="description"
                       placeholder="description"/>
                <SubmitButton type="submit">Submit</SubmitButton>
            </form>
        </Card>
    );
}

export default ProductForm;
