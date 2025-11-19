// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Card from "@/components/ui/Card";
// import Logo from "@/assets/images/logo/logo.png"; 
// import { toast } from "react-toastify";

// const LeaderBoard = () => {
//   const [clubs, setClubs] = useState([]);
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const BASE_URL = process.env.REACT_APP_BASE_URL;

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       // Fetch all clubs
//       const clubsRes = await axios.get(`${BASE_URL}/club/get-all-club`, {
//         headers: { Authorization: `${localStorage.getItem("token")}` },
//       });
//       setClubs(clubsRes.data?.data || []);

//       // Fetch leaderboard
//       const leaderRes = await axios.get(`${BASE_URL}/user/leaderboard`, {
//         headers: { Authorization: `${localStorage.getItem("token")}` },
//       });
//       setLeaderboard(leaderRes.data?.data || []);

//     } catch (error) {
//       console.error(error);
//       toast.error("Error loading leaderboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="p-6 space-y-6">

//       <h1 className="text-3xl font-bold mb-4">Leader Board</h1>

//       <Card className="p-4 mb-8">
//         {/* Loader */}
//         {loading ? (
//           <div className="flex justify-center items-center py-8">
//             <img src={Logo} alt="Loading..." className="w-52 h-24" />
//           </div>
//         ) : (
//           <>
//             <p className="text-gray-600 text-lg">
//               Total Clubs: <strong>{clubs.length}</strong>
//             </p>

//             <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//               {clubs.map((club) => (
//                 <div
//                   key={club._id}
//                   className="border rounded-xl p-3 shadow bg-gradient-to-r from-[#18BB90] to-[#0C6B47]"
//                 >
//                   <h3 className="font-semibold text-lg text-white">{club.clubName}</h3>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </Card>

//       {/* Leaderboard Table */}
//       <Card className="p-4">
//         <h2 className="text-xl font-semibold mb-4">Student Score</h2>

//         {loading ? (
//           <div className="flex justify-center items-center py-8">
//             <img src={Logo} alt="Loading..." className="w-52 h-24" />
//           </div>
//         ) : leaderboard.length === 0 ? (
//           <p>No leaderboard data available</p>
//         ) : (
//           <table className="w-full border-collapse">
//             <thead className="bg-gradient-to-r from-[#18BB90] to-[#0C6B47]">
//               <tr>
//                 <th className="p-2 border text-white">#</th>
//                 <th className="p-2 border text-white">Student Name</th>
//                 <th className="p-2 border text-white">Club</th>
//                 <th className="p-2 border text-white">Points</th>
//               </tr>
//             </thead>

//             <tbody>
//               {leaderboard.map((stu, index) => (
//                 <tr key={index} className="text-center even:bg-gray-50">
//                   <td className="p-2 border">{index + 1}</td>
//                   <td className="p-2 border">{stu.name}</td>
//                   <td className="p-2 border">{stu.club}</td>
//                   <td className="p-2 border font-bold">{stu.points}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </Card>
//     </Card>
//   );
// };

// export default LeaderBoard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/ui/Card";
import Logo from "@/assets/images/logo/logo.png";
import { toast } from "react-toastify";

const LeaderBoard = () => {
  const [clubs, setClubs] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all clubs 
      const clubsRes = await axios.get(`${BASE_URL}/club/get-all-club`, {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      });
      setClubs(clubsRes.data?.data || []);

      // Fetch leaderboard 
      const leaderRes = await axios.get(`${BASE_URL}/user/leaderboard`, {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      });
      setLeaderboard(leaderRes.data?.data || []);

    } catch (error) {
      console.error(error);
      toast.error("Error loading leaderboard data");
    } finally {
      setLoading(false);
    }
  };

  // Get top 3 scorers
  const getTop3Scorers = () => {
    if (leaderboard.length === 0) return [];
    const sorted = [...leaderboard].sort((a, b) => b.points - a.points);
    return sorted.slice(0, 3);
  };

  const top3 = getTop3Scorers();

  return (
    <Card  className="space-y-6">

      <h1 className="text-3xl font-bold mb-4">Leader Board</h1>

      <div className="p-4 mb-8">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <img src={Logo} alt="Loading..." className="w-52 h-24" />
          </div>
        ) : (
          <>
            {/* <p className="text-gray-600 text-lg">
              Total Clubs: <strong>{clubs.length}</strong>
            </p> */}
             <h2 className="text-xl font-semibold mb-4">ALL CLUBS</h2>

            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {clubs.map((club) => (
                <div
                  key={club._id}
                  className="border rounded-xl p-3 shadow bg-yellow-50 border-yellow-200 text-center"
                >
                  <h3 className="font-semibold text-lg text-gray-700">{club.clubName}</h3>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Top 3 Scorers Display */}
      {!loading && top3.length > 0 && (
        <div className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Top Scorers</h2>

          <div className="flex justify-center items-end gap-6 flex-wrap">
            {/* Second Place */}
            {top3[1] && (
              <div className="bg-white rounded-2xl shadow-lg p-6 w-52 border-2 border-gray-200">
                <div className="flex justify-center mb-3">
                  <img
                    src={Logo}
                    alt="MPUS CLU"
                    className="w-16 h-16 object-contain"
                  />
                </div>



                <h3 className="text-center font-semibold text-gray-800 text-base mb-2">
                  {top3[1].name}
                </h3>

                <p className="text-center text-4xl font-bold text-red-500 mb-3">
                  {top3[1].points}
                </p>

                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-2xl">
                    🥈
                  </div>
                </div>
              </div>
            )}

            {/* First Place - Highlighted with border */}
            {top3[0] && (
              <div className="bg-white rounded-2xl shadow-xl p-6 w-56 border-4 border-yellow-400 relative -mb-4">
                <div className="flex justify-center mb-3">
                  <img
                    src={Logo}
                    alt="MPUS CLU"
                    className="w-20 h-20 object-contain"
                  />
                </div>



                <h3 className="text-center font-bold text-gray-900 text-lg mb-2">
                  {top3[0].name}
                </h3>

                <p className="text-center text-5xl font-bold text-red-500 mb-3">
                  {top3[0].points}
                </p>

                <div className="flex justify-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
                    🏆
                  </div>
                </div>
              </div>
            )}

            {/* Third Place */}
            {top3[2] && (
              <div className="bg-white rounded-2xl shadow-lg p-6 w-52 border-2 border-gray-200">
                <div className="flex justify-center mb-3">
                  <img
                    src={Logo}
                    alt="MPUS CLU"
                    className="w-16 h-16 object-contain"
                  />
                </div>



                <h3 className="text-center font-semibold text-gray-800 text-base mb-2">
                  {top3[2].name}
                </h3>

                <p className="text-center text-4xl font-bold text-red-500 mb-3">
                  {top3[2].points}
                </p>

                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-2xl">
                    🥉
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      {/* <Card className="p-4"> 
        <h2 className="text-xl font-semibold mb-4">Student Score</h2> 
 
        {loading ? ( 
          <div className="flex justify-center items-center py-8"> 
            <img src={Logo} alt="Loading..." className="w-52 h-24" /> 
          </div> 
        ) : leaderboard.length === 0 ? ( 
          <p>No leaderboard data available</p> 
        ) : ( 
          <table className="w-full border-collapse"> 
            <thead className="bg-gradient-to-r from-[#18BB90] to-[#0C6B47]"> 
              <tr> 
                <th className="p-2 border text-white">#</th> 
                <th className="p-2 border text-white">Student Name</th> 
                <th className="p-2 border text-white">Club</th> 
                <th className="p-2 border text-white">Points</th> 
              </tr> 
            </thead> 
 
            <tbody> 
              {leaderboard.map((stu, index) => ( 
                <tr 
                  key={index} 
                  className={`text-center ${
                    index < 3 ? 'bg-yellow-50 font-semibold' : 'even:bg-gray-50'
                  }`}
                > 
                  <td className="p-2 border">{index + 1}</td> 
                  <td className="p-2 border">{stu.name}</td> 
                  <td className="p-2 border">{stu.club}</td> 
                  <td className="p-2 border font-bold">{stu.points}</td> 
                </tr> 
              ))} 
            </tbody> 
          </table> 
        )} 
      </Card>  */}
        <h2 className="text-xl font-semibold mb-4">STUDENTS SCORE</h2>

          <div className="space-y-3">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-[#18BB90] to-[#0C6B47] rounded-xl p-4 shadow-md">
              <div className="grid grid-cols-12 gap-4 items-center text-white font-semibold">
                <div className="col-span-1 text-center">Sr.No</div>
                <div className="col-span-5">User</div>
                <div className="col-span-4 text-right">Points</div>
                <div className="col-span-2 text-center">Club</div>
              </div>
            </div>

            {/* Student Cards */}
            {leaderboard.map((stu, index) => (
              <div
                key={index}
                className={`rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border ${index < 3
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-white border-gray-100'
                  }`}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Rank */}
                  <div className="col-span-1 text-center">
                    <span className={`text-2xl font-bold ${index < 3 ? 'text-yellow-600' : 'text-blue-600'
                      }`}>
                      {index + 1}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center overflow-hidden">
                      <span className="text-white font-bold text-lg">
                        {stu.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {stu.name}
                      </p>
                      <p className="text-xs text-gray-500">{stu.club}</p>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="col-span-4 text-right">
                    <p className="text-xl font-bold text-gray-700">
                      {stu.points?.toLocaleString()}
                    </p>
                  </div>

                  {/* Club Badge */}
                  <div className="col-span-2 flex justify-center">
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#18BB90] to-[#0C6B47] text-white text-xs font-semibold">
                      {stu.club?.substring(0, 3).toUpperCase() || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
    </Card>
  );
};

export default LeaderBoard;