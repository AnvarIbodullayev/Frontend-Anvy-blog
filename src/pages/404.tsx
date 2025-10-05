import MyLoading from "@/components/common/MyLoading";
import { Link } from "react-router-dom";

import { LiquidButton } from "@/components/ui/shadcn-io/liquid-button";

function PageNotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <MyLoading title={["404", "Page not found", "Back to home page"]} />
      <div className="mt-10">
        <Link to={"/"}>
          <LiquidButton>Home page</LiquidButton>
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
