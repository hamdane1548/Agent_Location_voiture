import { ArrowBigUpDash, Brain, Send } from 'lucide-react';
import { Shdr01 } from "../Components/ui/shdr-01";
import { Shdr14 } from "../Components/ui/shdr-14";
import { useEffect, useState } from 'react';
import { Shdr19 } from '../Components/ui/shdr-19';
import { ArrowBigUp } from 'lucide';

const Agent = () => {
   const [input, setInput] = useState("");

const avatarstate = input.trim() ? "thinking" : "idle";
   return (
    
    <div className="w-full h-auto px-15">
         <div className="w-full p-4 h-full border-l-[1px]  flex flex-col items-center border-r-[1px] border-b-[1px] border-gray-300">
           <div
  className="transition-all center duration-500 ease-in-out"
  style={{
    width: input.trim() ? "110px" : "100px",
    height: input.trim() ? "110px" : "100px",
  }}
>
      <Shdr19
    size={input.trim() ? 120 : 100}
  state={avatarstate}
  params={{ speed: 0.7 }}
  colors={{ ink: "#101426" }}
  stateColors={{
    idle: { ink: "#101426" },
    thinking: { ink: "#101426" },
    speaking: { ink: "#101429" },
  }}
  statePresets={{
    idle: { speed: 0.5 },
    thinking: { speed: 0.7 },
    speaking: { speed: 0.9 },
  }}
  stateVolumes={{
    idle: { input: 0, output: 0.2 },
    thinking: { input: 0.1, output: 0.45 },
    speaking: { input: 0.2, output: 0.8 },
  }}
  volumes={{ input: 0, output: 0.6 }}
  wrapperColor="currentColor"
  paused={false}
  pauseOffscreen
  maxDpr={1.5}
  ariaLabel="Assistant status"
/>
</div>
          <h1 className="text-2xl mt-5 text-center primary">Hello , How are You Doing <br />
             how can i <span className="text-[#FFD9A4]">help you </span> ?</h1>
             <div className="w-200 h-50 overflow-hidden flex flex-col mt-4 border shadow-lg p-2 border-gray-400/50 rounded-xl">
             <div className="w-full h-full items-center   space-x-2 p-1 flex ">
               <div className="w-auto flex  justify-center p-[3px]  h-full ">
                  <Brain strokeWidth={1.6} size={20} className="text-gray-400" ></Brain>
               </div>
               <div className="w-full h-full">
  <textarea    onChange={(e) => setInput(e.target.value)}
    placeholder="Ask AI a question or make your first request"
    className="w-full primary h-full resize-none  outline-none align-top"
  />
</div>
             </div>
             <div className="w-full flex items-center h-13 ">
                  <div className="w-1/2 h-full">

                  </div>
                   <div className="w-1/2  flex items-center space-x-2 justify-end h-full">
                    <div className="w-40 center space-x-1 h-8 border-gray-300/50 border rounded-sm">
                       <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                       <h1 className="text-[12px] text-gray-400 primary">openai/gpt-3.5-turbo</h1>
                    </div>
                      <div className="w-8 h-8 flex items-center justify-center bg-black rounded-sm">
                        <ArrowBigUpDash color="white"  size={19} strokeWidth={1.5}> </ArrowBigUpDash>
                      </div>
                  </div>
             </div>

             </div>
         </div>
    </div>
   )
}
export default Agent