import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemHeader,
    ItemTitle,
} from "@/components/ui/item"
import api from "@/utils/axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

interface Post {
    id: string
    title: string
    content: string
    image?: string
}

interface GlobalRes {
    message: string
    posts: Post[]
}

function GlobalField() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get<GlobalRes>("/post", {})

                setPosts(res.data.posts)
                setLoading(false)

                toast.success(res.data.message)
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        }
        fetchPosts()
    }, [])

    // handle Each Post
    const handleEachPost = (id: string) => {
        navigate(`/eachpost/${id}`)
    }

    return (
        <>
            <div>GlobalPosts</div>

            {!loading ? (
                <div className="mt-8 flex w-full max-w-6xl flex-col gap-6">
                    <ItemGroup className="grid grid-cols-3 gap-6">
                        {/* posts => map */}
                        {posts.map((post) => (
                            <Item onClick={() => handleEachPost(post.id)} key={post.id} variant="outline" className="h-full cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                                <ItemHeader>
                                    <img
                                        src={
                                            post.image
                                                ? import.meta.env.VITE_BASE_URL_WITHOUT_API + "/uploads/" + post.image
                                                : "https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop"
                                        }
                                        alt={post.title}
                                        className="aspect-video w-full rounded-md object-cover"
                                    />
                                </ItemHeader>
                                <ItemContent className="p-4">
                                    <ItemTitle className="text-lg font-semibold mb-2">{post.title}</ItemTitle>
                                    <ItemDescription className="text-gray-700 text-sm line-clamp-3 text-left">
                                        {post.content}
                                    </ItemDescription>
                                </ItemContent>
                            </Item>
                        ))}
                    </ItemGroup>
                </div>
            ) : (
                <Empty className="w-full">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Spinner />
                        </EmptyMedia>
                        <EmptyDescription>
                            Please wait while we process your request. Do not refresh the page.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}


        </>
    )
}

export default GlobalField