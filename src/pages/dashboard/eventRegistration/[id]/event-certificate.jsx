// import React from "react";

// const EventCertificate = ({ userName, eventName, date, clubName, logo }) => {
//   return (
//     <div className="w-[900px] mx-auto bg-white shadow-2xl p-10 border-[12px]  certificate-bg">
//     <div className="border-blue-900">
//       {/* Logo */}
//       <div className="flex justify-center mb-6">
//         <img
//           src={logo}
//           alt="Club Logo"
//           className="w-24 h-24 object-contain"
//         />
//       </div>

//       {/* Title */}
//       <h1 className="text-4xl font-bold text-center text-gray-800 tracking-wide">
//         Certificate of Participation
//       </h1>

//       <p className="text-center text-gray-600 mt-3 text-lg">
//         This certificate is proudly presented to
//       </p>

//       {/* Name */}
//       <h2 className="text-center text-3xl font-semibold text-primary-700 mt-4">
//         {userName}
//       </h2>

//       {/* Statement */}
//       <p className="text-center text-gray-700 mt-6 text-xl leading-relaxed">
//         For actively participating in the event <br />
//         <span className="font-semibold text-gray-900 text-2xl">
//           "{eventName}"
//         </span>
//         <br />
//         organized by {clubName}.
//       </p>
      
//         {/* Top Left Geometric Shape */}
//         <div className="absolute top-0 left-0 w-64 h-64 overflow-hidden pointer-events-none">
//           <div className="absolute" style={{
//             width: "200px",
//             height: "200px",
//             background: "linear-gradient(135deg, #4F46E5 0%, #4F46E5 50%, transparent 50%)",
//             transform: "rotate(45deg)",
//             transformOrigin: "top left",
//             top: "-50px",
//             left: "-50px"
//           }}></div>
//           <div className="absolute" style={{
//             width: "150px",
//             height: "150px",
//             background: "linear-gradient(135deg, #818CF8 0%, #818CF8 50%, transparent 50%)",
//             transform: "rotate(45deg)",
//             transformOrigin: "top left",
//             top: "0px",
//             left: "0px"
//           }}></div>
//         </div>

//         {/* Bottom Right Geometric Shape */}
//         <div className="absolute bottom-0 right-0 w-80 h-80 overflow-hidden pointer-events-none">
//           <div className="absolute" style={{
//             width: "300px",
//             height: "300px",
//             background: "linear-gradient(135deg, transparent 50%, #4F46E5 50%)",
//             transform: "rotate(45deg)",
//             transformOrigin: "bottom right",
//             bottom: "-150px",
//             right: "-150px"
//           }}></div>
//           <div className="absolute" style={{
//             width: "200px",
//             height: "200px",
//             background: "linear-gradient(135deg, transparent 50%, #818CF8 50%)",
//             transform: "rotate(45deg)",
//             transformOrigin: "bottom right",
//             bottom: "-100px",
//             right: "-100px"
//           }}></div>
//         </div>

//       {/* Date + Signature */}
//       <div className="mt-12 flex justify-between px-12">
//         <div className="text-center">
//           <p className="text-gray-700 font-medium">Date Issued</p>
//           <p className="font-semibold text-lg">{date}</p>
//         </div>

//         <div className="text-center">
//           <div className="border-t-2 border-gray-700 w-40 mx-auto"></div>
//           <p className="mt-2 text-gray-700 font-medium">Authorized Signature</p>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default EventCertificate;
import React from "react";
import Signature from "@/assets/images/all-img/Signature.png"; // your signature image path

const EventCertificate = ({ userName, eventName, date, clubName, logo }) => {
  return (
    <div className="w-[900px] mx-auto bg-white shadow-2xl p-6 border-[4px] border-blue-600 m-4 ml-4 mr-4 relative certificate-bg">
      {/* Inner padding/margin inside border */}
      <div className="bg-white p-10 relative">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Club Logo"
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-blue-900 tracking-wide">
          CERTIFICATE OF ATTENDANCE
        </h1>

        <p className="text-center text-gray-600 mt-3 text-lg">
          This certificate is proudly presented to
        </p>

        {/* Name */}
        <h2 className="text-center text-3xl font-semibold text-blue-900 mt-4">
          {userName}
        </h2>

        {/* Statement */}
        <p className="text-center text-gray-700 mt-6 text-xl leading-relaxed">
          For actively participating in the event <br />
          <span className="font-semibold text-gray-900 text-2xl">
            "{eventName}"
          </span>
          <br />
          organized by {clubName}.
        </p>

        {/* Decorative Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 overflow-hidden pointer-events-none">
          <div
            className="absolute"
            style={{
              width: "200px",
              height: "200px",
              background: "linear-gradient(135deg, #4F46E5 0%, #4F46E5 50%, transparent 50%)",
              transform: "rotate(45deg)",
              transformOrigin: "top left",
              top: "-50px",
              left: "-50px",
            }}
          ></div>
        </div>
        <div className="absolute bottom-0 right-0 w-80 h-80 overflow-hidden pointer-events-none">
          <div
            className="absolute"
            style={{
              width: "300px",
              height: "300px",
              background: "linear-gradient(135deg, transparent 50%, #4F46E5 50%)",
              transform: "rotate(45deg)",
              transformOrigin: "bottom right",
              bottom: "-150px",
              right: "-150px",
            }}
          ></div>
        </div>

        {/* Date + Signature */}
        <div className="mt-8 flex justify-between items-center px-12">
          <div className="text-center mt-32 pt-6">
            <p className="text-gray-700 font-medium">Place</p>
            <p className="font-semibold text-lg">{date}</p>
          </div>

          <div className="text-center">
            {/* Signature Image */}
            <img
              src={Signature}
              alt="Signature"
              className="w-40 mx-auto"
            />
            <p className=" text-gray-700 font-medium">Team Leader</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCertificate;
