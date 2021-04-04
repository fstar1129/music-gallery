import React from "react";
import { ReactComponent as IconLock } from "../../../assets/icons/icon-lock.svg";
const Visibility = ({ content, absolute }) => {
  return (
    <>
      {"public" === content.visibility && (
        <div
          className={`${
            absolute && "absolute"
          } flex top-5 right-5 text-gray-800 bg-gray-100 px-3 py-0.5 text-xs leading-3 rounded-full capitalize inline-flex items-center justify-center font-medium text-0.5 leading-tight sm:text-xs sm:leading-3`}
        >
          Public
        </div>
      )}

      {"free" === content.visibility && (
        <div
          className={`${
            absolute && "absolute"
          } flex top-5 right-5 text-gray-800 bg-gray-100 px-3 py-0.5 text-xs leading-3 rounded-full capitalize inline-flex items-center justify-center font-medium text-0.5 leading-tight sm:text-xs sm:leading-3`}
        >
          Free
        </div>
      )}

      {"basic" === content.visibility && (
        <div
          className={`${
            absolute && "absolute"
          } flex top-5 right-5 text-gray-800 bg-gray-100 px-3 py-0.5 text-xs leading-3 rounded-full capitalize inline-flex items-center justify-center font-medium text-0.5 leading-tight sm:text-xs sm:leading-3`}
        >
          <IconLock className="  fill-current w-3 h-3 mr-1" /> Basic
        </div>
      )}
      {"premium" === content.visibility && (
        <div
          className={`${
            absolute && "absolute"
          } flex top-5 right-5 text-gray-800 bg-gray-100 px-3 py-0.5 text-xs leading-3 rounded-full capitalize inline-flex items-center justify-center font-medium text-0.5 leading-tight sm:text-xs sm:leading-3`}
        >
          <IconLock className="  fill-current w-3 h-3 mr-1" /> Premium
        </div>
      )}
    </>
  );
};

export default Visibility;
