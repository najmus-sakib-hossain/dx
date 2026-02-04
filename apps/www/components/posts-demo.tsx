"use client";

import { motion } from "framer-motion";
import { usePosts, useCreatePost } from "@/lib/hooks/use-posts";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X, RefreshCw } from "lucide-react";

export function PostsDemo() {
  const { data: posts, isLoading, error } = usePosts();
  const createPost = useCreatePost();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost.mutateAsync({
      title,
      body,
      userId: 1,
    });
    setTitle("");
    setBody("");
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading posts: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                React Query Demo
              </CardTitle>
              <CardDescription>
                Data fetching with caching and automatic refetching
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(!showForm)} variant="outline">
              {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {showForm ? "Cancel" : "Create Post"}
            </Button>
          </div>
        </CardHeader>
        {showForm && (
          <CardContent>
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <Input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Post body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                className="h-24"
              />
              <Button
                type="submit"
                disabled={createPost.isPending}
                className="w-full"
              >
                {createPost.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {createPost.isPending ? "Creating..." : "Submit"}
              </Button>
            </motion.form>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts?.slice(0, 9).map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{post.body}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
