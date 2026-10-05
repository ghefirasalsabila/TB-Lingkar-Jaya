import { ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { BRAND_NAME, BRAND_PHONE_LINK } from "../../constants/brand";

export function PublicHeroSection({ heroImageSrc }) {
  return (
    <section>
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-10 xl:gap-14">
        <div className="order-2 space-y-4 lg:order-1">
          <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            {BRAND_NAME}
          </h1>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 lg:text-lg">
            Material, PVC, paku, listrik, cat, dan kebutuhan proyek harian.
          </p>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-6 sm:w-auto">
              <a href="#produk">
                Lihat Produk
                <ArrowRight data-icon="inline-end" />
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="self-center justify-center px-0 text-base text-foreground hover:bg-transparent sm:self-auto sm:w-auto sm:justify-start"
            >
              <a href={`tel:${BRAND_PHONE_LINK}`}>Hubungi Toko</a>
            </Button>
          </div>
        </div>

        <div className="order-1 overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white dark:border-white/10 dark:bg-white/6 lg:order-2 lg:rounded-[2rem]">
          <img
            src={heroImageSrc}
            alt={BRAND_NAME}
            className="aspect-[4/3] h-full w-full object-cover"
            decoding="async"
            fetchPriority="high"
            sizes="(min-width: 1280px) 56rem, (min-width: 1024px) 52vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
