'use client' // Error boundaries must be Client Components

import { Button, Card } from '@heroui/react'
import { useEffect } from 'react'
import { FaBug } from 'react-icons/fa'

export default function ErrorPage({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string }
    unstable_retry: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className='flex flex-col items-center justify-center gap-2 h-[calc(100vh-6rem)]'>
            <Card className='w-2/5 mx-auto shadow-xl py-10'>
                <Card.Header className='flex flex-col items-center justify-center'>
                    <div className='flex flex-col gap-2 items-center'>
                        <FaBug size={60} />
                        <h1 className='text-3xl font-semibold'>Server error!</h1>
                    </div>
                </Card.Header>
                <Card.Content>
                    <div className='flex justify-center text-danger'>{error.message}</div>
                </Card.Content>
                <Card.Footer className='flex justify-center'>
                    <Button
                        onClick={
                            // Attempt to recover by re-fetching and re-rendering the segment
                            () => unstable_retry()
                        }
                    >
                        Try again
                    </Button>
                </Card.Footer>
            </Card>

        </div>
    )
}