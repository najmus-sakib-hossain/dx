import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json() as Promise<Post[]>;
    },
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
      if (!response.ok) throw new Error("Failed to fetch post");
      return response.json() as Promise<Post>;
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: Omit<Post, "id">) => {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!response.ok) throw new Error("Failed to create post");
      return response.json() as Promise<Post>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
