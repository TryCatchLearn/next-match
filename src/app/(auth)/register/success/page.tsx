'use client';

import CardWrapper from '@/components/CardWrapper';
import { useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

export default function RegisterSuccessPage() {
    const router = useRouter();

    return (
        <CardWrapper 
            headerText='You have successfully registered'
            subHeaderText='You can now login to the app'
            action={() => router.push('/login')}
            actionLabel='Go to login'
            headerIcon={FaCheckCircle}
        />
    )
}