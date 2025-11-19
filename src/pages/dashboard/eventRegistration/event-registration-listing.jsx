
// import React, { useState, useMemo, useEffect } from "react";
// import axios from "axios";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { toast } from "react-toastify";
// import { motion } from "framer-motion";
// import Select from "@/components/ui/Select";
// import fallbackLogo from "@/assets/images/all-img/widget-bg-5.png";
// import EventRegistrationModal from "../eventRegistration/[id]/event-registration-form";
// import EventSurveyForm from "../eventRegistration/[id]/event-survey-form";
// import EventDetailModal from "../eventRegistration/[id]/event-detail";
// import { useNavigate } from "react-router-dom";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import Certificate from "../eventRegistration/[id]/event-certificate";

// const EventRegistrationListing = () => {
//   const [events, setEvents] = useState([]);
//   const [filters, setFilters] = useState({
//     category: "",
//     targetAudience: "",
//     targetGender: "",
//   });
//   const [loading, setLoading] = useState(true);


//   const [registerEvent, setRegisterEvent] = useState(null);
//   const [openSurvey, setOpenSurvey] = useState(null);
//   const [viewDetails, setViewDetails] = useState(null);
//   const navigate = useNavigate();

//   console.log("Stored user:", JSON.parse(localStorage.getItem("user")));
//   console.log("Stored userId:", localStorage.getItem("userId"));

//   // ⬇️ Logged-in User ID (important)
//   const userId = localStorage.getItem("userId");

//   const canDownloadCertificate = (event) => {
//     const eventDate = new Date(event.dateTime);
//     const now = new Date();

//     return userAlreadyJoined(event) && now >= eventDate;
//   };

//   const downloadCertificatePDF = async () => {
//   const certificate = document.getElementById("certificate-preview");
//   const canvas = await html2canvas(certificate, { scale: 2 });
//   const imgData = canvas.toDataURL("image/png");

//   const pdf = new jsPDF("landscape", "mm", "a4");
//   const width = pdf.internal.pageSize.getWidth();
//   const height = pdf.internal.pageSize.getHeight();

//   pdf.addImage(imgData, "PNG", 0, 0, width, height);
//   pdf.save(`${certEvent.eventTitle}-certificate.pdf`);
// };
//   // -------------------------------
//   // Fetch events
//   // -------------------------------
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${process.env.REACT_APP_BASE_URL}/event/get-all-event`,
//           { headers: { Authorization: `${token}` } }
//         );
//         setEvents(res.data?.data || []);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//         toast.error("Failed to fetch events");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   // -------------------------------
//   // Filters
//   // -------------------------------
//   const categories = [...new Set(events.map((e) => e.eventCategory))];
//   const genders = [...new Set(events.map((e) => e.targetGender))];
//   const audiences = [...new Set(events.map((e) => e.targetAudience))];

//   const filteredEvents = useMemo(() => {
//     return events.filter((e) => {
//       return (
//         (!filters.category || e.eventCategory === filters.category) &&
//         (!filters.targetGender || e.targetGender === filters.targetGender) &&
//         (!filters.targetAudience || e.targetAudience === filters.targetAudience)
//       );
//     });
//   }, [events, filters]);

//   const handleFilterChange = (selectedOption, name) => {
//     setFilters({ ...filters, [name]: selectedOption ? selectedOption.value : "" });
//   };

//   const handleReset = () => {
//     setFilters({ category: "", targetAudience: "", targetGender: "" });
//   };

//   // -------------------------------
//   // Helper to check if user joined
//   // -------------------------------
//   const userAlreadyJoined = (event) => {
//     if (!event?.members) return false;
//     return event.members.some((m) => m._id === userId);
//   };

//   // -------------------------------
//   // Handle Button clicks
//   // -------------------------------
//   const handleRegisterClick = (event) => {
//     setRegisterEvent(event);
//   };

//   const handleSurveyClick = (event) => {
//     setOpenSurvey(event);
//   };
//   const handleViewDetailsClick = (event) => {
//     if (!event || !event._id) {
//       console.error("Invalid event object:", event);
//       return;
//     }
//     setViewDetails(event);
//   };
//   // Loading UI
//   if (loading) {
//     return <p className="text-center text-gray-500">Loading events...</p>;
//   }

//   return (
//     <>
//       <Card className="p-6">
//         <div className="flex justify-between mb-3">
//           <h2 className="text-2xl font-bold mb-6 text-center">Event Directory</h2>

//           {/* Filters */}
//           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
//             <Select
//               options={[
//                 { value: "", label: "All Categories" },
//                 ...categories.map((c) => ({ value: c, label: c })),
//               ]}
//               value={
//                 filters.category
//                   ? { value: filters.category, label: filters.category }
//                   : null
//               }
//               onChange={(selected) => handleFilterChange(selected, "category")}
//               placeholder="Select Category"
//             />

//             <Select
//               options={[
//                 { value: "", label: "All Genders" },
//                 ...genders.map((g) => ({ value: g, label: g })),
//               ]}
//               value={
//                 filters.targetGender
//                   ? { value: filters.targetGender, label: filters.targetGender }
//                   : null
//               }
//               onChange={(selected) => handleFilterChange(selected, "targetGender")}
//               placeholder="Select Gender"
//             />

//             <Select
//               options={[
//                 { value: "", label: "All Audiences" },
//                 ...audiences.map((a) => ({ value: a, label: a })),
//               ]}
//               value={
//                 filters.targetAudience
//                   ? { value: filters.targetAudience, label: filters.targetAudience }
//                   : null
//               }
//               onChange={(selected) => handleFilterChange(selected, "targetAudience")}
//               placeholder="Select Audience"
//             />

//             <Button
//               text="Reset Filters"
//               className="bg-primary-600 h-10 hover:bg-primary-900 text-white"
//               onClick={handleReset}
//             />
//           </div>
//         </div>

//         {/* Event Cards */}
//         {filteredEvents.length === 0 ? (
//           <p className="text-center text-gray-500">No events match your filters.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredEvents.map((event, index) => {
//               const joined = userAlreadyJoined(event); // Check here

//               return (
//                 <motion.section
//                   key={event._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   whileHover={{
//                     scale: 1.03,
//                     boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
//                   }}
//                   className="overflow-hidden shadow-md rounded-2xl border border-gray-200 bg-white dark:bg-slate-800 hover:shadow-lg transition flex flex-col"
//                 >
//                   {/* <motion.img
//                     src={event.eventImage || fallbackLogo}
//                     alt={event.eventTitle}
//                     className="w-full h-48 object-cover"
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ duration: 0.3 }}
//                     onError={(e) => (e.target.src = fallbackLogo)}
//                   /> */}
//                   <div className="relative w-full h-48">
//                     <motion.img
//                       src={event.eventImage || fallbackLogo}
//                       alt={event.eventTitle}
//                       className="w-full h-full object-cover"
//                       whileHover={{ scale: 1.05 }}
//                       transition={{ duration: 0.3 }}
//                       onError={(e) => (e.target.src = fallbackLogo)}
//                     />

//                     {/* Download Certificate Button — only when event completed */}
//                     {canDownloadCertificate(event) && (
//                       <button
//                         onClick={() => console.log("Download certificate")}
//                         className="absolute top-3 right-3 bg-white/90 hover:bg-white text-primary-600 shadow-md p-2 rounded-full transition"
//                         title="Download Certificate"
//                       >
//                         <i className="fa-solid fa-download text-lg"></i>
//                       </button>
//                     )}
//                   </div>


//                   <div className="p-5 flex flex-col flex-grow">
//                     <h3 className="text-lg font-semibold mb-1">
//                       {event.eventTitle}
//                     </h3>

//                     <p className="text-sm text-gray-600 mb-1">
//                       <strong>Category:</strong> {event.eventCategory}
//                     </p>
//                     <p className="text-sm text-gray-600 mb-1">
//                       <strong>Date & Time:</strong>{" "}
//                       {new Date(event.dateTime).toLocaleString()}
//                     </p>
//                     <p className="text-sm text-gray-600 mb-1">
//                       <strong>Location:</strong> {event.location}
//                     </p>
//                     <p className="text-sm text-gray-600 mb-1">
//                       <strong>Audience:</strong> {event.targetAudience}
//                     </p>
//                     <p className="text-sm text-gray-600 mb-2">
//                       <strong>Deadline:</strong>{" "}
//                       {new Date(event.registrationDeadline).toLocaleDateString()}
//                     </p>

//                     {/* Conditional Buttons */}
//                     <div className="mt-auto pt-2 flex justify-between gap-2">
//                       <Button
//                         text="View Details"
//                         className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
//                         onClick={() => navigate(`/event-details/${event._id}`)}
//                       />
//                       {/* If user already joined → show Survey */}
//                       {joined ? (
//                         <Button
//                           text="Survey"
//                           className="flex-1 btn font-normal btn-sm bg-gradient-to-r from-[#18BB90] to-[#0C6B47] text-white border-0 hover:opacity-90"
//                           onClick={() => handleSurveyClick(event)}
//                         />
//                       ) : (
//                         <Button
//                           text="Join Event"
//                           className="flex-1 btn font-normal btn-sm bg-gradient-to-r from-[#18BB90] to-[#0C6B47] text-white border-0 hover:opacity-90"
//                           onClick={() => handleRegisterClick(event)}
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </motion.section>
//               );
//             })}
//           </div>
//         )}
//       </Card>

//       {/* Join Event Modal */}
//       {registerEvent && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="relative rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
//             <button
//               onClick={() => setRegisterEvent(null)}
//               className="absolute top-6 right-7 text-white hover:text-gray-700 text-xl"
//             >
//               ✕
//             </button>

//             <EventRegistrationModal
//               event={registerEvent}
//               mode="add"
//               onClose={() => setRegisterEvent(null)}
//             />
//           </div>
//         </div>
//       )}

//       {/* Survey Modal */}
//       {openSurvey && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="relative bg-white rounded-xl shadow-lg p-4 max-h-[90vh] overflow-y-auto">
//             <button
//               onClick={() => setOpenSurvey(null)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
//             >
//               ✕
//             </button>

//             <EventSurveyForm
//               surveyRequest={openSurvey}
//               onClose={() => setOpenSurvey(null)}
//             />
//           </div>
//         </div>
//       )}
//       {viewDetails && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="relative bg-white rounded-xl shadow-lg p-4 max-h-[70vh] overflow-y-auto">
//             <button
//               onClick={() => setViewDetails(null)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
//             >
//               ✕
//             </button>
//             <EventDetailModal
//               eventId={viewDetails._id}
//               onClose={() => setViewDetails(null)}
//             />
//           </div>
//         </div>
//       )}

//     </>
//   );
// };

// export default EventRegistrationListing;
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Select from "@/components/ui/Select";
import fallbackLogo from "@/assets/images/all-img/widget-bg-5.png";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Certificate from "../eventRegistration/[id]/event-certificate";

const EventRegistrationListing = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    targetAudience: "",
    targetGender: "",
  });
  const [loading, setLoading] = useState(true);
  const [certEvent, setCertEvent] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "Guest User";

  // -------------------------------
  // Fetch events
  // -------------------------------
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/event/get-all-event`,
          { headers: { Authorization: `${token}` } }
        );
        setEvents(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // -------------------------------
  // Filters
  // -------------------------------
  const categories = [...new Set(events.map((e) => e.eventCategory))];
  const genders = [...new Set(events.map((e) => e.targetGender))];
  const audiences = [...new Set(events.map((e) => e.targetAudience))];

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      return (
        (!filters.category || e.eventCategory === filters.category) &&
        (!filters.targetGender || e.targetGender === filters.targetGender) &&
        (!filters.targetAudience || e.targetAudience === filters.targetAudience)
      );
    });
  }, [events, filters]);

  const handleFilterChange = (selectedOption, name) => {
    setFilters({ ...filters, [name]: selectedOption ? selectedOption.value : "" });
  };

  const handleReset = () => {
    setFilters({ category: "", targetAudience: "", targetGender: "" });
  };

  // -------------------------------
  // Helper to check if user joined
  // -------------------------------
  const userAlreadyJoined = (event) => {
    if (!event?.members) return false;
    return event.members.some((m) => m._id === userId);
  };

  // -------------------------------
  // Check if certificate is available
  // -------------------------------
  const canDownloadCertificate = (event) => {
    const eventDate = new Date(event.dateTime);
    const now = new Date();
    return userAlreadyJoined(event) && now >= eventDate;
  };

  // -------------------------------
  // Download Certificate
  // -------------------------------
  const handleDownloadCertificate = async (event) => {
    setCertEvent(event);

    setTimeout(async () => {
      const certificate = document.getElementById("certificate-preview");
      if (!certificate) return;

      const canvas = await html2canvas(certificate, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`${event.eventTitle}-certificate.pdf`);
    }, 300);
  };

  // -------------------------------
  // Loading UI
  // -------------------------------
  if (loading) {
    return <p className="text-center text-gray-500">Loading events...</p>;
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between mb-3">
          <h2 className="text-2xl font-bold mb-6 text-center">Event Directory</h2>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Select
              options={[
                { value: "", label: "All Categories" },
                ...categories.map((c) => ({ value: c, label: c })),
              ]}
              value={
                filters.category ? { value: filters.category, label: filters.category } : null
              }
              onChange={(selected) => handleFilterChange(selected, "category")}
              placeholder="Select Category"
            />
            <Select
              options={[
                { value: "", label: "All Genders" },
                ...genders.map((g) => ({ value: g, label: g })),
              ]}
              value={
                filters.targetGender
                  ? { value: filters.targetGender, label: filters.targetGender }
                  : null
              }
              onChange={(selected) => handleFilterChange(selected, "targetGender")}
              placeholder="Select Gender"
            />
            <Select
              options={[
                { value: "", label: "All Audiences" },
                ...audiences.map((a) => ({ value: a, label: a })),
              ]}
              value={
                filters.targetAudience
                  ? { value: filters.targetAudience, label: filters.targetAudience }
                  : null
              }
              onChange={(selected) => handleFilterChange(selected, "targetAudience")}
              placeholder="Select Audience"
            />
            <Button
              text="Reset Filters"
              className="bg-primary-600 h-10 hover:bg-primary-900 text-white"
              onClick={handleReset}
            />
          </div>
        </div>

        {/* Event Cards */}
        {filteredEvents.length === 0 ? (
          <p className="text-center text-gray-500">No events match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => {
              const joined = userAlreadyJoined(event);
              return (
                <motion.section
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
                  }}
                  className="overflow-hidden shadow-md rounded-2xl border border-gray-200 bg-white dark:bg-slate-800 hover:shadow-lg transition flex flex-col"
                >
                  <div className="relative w-full h-48">
                    <motion.img
                      src={event.eventImage || fallbackLogo}
                      alt={event.eventTitle}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => (e.target.src = fallbackLogo)}
                    />

                    {/* Download Certificate Button */}
                    {canDownloadCertificate(event) && (
                      <button
                        onClick={() => handleDownloadCertificate(event)}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white/95 text-primary-600 font-semibold px-3 py-1 rounded shadow-md transition"
                        title="Download Certificate"
                      >
                        Download Certificate
                      </button>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold mb-1">{event.eventTitle}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Category:</strong> {event.eventCategory}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Date & Time:</strong> {new Date(event.dateTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Location:</strong> {event.location}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Audience:</strong> {event.targetAudience}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Deadline:</strong>{" "}
                      {new Date(event.registrationDeadline).toLocaleDateString()}
                    </p>

                    <div className="mt-auto pt-2 flex justify-between gap-2">
                      <Button
                        text="View Details"
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
                        onClick={() => navigate(`/event-details/${event._id}`)}
                      />
                      {joined ? (
                        <Button
                          text="Joined"
                          className="flex-1 btn font-normal btn-sm bg-gradient-to-r from-[#18BB90] to-[#0C6B47] text-white border-0 cursor-default"
                        />
                      ) : (
                        <Button
                          text="Join Event"
                          className="flex-1 btn font-normal btn-sm bg-gradient-to-r from-[#18BB90] to-[#0C6B47] text-white border-0 hover:opacity-90"
                          onClick={() => toast.info("Register functionality not included")}
                        />
                      )}
                    </div>
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}
      </Card>

      {/* Hidden Certificate Renderer */}
      <div
        id="certificate-preview"
        style={{ position: "absolute", left: "-9999px", top: 0 }}
      >
        {certEvent && (
          <Certificate
            userName={userName}
            eventName={certEvent.eventTitle}
            clubName={certEvent.clubName || certEvent.createdBy?.name} // fallback if clubName not present
            date={new Date(certEvent.dateTime).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            logo={certEvent.eventImage}
          />

        )}
      </div>
    </>
  );
};

export default EventRegistrationListing;
