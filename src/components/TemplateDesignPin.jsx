import React, { useState } from "react";
import { AnimatePresence, delay, motion } from "framer-motion";
import { data } from "autoprefixer";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidHeart,
  BiSolidPlusCircle,
  BiSolidPlusSquare,
} from "react-icons/bi";
import UseUser from "../hooks/UseUser";
import { saveToCollections } from "../api";
import useTemplates from "../hooks/UseTemplates";
import { useNavigate } from "react-router-dom";

const TemplateDesignPin = ({ data, index }) => {
  const { data: user, refetch: UserRefetch } = UseUser();

  const { refetch: temp_refetch } = useTemplates;

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    UserRefetch();
  };

  const saveToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    temp_refetch();
  };

  const navigate = useNavigate();

  const handleRouteNavigation = () => {
    navigate(`/resumeDetail/${data?._id}`, { replace: true });
  };

  const [isHovered, setisHovered] = useState(false);

  return (
    <motion.div
      key={data?._id}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 0.85 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ delay: index * 0.3 }}
    >
      <div
        className="w-full h-[500px] 2xl:h-[740px] rounded-md bg-[#E7E5DF] overflow-hidden relative"
        onMouseEnter={() => setisHovered(true)}
        onMouseLeave={() => setisHovered(false)}
      >
        <img
          src={data?.imageURL}
          className="w-full h-full object-cover"
          alt=""
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 0.85 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ delay: index * 0.3 }}
              onClick={handleRouteNavigation}
              className="absolute inset-0 flex flex-col items-end justify-start px-4 py-3 z-2 cursor-pointer "
            >
              <div className="flex flex-col items-end justify-start relative bottom-10 left-10 gap-8">
                <InnerBoxCard
                  label={
                    user?.collections?.includes(data?._id)
                      ? "Added to Collection"
                      : "Add to Collection"
                  }
                  Icon={
                    user?.collections?.includes(data?._id)
                      ? BiSolidPlusCircle
                      : BiFolderPlus
                  }
                  onHandle={addToCollection}
                />
                <InnerBoxCard
                  label={
                    data?.favourites?.includes(user?.uid)
                      ? "Added To Favourites"
                      : "Add to Favourites"
                  }
                  Icon={
                    data?.favourites?.includes(user?.uid)
                      ? BiSolidHeart
                      : BiHeart
                  }
                  onHandle={saveToFavourites}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// InnerBox component

const InnerBoxCard = ({ label, Icon, onHandle }) => {
  const [isHovered, setisHovered] = useState(false);
  return (
    <div
      onClick={onHandle}
      className="w-10 h-10 rounded-md bg-gray-200 items-center flex justify-center hover:shadow-md relative"
      onMouseEnter={() => setisHovered(true)}
      onMouseLeave={() => setisHovered(false)}
    >
      <Icon className="text-base h-6 w-6" />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 50 }}
            className="px-3 py-2 rounded-md bg-gray-200 absolute -left-40 after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[14px] after:rotate-45 "
          >
            <p className="text-md whitespace-nowrap">{label}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesignPin;
