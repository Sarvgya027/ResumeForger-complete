import React, { useState } from "react";
import { MdLayersClear } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { FiltersData } from "../utils/helpers";
import useFilters from "../hooks/UseFilters";
import { useQueryClient } from "react-query";

function Filters() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const { data: FilterData, isLoading, isError, refetch } = useFilters();

  const queryClient = useQueryClient();

  const handleFilterValue = (value) => {
    // const previousState = queryClient.getQueryData("globalFilter");
    // const updatedState = {...previousState, filter : value}
    // queryClient.setQueryData("globalFilter", updatedState)
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: value,
    });
  };

  const clearFilter = () => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  };

  return (
    <div className="w-full flex items-center justify-start py-2">
      <div
        onClick={clearFilter}
        className="border border-gray-300 rounded-md px-3 py-2 mr-2 cursor-pointer group hover:shadow-md bg-gray-200 relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <MdLayersClear className="text-xl" />
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 20 }}
              className="absolute -top-8 -left-2 bg-white shadow-md rounded-md px-2 py-1"
            >
              <p className="whitespace-nowrap text-xs">Clear all</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex items-center justify-start overflow-x-scroll gap-4 scrollbar-none">
        {FiltersData &&
          FiltersData.map((item) => (
            <div
              onClick={() => handleFilterValue(item.value)}
              key={item.id}
              className={`border border-gray-300 rounded-md px-6 py-2 cursor-pointer group hover:shadow-md  ${
                FilterData &&
                FilterData?.searchTerm === item.value &&
                "bg-[#E7E5DF] shadow-md "
              }`}
            >
              <p className="text-sm whitespace-nowrap">{item.label}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Filters;
