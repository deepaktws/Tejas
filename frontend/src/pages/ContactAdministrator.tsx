import { images } from "../utils/images";

function ContactAdministrator() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-surface-page">
            <div className="flex flex-col items-center justify-center md:px-32 md:py-8 px-16 py-4 bg-surface-card rounded-xl shadow-xl">
                <img src={images.jswSteelLogo} alt="success" className="w-28 h-28" />
                <h1 className="text-2xl font-bold">Your request has been sent</h1>
                <p className="text-sm text-gray-500">Please wait for the Admin’s response</p>
            </div>
        </div>
    )
}
export default ContactAdministrator;