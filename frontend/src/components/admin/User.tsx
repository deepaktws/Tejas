import { toast } from 'react-toastify'
import { usersData } from '../../staticData'
import TabsWithButton from './Tabs'
import { images } from '../../utils/images'
import { useEffect, useState } from 'react'
import { getUsers } from '../../service/user.service'

const tableColumns = [
    'User Name',
    'Email',
    'Designation',
    'Contact',
    'Role',
    'Action Items',
] as const

function copyToClipboard(value: string) {
    void navigator.clipboard.writeText(value).then(() => {
        toast.success('Copied to clipboard')
    })
}

function CopyableCell({ value }: { value: string }) {
    return (
        <div className="flex items-center gap-2 justify-center">
            <span>{value}</span>
            <button
                type="button"
                onClick={() => copyToClipboard(value)}
                aria-label={`Copy ${value}`}
                className="text-brand-accent hover:opacity-80"
            >
                <img src={images.copyIcon} alt="Copy" className="w-4 h-4" />
            </button>
        </div>
    )
}


function handleAddUser() {
    console.log('Add User')
}


export default function User() {
    const [users, setUsers] = useState<any[]>([])
    useEffect(() => {
        getUsers().then((data) => {
            setUsers(data.body.data)
        })
    }, [])
    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
            <TabsWithButton buttonText="Add User" onButtonClick={handleAddUser} />
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
                        {users.map((user: any, index: number) => (
                            <tr
                                key={user.id}
                                className={
                                    index % 2 === 0
                                        ? 'bg-[#eef4fc]'
                                        : 'bg-surface-card'
                                }
                            >
                                <td className="px-4 py-3 text-center text-sm text-text-primary">
                                    {user.name}
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-text-primary">
                                    {/* <CopyableCell value={user.email} /> */}
                                    <CopyableCell value={user.userName} />
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-text-primary">
                                    {user.designation}
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-text-primary">
                                    <CopyableCell value={user.contact} />
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-text-primary">
                                    {user.userRoles.join(', ')}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-3">
                                        {/* <button
                                            type="button"
                                            aria-label={`View ${user.userName}`}
                                            className="text-brand-accent hover:opacity-80"
                                        >
                                            <img src={images.eyeIcon} alt="Eye" className="w-4 h-4" />
                                        </button> */}
                                        <button
                                            type="button"
                                            aria-label={`Edit ${user.userName}`}
                                            className="text-brand-accent hover:opacity-80"
                                        >
                                            <img src={images.editIcon} alt="Edit" className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label={`Delete ${user.userName}`}
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
