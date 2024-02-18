import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { uploadURL } from "../../../services/uploadURL";
import { getVideoLength } from "../../../utils/getVideoLength";
import { translateAudio } from "../../../services/translate";
import { postTextToSpeech } from "../../../services/textToSpeech";
import { getOCRFromImage } from "../../../services/getOCRFromImage";


const VideoURL = ({ videos }) => {
  const [url, setUrl] = useState("");
  const [videoLength, setVideoLength] = useState(null);
  const [pixelHeight, setPixelHeight] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [ocr, setOcr] = useState(null);
  const [audio, setAudio] = useState(null);

  const handleURL = ({ target: { value } }) => {
    setUrl(value);
  };

  const handleUpload = async () => {
    if (url === "") return;
    const response = await uploadURL(url);

    if (response.metadata.format) {
      setVideoLength(getVideoLength(response.metadata.format.duration));
      setPixelHeight(response.metadata.streams[0].height);
    } else {
      setVideoLength(null);
    }
  };

  const handleTranslate = async () => {
    const response = await translateAudio();
    if (response.transcription) {
      setTranscription(response.transcription.text);
    }
    console.log(response, "RESPONSE");
  };

  const downloadAudio = () => {
    const link = document.createElement("a");
    link.href = "audio.wav";
    link.download = "audio.wav";
    link.click();
  };

  const handleTextToSpeech = async () => {
    const request = await postTextToSpeech(transcription);
    if (request.message === "Success") {
      setAudio(true);
    }
  };

  const handleThumbnail = () => {
    const link = document.createElement("a");
    link.href = "thumbnail.jpg";
    link.download = "thumbnail.jpg";
    link.click();
  };

  const handleOCR = async () => {
    const response = await getOCRFromImage();
    if (response.text) {
      setOcr(response.text);
    }
  };

  return (
    <div className={styles.root}>
      <h3> Duration: {videoLength} </h3>
      <h3> Pixel Height: {pixelHeight ? `${pixelHeight}p` : ""} </h3>
      {videos.length > 0 ? <p>{videos[0].urls}</p> : <p>No videos</p>}
      {videoLength && (
        <>
          {" "}
          <audio src="audio.wav" controls />
          <button onClick={downloadAudio}> download audio</button>
        </>
      )}

      <textarea onChange={handleURL}></textarea>
      <button onClick={handleUpload}> Upload </button>

      <button onClick={handleTranslate}>Translate audio </button>
      {transcription && <p>{transcription}</p>}

      <button onClick={handleTextToSpeech}> Text to speech </button>
      {audio && (
        <audio id="audio" controls>
          <source src="speech.mp3" type="audio/mp3" />
        </audio>
      )}
      {pixelHeight && (
        <>
          <p> Thumbnail </p>
          <img
            className={styles.thumbnail}
            src="thumbnail.jpg"
            alt="thumbnail"
          />
          <button onClick={handleThumbnail}> download thumbnail</button>
        </>
      )}
      <button onClick={handleOCR}> Get OCR </button>
      {ocr && <p>{ocr}</p>}
    </div>
  );
};

export default VideoURL;
