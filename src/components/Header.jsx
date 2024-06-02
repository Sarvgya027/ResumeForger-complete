import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../assets";
import { AnimatePresence, motion } from "framer-motion";
import { CircleLoader } from "react-spinners";
import UseUser from "../hooks/UseUser";
import { HiOutlineLogout } from "react-icons/hi";
import { useQueryClient } from "react-query";
import { auth } from "../config/firebase.config";
import { adminIds } from "../utils/helpers";
import useFilters from "../hooks/UseFilters";

function Header() {
  const { data, isLoading } = UseUser();
  const [isDropDown, setDropDown] = useState(false);

  const queryClient = useQueryClient();

  const { data: FilterData } = useFilters();

  const signOutUser = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData("user", null);
    });
  };

  const handleSearchTerm = (e) => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: e.target.value,
    });
  };

  const clearFilter = () => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  };

  return (
    <header className="w-full flex items-center justify-between px-4 py-2 lg:px-8 border-b border-gray-400 bg-[#E7E5DF] z-50 gap-12 sticky top-0">
      {/* Logo */}
      <Link to={"/"}>
        <img className="h-10 object-contain" src={Logo} alt="" />
      </Link>

      {/* Search input */}
      <div className="w-4/12 border border-zinc-600 px-4 py-1 rounded-md flex items-center justify-center">
        <input
          value={FilterData ? FilterData?.searchTerm || "" : ""}
          onChange={handleSearchTerm}
          type="text"
          placeholder="Search here..."
          className="flex-1 h-10 bg-transparent placeholder-zinc-400 text-base font-semibold outline-none border-none"
        />

        <AnimatePresence>
          {FilterData?.searchTerm.length > 0 && (
            <motion.div
              onClick={clearFilter}
              className="w-8 h-8  flex items-center justify-center bg-gray-300 rounded-md cursor-pointer active:scale-95 duration-100"
            >
              <p className="text-xl text-black">X</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile or Login button */}
      <AnimatePresence>
        {isLoading ? (
          <CircleLoader size={48} />
        ) : (
          <React.Fragment>
            {data ? (
              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setDropDown(!isDropDown)}
              >
                {data?.photoURL ? (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer">
                    <img
                      src={data?.photoURL}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full "
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gray-400 rounded-full "></div>
                )}

                {/* drop down menu */}
                <AnimatePresence>
                  {isDropDown && (
                    <motion.div
                      onMouseLeave={() => setDropDown(!isDropDown)}
                      className="w-60 pt-8 absolute px-4 py-2 rounded-md bg-[#F8F4F9] right-2 top-16 flex flex-col items-center justify-start"
                    >
                      {data?.photoURL ? (
                        <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center cursor-pointer">
                          <img
                            src={data?.photoURL}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-full "
                            alt=""
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-400 rounded-full "></div>
                      )}
                      <p className="font-semibold pt-4 pb-4 text-center">
                        {data?.displayName}
                      </p>
                      {/* menu options */}
                      <div className="w-full border-t-2 border-r-slate-950 flex-col items-start flex gap-6 pt-4 ">
                        <Link
                          className="whitespace-nowrap relative left-4 "
                          to={`/profile/${data.uid}`}
                        >
                          My Account
                        </Link>

                        {adminIds.includes(data?.uid) && (
                          <Link
                            className="whitespace-nowrap relative left-4"
                            to={"/template/create"}
                          >
                            Add New Template
                          </Link>
                        )}

                        <div
                          className="w-full px-2 py-4 border-t border-r-slate-950 justify-between group flex cursor-pointer"
                          onClick={signOutUser}
                        >
                          <p className="group-hover:text-zinc-900 text-gray-600">
                            Sign Out
                          </p>
                          <HiOutlineLogout
                            size={20}
                            className=" group-hover:text-zinc-900 text-gray-600"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link to={"/auth"}>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className=" bg-gray-500 hover:bg-[#393E41] text-white font-semibold px-4 py-2 rounded-full hover:shadow-md "
                >
                  Login
                </motion.button>
              </Link>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
