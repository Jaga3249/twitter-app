import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateProfile = () => {
  const QueryClient = useQueryClient();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/api/v1/user/update", {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error?.message || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("user profile updated sucessfully");
      Promise.all([
        QueryClient.invalidateQueries({ queryKey: ["authUser"] }),
        QueryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  return { updateProfile, isUpdatingProfile };
};
export default useUpdateProfile;
