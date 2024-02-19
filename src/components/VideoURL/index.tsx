import { useEffect, useReducer, useRef, useState } from "react";
import styles from "./index.module.scss";
import { getVideoLength } from "../../../utils/getVideoLength";
import { initialState, reducer } from "../../lib/reducer";
import {
  useOCR,
  usePostVideo,
  useTextToSpeech,
  useTranslateAudio,
} from "../../../services/useGetSetVideos";
import { roboto_mono } from "../../../utils/fonts";

const VideoURL = ({ videos }) => {
  const {
    data: dataTranslateAudio,
    isFetching,
    getTranslateAudio,
  } = useTranslateAudio();

  const { mutate: postTextToSpeech, isLoading: isLoadingTextToSpeech } =
    useTextToSpeech();

  const {
    data: dataOCR,
    isFetching: isLoadingOCR,
    getOCR,
    isFetched: isOCRFetched,
  } = useOCR();
  const { mutate, isLoading: isMutating } = usePostVideo();
  const [state, dispatch] = useReducer(reducer, initialState);

  const imagePath = "thumbnail.jpg";
  const imageUrlWithCacheBuster = `${imagePath}?${new Date().getTime()}`;

  const audioUrl = "audio.wav";
  const audioUrlWithCacheBuster = `${audioUrl}?${new Date().getTime()}`;

  useEffect(() => {
    if (videos.length > 0) {
      dispatch({ type: "SET_URL", payload: videos[0].url });
    }
  }, [videos]);

  const handleURL = ({ target: { value } }) => {
    dispatch({ type: "SET_URL", payload: value });
  };

  const handleUpload = async () => {
    if (state.url === "") return;

    dispatch({ type: "GO_DEFAULT" });

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
  };

  useEffect(() => {
    if (dataTranslateAudio?.transcription?.text) {
      dispatch({
        type: "SET_TRANSCRIPTION",
        payload: dataTranslateAudio.transcription.text,
      });
    }
  }, [dataTranslateAudio]);

  const downloadAudio = () => {
    const link = document.createElement("a");
    link.href = "audio.wav";
    link.download = "audio.wav";
    link.click();
  };

  const handleTextToSpeech = async () => {
    postTextToSpeech(state.transcription, {
      onSuccess: ({ data }) => {
        if (data.message === "Success") {
          dispatch({ type: "SET_AUDIO", payload: true });
        }
      },
    });
  };

  const handleThumbnail = () => {
    const link = document.createElement("a");
    link.href = "thumbnail.jpg";
    link.download = "thumbnail.jpg";
    link.click();
  };

  useEffect(() => {
    if (dataOCR?.text) {
      dispatch({ type: "SET_OCR", payload: dataOCR.text });
    } else {
      dispatch({ type: "SET_NOT_OCR" });
    }
  }, [dataOCR]);

  return (
    <div className={styles.root}>
      <h3 className={styles.center}> Paste your video URL! </h3>

      <input onChange={handleURL} value={state.url} />
      <button onClick={handleUpload} className={styles.uploadButton}>
        {" "}
        ANALYZE VIDEO{" "}
      </button>
      {isMutating && <p className={styles.center}>Uploading...</p>}
      <div className={styles.info}>
        {state.pixelHeight && (
          <div className={styles.box}>
            <h3 className={styles.infovideo}>
              {" "}
              Video Length: <span> {state.videoLength} </span>{" "}
            </h3>
            <h3 className={styles.infovideo}>
              {" "}
              Resolution:{" "}
              <span> {state.pixelHeight ? `${state.pixelHeight}p` : ""}</span>
            </h3>
            <figure>
              <img
                key={state.filename}
                className={styles.thumbnail}
                src={imageUrlWithCacheBuster}
                alt="thumbnail"
              />
              <figcaption> Video Thumbnail</figcaption>
            </figure>

            <div className={styles.wrapper}>
              <button className={styles.fieldButton} onClick={handleThumbnail}>
                {" "}
                DOWNLOAD{" "}
              </button>
              <section>
                <button className={styles.fieldButton} onClick={() => getOCR()}>
                  {" "}
                  GET OCR{" "}
                </button>
                {isLoadingOCR && <span className={styles.loader}></span>}
              </section>
            </div>

            {state.ocr && (
              <span className={roboto_mono.className}>{state.ocr}</span>
            )}
          </div>
        )}

        {state.videoLength && (
          <div className={styles.box}>
            <audio id="audio" controls key={state.filename}>
              <source src={audioUrlWithCacheBuster} type="audio/mp3" />
            </audio>
            <div className={styles.wrapper}>
              <button className={styles.fieldButton} onClick={downloadAudio}>
                {" "}
                DOWNLOAD
              </button>
              <section>
                <button
                  className={styles.fieldButton}
                  onClick={() => getTranslateAudio()}
                >
                  TRANSLATE
                </button>
                {isFetching && <span className={styles.loader}></span>}
              </section>
              <section>
                <button
                  className={styles.fieldButton}
                  onClick={handleTextToSpeech}
                >
                  {" "}
                  TEXT TO SPEECH{" "}
                </button>
                {isLoadingTextToSpeech && (
                  <span className={styles.loader}></span>
                )}
              </section>
            </div>

            {state.transcription && <p>{state.transcription}</p>}

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
