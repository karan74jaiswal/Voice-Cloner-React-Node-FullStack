// import {
//   ReactCompareSlider,
//   ReactCompareSliderImage,
// } from "react-compare-slider";

import { useVoiceContext } from "./VoiceProvider";
export function VideoSection() {
  const { inputVoice, outputVoice } = useVoiceContext();
  // const videoUrl = URL.createObjectURL(video);
  return (
    <section className="imageSection">
      {/* <video
        controls
        width={850}
        height={500}
        muted
        className="original-image"
        id="blurred"
        style={{
          border: "none",
          borderRadius: "20px",
        }}
      >
        <source src={videoUrl} type="video/mp4"></source>
        <track
          kind="subtitles"
          src={newVideo}
          srcLang="en"
          label="English"
          default
        ></track>
      </video> */}
      {/* <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={imageUrl} alt="Image one" />}
        itemTwo={<ReactCompareSliderImage src={newImage} alt="Image two" />}
        transition="1s ease-in-out"
        style={{
          width: "70%",
          height: "70%",
        }}
      /> */}
    </section>
  );
}
