import ProductionStats from "./Home/ProductionStats";
import BlendCalculation from "./Home/BlendCalculation";
import { InputTable, type TableRow } from "./Home/InputTable";
import { chemistryData, scrapTableData } from '../../staticData'
import SendDataModal from "./Home/SendDataModal";
import { useState } from "react";



function Home() {
    const [openSendDataModal, setOpenSendDataModal] = useState(false)
    const handleSend = (data: TableRow[]) => {
        console.log('Send Scrap Actuals', data)
        setOpenSendDataModal(true)
    }
    const handleCloseSendDataModal = () => {
        setOpenSendDataModal(false)
    }
    return (
        <div className="px-6 py-4">
            <ProductionStats />
            <BlendCalculation />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <InputTable title="Chemistry" data={chemistryData} />
            <InputTable title="Scrap Table" data={scrapTableData} sendButton={true} onSend={handleSend} />
            </div>
            <SendDataModal open={openSendDataModal} onClose={handleCloseSendDataModal} data={scrapTableData} />
        </div>

    )

}

export default Home;

