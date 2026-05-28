import { AdminLocationsData } from "../../staticData"
import TabsWithButton from "./Tabs"
import { images } from "../../utils/images"
const tableColumns = [
    'Name',
    'Business Unit',
    'Address',
    'City',
    'State',
    'Zip Code',
    'Country',
    'Action Items',
] as const


export default function AdminLocation() {

    function handleAddLocation() {
        console.log('Add Location')
    }

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
            <TabsWithButton buttonText="Add Location" onButtonClick={handleAddLocation} />
            <div className="flex-1 overflow-x-auto px-6 pb-6">
                <table className="w-full min-w-[900px] border-collapse overflow-hidde">
                    <thead>
                        <tr className="bg-linear-to-b from-brand-primary to-brand-primary-dark text-text-inverse">
                            {tableColumns.map((column) => (
                                <th
                                    key={column}
                                    scope="col"
                                    className="px-4 py-3 text-center text-sm font-bold"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {AdminLocationsData.map((location, index) => (
                            <tr
                                key={location.id}
                                className={
                                    index % 2 === 0
                                        ? 'bg-[#eef4fc]'
                                        : 'bg-surface-card'
                                }
                            >
                                <td className="px-4 py-3 text-center text-sm text-text-primary">
                                    {location.name}
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-text-primary">
                                    {location.businessUnit}
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-text-primary">
                                    {location.address}
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-text-primary">
                                    {location.city}
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-text-primary">
                                    {location.state}
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-text-primary">
                                    {location.zipCode}
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-text-primary">
                                    {location.country}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            aria-label={`View ${location.name}`}
                                            className="text-brand-accent hover:opacity-80"
                                        >
                                            <img src={images.eyeIcon} alt="Eye" className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label={`Edit ${location.name}`}
                                            className="text-brand-accent hover:opacity-80"
                                        >
                                            <img src={images.editIcon} alt="Edit" className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label={`Delete ${location.name}`}
                                            className="text-brand-danger hover:opacity-80"
                                        >
                                            <img src={images.deleteIcon} alt="Delete" className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}