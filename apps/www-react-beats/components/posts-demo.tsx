"use client";

import { motion } from "framer-motion";
import { AlertCircle, Loader2, Plus, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VALIDATION_LIMITS } from "@/lib/constants";
import { useCreatePost, usePosts } from "@/lib/hooks/use-posts";
import { logger } from "@/lib/logger";
import { createPostSchema } from "@/lib/validations/post";

export function PostsDemo() {
  const { data: posts, isLoading, error, refetch } = usePosts();
  const createPost = useCreatePost();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    try {
      const validated = createPostSchema.parse({
        title,
        body,
        userId: 1,
      });

      await createPost.mutateAsync(validated);
      setTitle("");
      setBody("");
      setShowForm(false);
    } catch (err) {
      if (err instanceof Error) {
        setValidationError(err.message);
        logger.error("Failed to create post", err);
      }
    }
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
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Error Loading Posts</CardTitle>
          </div>
          <CardDescription>{error.message || "Failed to fetch posts from the API"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
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
              <CardDescription>Data fetching with caching and automatic refetching</CardDescription>
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
              {validationError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{validationError}</p>
                </div>
              )}
              <Input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={VALIDATION_LIMITS.POST_TITLE_MAX}
                required
              />
              <Textarea
                placeholder="Post body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="h-24"
                maxLength={VALIDATION_LIMITS.POST_BODY_MAX}
                required
              />
              <Button type="submit" disabled={createPost.isPending} className="w-full">
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
