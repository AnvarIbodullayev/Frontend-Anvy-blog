import { RotatingText } from "@/components/ui/shadcn-io/rotating-text";

interface MyLoadingProps {
  title: string | string[];
}

function MyLoading({ title }: MyLoadingProps) {
  return (
    <RotatingText
      text={title}
      duration={3000}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="text-4xl font-semibold"
    />
  );
}

export default MyLoading;
