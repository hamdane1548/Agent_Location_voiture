
const Header = () =>{
        return (
         <>
            <div className="w-full h-10 border-b-[1px] center border-gray-400/40">
               <p className="text-sm text-[#0B1215] primary">
This is the beta version (v1.0) of the project, developed specifically for a specifi test case.                  </p>
            </div>
            <div className="w-full h-12 p-2 justify-between  flex items-center border-b-[1px] border-gray-400/40">
                <div className="w-auto h-full flex space-x-1 items-center">
                   <h1 className="primary text-[15px] tracking-tight  font-bold">Vox-Plot</h1>
                </div>
                <div className="w-auto h-full flex space-x-2 items-center">
                     <a className="border-[1px]  border-gray-400  px-4 py-[5px] primary text-[13px] text-[#0B1215] rounded-[15px]">Contact Support</a>

                      <a className="bg-[#0B1215] px-4 py-[5px] primary text-[13px] text-[#F2F6FC] rounded-[15px]">Log in</a>
                </div>
           </div>
           </>
        )
}
export default Header