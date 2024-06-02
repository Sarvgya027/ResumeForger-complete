import React, { useEffect, useState } from "react";
import UseUser from "../hooks/UseUser";
import { AnimatePresence } from "framer-motion";
import { MainSpinner, TemplateDesignPin } from "../components";
import useTemplates from "../hooks/UseTemplates";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getSavedResumes } from "../api";
import { NoData } from "../assets";

const UserProfile = () => {
  const {
    data: user,
    isLoading: userIsLoading,
    isError: userIsError,
  } = UseUser();
  const [activeTab, setActiveTab] = useState("collections");

  const {
    data: templates,
    isLoading: temp_isLoading,
    isError: temp_isError,
  } = useTemplates();

  const navigate = useNavigate();

  const { data: savedResumes } = useQuery(["saveResumes"], () => {
    return getSavedResumes(user?.uid);
  });

  useEffect(() => {
    if (userIsError) {
      navigate("/auth", { replace: true });
    }
  }, [userIsError, navigate]);

  if (userIsLoading || temp_isLoading) {
    return <div>Loading...</div>;
  }

  if (userIsError || temp_isError) {
    return <div>Error fetching data</div>;
  }

  if (temp_isLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div className="w-full relative">
        <div className="w-full h-72 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/462162/pexels-photo-462162.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center justify-center flex-col gap-4 mt-4 absolute top-60 left-0 right-0 m-auto">
          {user?.photoURL ? (
            <img
              src={user?.photoURL}
              referrerPolicy="no-referrer"
              className="w-20 h-20 object-cover rounded-full"
              alt=""
            />
          ) : (
            <img
              className="rounded-full w-20 h-20"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDwmG52pVI5JZfn04j9gdtsd8pAGbqjjLswg&usqp=CAU"
              alt=""
            />
          )}
          <p>{user?.displayName}</p>
        </div>
        {/* tabs */}
        <div className="flex items-center justify-center mt-12">
          <div
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
          >
            <p
              onClick={() => setActiveTab("collections")}
              className={`text-base relative top-16 group-hover:text-blue-600 placeholder-zinc-400 py-1 rounded-full w-24 text-center ${
                activeTab === "collections"
                  ? "bg-white shadow-md text-blue-600"
                  : ""
              }`}
            >
              Collections
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
          >
            <p
              onClick={() => setActiveTab("resumes")}
              className={`text-base relative top-16 group-hover:text-blue-600 placeholder-zinc-400 py-1 rounded-full w-24 text-center ${
                activeTab === "resumes"
                  ? "bg-white shadow-md text-blue-600"
                  : ""
              }`}
            >
              My resumes
            </p>
          </div>
        </div>

        {/* tab content */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6">
          <AnimatePresence>
            {activeTab === "collections" && (
              <React.Fragment>
                {user?.collections?.length > 0 && user?.collections ? (
                  <RenderATemplate
                    templates={templates?.filter((temp) =>
                      user?.collections?.includes(temp?._id)
                    )}
                    user={user}
                  />
                ) : (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center">
                    <img
                      src={NoData}
                      alt=""
                      className="w-32 h-auto object-contain"
                    />
                  </div>
                )}
              </React.Fragment>
            )}

            {activeTab === "resumes" && (
              <React.Fragment>
                {savedResumes?.length > 0 ? (
                  <RenderATemplate templates={savedResumes} user={user} />
                ) : (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center">
                    <img
                      src={NoData}
                      alt=""
                      className="w-32 h-auto relative top-10 object-contain"
                    />
                  </div>
                )}
              </React.Fragment>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const RenderATemplate = ({ templates, user }) => {
  if (!user?.collections || user?.collections.length === 0) {
    return <div>No collections found</div>;
  }

  if (!templates || templates.length === 0) {
    return <div>No templates found</div>;
  }

  return (
    <React.Fragment>
      {templates && templates.length > 0 && (
        <React.Fragment>
          <AnimatePresence>
            {templates.map((template, index) => (
              <TemplateDesignPin
                key={template?._id}
                data={template}
                index={index}
              />
            ))}
          </AnimatePresence>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default UserProfile;
