import { Button, ButtonProps, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { ReactNode } from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    header?: string;
    body: ReactNode;
    footerButtons?: ButtonProps[];
    imageModal?: boolean;
}

export default function AppModal({ isOpen, onClose, header, body, footerButtons, imageModal }: Props) {
    
    const handleClose = () => {
        setTimeout(() => onClose(), 10);
    }
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            placement='top-center'
            classNames={{
                base: `${imageModal ? 'border-2 border-white' : ''}`,
                body: `${imageModal ? 'p-0': ''}`
            }}
            motionProps={{
                variants: {
                    enter: { y: 0, opacity: 100, transition: { duration: 0.3 } },
                    exit: { y: 100, opacity: 0, transition: { duration: 0.3 } }
                }
            }}
        >
            <ModalContent>
                {!imageModal &&
                <ModalHeader className='flex flex-col gap-1'>{header}</ModalHeader>}
                <ModalBody>{body}</ModalBody>
                {!imageModal &&
                <ModalFooter>
                    {footerButtons && footerButtons.map((props: ButtonProps, index) => (
                        <Button {...props} key={index}>
                            {props.children}
                        </Button>
                    ))}
                </ModalFooter>}
            </ModalContent>
        </Modal>
    )
}