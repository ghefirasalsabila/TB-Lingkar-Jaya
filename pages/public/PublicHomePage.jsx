import heroLingkarJaya from "../../assets/hero-image-lingkar-jaya.jpg";
import { PublicHighlightsSection } from "../../components/public/PublicHighlightsSection";
import { PublicHeroSection } from "../../components/public/PublicHeroSection";
import { PublicPageLayout } from "../../components/public/PublicPageLayout";
import { PublicPageSeo } from "../../components/public/PublicPageSeo";
import { PublicProductsSection } from "../../components/public/PublicProductsSection";
import { PublicStoreGallerySection } from "../../components/public/PublicStoreGallerySection";
import { PUBLIC_SEO_DESCRIPTION, PUBLIC_SEO_TITLE } from "../../features/public/public-utils";
import { usePublicHomePage } from "../../hooks/public/usePublicHomePage";

export function PublicHomePage() {
  const pageState = usePublicHomePage();

  return (
    <>
      <PublicPageSeo
        siteUrl={pageState.siteUrl}
        ogImageUrl={pageState.ogImageUrl}
        title={PUBLIC_SEO_TITLE}
        description={PUBLIC_SEO_DESCRIPTION}
        path="/"
      />
      <PublicPageLayout>
          <section className="space-y-8 lg:space-y-10">
            <PublicHeroSection heroImageSrc={heroLingkarJaya} />
            <PublicHighlightsSection
              loading={pageState.loading}
              totalProducts={pageState.totalProducts}
              highlightedCount={pageState.highlightedProducts.length}
              startingPriceLabel={pageState.startingPriceLabel}
            />
          </section>

          <PublicStoreGallerySection />

          <PublicProductsSection
            loading={pageState.loading}
            error={pageState.error}
            highlightedProducts={pageState.highlightedProducts}
          />
      </PublicPageLayout>
    </>
  );
}
