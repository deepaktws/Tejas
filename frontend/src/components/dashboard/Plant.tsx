import { Navbar } from "./Navbar";

function Plant() {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex-1">
                <div className="flex flex-col h-full">
                    <div className="flex-1 p-4">
                        Plant
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Plant;