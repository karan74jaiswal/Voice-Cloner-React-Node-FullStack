import { useState, useEffect, useRef } from "react";
import { VideoSection } from "./VideoSection";
import { Message } from "./Message";
import UploadFile from "./UploadFile";
import { Button } from "./Button";
// import UpscaleOptions from "./UpscaleOptions";
import { Hourglass } from "react-loader-spinner";
import {
  ListControls,
  ListHeader,
  ListPlayer,
  ListPlayerContext,
} from "react-list-player";
import { InputTextarea } from "primereact/inputtextarea";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useVoiceContext } from "./VoiceProvider";
import { createClient } from "@supabase/supabase-js";


const testListInfo = {};
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
export function Main() {
  const {
    text,
    setText,
    inputVoice,
    setInputVoice,
    outputVoice,
    setOutputVoice,
    isLoading,
    setIsLoading,
  } = useVoiceContext();
  const [voiceList, setVoiceList] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [playerVoice, setPlayerVoice] = useState("No Audio");
  // const [isloading, setIsLoading] = useState(false);

  const handleSubmit = async function () {
    setIsLoading(true);
    console.log(inputVoice);
    const { result } = await fetch(`https://voice-cloner-react-node-full-stack.vercel.app/api/convert`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ text, speaker: inputVoice }),
    }).then((res) => res.json());
    console.log(result);
    setAudioSrcs([result]);
    setOutputVoice(result);
    setPlayerVoice("Cloned Voice");
    setIsLoading(false);
  };
  const [testTracks, setTestTrack] = useState([]);
  const audioRef = useRef(null);
  const [audioSrcs, setAudioSrcs] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(-1); // -1 means no track is selected
  const [isPlaying, setIsPlaying] = useState(false); // play/pause
  const [isMuted, setIsMuted] = useState(false);
  async function onFileChange(file) {
    console.log(file);
    const fileName = file.name;
    setIsLoading(true);
    const { data, error } = await supabase.storage
      .from("PredefinedVoices") // Replace with your bucket name
      .upload(`uploadedVoices/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    const publicUrl = supabase.storage
      .from("PredefinedVoices")
      .getPublicUrl(`uploadedVoices/${fileName}`).data.publicUrl;

    console.log(publicUrl);
    setInputVoice(publicUrl);
    setAudioSrcs([publicUrl]);
    setOutputVoice(null);
    setIsLoading(false);
    setPlayerVoice(fileName);
    // setTestTrack([{ file }]);
  }

  useEffect(() => {
    async function fetchVoiceList() {
      const { data } = await supabase.from("Predefined Voices").select("*");
      const voices = data.map((voice) => {
        return {
          id: voice.id,
          name: voice.voiceName.slice(0, -4),
          code: voice.voiceUrl,
        };
      });
      console.log(voices);
      setVoiceList(voices);
    }

    fetchVoiceList();
  }, []);

  const handleOnPlay = (index, resume) => {
    if (index === selectedTrack && !resume) {
      audioRef.current?.load();
      audioRef.current?.play();
    }
  };

  const downloadAudio = async () => {
    if (audioRef.current) {
      // Get the audio source URL
      const response = await fetch(audioRef.current.src);
      const blob = await response.blob();

      // Create a Blob URL
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "clonedVoice.mp3"; // Set the default filename

      // Append the anchor to the document body
      document.body.appendChild(anchor);

      // Programmatically click the anchor to trigger the download
      anchor.click();

      // Remove the anchor from the document
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }
  };

  const reset = function () {
    setInputVoice(null);
    setOutputVoice(null);
    setSelectedVoice(null);
    setAudioSrcs([]);
    setSelectedTrack(-1);
    setPlayerVoice("No Audio");
    setText("");
  };
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current?.play();
      } else {
        audioRef.current?.pause();
      }
    }
  }, [isPlaying, selectedTrack]);
  return (
    <main>
      {!isLoading && (
        <>
          <Message />
          <div className="flex justify-content-center w-8">
            <FloatLabel className="w-full">
              <Dropdown
                inputId="dropdownvoices"
                value={selectedVoice}
                onChange={(e) => {
                  console.log(e.value);
                  setSelectedVoice(e.value);
                  setInputVoice(e.value.code);
                  setAudioSrcs([e.value.code]);
                  setOutputVoice(null);
                  setPlayerVoice(e.value.name);
                  // setTestTrack([e.value.code]);
                }}
                options={voiceList}
                optionLabel="name"
                className="w-full mt-3 py-3"
              />
              <label
                htmlFor="dropdownvoices"
                style={{
                  color: "rgb(186,186,186)",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Select a Voice
              </label>
            </FloatLabel>
          </div>
          <div className="my-2">OR</div>
          <UploadFile onFileChange={onFileChange} />
          <div className="flex justify-content-center w-full mt-5 gap-4 sm:flex-column md:flex-row">
            <div className="flex flex-column align-items-center">
              <FloatLabel className="mx-4">
                <InputTextarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  autoResize
                  id="inputText"
                  rows={8}
                  cols={80}
                  className="mt-2 p-2"
                />
                <label
                  htmlFor="inputText"
                  style={{
                    color: "rgb(186,186,186)",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Text
                </label>
              </FloatLabel>
              <div className="flex gap-6 mt-3 sm:flex-column-reverse md:flex-row">
                <Button className="btnBack show px-8" onClick={reset}>
                  Clear
                </Button>
                <Button
                  className="btnBack show px-8 py-3"
                  onClick={handleSubmit}
                  disabled={!inputVoice && !text}
                >
                  Clone
                </Button>
              </div>
            </div>
            <div className="flex flex-column align-items-center">
              <ListPlayerContext.Provider
                value={{
                  selectedTrack,
                  setSelectedTrack,
                  isPlaying,
                  setIsPlaying,
                  isMuted,
                  setIsMuted,
                }}
              >
                <div className="container-for-sizing-player h-11rem">
                  <ListPlayer
                    tracks={testTracks}
                    playCallback={handleOnPlay}
                    listInfo={{
                      type: "playlist",
                      name: playerVoice,
                      numTracks: 1,
                      duration: "",
                      creationDate: "",
                      imageSrc: "logo_dark.png",
                    }}
                    // kbdShortcuts={true}
                    // playerMode="miniplayer"
                  >
                    {/* <ListControls /> */}
                  </ListPlayer>
                </div>
                <audio
                  ref={audioRef}
                  src={audioSrcs[selectedTrack]}
                  muted={isMuted}
                  onEnded={() => {
                    setIsPlaying(false);
                    // setSelectedTrack(selectedTrack + 1);
                  }}
                />
              </ListPlayerContext.Provider>
              {outputVoice && (
                <Button
                  className="btnBack show px-6 py-3 mt-3"
                  onClick={downloadAudio}
                  // disabled={!inputVoice && !text}
                >
                  Download
                </Button>
              )}
            </div>
          </div>

          {/* <div className="flex gap-6 mt-3">
            <Button className="btnBack show px-8">Clear</Button>
            <Button
              className="btnBack show px-8 py-3"
              onClick={handleSubmit}
              disabled={!inputVoice && !text}
            >
              Clone
            </Button>
          </div> */}
        </>
      )}

      {isLoading && (
        <Hourglass
          visible={true}
          height="80"
          width="80"
          ariaLabel="hourglass-loading"
          wrapperStyle={{}}
          wrapperClass=""
          colors={["#fff", "#424b5a"]}
        />
      )}
    </main>
  );
}
