import { CardHeader, Divider, CardBody } from '@nextui-org/react'
import React from 'react'

export default function ChatPage() {
    return (
        <>
            <CardHeader className='text-2xl font-semibold text-secondary'>
                Chat
            </CardHeader>
            <Divider />
            <CardBody>
                Chat goes here
            </CardBody>
        </>
    )
}
