import React, { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import VideoTag from "./VideoTag";
import YoutubeEmbed from "../video/YoutubeEmbed";
import VimeoEmbed from "../video/VimeoEmbed";
import JWEmbed from "../video/JWEmbed";
import Resi from "../video/ResiEmbed";
import constants from "../../constants.json";
import VideoPlayer from "react-video-js-player";
//import * as moment from "moment";
import Chat from "../chat/Chat";
import Ads from "./Ads";
import { useSelector } from "react-redux";
import usePlatformTz from "../general/chat/hooks/usePlatformTz";

const VideoPreview = ({ content, collection, platformData }) => {
  const [isReadingMore, setIsReadingMore] = useState(false);
  const { platformData } = useSelector(state => state.frontend);
  const [moment] = usePlatformTz();
  const isDescriptionLong = () => ReactHtmlParser(content.description).length > 1; // more than one paragraph
  const renderAbbregedDescription = () => (
    <div className="contentDescription prose">
      {ReactHtmlParser(content.description)[0]}
      <div>...</div>
    </div>
  );

  return (
    content && (
      <div>
        <div className="block md:flex">
          <div className="flex flex-col">
            <div className="w-full fixed md:relative top-14 md:top-0 z-10 bg-black">
              {"video embed" === content.type && content.contentURI?.includes("youtu") && (
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    paddingBottom: "56.25%"
                  }}
                >
                  <YoutubeEmbed src={content.contentURI} />
                </div>
              )}
              {"video embed" === content.type && content.contentURI?.includes("vimeo") && (
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    paddingBottom: "56.25%"
                  }}
                >
                  <VimeoEmbed src={content.contentURI} />
                </div>
              )}
              {"jw video" === content.type && (
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    paddingBottom: "56.25%"
                  }}
                >
                  <JWEmbed contentId={content.contentURI} />
                </div>
              )}
              {"resi" === content.type && (
                <Resi contentId={content.contentURI} featuredThumb={content.featuredImage} />
              )}
              {"video" === content.type && (
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    paddingBottom: "56.25%"
                  }}
                >
                  <VideoPlayer
                    controls={true}
                    src={constants.cdnUrl + content.video}
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {/* ADS MODULE */}

            <Ads
              platformDark={platformData.darkColor}
              platformPrimary={platformData.primaryColor}
              collection={collection}
            />
          </div>

          <Chat content={content} />
        </div>
      </div>
    )
  );
};

export default VideoPreview;
