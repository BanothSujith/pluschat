import React from 'react'

function DefaultuserProfile({data}) {
  return (
    <div className={` ${data} bg-gray-700 overflow-hidden`}>
      <div className="w-full h-full flex flex-col overflow-hidden items-center justify-between gap-0.5 pt-[10%]">
        <div className=" bg-[#c4c3c3] w-[40%] aspect-square rounded-full flex justify-center"></div>
        <div className="bg-[#c4c3c3] w-[100%] aspect-square flex rounded-full justify-center"></div>
      </div>
    </div>
  );
}

export default DefaultuserProfile
