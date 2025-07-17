import React from "react";
import DoctorProfileHeader from "../DoctorProfileHeader";
import ProfileInfoNavigation from "../ProfileInfoNavigation";
import DoctorCalendar from "./DoctorCalendar"
import useMediaQuery from "../../hooks/useMediaQuery";

function Calendar() {
  const isAboveSmallScreens = useMediaQuery('(min-width: 769px)');
  return (
    <div className="lg:flex ">
      {/* Right Sidebar (Header) */}
      <div className=" bg-gray-100 lg:fixed left-0 h-full w-full md:flex">
        <DoctorProfileHeader />
        {isAboveSmallScreens && (
          <ProfileInfoNavigation className="lg:ml-[4.6rem] "/>
        )}
      </div>

      {/* Main Calendar Section*/}
      <div className="  lg:ml-[25.5rem] z-10 bg-white lg:w-[70%] px-4 mt-10">
       
        <DoctorCalendar className="lg:flex-1 w-full"/>
      </div>
    </div>
  );
}

export default Calendar;
