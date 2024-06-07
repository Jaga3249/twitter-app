import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
  const QueryClient = useQueryClient();
  const { mutate: follow, isPending: loading } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/v1/user/follow/${userId}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error.message || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      Promise.all([
        QueryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        QueryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { follow, loading };
};
export default useFollow;
