'use client'


import {Button, ButtonProps} from '@/components/ui/button';
import {useFormStatus} from 'react-dom';

export type SubmitButtonProps = ButtonProps
const SubmitButton = ({children, ...props}: SubmitButtonProps) => {
    const {pending} = useFormStatus();
    return (
        <Button {...props} disabled={pending}>{children}</Button>
    );
};

export default SubmitButton;
