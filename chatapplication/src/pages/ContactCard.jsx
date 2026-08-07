import ReactTimeAgo from 'react-time-ago';
import DefaultuserProfile from './DefaultuserProfile';

function ContactCard({data}) {
  // console.log("data",data);
  return (
    <div className=" w-full h-fit text-[var(--text)] bg-[var(--card)] flex items-center ">
      <div className=" ">
        {data?.profile && data?.profile !== "data:image/webp;base64," ? (
          <img
            src={data?.profile}
            alt="profile"
            className="w-12 aspect-square rounded-full m-2 border"
          />
        ) : (
          <DefaultuserProfile
            data={"w-12 aspect-square rounded-full m-2 border"}
          />
        )}
      </div>
      <div className=" pb-2 pt-1 w-full ">
        <div className=" flex justify-between items-center px-4 pr-8 w-full">
          <h1 className="  w-[17ch] md:w-[30ch] lg:w-[50ch] max-w-[80%]  line-clamp-1 text-start  text-[var(--text-h)] text-lg ">
            {data?.user?.name?.trim() || data?.name?.trim()}
          </h1>
          {!isNaN(data?.timeStamps) && (
            <ReactTimeAgo
              className="ml-2 text-xs"
              date={data?.timeStamps}
              locale="en-US"
              timeStyle="twitter"
            />
          )}
        </div>
        <div className=" flex justify-between pr-8 ">
          <p className="line-clamp-1 max-w-[90%] px-4 text-sm mt-1">
            {data?.lastMessage}
          </p>
          {data?.unreadMessages > 0 && (
            <p className="font-sans font-medium bg-[#09ff00] text-[#0c2b0e] rounded-full w-6 h-6 aspect-square text-center flex items-center justify-center ">
              {data?.unreadMessages || 0}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactCard