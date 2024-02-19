export const initialState = {
  url: "",
  videoLength: null,
  pixelHeight: null,
  filename: null,
  transcription: null,
  ocr: null,
  audio: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case "GO_DEFAULT":
      return { ...initialState, url: state.url };
    case "SET_URL":
      return { ...state, url: action.payload };
    case "SET_VIDEO_LENGTH":
      return { ...state, videoLength: action.payload };
    case "SET_PIXEL_HEIGHT":
      return { ...state, pixelHeight: action.payload };
    case "SET_FILENAME":
      return { ...state, filename: action.payload };
    case "SET_TRANSCRIPTION":
      return { ...state, transcription: action.payload };
    case "SET_OCR":
      return { ...state, ocr: action.payload };
    case "SET_AUDIO":
      return { ...state, audio: action.payload };
    default:
      return state;
  }
}
