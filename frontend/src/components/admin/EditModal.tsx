type EditModalProps = {
    isOpen: boolean
    title: string
    onClose: () => void
    children: React.ReactNode
}

export default function EditModal({
    isOpen,
    title,
    onClose,
    children,
}: EditModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50">
            {/* Dark overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="absolute top-4 right-0 max-h-[calc(100vh-2rem)] w-[420px] box-border overflow-hidden rounded-l-2xl border-8 border-white bg-white shadow-2xl">
                <div className="flex items-center justify-between bg-linear-to-b from-brand-primary to-brand-primary-dark px-4 py-3 text-white">
                    <h2 className="text-lg font-semibold">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="max-h-[calc(100vh-120px)] overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}