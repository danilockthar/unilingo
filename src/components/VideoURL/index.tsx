import { useEffect, useReducer, useRef, useState } from "react";
import styles from "./index.module.scss";
import { uploadURL } from "../../../services/uploadURL";
import { getVideoLength } from "../../../utils/getVideoLength";
import { translateAudio } from "../../../services/translate";
import { postTextToSpeech } from "../../../services/textToSpeech";
import { getOCRFromImage } from "../../../services/getOCRFromImage";
import { initialState, reducer } from "../../lib/reducer";
import { usePostVideo } from "../../../services/useGetSetVideos";

const VideoURL = ({ videos }) => {
  const { mutate, isLoading: isMutating } = usePostVideo();
  const [state, dispatch] = useReducer(reducer, initialState);
  const imagePath = "thumbnail.jpg";
  const imageUrlWithCacheBuster = `${imagePath}?${new Date().getTime()}`;

  const audioUrl = "audio.wav";
  // Add a unique query parameter to the audio URL
  const audioUrlWithCacheBuster = `${audioUrl}?${new Date().getTime()}`;

  useEffect(() => {
    if (videos.length > 0) {
      /* setUrl(videos[0].url); */
      dispatch({ type: "SET_URL", payload: videos[0].url });
    }
  }, [videos]);

  const handleURL = ({ target: { value } }) => {
    /*  setUrl(value); */
    dispatch({ type: "SET_URL", payload: value });
  };

  const handleUpload = async () => {
    if (state.url === "") return;

    dispatch({ type: "GO_DEFAULT" });
    /*     const response = await uploadURL(state.url); */

    mutate(state.url, {
      onSuccess({ data }) {
        if (data.metadata.format) {
          dispatch({
            type: "SET_VIDEO_LENGTH",
            payload: getVideoLength(data.metadata.format.duration),
          });
          data.metadata.streams.find((elem) => {
            elem.height
              ? dispatch({ type: "SET_PIXEL_HEIGHT", payload: elem.height })
              : null;
          });
          dispatch({
            type: "SET_FILENAME",
            payload: data.metadata.format.filename,
          });
        }
      },
      onError() {
        dispatch({ type: "SET_VIDEO_LENGTH", payload: null });
      },
    });

    /* if (response.metadata.format) {
      dispatch({
        type: "SET_VIDEO_LENGTH",
        payload: getVideoLength(response.metadata.format.duration),
      });
      response.metadata.streams.find((elem) => {
        elem.height
          ? dispatch({ type: "SET_PIXEL_HEIGHT", payload: elem.height })
          : null;
      });
      dispatch({
        type: "SET_FILENAME",
        payload: response.metadata.format.filename,
      });
    } else {
      dispatch({ type: "SET_VIDEO_LENGTH", payload: null });
    } */
  };

  const handleTranslate = async () => {
    const response = await translateAudio();
    if (response.transcription) {
      dispatch({
        type: "SET_TRANSCRIPTION",
        payload: response.transcription.text,
      });
      /*     setTranscription(response.transcription.text); */
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
    const request = await postTextToSpeech(state.transcription);
    if (request.message === "Success") {
      /* setAudio(true); */
      dispatch({ type: "SET_AUDIO", payload: true });
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
      dispatch({ type: "SET_OCR", payload: response.text });
    }
  };

  return (
    <div className={styles.root}>
      <h3 className={styles.center}> Paste your video URL! </h3>

      <input onChange={handleURL} value={state.url} />
      <button onClick={handleUpload} className={styles.uploadButton}>
        {" "}
        Upload!{" "}
      </button>
      {isMutating && <p className={styles.center}>Uploading...</p>}
      <div className={styles.info}>
        {state.pixelHeight && (
          <div className={styles.box}>
            <h3>
              {" "}
              Video Length: <span> {state.videoLength} </span>{" "}
            </h3>
            <h3>
              {" "}
              Resolution:{" "}
              <span> {state.pixelHeight ? `${state.pixelHeight}p` : ""}</span>
            </h3>
            <h3> Video Thumbnail </h3>
            <img
              key={state.filename}
              className={styles.thumbnail}
              src={imageUrlWithCacheBuster}
              alt="thumbnail"
            />
            <button onClick={handleThumbnail}> Download </button>

            <button onClick={handleOCR}> Get OCR </button>
            {state.ocr && <p>{state.ocr}</p>}
          </div>
        )}

        {state.videoLength && (
          <div className={styles.box}>
            <audio id="audio" controls key={state.filename}>
              <source src={audioUrlWithCacheBuster} type="audio/mp3" />
            </audio>
            <button onClick={downloadAudio}> download audio</button>
            <button onClick={handleTranslate}>Translate audio </button>
            {state.transcription && <p>{state.transcription}</p>}

            <button onClick={handleTextToSpeech}> Text to speech </button>
            {state.audio && (
              <audio id="audio" controls>
                <source src="speech.mp3" type="audio/mp3" />
              </audio>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoURL;
