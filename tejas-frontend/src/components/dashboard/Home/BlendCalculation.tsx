import { useState } from "react";
import { ClearableInput } from "../../ui/ClearableInput";
import { Button } from "../../ui";

function BlendCalculation() {
    const [heatId, setHeatId] = useState('')
    const rowH = 'h-[40px]'
    const textBtn = `${rowH} px-3 flex items-center text-sm font-medium`

    return (
        <div className="flex flex-col gap-5 bg-surface-card mb-7">
            <h1 className="text-lg font-bold text-[#083D1C]">Blend Calculation</h1>
            <div className={`flex items-center gap-3 ${rowH}`}>

                <span className={`w-28 text-sm font-medium flex items-center ${rowH}`}>
                    Heat ID
                </span>

                <ClearableInput
                    value={heatId}
                    onChange={setHeatId}
                    className={rowH}
                />

                <button className={`${textBtn} underline cursor-pointer`}>
                    Fetch Data
                </button>

                <button className={`${textBtn} underline cursor-pointer`}>
                    Go to Next Heat ID
                </button>

            </div>
            <Button
              className="
              w-[160px]
                h-[40px]
                px-12
                text-xs uppercase tracking-widest
                text-white
                bg-[linear-gradient(174.84deg,#16A34A_29.64%,#083D1C_231.54%)]
                shadow-[3px_3px_11.3px_0px_#00000040]
              "
              disabled={!heatId.trim()}
            >
              Optimize
            </Button>
        </div>
    )
}
export default BlendCalculation;