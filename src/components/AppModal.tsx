import { Modal, ModalCloseTrigger, useOverlayState } from "@heroui/react"
import { ReactNode } from "react";

type Props = {
    state: ReturnType<typeof useOverlayState>;
    title?: string;
    footer?: ReactNode;
    dialogClassName?: string;
    children: ReactNode
}

export default function AppModal({ state, title, footer, dialogClassName, children }: Props) {
    return (
        <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
            <Modal.Container>
                <Modal.Dialog className={dialogClassName}>
                    <Modal.Header>
                        {title && <Modal.Heading>{title}</Modal.Heading>}
                        <ModalCloseTrigger />
                    </Modal.Header>
                    <Modal.Body>{children}</Modal.Body>
                    {footer && <Modal.Footer>{footer}</Modal.Footer>}
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    )
}