import { Shdr01 } from "../Components/ui/shdr-01";
import { Shdr14 } from "../Components/ui/shdr-14";

const Agent = () => {
   return (
    <div className="w-full h-auto px-15">
         <div className="w-full p-4 h-full border-l-[1px]  flex flex-col items-center border-r-[1px] border-b-[1px] border-gray-300">
              <Shdr14
      size={100}
      state="speaking"
      params={{ speed: 0.7 }}
      colors={{ ink: "#101426" }}
      stateColors={{
        idle: { ink: "#101426" },
        thinking: { ink: "#101426" },
        speaking: { ink: "#101426" }
      }}
      statePresets={{
        idle: { speed: 0.5 },
        thinking: { speed: 0.7 },
        speaking: { speed: 0.9 }
      }}
      stateVolumes={{
        idle: { input: 0, output: 0.2 },
        thinking: { input: 0.1, output: 0.45 },
        speaking: { input: 0.2, output: 0.8 }
      }}
      volumes={{ input: 0, output: 0.6 }}
      wrapperColor="currentColor"
      paused={false}
      pauseOffscreen
      maxDpr={1.5}
      ariaLabel="Assistant status"
    />    
          <h1 className="text-2xl mt-5 text-center primary">Hello , How are You Doing <br />
             how can i <span className="text-[#FFD9A4]">help you </span> ?</h1>
             <div className="w-200 h-50 mt-4 border border-gray-400/50 rounded-sm">

             </div>
         </div>
    </div>
   )
}
export default Agent