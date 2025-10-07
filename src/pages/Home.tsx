import { AppleHelloEnglishEffect } from "@/components/ui/shadcn-io/apple-hello-effect"

function Home() {
    return (
        <div className="flex items-center justify-center w-full min-h-100">
            <AppleHelloEnglishEffect speed={1.1} />
        </div>
    )
}

export default Home