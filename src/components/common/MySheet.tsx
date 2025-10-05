import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import api from "@/utils/axios";
import { toast } from "sonner";

interface postRes {
  message: string;
}

export function MySheet() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (file) formData.append("image", file);

      const res = await api.post<postRes>("/post/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Create Post</SheetTitle>
          <SheetDescription>
            Fill out the details of your post. Click save when done.
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          {/* Title */}
          <div className="grid gap-3">
            <Label htmlFor="post-title">Title</Label>
            <Input
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              id="post-title"
              placeholder="Post title"
            />
          </div>

          {/* Content */}
          <div className="grid gap-3">
            <Label htmlFor="post-content">Content</Label>
            <Textarea
              title="content"
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              id="post-content"
              placeholder="Write your post here..."
            />
          </div>

          {/* Image */}
          <div className="grid gap-3">
            <Label htmlFor="post-image">Image</Label>
            <Input
              type="file"
              id="post-image"
              accept="image/*"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
          </div>
        </div>

        <SheetFooter className="flex gap-2">
          <Button onClick={handlePost} type="submit">
            Post
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </>
  );
}
