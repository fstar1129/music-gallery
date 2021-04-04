import React, { useState } from "react";
import { Link } from "react-router-dom";
import usePlatformTz from "../general/chat/hooks/usePlatformTz";
import { ReactComponent as IconPlay } from "../../assets/icons/icon-play.svg";

import { stripHtmlTags } from "../../utils";
import constants from "../../constants.json";
import Visibility from "./content/Visibility";

const GridCollection = ({ n, overrideTitle, filterContent, customBGColor, collection }) => {
  const [isReadingMore] = useState(false);

  const [moment] = usePlatformTz();
  const orderByPublishedDate = contents =>
    contents
      .slice()
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  return (
    <div
      className=" py-16 "
      style={{
        backgroundColor: `${customBGColor}`
      }}
    >
      <span id="firstcollection"></span>
      <div className="mx-3 md:mx-auto max-w-6xl px-0 sm:px-10   ">
        <div className="hidden flex justify-between pb-5 sm:pb-7">
          <Link to={`/${collection.slug}`}>
            <h1 className="collection-title text-xl sm:text-4xl font-bold">
              {overrideTitle ? overrideTitle : collection.name}
            </h1>
          </Link>
          <div className="flex items-center ml-2"></div>
        </div>
        <div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-12  ">
            {orderByPublishedDate(collection.Contents || []).map((content, i) => {
              if (content.id === filterContent) return null;

              if (moment().isAfter(content.expireDate)) return null;

              const description = stripHtmlTags(content?.description);
              return (
                <li
                  key={i}
                  className=" hover:shadow-2xl rounded-md shadow-lg overflow-hidden transition duration-500 ease-in-out"
                  // style={{ width: 350 }}
                >
                  <Link to={`/${collection.slug}/${content.slug}`}>
                    <div
                      className="relative"
                      // style={{ width: 350 }}
                    >
                      <img
                        className="h-full w-full object-cover"
                        src={constants.cdnUrl + "tr:ar-16-9,w-500/" + content.featuredImage}
                        alt="logo"
                      />
                      <div className="absolute flex justify-center items-center w-full h-full top-0">
                        <IconPlay className="w-auto h-auto" />
                      </div>
                      <Visibility content={content} absolute={true} />
                    </div>
                    <div className="mt-3 mx-4">
                      <h2 className="mt-2 font-base font-bold  line-clamp text-xl leading-6 sm:text-xl">
                        {content.title}
                      </h2>
                    </div>
                    <div className="my-2 mx-4">
                      <span className="text-gray-700 text-xs mt-6 leading-3 font-semibold  mr-4 sm:text-base sm:leading-5">
                        {content.User.name}
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-700 text-xs mt-2 leading-3 font-weight-normal  ml-4 sm:text-base sm:leading-5">
                        {moment(content.publishedDate).add(1, "days").format("ll")}
                      </span>

                      <div
                        className="text-gray-700 text-xs mt-2 leading-3 font-normal mr-3 sm:text-base sm:leading-5"
                        style={{ width: 350 }}
                      >
                        {description && description.length >= 110
                          ? isReadingMore
                            ? description
                            : description.slice(0, 110) + "..."
                          : description}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GridCollection;
