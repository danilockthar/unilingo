import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "react-query";

export const useGetVideo = () => {
  const { data, isLoading, error } = useQuery("videos", () =>
    fetch("/api/videos").then((res) => res.json())
  );

  return { data, isLoading, error };
};

export const usePostVideo = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: async (url) =>
      await axios.post(
        "/api/videos",
        { url },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries("videos");
    },
  });

  return { mutate, isLoading };
};

export const useTranslateAudio = () => {
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    error,
    status,
    isFetching,
    refetch: getTranslateAudio,
  } = useQuery(
    "translate-audio",
    () => fetch("/api/translate-audio").then((res) => res.json()),
    {
      enabled: false,
      onSuccess: () => {
        queryClient.invalidateQueries("translate-audio");
      },
    }
  );

  return { data, isLoading, error, getTranslateAudio, status, isFetching };
};

export const useTextToSpeech = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (text) =>
      await axios.post(
        "/api/text-to-speech",
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries("text-to-speech");
    },
  });
  return { mutate, isLoading };
};

export const useOCR = () => {
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    error,
    refetch: getOCR,
  } = useQuery(
    "ocr-image",
    () => fetch("/api/ocr-image").then((res) => res.json()),
    {
      enabled: false,
      onSuccess: () => {
        queryClient.invalidateQueries("ocr-image");
      },
    }
  );
  return { data, isLoading, error, getOCR };
};
