import { verifyEmail } from '@/app/actions/authActions'
import CardWrapper from '@/components/CardWrapper';
import ResultMessage from '@/components/ResultMessage';
import { Spinner } from '@nextui-org/react';
import { MdOutlineMailOutline } from 'react-icons/md';

export default async function VerifyEmailPage({ searchParams }: { searchParams: { token: string } }) {
    const result = await verifyEmail(searchParams.token);

    return (
        <CardWrapper
            headerText='Verifying your email address'
            headerIcon={MdOutlineMailOutline}
            body={
                <div className='flex flex-col space-y-4 items-center'>
                    <div className='flex flex-row items-center'>
                        <p>Verifying your email address.  Please wait...</p>
                        {!result && <Spinner color='secondary' />}
                    </div>
                </div>
            }
            footer={
                <ResultMessage result={result} />
            }
            
        />
    )
}