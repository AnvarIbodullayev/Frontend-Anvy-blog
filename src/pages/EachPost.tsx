import api from "@/utils/axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface EachPostRes {
    title: string;
    content: string;
    image: string;
    User: {
        username: string
    }
}

function EachPost() {
    const [post, setPost] = useState<EachPostRes | null>(null)
    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        const fetchApiEachPost = async () => {
            try {
                const res = await api.get(`/post/${id}`, {})
                setPost(res.data.post)
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        }

        fetchApiEachPost()
    }, [])
    console.log(post);


    return (
        <div className="flex justify-center">
            <div className="sm:w-[80%] flex flex-col text-center items-center px-4 md:px-8 lg:px-16">
                <div className="w-full text-left">
                    <p className="text-muted-foreground text-sm mt-20">
                        Author: {post?.User.username}
                    </p>
                </div>

                <h1 className="mt-10 scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                    {post?.title}
                </h1>

                {/* image */}
                <img
                    className="max-w-6/12 mt-10 w-auto h-auto rounded-md shadow-md object-contain"
                    src={"https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop"}
                    alt="Image not found"
                />

                <p className="leading-7 mt-6 text-left">{post?.content}</p>

            </div>
        </div>
    )
}

export default EachPost