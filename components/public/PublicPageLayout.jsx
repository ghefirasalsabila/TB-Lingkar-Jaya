import { cn } from "../../lib/classnames";
import { PublicHomeFooter } from "./PublicHomeFooter";
import { PublicHomeHeader } from "./PublicHomeHeader";

export function PublicPageLayout({ children, mainClassName }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4efe6_0%,#faf7f1_28%,#ffffff_100%)] text-foreground dark:bg-[linear-gradient(180deg,#101514_0%,#121a19_32%,#151e1d_100%)]">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-10 px-4 py-4 sm:px-5 lg:px-6 lg:py-6 xl:px-8">
        <PublicHomeHeader />
        <main className={cn("space-y-14 lg:space-y-18", mainClassName)}>{children}</main>
        <PublicHomeFooter />
      </div>
    </div>
  );
}
