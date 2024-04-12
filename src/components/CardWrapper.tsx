import { Card, CardHeader, CardBody, CardFooter, Button } from '@nextui-org/react';
import { ReactNode } from 'react';
import { GiPadlock } from 'react-icons/gi';
import { IconType } from 'react-icons/lib';

type Props = {
    body?: ReactNode;
    headerIcon: IconType;
    headerText: string;
    subHeaderText?: string;
    action?: () => void;
    actionLabel?: string;
    footer?: ReactNode;
}

export default function CardWrapper({ body, footer, headerIcon: Icon, headerText, subHeaderText, action, actionLabel }: Props) {
    return (
        <div className='flex items-center justify-center vertical-center'>
            <Card className='w-2/5 mx-auto p-5'>
                <CardHeader className='flex flex-col items-center justify-center'>
                    <div className='flex flex-col gap-2 items-center text-secondary'>
                        <div className='flex flex-row items-center gap-3'>
                            <Icon size={30} />
                            <h1 className='text-3xl font-semibold'>{headerText}</h1>
                        </div>
                        {subHeaderText &&
                            <p className='text-neutral-500'>{subHeaderText}</p>}
                    </div>
                </CardHeader>
                {body &&
                <CardBody>
                    {body}
                </CardBody>}
                <CardFooter className='flex flex-col justify-center'>
                    {action && (
                        <Button onClick={action} fullWidth color='secondary' variant='bordered'>
                            {actionLabel}
                        </Button>
                    )}
                    {footer && (
                        <>{footer}</>
                    )}
                </CardFooter>
            </Card>

        </div>

    )
}