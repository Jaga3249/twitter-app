import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/dummy/db/Dummy";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";

const Posts = ({ feedType }) => {
  const [postData, setPostData] = useState([]);

  const getPostEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      default:
        return "/api/posts/all";
    }
  };
  const POST_ENDPOINT = getPostEndPoint();
  const { isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        setPostData(data?.data?.posts);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
  useEffect(() => {
    refetch();
  }, [feedType, refetch]);
  return (
    <>
      {isLoading ||
        (isRefetching && (
          <div className="flex flex-col justify-center">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ))}
      {!isLoading && !isRefetching && postData?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && postData && (
        <div>
          {postData.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
