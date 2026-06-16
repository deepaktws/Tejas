type User = {
    userName: string
    email: string
    designation: string
    contact: string
    role: string
}

type UserEditFormProps = {
    user: User
}

export default function UserEditForm({
    user,
}: UserEditFormProps) {
    return (
        <div className="space-y-6">
            <section>
                <h3 className="mb-4 text-xs font-bold uppercase">
                    User Details
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm">
                            Username
                            <span className="text-red-500"> *</span>
                        </label>

                        <input
                            defaultValue={user.userName}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Email ID
                            <span className="text-red-500"> *</span>
                        </label>

                        <input
                            defaultValue={user.email}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Phone Number
                            <span className="text-red-500"> *</span>
                        </label>

                        <input
                            defaultValue={user.contact}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Designation
                            <span className="text-red-500"> *</span>
                        </label>

                        <input
                            defaultValue={user.designation}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                </div>
            </section>

            <section>
                <h3 className="mb-4 text-xs font-bold uppercase">
                    Access Scope
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm">
                            Business Unit
                        </label>

                        <select className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
                            <option>JSW Steel</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Location
                        </label>

                        <select className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
                            <option>Vijayanagar, Salem, +2</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Area
                        </label>

                        <select className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
                            <option>Coke Oven Monitoring, +11</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Camera
                        </label>

                        <select className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
                            <option>PC6 Sway, PC6 FOD, +26</option>
                        </select>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="mb-4 text-xs font-bold uppercase">
                    Date & Time
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-sm">
                            Creation Date & Time
                        </label>

                        <input
                            defaultValue="24/10/25 12:08:14 PM"
                            disabled
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Updation Date & Time
                        </label>

                        <input
                            defaultValue="14/05/26 06:08:53 PM"
                            disabled
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                </div>
            </section>

            <div className="flex justify-end">
                <button
                    type="button"
                    className="rounded bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                >
                    Save Changes
                </button>
            </div>
        </div>
    )
}