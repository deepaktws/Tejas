import { NavLink } from "react-router-dom";
import { Button } from "../ui/Button";

const adminTabs = [
    { label: 'User', path: '/admin/user' },
    { label: 'Areas', path: '/admin/area' },
    { label: 'Locations', path: '/admin/location' },
] as const

function Tabs() {
    return (
        <nav
                    className="flex gap-1 border-border-default bg-surface-card"
                    aria-label="Admin sections"
                >
                    {adminTabs.map((tab) => (
                        <NavLink
                            key={tab.path}
                            to={tab.path}
                            end
                            className={({ isActive }) =>
                                [
                                    ' text-sm font-semibold transition-colors py-3.5 px-6.5 rounded-t-lg',
                                    isActive
                                        ? 'border-brand-danger border-2 border-b-0 text-brand-danger'
                                        : 'border-border-default text-text-secondary bg-gray-100 hover:text-text-primary',
                                ].join(' ')
                            }
                        >
                            {tab.label}
                        </NavLink>
                    ))}
                </nav>
    )
}

function TabsWithButton({buttonText,onButtonClick}: {buttonText: string,onButtonClick: () => void}) {
  return (
    <div className="flex justify-between py-4 items-center px-6">
      <Tabs />
      <Button className="rounded-lg px-2 py-3.5 text-sm" variant="secondary" onClick={onButtonClick}>
        + {buttonText}
      </Button>
    </div>
  );
}
export default TabsWithButton;