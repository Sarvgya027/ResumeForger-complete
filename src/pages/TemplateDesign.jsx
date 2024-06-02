import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getTemplateDetails, saveToCollections } from "../api";
import { MainSpinner, TemplateDesignPin } from "../components";
import { FaHouse } from "react-icons/fa6";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import UseUser from "../hooks/UseUser";
import useTemplates from "../hooks/UseTemplates";
import { AnimatePresence } from "framer-motion";

function TemplateDesign() {
  const { templateID } = useParams();

  const { data, isError, isLoading, refetch } = useQuery(
    ["template", templateID],
    () => getTemplateDetails(templateID)
  );

  const { data: user, refetch: UserRefetch } = UseUser();

  const {
    data: templates,
    refetch: temp_refetch,
    isLoading: temp_isLoading,
  } = useTemplates();

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    UserRefetch();
  };

  const saveToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    temp_refetch();
    refetch();
  };

  if (isLoading) return <MainSpinner />;

  if (isError) {
    return (
      <div className="w-full h-[60%] flex flex-col items-center justify-center">
        <p className="font-semibold">
          Error while fetching data... Try again later
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-start flex-col px-4 py-6">
      <div className="w-full flex items-center pb-8 gap-2 ">
        <Link to={"/"} className="flex items-center justify-center gap-2 ">
          <FaHouse /> Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>

      {/* // main section */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12">
        {/* left section */}
        <div className="col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4">
          <img
            className="w-full h-auto object-containrounded-md"
            src={data?.imageURL}
            alt=""
          />

          {/* title section */}
          <div className="w-full flex flex-col items-start justify-start gap-2">
            <div className="w-full flex items-center justify-between">
              <p className="font-semibold">{data?.title}</p>
              {/* likes */}

              {data?.favourites?.length > 0 && (
                <div className="flex items-center justify-startgap-1">
                  <BiHeart className="text-base tex-red-500" />
                  <p className="text-base">{data?.favourites?.length}likes</p>
                </div>
              )}
            </div>

            {/* collection favourite options */}
            {user && (
              <div className="flex item-center justify-center">
                {user?.collections?.includes(data?._id) ? (
                  <React.Fragment>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiSolidFolderPlus />
                      <p className="text-sm whitespace-nowrap">
                        Remove from collections
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiFolderPlus />
                      <p className="text-sm whitespace-nowrap">
                        Add to collections
                      </p>
                    </div>
                  </React.Fragment>
                )}
                {data?.favourites?.includes(user?.uid) ? (
                  <React.Fragment>
                    <div
                      onClick={saveToFavourites}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiSolidHeart />
                      <p className="text-sm whitespace-nowrap">
                        Remove from favourites
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div
                      onClick={saveToFavourites}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiHeart />
                      <p className="text-sm whitespace-nowrap">
                        Add to favourites
                      </p>
                    </div>
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </div>

        {/* right section */}
        <div className="col-span-1 lg:col-span-4 w-full flex flex-col items-center px-3 gap-6 justify-start">
          <div
            className="w-full h-72 rounded-md overflow-hidden relative bg-sky-300"
            style={{
              background:
                "url(https://images.pexels.com/photos/949587/pexels-photo-949587.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
              <Link
                to={"/"}
                className="px-4 py-2 rounded-md border-2 border-gray-50 text-white w-30 flex items-center justify-center  "
              >
                Discover More
              </Link>
            </div>
          </div>
          {user && (
            <Link
              className="w-full px-4 py-3 rounded-md flex items-center justify-center bg-[#E7E5DF]"
              to={`/resume/${data?.name}?.templateId=${templateID}`}
            >
              <p className="font-semibold text-lg ">Edit this template</p>
            </Link>
          )}

          {/* tags */}
          <div className="w-full flex items-center justify-start flex-wrap gap-2 ">
            {data?.tags?.map((tag, index) => (
              <p
                className="text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap"
                key={index}
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* similar templates */}
      {templates?.filter((temp) => temp._id !== data?._id).length > 0 && (
        <div className="w-full py-6 flex flex-col items-start justify-startgap-4">
          <p className="text-lg font-semibold">You might also like this</p>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-2">
            <React.Fragment>
              <AnimatePresence>
                {templates
                  ?.filter((temp) => temp._id !== data?._id)
                  .map((template, index) => (
                    <TemplateDesignPin
                      key={template?._id}
                      data={template}
                      index={index}
                    />
                  ))}
              </AnimatePresence>
            </React.Fragment>
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateDesign;
