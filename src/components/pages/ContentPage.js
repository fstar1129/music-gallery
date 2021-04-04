import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import moment from 'moment';
import { setLoginModalState } from "../../features/auth/authSlice";
import UpgradeModal from "../UpgradeModal";
import Navbar from "./Navbar";
import constants from "../../constants";
import { stripHtmlTags } from "../../utils";
import YoutubeEmbed from "../video/YoutubeEmbed";
import VimeoEmbed from "../video/VimeoEmbed";
import JWEmbed from "../video/JWEmbed";
import VideoPlayer from "react-video-js-player";
import Resi from "../video/ResiEmbed";
import Ads from "./Ads";
import Chat from "../chat/Chat";
import Countdown from '../Countdown';
import { toggleChat } from "../../features/chat/chatSlice";
import Visibility from "./content/Visibility";
import { Link } from "react-router-dom";

const ContentPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { platformData } = useSelector(state => state.frontend);
  const { currentUser } = useSelector(state => state.auth);
  const { chatEnabled } = useSelector(state => state.chat);
  const [content, setContent] = useState(null);
  const [collection, setCollection] = useState({});
  const [mayAccess, setMayAccess] = useState(undefined);
  const [countdown, setCountdown] = useState({
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0
    });
  const [isCountdownSet, setIsCountdownSet] = useState(false);
  
  const [upgradeModalShowing, setUpgradeModalShowing] = useState(false);

  const { pathname } = useLocation();

  const bgTreatment = constants.cdnUrl + collection.collectionBGImage;

  var timer = null;

  useEffect(() => {
    const collectionSlug = pathname.split("/").slice(1)[0];

    // find collection with slug collectionSlug
    const collectionTemp =
      platformData.Collections &&
      platformData.Collections.find(collection => collection.slug === collectionSlug);

    if (!collectionTemp) return;

    setCollection(collectionTemp);

    const contentSlug = pathname.split("/").slice(1)[1];

    // find the content with slug contentSlug
    const contentTemp = collectionTemp.Contents.find(content => content.slug === contentSlug);

    if (!contentTemp) return;

    setContent(contentTemp);

    // scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // eslint-disable-next-line
  }, [platformData.Collections, pathname]);

  useEffect(() => {
    if (currentUser && ("sa" === currentUser.role || "admin" === currentUser.role)) {
      // admins, sas, have no restrictions
      setMayAccess(true);
      return;
    }

    if (content && "public" === content.visibility) {
      // no  restrictions
      setMayAccess(true);
      return;
    } else if (content && !currentUser) {
      setMayAccess(false);

      if ("true" === localStorage.getItem("visited")) {
        // visited previously
        dispatch(
          setLoginModalState({
            loginModalShowing: true,
            activeAuthForm: "signUp",
            redirectOnCloseTo: "/"
          })
        );
      } else {
        // had never visited
        dispatch(
          setLoginModalState({
            loginModalShowing: true,
            activeAuthForm: "signIn",
            redirectOnCloseTo: "/"
          })
        );
        localStorage.setItem("visited", "true");
      }

      return;
    }

    // FREE, BASIC and PREMIUM CONTENT
    if (content && "free" === content.visibility) {
      if (
        currentUser &&
        ("free" === currentUser.role ||
          "basic" === currentUser.role ||
          "premium" === currentUser.role)
      ) {
        setMayAccess(true);
      } else {
        setMayAccess(false);
      }
    } else if (content && "basic" === content.visibility) {
      if (currentUser && ("basic" === currentUser.role || "premium" === currentUser.role)) {
        setMayAccess(true);
      } else {
        setMayAccess(false);
      }
    } else if (content && "premium" === content.visibility) {
      if (currentUser && "premium" === currentUser.role) {
        setMayAccess(true);
      } else {
        setMayAccess(false);
      }
    }

    // eslint-disable-next-line
  }, [content, currentUser]);

  useEffect(() => {
    if (false === mayAccess) {
      // show insufficient role modal
      setUpgradeModalShowing(true);
    } else {
      setUpgradeModalShowing(false);
    }
  }, [mayAccess, currentUser]);

  useEffect(() => {
    if (content) {
      dispatch(toggleChat({ chatEnabled: content.chatEnabled }));
      // Currently, content does not have start datetime field, so I used a static value instead of it for now.
      // startCountdown(content.startDate);
      startCountdown(content.startDate);
    }

    // eslint-disable-next-line
  }, [content]);

  const orderByPublishedDate = contents =>
    contents
      .slice()
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  const noAds = collection.Ads?.length === 0;

  const startCountdown = startDate => {
    clearInterval(timer);
    timer = null;

    if (startDate !== '') {
      timer = setInterval(() => playTimer(startDate), 1000);
      setIsCountdownSet(true);
    }
  }

  const playTimer = startDate => {
    const unixEndDate = Number(moment.utc(startDate).format('X'));
    const distance = unixEndDate - moment.utc().format('X');

    if (distance > 0) {
      setCountdown({
          days: parseInt(distance / (60 * 60 * 24), 10),
          hours: parseInt(distance % (60 * 60 * 24) / (60 * 60), 10),
          mins: parseInt(distance % (60 * 60) / (60), 10),
          secs: parseInt(distance % 60, 10)
        });
    }
    else {
      clearInterval(timer);
      timer = null;
      setIsCountdownSet(false);
    }
  }

  return (
    content && (
      <>
        {collection?.name && content?.title && platformData?.name && (
          <Helmet>
            <title>{`${collection?.name}: ${content?.title} - ${platformData?.name}`}</title>
            <meta name="description" content={stripHtmlTags(content?.description)} />
            <meta name="og:description" content={stripHtmlTags(content?.description)} />
            <meta name="og:image" content={constants.cdnUrl + content?.featuredImage || ""} />
            <meta name="og:title" content={content?.title || ""} />
          </Helmet>
        )}
        <div className="contentpage">
          <Navbar />
          {new Date(content.publishedDate) < new Date() && (
            <div
              className={`${chatEnabled ? "" : "preview-container-chat-closed"} preview-container`}
              style={{
                backgroundImage: `url("${bgTreatment}")`,
                backgroundColor: `${platformData.darkColor}`
              }}
            >
              {isCountdownSet && (
                  <Countdown countdown={countdown} />
              )}
              {!isCountdownSet && (
                <>
                  {/* Decorative background element */}
                  {collection.collectionBGImage === null && (
                    <div className="relative xl:max-w-8xl mx-auto hidden md:block" style={{ zIndex: 0 }}>
                      <div
                        className="absolute hidden top-0 left-0 ml-11 mt-7"
                        style={{
                          width: 319,
                          height: 319,
                          backgroundColor: `${platformData.primaryColor}`,
                          background: `linear-gradient(90deg, #21282f 17px, transparent 1%) center,
                                      linear-gradient(#21282f 17px, transparent 1%) center,
                                      rgba(229, 231, 235, 0.2)`
                        }}
                      />
                    </div>
                  )}
                {/* END Decorative background element */}

                <div
                  className={`${
                    chatEnabled ? "" : "video-container-chat-disabled"
                  } video-container z-10`}
                >
                  <div className="video-container-inner" style={{ position: "relative" }}>
                    {content.chatEnabled && (
                      <>
                        {!chatEnabled ? (
                          <button
                            className="close-chat absolute top-19 right-5 bg-white uppercase rounded-full px-5 py-1"
                            style={{ zIndex: 99 }}
                            onClick={() => dispatch(toggleChat())}
                          >
                            open chat
                          </button>
                        ) : (
                          <div
                            className="cursor-pointer outline-none border-none shadow-none text-white close-chat absolute top-19 right-5 uppercase px-5 py-1"
                            style={{ zIndex: 99 }}
                            onClick={() => dispatch(toggleChat())}
                          >
                            X
                          </div>
                        )}
                      </>
                    )}
                    {"video embed" === content.type && content.contentURI?.includes("youtu") && (
                      <div
                        className={`${chatEnabled ? "video-embed" : "video-embed-chat-disabled"} ${
                          noAds ? "no-ads" : ""
                        } `}
                      >
                        <YoutubeEmbed src={content.contentURI} />
                      </div>
                    )}
                    {"video embed" === content.type && content.contentURI?.includes("vimeo") && (
                      <div
                        className={`${chatEnabled ? "video-embed" : "video-embed-chat-disabled"} ${
                          noAds ? "no-ads" : ""
                        }`}
                      >
                        <VimeoEmbed src={content.contentURI} />
                      </div>
                    )}
                    {"jw video" === content.type && (
                      <div
                        className={`${chatEnabled ? "video-embed" : "video-embed-chat-disabled"} ${
                          noAds ? "no-ads" : ""
                        }`}
                      >
                        <JWEmbed contentId={content.contentURI} />
                      </div>
                    )}
                    {"resi" === content.type && (
                      <Resi
                        chatEnabled={chatEnabled}
                        contentId={content.contentURI}
                        featuredThumb={content.featuredImage}
                        noAds={noAds}
                      />
                    )}
                    {"video" === content.type && (
                      <div
                        className={`${chatEnabled ? "video-embed" : "video-embed-chat-disabled"} ${
                          noAds ? "no-ads" : ""
                        }`}
                      >
                        <VideoPlayer
                          controls={true}
                          src={constants.cdnUrl + content.video}
                          allowFullScreen
                        />
                      </div>
                    )}

                    {/* Author info */}
                    <div className="absolute bottom-20 left-5 content">
                      <Visibility content={content} />
                      <h1 className="text-white bolder video-title mb-0" style={{}}>
                        {content.title}
                      </h1>
                      <h2 className="text-white italic video-author" style={{}}>
                        {content.User?.name}
                      </h2>
                    </div>
                  </div>

                  {!noAds && (
                    <Ads
                      platformDark={platformData.darkColor}
                      platformPrimary={platformData.primaryColor}
                      collection={collection}
                      content={content}
                      chatEnabled={chatEnabled}
                    />
                  )}
                </div>

                {content.chatEnabled && chatEnabled && (
                  <div className="chat-container text-white">
                    <Chat content={content} />
                  </div>
                )}

                <Ads
                  mobile={true}
                  platformDark={platformData.darkColor}
                  platformPrimary={platformData.primaryColor}
                  collection={collection}
                  content={content}
                  chatEnabled={chatEnabled}
                />
              </>
              )}
            </div>
          )}

          {/* UP NEXT */}
          <div className="bg-gray-50 pt-5 sm:pt-16 secondary-collection">
            <div className="col-1">
              <div className="max-w-sm sm:max-w-4xl mx-auto">
                <h1 className="font-base font-bold" style={{ fontSize: 36, color: "#414141" }}>
                  {content.title}
                </h1>
                <div dangerouslySetInnerHTML={{ __html: content.description }}></div>

                {/* more */}
                <div className="py-12">
                  <h2
                    className="font-base font-bold mb-5"
                    style={{ fontSize: 24, color: "#414141" }}
                  >
                    {collection.name}
                  </h2>

                  <ul className="secondary-collection-float">
                    {orderByPublishedDate(collection.Contents || []).map((content, i) => {
                      return !content ? (
                        <li></li>
                      ) : (
                        <li
                          key={i}
                          className="hover:opacity-75 transition duration-150 ease-in-out relative mb-7 mx-auto "
                        >
                          <Link to={`/${collection.slug}/${content.slug}`}>
                            <div className="relative w-full">
                              {content.featuredImage ? (
                                <img
                                  className="h-full w-full object-cover"
                                  src={
                                    constants.cdnUrl + "tr:ar-16-9,w-500/" + content.featuredImage
                                  }
                                  alt="logo"
                                />
                              ) : (
                                <img
                                  className="h-full w-full object-cover"
                                  src={
                                    constants.cdnUrl + "tr:ar-16-9,w-500/" + platformData.heroImage
                                  }
                                  alt="logo"
                                />
                              )}
                            </div>
                            <div className=" absolute bottom-3">
                              {/*<h2 className="text-white font-base font-bold text-sm italic">*/}
                              {/*  {collection.name}*/}
                              {/*</h2>*/}
                              <h3
                                className="text-white px-2 py-0.5  bg-blue-600 font-bold text-base "
                                style={{ backgroundColor: `${platformData.primaryColor}` }}
                              >
                                {content.title}
                              </h3>
                              <span
                                className="text-white px-2 py-0.5 text-xs  font-semibold "
                                style={{ backgroundColor: `${platformData.darkColor}` }}
                              >
                                {content.User?.name}
                              </span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-2"></div>
          </div>
        </div>
        <UpgradeModal
          modalShowing={upgradeModalShowing}
          content={content}
          currentUser={currentUser}
          closeModal={() => {
            setUpgradeModalShowing(false);
            history.push("/");
          }}
        />
      </>
    )
  );
};

export default ContentPage;
