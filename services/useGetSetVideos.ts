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

  console.log("entry");
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
  });

  return { mutate, isLoading };
};
