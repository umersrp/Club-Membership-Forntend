// import React, { useState, useMemo, useEffect } from "react";
// import axios from "axios";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { toast } from "react-toastify";
// import { motion } from "framer-motion";
// import Select from "@/components/ui/Select";
// import fallbackLogo from "@/assets/images/all-img/widget-bg-5.png";
// import EventRegistrationModal from "../eventRegistration/[id]/event-registration-form";

// const EventRegistrationListing = () => {
//   const [events, setEvents] = useState([]);
//   const [registeredEvents, setRegisteredEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [registerEvent, setRegisterEvent] = useState(null); // 👈 for opening modal
//   const [filters, setFilters] = useState({
//     category: "",
//     targetAudience: "",
//     targetGender: "",
//   });
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch events from backend
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${process.env.REACT_APP_BASE_URL}/event/get-all-event`,
//           { headers: { Authorization: `${token}` } }
//         );

//         const fetchedEvents = res.data?.data || [];
//         setEvents(fetchedEvents);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//         toast.error("Failed to fetch events");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   // Extract filter options
//   const categories = [...new Set(events.map((e) => e.eventCategory))];
//   const genders = [...new Set(events.map((e) => e.targetGender))];
//   const audiences = [...new Set(events.map((e) => e.targetAudience))];

//   // Filtering logic
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

//   const handleRegisterClick = (event) => {
//     setRegisterEvent(event); // 👈 open modal for this event
//   };

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
//             {filteredEvents.map((event, index) => (
//               <motion.section
//                 key={event._id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 whileHover={{
//                   scale: 1.03,
//                   boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
//                 }}
//                 className="overflow-hidden shadow-md rounded-2xl border border-gray-200 bg-white dark:bg-slate-800 hover:shadow-lg transition flex flex-col"
//               >
//                 <motion.img
//                   src={event.eventImage || fallbackLogo}
//                   alt={event.eventTitle}
//                   className="w-full h-48 object-cover"
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ duration: 0.3 }}
//                   onError={(e) => (e.target.src = fallbackLogo)}
//                 />

//                 <div className="p-5 flex flex-col flex-grow">
//                   <h3 className="text-lg font-semibold mb-1">{event.eventTitle}</h3>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <strong>Category:</strong> {event.eventCategory}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <strong>Date & Time:</strong>{" "}
//                     {new Date(event.dateTime).toLocaleString()}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <strong>Location:</strong> {event.location}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <strong>Audience:</strong> {event.targetAudience}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-2">
//                     <strong>Deadline:</strong>{" "}
//                     {new Date(event.registrationDeadline).toLocaleDateString()}
//                   </p>

//                   <div className="mt-auto pt-2 flex justify-between gap-2">
//                     <Button
//                       text="View Details"
//                       className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
//                       onClick={() => setSelectedEvent(event)}
//                     />

//                     {/* ✅ Open Modal instead of navigate */}
//                     <Button
//                       icon="heroicons-outline:plus-sm"
//                       text="Join Event"
//                       className="flex-1 btn font-normal btn-sm bg-gradient-to-r from-[#3AB89D] to-[#3A90B8] text-white border-0 hover:opacity-90"
//                       iconClass="text-lg"
//                       onClick={() => handleRegisterClick(event)} // open modal
//                     />
//                   </div>
//                 </div>
//               </motion.section>
//             ))}
//           </div>
//         )}
//       </Card>

//       {/* ✅ Modal to show registration form */}
//       {registerEvent && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
//           <div className="relative">
//             <button
//               onClick={() => setRegisterEvent(null)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
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
import EventRegistrationModal from "../eventRegistration/[id]/event-registration-form";

const EventRegistrationListing = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    targetAudience: "",
    targetGender: "",
  });
  const [loading, setLoading] = useState(true);
  const [registerEvent, setRegisterEvent] = useState(null);

  // ✅ Fetch events
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

  // Extract unique filter options
  const categories = [...new Set(events.map((e) => e.eventCategory))];
  const genders = [...new Set(events.map((e) => e.targetGender))];
  const audiences = [...new Set(events.map((e) => e.targetAudience))];

  // Apply filters
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

  const handleRegisterClick = (event) => {
    setRegisterEvent(event); // 👈 Open modal for specific event
  };

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
                filters.category
                  ? { value: filters.category, label: filters.category }
                  : null
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
            {filteredEvents.map((event, index) => (
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
                <motion.img
                  src={event.eventImage || fallbackLogo}
                  alt={event.eventTitle}
                  className="w-full h-48 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => (e.target.src = fallbackLogo)}
                />

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-1">{event.eventTitle}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Category:</strong> {event.eventCategory}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Date & Time:</strong>{" "}
                    {new Date(event.dateTime).toLocaleString()}
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
                      onClick={() => console.log("Details:", event)}
                    />

                    <Button
                      icon="heroicons-outline:plus-sm"
                      text="Join Event"
                      className="flex-1 btn font-normal btn-sm bg-gradient-to-r from-[#3AB89D] to-[#3A90B8] text-white border-0 hover:opacity-90"
                      iconClass="text-lg"
                      onClick={() => handleRegisterClick(event)} // 👈 open modal
                    />
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </Card>

      {/* ✅ Centered Modal */}
      {registerEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white rounded-xl shadow-lg p-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setRegisterEvent(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
            {/* ✅ Pass selected event to modal */}
            <EventRegistrationModal
              event={registerEvent}
              mode="add"
              onClose={() => setRegisterEvent(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EventRegistrationListing;
