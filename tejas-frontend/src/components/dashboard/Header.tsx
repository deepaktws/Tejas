import DatePicker from "../ui/DatePicker";

function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold text-brand-primary">Scrap Blending Model</h1>
            <DatePicker />
        </header>
    )
}
export default Header;