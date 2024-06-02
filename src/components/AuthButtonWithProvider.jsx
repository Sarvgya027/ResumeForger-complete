import React from "react";
import { FaChevronRight } from "react-icons/fa";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../config/firebase.config";

// Create authentication provider instances
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const twitterProvider = new TwitterAuthProvider();

function AuthButtonWithProvider({ Icon, label, provider }) {
  const handleClick = async () => {
    switch (provider) {
      case "GoogleAuthProvider":
        await signInWithRedirect(auth, googleProvider)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.Console.log(`error : ${err.Message} `);
          });
        break;
      case "GithubAuthProvider":
        await signInWithRedirect(auth, githubProvider)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.Console.log(`error : ${err.Message} `);
          });
        break;
      case "TwitterAuthProvider":
        console.log("inside Twitter auth");
        break;
      default:
        console.log("Unknown provider");
        break;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full px-4 py-3 rounded-lg border-2 border-[#0D5C63] flex items-center justify-between cursor-pointer group hover:hover:bg-[#0D5C63] active:scale-95 hover:shadow-md duration-100"
    >
      <Icon className="group-hover:text-white" />
      <p className="group-hover:text-white">{label}</p>
      <FaChevronRight className="group-hover:text-white" />
    </div>
  );
}

export default AuthButtonWithProvider;
