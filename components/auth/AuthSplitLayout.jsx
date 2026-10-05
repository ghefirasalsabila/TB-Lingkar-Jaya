import heroLingkarJaya from "../../assets/hero-image-lingkar-jaya.jpg";
import { BrandMark } from "../common/BrandMark";
import { ThemeToggle } from "../common/ThemeToggle";
import { BRAND_NAME } from "../../constants/brand";

export function AuthSplitLayout({ heroTitle, children }) {
  return (
    <div className="min-h-screen bg-[#f6f3ed] px-4 py-4 dark:bg-[#111716] sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col justify-center">
        <div className="mb-4 flex justify-end">
          <ThemeToggle />
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#161d1c]">
          <div className="grid min-h-[720px] lg:grid-cols-[1.05fr_0.95fr]">
            <section className="relative hidden lg:block">
              <img
                src={heroLingkarJaya}
                alt={BRAND_NAME}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
              <div className="absolute inset-x-0 top-0 p-8">
                <div className="flex items-center gap-3">
                  <BrandMark className="size-11 rounded-2xl" decorative />
                  <p className="text-sm font-semibold tracking-tight text-white drop-shadow-md">{BRAND_NAME}</p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-8">
                <h1 className="max-w-md text-4xl font-semibold leading-tight text-white drop-shadow-md">{heroTitle}</h1>
              </div>
            </section>

            <section className="flex items-center px-6 py-8 sm:px-10 lg:px-12">
              <div className="mx-auto w-full max-w-md">{children}</div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
