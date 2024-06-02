import React, { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";
import { CircleLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../config/firebase.config";
import { adminIds, initialTags } from "../utils/helpers";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import useTemplates from "../hooks/UseTemplates";
import UseUser from "../hooks/UseUser";
import { useNavigate } from "react-router-dom";

const CreateTemplate = () => {
  const [formData, setFormData] = useState({
    title: "",
    imageURL: null,
  });

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    imageUrl: null,
    progress: 0,
  });

  //   selected tags
  const [selectedTags, setselectedTags] = useState([]);

  const {
    data: templates,
    isError: templatesIsError,
    isLoading: templatesIsLoading,
    refetch: templatesRefetch,
  } = useTemplates();

  const { data: user, isLoading } = UseUser();

  const navigate = useNavigate();

  const handleSelectedTags = (tag) => {
    if (selectedTags.includes(tag)) {
      setselectedTags(selectedTags.filter((selected) => selected !== tag));
    } else {
      setselectedTags([...selectedTags, tag]);
    }
  };

  // Handling input field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = async (e) => {
    setImageAsset((prev) => ({ ...prev, isImageLoading: true }));
    const file = e.target.files[0];

    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageAsset((prev) => ({
            ...prev,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("stoarage/unauthorized")) {
            toast.error(`Error : Authorization Revoked`);
          } else {
            toast.error(`Error: ${error.message}`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageAsset((prev) => ({
              ...prev,
              isImageLoading: false,
              imageUrl: downloadURL,
            }));
            setFormData((prev) => ({ ...prev, imageURL: downloadURL }));
          });
          toast.success("Image uploaded");
          setInterval(() => {
            setImageAsset((prev) => ({ ...prev, isImageLoading: false }));
          }, 2000);
        }
      );
    } else {
      toast.info("Invalid File Format");
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  //   action to deleteeeee image
  const deleteAnImageObject = async () => {
    setInterval(() => {
      setImageAsset((prev) => ({
        ...prev,
        progress: 0,
        imageUrl: null,
      }));
    }, 2000);
    setImageAsset((prev) => ({ ...prev, isImageLoading: true }));
    const deleteRef = ref(storage, imageAsset.imageUrl);
    deleteObject(deleteRef).then(() => {
      toast.success("Image removed");
    });
  };

  const pushToCloud = async () => {
    const timestamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.imageUrl,
      tags: selectedTags,
      name:
        templates && templates.length > 0
          ? `Template${templates.length + 1}`
          : "Template1",
      timestamp: timestamp,
    };

    await setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        setFormData((prev) => ({ ...prev, title: "", imageURL: "" }));
        setImageAsset((prev) => ({ ...prev, imageUrl: null }));
        setselectedTags([]);
        templatesRefetch();
        toast.success("Data pushed to cloud");
      })
      .catch((error) => {
        toast.error(`Error : ${error.message}`);
      });
  };

  // function to remove data from cloud

  const removeTemplate = async (template) => {
    const deleteRef = ref(storage, template?.imageURL);
    await deleteObject(deleteRef).then(async () => {
      await deleteDoc(doc(db, "templates", template?._id))
        .then(() => {
          toast.success("Template deleted");
          templatesRefetch();
        })
        .catch((err) => {
          toast.error(`Error : ${err.message}`);
        });
    });
  };

  useEffect(() => {
    if (!isLoading && !adminIds.includes(user?.uid)) {
      navigate("/", { replace: true });
    }
  }, [user, isLoading]);

  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/* left container */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2">
        <div className="w-full">
          <p className="text-lg ">Create a new Template</p>
        </div>
        {/* template id section */}
        <div className="w-full flex items-center justify-end">
          <p className="font-semibold text-base ">TempID:{""}</p>
          <p className="font-semibold text-sm ">
            {templates && templates.length > 0
              ? `Template${templates.length + 1}`
              : "Template1"}
            :{""}
          </p>
        </div>
        {/* template title section */}
        <input
          className="w-full px-4 py-3 rounded-md bg-transparent border  border-zinc-900 text-lg focus:shadow-md outline-none placeholder-[#F8F4F9]"
          type="text"
          name="title"
          placeholder="Template Title"
          value={formData.title}
          onChange={handleChange}
        />
        <div className="w-full bg-transparent backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md border-2 border-dotted border-zinc-900 cursor-pointer flex items-center justify-center ">
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div className="flex flex-col items-center justify-center gap-4">
                <CircleLoader size={28} />
                <p>{imageAsset.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset.imageUrl ? (
                <React.Fragment>
                  <label className="w-full cursor-pointer h-full">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="flex items-center justify-center cursor-pointer flex-col">
                        <FaUpload />
                        <p>Click to Upload</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg, .jpg, .png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset?.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* delete action */}
                  <div
                    onClick={deleteAnImageObject}
                    className="absolute top-4 right-4 w-6 h-6 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                  >
                    <FaTrash className="text-sm text-white" />
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>{" "}
        {/* tags / initial tags */}
        <div className=" w-full flex items-center flex-wrap gap-2">
          {initialTags.map((tag, i) => (
            <div
              key={i}
              className={`cursor-pointer rounded-md py-1 px-1 border border-gray-500 cursor-pointe ${
                selectedTags.includes(tag) ? "bg-[#1981c6] text-white" : ""
              } `}
              onClick={() => handleSelectedTags(tag)}
            >
              <p>{tag}</p>
            </div>
          ))}
        </div>
        {/* button */}
        <button
          type="button"
          className="w-full rounded-md py-3  bg-[#1981c6] text-black"
          onClick={pushToCloud}
        >
          Save
        </button>
      </div>

      {/* right container */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 px- w-full flex-1 py-4">
        {templatesIsLoading ? (
          <React.Fragment>
            <CircleLoader />
          </React.Fragment>
        ) : (
          <React.Fragment>
            {templates && templates.length > 0 ? (
              <React.Fragment>
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                  {" "}
                  {templates?.map((template) => (
                    <div
                      key={template._id}
                      className="w-full h-[500px] rounded-md overflow-hidden relative"
                    >
                      <img
                        src={template?.imageURL}
                        className="w-full h-full object-cover"
                      />
                      <div
                        onClick={() => removeTemplate(template)}
                        className="absolute top-4 right-4 w-6 h-6 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                      >
                        <FaTrash className="text-sm text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <CircleLoader />
                <p>No Data</p>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default CreateTemplate;
