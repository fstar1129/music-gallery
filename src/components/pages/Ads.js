import React from "react";
import constants from "../../constants.json";
import PopupIframe from "./PopupIframe";

const ImageAd = ({ ad }) => (
  <div>
    <a target="_blank" rel="noopener noreferrer" href={ad.url}>
      <img className="w-full" alt="" src={constants.cdnUrl + ad.image + "?tr=w-500"} />
    </a>
  </div>
);

const EmbedAd = ({ ad }) => (
  <iframe title="iframe" srcDoc={ad.embed} style={{ height: "10.6rem" }} />
);

const EmbedAdFull = ({ ad }) => (
  <div style={{ height: "40rem" }}>
    <iframe className="w-full h-full" title="iframe" srcDoc={ad.embed} />
  </div>
);

const PopupEmbedAd = ({ ad, platformDark, platformPrimary }) => (
  <div style={{ backgroundColor: `${platformPrimary}` }}>
    <PopupIframe platformDark={platformDark} headline={ad.title} embedURL={ad.embed} />
  </div>
);

const Ads = ({ collection, platformDark, platformPrimary, mobile, content, chatEnabled }) => {
  const ads = collection.Ads || [];

  const images = ads.filter(ad => ad.type === "Image");

  const embeds = ads.filter(ad => ad.type === "Embed");

  const fullembed = ads.filter(ad => ad.type === "Embed Large");

  const popupembeds = ads.filter(ad => ad.type === "Popup Embed");

  return (
    <div
      className={`${mobile ? "ads-container-mobile" : "ads-container"} 
      ${!chatEnabled ? "ads-container-mobile-chat-disabled" : ""}
      mx-auto`}
    >
      {images.map((ad, i) => (
        <ImageAd ad={ad} key={i} />
      ))}

      {fullembed.map((ad, i) => (
        <EmbedAdFull ad={ad} key={i} />
      ))}

      {embeds.map((ad, i) => (
        <EmbedAd ad={ad} key={i} />
      ))}

      {popupembeds.map((ad, i) => (
        <PopupEmbedAd
          platformDark={platformDark}
          platformPrimary={platformPrimary}
          ad={ad}
          key={i}
        />
      ))}
    </div>
  );
};

export default Ads;
