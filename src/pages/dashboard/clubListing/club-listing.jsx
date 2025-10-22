import React, { useState, useMemo } from "react";
import clubsData from "@/constant/club-data";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Select from "@/components/ui/Select";
import ClubDetailModal from "./club-detail-modal";

const ClubListing = () => {
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [filters, setFilters] = useState({
    interest: "",
    major: "",
    category: "",
  });
  const [selectedClub, setSelectedClub] = useState(null);

  // Unique dropdown options
  const interests = [...new Set(clubsData.map((club) => club.interest))];
  const majors = [...new Set(clubsData.map((club) => club.targetAudience.major))];
  const categories = [...new Set(clubsData.map((club) => club.category))];

  const handleJoin = (clubName) => {
    if (joinedClubs.includes(clubName)) {
      toast.info(`You already joined ${clubName}`);
      return;
    }
    setJoinedClubs([...joinedClubs, clubName]);
    toast.success(`You joined ${clubName}!`);
  };

  const filteredClubs = useMemo(() => {
    return clubsData.filter((club) => {
      return (
        (!filters.interest || club.interest === filters.interest) &&
        (!filters.major || club.major === filters.major) &&
        (!filters.category || club.category === filters.category)
      );
    });
  }, [filters]);

  const handleFilterChange = (selectedOption, name) => {
    setFilters({ ...filters, [name]: selectedOption ? selectedOption.value : "" });
  };

  const handleReset = () => {
    setFilters({ interest: "", major: "", category: "" });
  };

  return (
    <Card className="p-6">
      <div className="flex flex-cols justify-between items-center mb-3">
        <h2 className="text-2xl font-bold mb-6 text-center">Club Directory</h2>

        {/* Filter Section */}
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

      {/* Club Cards Grid */}
      {filteredClubs.length === 0 ? (
        <p className="text-center text-gray-500">No clubs match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClubs.map((club, index) => (
            <motion.section
              key={club.id}
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
                src={club.logo}
                alt={club.name}
                className="w-full h-48 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />

              {/* Club Details */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-1">{club.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <strong>Major:</strong> {club.targetAudience.major}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <strong>Category:</strong> {club.category}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <strong>President:</strong> {club.leadershipTeam?.president?.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <strong>Vice President:</strong> {club.leadershipTeam?.vicePresident?.name}
                </p>
                {/* Fixed height for consistency */}
                {/* <p className="text-sm text-gray-700 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                  {club.description.length > 100
                    ? club.description.substring(0, 100) + "..."
                    : club.description}
                </p> */}

                {/* Buttons always pinned at bottom */}
                <div className="mt-auto pt-2 flex justify-between gap-2">
                  <Button
                    text="View Details"
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
                    onClick={() => setSelectedClub(club)}
                  />
                  <Button
                    text={
                      joinedClubs.includes(club.name)
                        ? "Joined"
                        : "Join Club"
                    }
                    disabled={joinedClubs.includes(club.name)}
                    className={`flex-1 ${joinedClubs.includes(club.name)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary-600 hover:bg-primary-900 text-white"
                      }`}
                    onClick={() => handleJoin(club.name)}
                  />
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      )}

      {/* Club Details Modal */}
      {selectedClub && (
        <ClubDetailModal
          club={selectedClub}
          onClose={() => setSelectedClub(null)}
        />
      )}
    </Card>
  );
};

export default ClubListing;
