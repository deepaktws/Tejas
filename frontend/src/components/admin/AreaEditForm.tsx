type Area = {
    areaName: string
    locationName: string
    creationDateTime: string
    lastUpdate: string
}

type AreaEditFormProps = {
    area: Area
}

export default function AreaEditForm({
    area,
}: AreaEditFormProps) {
    return (
        <div className="space-y-6">
            <section>
                <h3 className="mb-4 text-xs font-bold uppercase">
                    Area Details
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm">
                            Area Name
                            <span className="text-red-500"> *</span>
                        </label>

                        <input
                            defaultValue={area.areaName}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Location
                            <span className="text-red-500"> *</span>
                        </label>

                        <input
                            defaultValue={area.locationName}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
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
                            defaultValue={area.creationDateTime}
                            disabled
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Updation Date & Time
                        </label>

                        <input
                            defaultValue={area.lastUpdate}
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