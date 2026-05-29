import { Modal } from "@mui/material";
import type { TableRow } from './InputTable';
import { InputTable } from "./InputTable";

type SendDataModalProps = {
    open: boolean
    onClose: () => void
    data: TableRow[]
}

function SendDataModal({ open, onClose,data }: SendDataModalProps) {
    const onSend = () => {
        console.log('Send Data', data)
        onClose()
    }
    return (
        <Modal open={open} onClose={onClose} className="w-full h-full flex items-center justify-center" >
            <div className="w-fit h-fit flex flex-col items-center justify-center gap-4 bg-white rounded-md px-16 py-8 outline-none">
                <h1 className="text-2xl font-bold text-[#303030]">ACKNOWLEDGEMENT REQUIRED</h1>
                <p className="text-sm text-[#717182]">Please confirm the operator additions</p>
                <InputTable data={data} sendButton={false} />
                <div className="flex items-center justify-center gap-2 w-full">
                    <button className="w-1/3 bg-transparent text-black border border-black px-8 py-1 rounded-md" onClick={onClose}>Cancel</button>
                    <button className="w-1/3 bg-brand-primary text-white px-8 py-1 rounded-md" onClick={onSend}>Send</button>
                </div>
            </div>
        </Modal>
    )
}

export default SendDataModal;