type Location = {
    name: string
    businessUnit: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
}

type LocationEditFormProps = {
    location: Location
}

export default function LocationEditForm({
    location,
}: LocationEditFormProps) {
    return (
        <div className="space-y-6">
            <section>
                <h3 className="mb-4 text-xs font-bold uppercase">
                    Location Details
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm">
                            Location Name
                            <span className="text-red-500"> *</span>
                        </label>

                        <input
                            defaultValue={location.name}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Address
                        </label>

                        <input
                            defaultValue={location.address}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            City
                        </label>

                        <input
                            defaultValue={location.city}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            State
                        </label>

                        <input
                            defaultValue={location.state}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            ZIP Code
                        </label>

                        <input
                            defaultValue={location.zipCode}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Country
                        </label>

                        <input
                            defaultValue={location.country}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Business Unit
                            <span className="text-red-500"> *</span>
                        </label>

                        <input
                            defaultValue={location.businessUnit}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                </div>
            </section>

            <section>
                <h3 className="mb-4 text-xs font-bold uppercase">
                    Date Details
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