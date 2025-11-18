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

  return (
    <Card className="p-6 space-y-6">

      <h1 className="text-3xl font-bold mb-4">Leader Board</h1>

      <Card className="p-4 mb-8">
        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <img src={Logo} alt="Loading..." className="w-52 h-24" />
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-lg">
              Total Clubs: <strong>{clubs.length}</strong>
            </p>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {clubs.map((club) => (
                <div
                  key={club._id}
                  className="border rounded-xl p-3 shadow bg-gradient-to-r from-[#18BB90] to-[#0C6B47]"
                >
                  <h3 className="font-semibold text-lg text-white">{club.clubName}</h3>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Leaderboard Table */}
      <Card className="p-4">
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
                <tr key={index} className="text-center even:bg-gray-50">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{stu.name}</td>
                  <td className="p-2 border">{stu.club}</td>
                  <td className="p-2 border font-bold">{stu.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </Card>
  );
};

export default LeaderBoard;
