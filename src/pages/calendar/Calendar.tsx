// import dayjs from "dayjs";
// import { useState } from "react";
// import "./Calendar.css"; // Import CSS file

// function Calendar() {
//   const [currentDate, setCurrentDate] = useState(dayjs());
//   const startOfWeek = currentDate.startOf("week");

//   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//   const getDay = (dayOffset: number) => {
//     return startOfWeek.add(dayOffset, "day");
//   };

//   const nextWeek = () => {
//     setCurrentDate(currentDate.add(1, "week"));
//   };

//   const prevWeek = () => {
//     setCurrentDate(currentDate.subtract(1, "week"));
//   };

//   return (
//     <div className="calendar-container">
//       <div className="calendar-header">
//         <button onClick={prevWeek}>&lt;</button>
//         <span>{`${startOfWeek.format("MMM D")} - ${startOfWeek
//           .add(6, "day")
//           .format("MMM D, YYYY")}`}</span>
//         <button onClick={nextWeek}>&gt;</button>
//       </div>
//       <div className="calendar-body">
//         <div className="days-header">
//           {days.map((day) => (
//             <div key={day} className="day-header">
//               {day}
//             </div>
//           ))}
//         </div>
//         <div className="days-grid">
//           {Array.from({ length: 7 }).map((_, index) => {
//             const day = getDay(index);
//             const isCurrentDay = day.isSame(dayjs(), "day");

//             return (
//               <div
//                 key={index}
//                 className={`day-cell ${isCurrentDay ? "current-day" : ""}`}
//               >
//                 {day.format("D")}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Calendar;

// import dayjs from "dayjs";
// import { useState } from "react";
// import "./Calendar.css"; // Import CSS file

// function Calendar() {
//   const [currentDate, setCurrentDate] = useState(dayjs());
//   const startOfMonth = currentDate.startOf("month");
//   const endOfMonth = currentDate.endOf("month");
//   const startOfWeek = startOfMonth.startOf("week");
//   const endOfWeek = endOfMonth.endOf("week");

//   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//   const generateDays = () => {
//     const daysArray = [];
//     let currentDay = startOfWeek;

//     while (currentDay <= endOfWeek) {
//       daysArray.push(currentDay);
//       currentDay = currentDay.add(1, "day");
//     }

//     return daysArray;
//   };

//   const allDays = generateDays();

//   const nextMonth = () => {
//     setCurrentDate(currentDate.add(1, "month"));
//   };

//   const prevMonth = () => {
//     setCurrentDate(currentDate.subtract(1, "month"));
//   };

//   const isSameMonth = (day: dayjs.Dayjs) => {
//     return day.isSame(currentDate, "month");
//   };

//   return (
//     <div className="calendar-container">
//       <div className="calendar-header">
//         <button onClick={prevMonth}>&lt;</button>
//         <span>{currentDate.format("MMMM YYYY")}</span>
//         <button onClick={nextMonth}>&gt;</button>
//       </div>
//       <div className="calendar-body">
//         <div className="days-header">
//           {days.map((day) => (
//             <div key={day} className="day-header">
//               {day}
//             </div>
//           ))}
//         </div>
//         <div className="days-grid">
//           {allDays.map((day, index) => (
//             <div
//               key={index}
//               className={`day-cell ${isSameMonth(day) ? "" : "other-month"} ${
//                 day.isSame(dayjs(), "day") ? "current-day" : ""
//               }`}
//             >
//               {day.format("D")}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Calendar;

import React from "react";

function Calendar() {
  return <div>Calendar</div>;
}

export default Calendar;
