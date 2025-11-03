// // import React, { useState, useMemo, useEffect } from "react";
// // import Card from "@/components/ui/Card";
// // import Button from "@/components/ui/Button";
// // import { toast } from "react-toastify";
// // import { motion } from "framer-motion";
// // import Select from "@/components/ui/Select";
// // import ClubDetailModal from "./club-detail-modal";
// // import axios from "axios";
// // import fallbackLogo from "@/assets/images/all-img/widget-bg-5.png";
// // import ClubApplicationForm from "../clubApplication/[id]/club-application-form";

// // const ClubListing = () => {
// //   const [clubs, setClubs] = useState([]);
// //   const [pendingRequests, setPendingRequests] = useState([]); //  New state
// //   const [joinClub, setJoinClub] = useState(null);

// //   const [filters, setFilters] = useState({
// //     interest: "",
// //     major: "",
// //     category: "",
// //   });
// //   const [selectedClub, setSelectedClub] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   //  Fetch Clubs
// //   useEffect(() => {
// //     const fetchClubs = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         if (!token) {
// //           toast.error("Please log in to view clubs");
// //           return;
// //         }

// //         const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/club/get-all-club`, {
// //           headers: {
// //             Authorization: `${token}`,
// //           },
// //         });

// //         setClubs(res.data?.data || []);
// //       } catch (error) {
// //         console.error("Error fetching clubs:", error);
// //         toast.error(error.response?.data?.message || "Failed to load clubs");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchClubs();
// //   }, []);

// //   //  Extract unique filter options
// //   const categories = [...new Set(clubs.map((club) => club.clubCategory).filter(Boolean))];
// //   const majors = [
// //     ...new Set(
// //       clubs
// //         .flatMap((club) => club.targetMajor || [])
// //         .filter((m) => m && m.trim() !== "")
// //     ),
// //   ];
// //   const interests = [...new Set(clubs.map((club) => club.interest).filter(Boolean))];

// //   //  Filtering logic
// //   const filteredClubs = useMemo(() => {
// //     return clubs.filter((club) => {
// //       return (
// //         (!filters.interest || club.interest === filters.interest) &&
// //         (!filters.major ||
// //           (club.targetMajor && club.targetMajor.includes(filters.major))) &&
// //         (!filters.category || club.clubCategory === filters.category)
// //       );
// //     });
// //   }, [clubs, filters]);

// //   const handleFilterChange = (selectedOption, name) => {
// //     setFilters({ ...filters, [name]: selectedOption ? selectedOption.value : "" });
// //   };

// //   const handleReset = () => {
// //     setFilters({ interest: "", major: "", category: "" });
// //   };

// //   if (loading) {
// //     return <p className="text-center text-gray-500">Loading clubs...</p>;
// //   }

// //   return (
// //     <>
// //       <Card className="p-6">
// //         <div className="flex justify-between mb-3">
// //           <h2 className="text-2xl font-bold mb-6 text-center">Club Directory</h2>

// //           {/*  Filter Section */}
// //           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
// //             <Select
// //               options={[
// //                 { value: "", label: "All Interests" },
// //                 ...interests.map((i) => ({ value: i, label: i })),
// //               ]}
// //               value={
// //                 filters.interest
// //                   ? { value: filters.interest, label: filters.interest }
// //                   : null
// //               }
// //               onChange={(selected) => handleFilterChange(selected, "interest")}
// //               placeholder="Select Interest"
// //             />

// //             <Select
// //               options={[
// //                 { value: "", label: "All Majors" },
// //                 ...majors.map((m) => ({ value: m, label: m })),
// //               ]}
// //               value={
// //                 filters.major
// //                   ? { value: filters.major, label: filters.major }
// //                   : null
// //               }
// //               onChange={(selected) => handleFilterChange(selected, "major")}
// //               placeholder="Select Major"
// //             />

// //             <Select
// //               options={[
// //                 { value: "", label: "All Categories" },
// //                 ...categories.map((c) => ({ value: c, label: c })),
// //               ]}
// //               value={
// //                 filters.category
// //                   ? { value: filters.category, label: filters.category }
// //                   : null
// //               }
// //               onChange={(selected) => handleFilterChange(selected, "category")}
// //               placeholder="Select Category"
// //             />

// //             <Button
// //               text="Reset Filters"
// //               className="bg-primary-600 h-10 hover:bg-primary-900 text-white"
// //               onClick={handleReset}
// //             />
// //           </div>
// //         </div>

// //         {/*  Club Cards */}
// //         {filteredClubs.length === 0 ? (
// //           <p className="text-center text-gray-500">No clubs match your filters.</p>
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// //             {filteredClubs.map((club, index) => (
// //               <motion.section
// //                 key={club._id}
// //                 initial={{ opacity: 0, y: 20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 transition={{ delay: index * 0.05 }}
// //                 whileHover={{
// //                   scale: 1.03,
// //                   boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
// //                 }}
// //                 className="overflow-hidden shadow-md rounded-2xl border border-gray-200 bg-white dark:bg-slate-800 hover:shadow-lg transition flex flex-col"
// //               >
// //                 {/* Club Image */}
// //                 <motion.img
// //                   src={club.clubLogo || fallbackLogo}
// //                   alt={club.clubName}
// //                   className="w-full h-48 object-cover"
// //                   whileHover={{ scale: 1.05 }}
// //                   transition={{ duration: 0.3 }}
// //                   onError={(e) => (e.target.src = fallbackLogo)}
// //                 />

// //                 {/* Club Details */}
// //                 <div className="p-5 flex flex-col flex-grow">
// //                   <h3 className="text-lg font-semibold mb-1">{club.clubName}</h3>
// //                   <p className="text-sm text-gray-600 mb-1">
// //                     <strong>Category:</strong> {club.clubCategory || "N/A"}
// //                   </p>
// //                   <p className="text-sm text-gray-600 mb-1">
// //                     <strong>President:</strong> {club.presidentName || "N/A"}
// //                   </p>
// //                   <p className="text-sm text-gray-600 mb-2">
// //                     <strong>Vice President:</strong> {club.vicePresidentName || "N/A"}
// //                   </p>

// //                   <div className="mt-auto pt-2 flex justify-between gap-2">
// //                     <Button
// //                       text="View Details"
// //                       className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
// //                       onClick={() => setSelectedClub(club)}
// //                     />

// //                     {/*  Join Button or Request Pending */}
// //                     {pendingRequests.includes(club._id) ? (
// //                       <Button
// //                         text="Request Pending"
// //                         disabled
// //                         className="flex-1 bg-gray-400 text-white cursor-not-allowed"
// //                       />
// //                     ) : (
// //                       <Button
// //                         icon="heroicons-outline:plus-sm"
// //                         text="Join Club"
// //                         className="flex-1 btn font-normal btn-sm bg-gradient-to-r from-[#3AB89D] to-[#3A90B8] text-white border-0 hover:opacity-90"
// //                         iconClass="text-lg"
// //                         onClick={() => setJoinClub(club)}
// //                       />
// //                     )}
// //                   </div>
// //                 </div>
// //               </motion.section>
// //             ))}
// //           </div>
// //         )}

// //         {/* Club Details Modal */}
// //         {selectedClub && (
// //           <ClubDetailModal
// //             club={selectedClub}
// //             onClose={() => setSelectedClub(null)}
// //           />
// //         )}
// //       </Card>

// //       {/*  Join Club Modal */}
// //       {joinClub && (
// //         <ClubApplicationForm
// //           club={joinClub}
// //           mode="add"
// //           onClose={() => setJoinClub(null)}
// //           onRequestSent={(clubId) => {
// //             setPendingRequests((prev) => [...prev, clubId]);
// //             toast.success("Join request sent!");
// //             setJoinClub(null);
// //           }}
// //         />
// //       )}
// //     </>
// //   );
// // };

// // export default ClubListing;
// import React, { useState, useMemo, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { toast } from "react-toastify";
// import { motion } from "framer-motion";
// import Select from "@/components/ui/Select";
// import ClubDetailModal from "./[id]/club-detail";
// import axios from "axios";
// import fallbackLogo from "@/assets/images/all-img/widget-bg-5.png";
// import ClubApplicationForm from "../clubApplication/[id]/club-application-form";
// import ClubDetail from "./[id]/club-detail";

// const ClubListing = () => {
//   const [clubs, setClubs] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [joinClub, setJoinClub] = useState(null);
//   const [selectedClub, setSelectedClub] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [loadingDetails, setLoadingDetails] = useState(false); // ✅ new state

//   const [filters, setFilters] = useState({
//     interest: "",
//     major: "",
//     category: "",
//   });

//   // ✅ Fetch all clubs
//   useEffect(() => {
//     const fetchClubs = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please log in to view clubs");
//           return;
//         }

//         const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/club/get-all-club`, {
//           headers: { Authorization: `${token}` },
//         });

//         setClubs(res.data?.data || []);
//       } catch (error) {
//         console.error("Error fetching clubs:", error);
//         toast.error(error.response?.data?.message || "Failed to load clubs");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClubs();
//   }, []);

//   // ✅ Fetch single club details by ID
//   const handleViewDetails = async (clubId) => {
//     try {
//       setLoadingDetails(true);
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/club/${clubId}`, {
//         headers: { Authorization: `${token}` },
//       });

//       setSelectedClub(res.data?.data || null);
//     } catch (error) {
//       console.error("Error fetching club details:", error);
//       toast.error(error.response?.data?.message || "Failed to load club details");
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   // ✅ Extract unique filter options
//   const categories = [...new Set(clubs.map((club) => club.clubCategory).filter(Boolean))];
//   const majors = [
//     ...new Set(
//       clubs
//         .flatMap((club) => club.targetMajor || [])
//         .filter((m) => m && m.trim() !== "")
//     ),
//   ];
//   const interests = [...new Set(clubs.map((club) => club.interest).filter(Boolean))];

//   // ✅ Filtering logic
//   const filteredClubs = useMemo(() => {
//     return clubs.filter((club) => {
//       return (
//         (!filters.interest || club.interest === filters.interest) &&
//         (!filters.major || (club.targetMajor && club.targetMajor.includes(filters.major))) &&
//         (!filters.category || club.clubCategory === filters.category)
//       );
//     });
//   }, [clubs, filters]);

//   const handleFilterChange = (selectedOption, name) => {
//     setFilters({ ...filters, [name]: selectedOption ? selectedOption.value : "" });
//   };

//   const handleReset = () => {
//     setFilters({ interest: "", major: "", category: "" });
//   };

//   if (loading) {
//     return <p className="text-center text-gray-500">Loading clubs...</p>;
//   }

//   return (
//     <>
//       <Card className="p-6">
//         <div className="flex justify-between mb-3">
//           <h2 className="text-2xl font-bold mb-6 text-center">Club Directory</h2>

//           {/* ✅ Filter Section */}
//           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
//             <Select
//               options={[
//                 { value: "", label: "All Interests" },
//                 ...interests.map((i) => ({ value: i, label: i })),
//               ]}
//               value={
//                 filters.interest
//                   ? { value: filters.interest, label: filters.interest }
//                   : null
//               }
//               onChange={(selected) => handleFilterChange(selected, "interest")}
//               placeholder="Select Interest"
//             />

//             <Select
//               options={[
//                 { value: "", label: "All Majors" },
//                 ...majors.map((m) => ({ value: m, label: m })),
//               ]}
//               value={
//                 filters.major
//                   ? { value: filters.major, label: filters.major }
//                   : null
//               }
//               onChange={(selected) => handleFilterChange(selected, "major")}
//               placeholder="Select Major"
//             />

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

//             <Button
//               text="Reset Filters"
//               className="bg-primary-600 h-10 hover:bg-primary-900 text-white"
//               onClick={handleReset}
//             />
//           </div>
//         </div>

//         {/* ✅ Club Cards */}
//         {filteredClubs.length === 0 ? (
//           <p className="text-center text-gray-500">No clubs match your filters.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredClubs.map((club, index) => (
//               <motion.section
//                 key={club._id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 whileHover={{
//                   scale: 1.03,
//                   boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
//                 }}
//                 className="overflow-hidden shadow-md rounded-2xl border border-gray-200 bg-white dark:bg-slate-800 hover:shadow-lg transition flex flex-col"
//               >
//                 {/* Club Image */}
//                 <motion.img
//                   src={club.clubLogo || fallbackLogo}
//                   alt={club.clubName}
//                   className="w-full h-48 object-cover"
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ duration: 0.3 }}
//                   onError={(e) => (e.target.src = fallbackLogo)}
//                 />

//                 {/* Club Details */}
//                 <div className="p-5 flex flex-col flex-grow">
//                   <h3 className="text-lg font-semibold mb-1">{club.clubName}</h3>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <strong>Category:</strong> {club.clubCategory || "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <strong>President:</strong> {club.presidentName || "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-2">
//                     <strong>Vice President:</strong> {club.vicePresidentName || "N/A"}
//                   </p>

//                   <div className="mt-auto pt-2 flex justify-between gap-2">
//                     {/* ✅ Fetch detailed data before showing modal */}
//                     <Button
//                       text={loadingDetails ? "Loading..." : "View Details"}
//                       disabled={loadingDetails}
//                       className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
//                       onClick={() => handleViewDetails(club._id)}
//                     />

//                     {/* ✅ Join Button or Request Pending */}
//                     {pendingRequests.includes(club._id) ? (
//                       <Button
//                         text="Request Pending"
//                         disabled
//                         className="flex-1 bg-gray-400 text-white cursor-not-allowed"
//                       />
//                     ) : (
//                       <Button
//                         icon="heroicons-outline:plus-sm"
//                         text="Join Club"
//                         className="flex-1 btn font-normal btn-sm bg-gradient-to-r from-[#3AB89D] to-[#3A90B8] text-white border-0 hover:opacity-90"
//                         iconClass="text-lg"
//                         onClick={() => setJoinClub(club)}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </motion.section>
//             ))}
//           </div>
//         )}

//         {/* Club Details Modal */}
//         {selectedClub && (
//           <ClubDetail
//             club={selectedClub}
//             onClose={() => setSelectedClub(null)}
//           />
//         )}
//       </Card>

//       {/* ✅ Join Club Modal */}
//       {joinClub && (
//         <ClubApplicationForm
//           club={joinClub}
//           mode="add"
//           onClose={() => setJoinClub(null)}
//           onRequestSent={(clubId) => {
//             setPendingRequests((prev) => [...prev, clubId]);
//             toast.success("Join request sent!");
//             setJoinClub(null);
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default ClubListing;
import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Select from "@/components/ui/Select";
import axios from "axios";
import fallbackLogo from "@/assets/images/all-img/widget-bg-5.png";
import { useNavigate } from "react-router-dom";
import ClubApplicationForm from "../clubApplication/[id]/club-application-form";

const ClubListing = () => {
  const [clubs, setClubs] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [joinClub, setJoinClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ to navigate to detail page

  const [filters, setFilters] = useState({
    interest: "",
    major: "",
    category: "",
  });

  // ✅ Fetch all clubs
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to view clubs");
          return;
        }

        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/club/get-all-club`,
          { headers: { Authorization: `${token}` } }
        );

        setClubs(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        toast.error(error.response?.data?.message || "Failed to load clubs");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // ✅ Extract unique filter options
  const categories = [...new Set(clubs.map((club) => club.clubCategory).filter(Boolean))];
  const majors = [
    ...new Set(
      clubs
        .flatMap((club) => club.targetMajor || [])
        .filter((m) => m && m.trim() !== "")
    ),
  ];
  const interests = [...new Set(clubs.map((club) => club.interest).filter(Boolean))];

  // ✅ Filtering logic
  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      return (
        (!filters.interest || club.interest === filters.interest) &&
        (!filters.major || (club.targetMajor && club.targetMajor.includes(filters.major))) &&
        (!filters.category || club.clubCategory === filters.category)
      );
    });
  }, [clubs, filters]);

  const handleFilterChange = (selectedOption, name) => {
    setFilters({ ...filters, [name]: selectedOption ? selectedOption.value : "" });
  };

  const handleReset = () => {
    setFilters({ interest: "", major: "", category: "" });
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading clubs...</p>;
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between mb-3">
          <h2 className="text-2xl font-bold mb-6 text-center">Club Directory</h2>

          {/* ✅ Filter Section */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Select
              options={[
                { value: "", label: "All Interests" },
                ...interests.map((i) => ({ value: i, label: i })),
              ]}
              value={
                filters.interest
                  ? { value: filters.interest, label: filters.interest }
                  : null
              }
              onChange={(selected) => handleFilterChange(selected, "interest")}
              placeholder="Select Interest"
            />

            <Select
              options={[
                { value: "", label: "All Majors" },
                ...majors.map((m) => ({ value: m, label: m })),
              ]}
              value={
                filters.major
                  ? { value: filters.major, label: filters.major }
                  : null
              }
              onChange={(selected) => handleFilterChange(selected, "major")}
              placeholder="Select Major"
            />

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

            <Button
              text="Reset Filters"
              className="bg-primary-600 h-10 hover:bg-primary-900 text-white"
              onClick={handleReset}
            />
          </div>
        </div>

        {/* ✅ Club Cards */}
        {filteredClubs.length === 0 ? (
          <p className="text-center text-gray-500">No clubs match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClubs.map((club, index) => (
              <motion.section
                key={club._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
                }}
                className="overflow-hidden shadow-md rounded-2xl border border-gray-200 bg-white dark:bg-slate-800 hover:shadow-lg transition flex flex-col"
              >
                {/* Club Image */}
                <motion.img
                  src={club.clubLogo || fallbackLogo}
                  alt={club.clubName}
                  className="w-full h-48 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => (e.target.src = fallbackLogo)}
                />

                {/* Club Details */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-1">{club.clubName}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Category:</strong> {club.clubCategory || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>President:</strong> {club.presidentName || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Vice President:</strong> {club.vicePresidentName || "N/A"}
                  </p>

                  <div className="mt-auto pt-2 flex justify-between gap-2">
                    {/* ✅ Navigate to club detail page */}
                    <Button
                      text="View Details"
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
                      onClick={() => navigate(`/club-details/${club._id}`)}
                    />

                    {/* ✅ Join Button or Request Pending */}
                    {pendingRequests.includes(club._id) ? (
                      <Button
                        text="Request Pending"
                        disabled
                        className="flex-1 bg-gray-400 text-white cursor-not-allowed"
                      />
                    ) : (
                      <Button
                        icon="heroicons-outline:plus-sm"
                        text="Join Club"
                        className="flex-1 btn font-normal btn-sm bg-gradient-to-r from-[#3AB89D] to-[#3A90B8] text-white border-0 hover:opacity-90"
                        iconClass="text-lg"
                        onClick={() => setJoinClub(club)}
                      />
                    )}
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </Card>

      {/* ✅ Join Club Modal */}
      {joinClub && (
        <ClubApplicationForm
          club={joinClub}
          mode="add"
          onClose={() => setJoinClub(null)}
          onRequestSent={(clubId) => {
            setPendingRequests((prev) => [...prev, clubId]);
            toast.success("Join request sent!");
            setJoinClub(null);
          }}
        />
      )}
    </>
  );
};

export default ClubListing;
