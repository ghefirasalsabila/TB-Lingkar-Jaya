import storePvcShelfImage from "../../assets/store/store-pvc-shelf.jpg";
import storeShowcaseOverviewImage from "../../assets/store/store-showcase-overview.jpg";
import storeSuppliesCornerImage from "../../assets/store/store-supplies-corner.jpg";

const galleryItems = [
  {
    alt: "Area utama toko dengan rak dan stok material",
    className: "lg:row-span-2",
    imageClassName: "aspect-[16/11] lg:aspect-auto lg:h-full",
    src: storeShowcaseOverviewImage,
  },
  {
    alt: "Rak perlengkapan dan material bangunan di dalam toko",
    className: "",
    imageClassName: "aspect-[16/10]",
    src: storeSuppliesCornerImage,
  },
  {
    alt: "Rak pipa PVC dan perlengkapan terkait",
    className: "",
    imageClassName: "aspect-[16/10]",
    src: storePvcShelfImage,
  },
];

export function PublicStoreGallerySection() {
  return (
    <section aria-labelledby="store-gallery-heading" className="space-y-5 lg:space-y-6">
      <h2 id="store-gallery-heading" className="text-2xl font-semibold text-foreground sm:text-3xl">
        Area Toko
      </h2>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.95fr]">
        {galleryItems.map((item) => (
          <div
            key={item.alt}
            className={`overflow-hidden rounded-[1.5rem] border border-stone-200/80 bg-white dark:border-white/10 dark:bg-white/6 lg:rounded-[2rem] ${item.className}`}
          >
            <img
              src={item.src}
              alt={item.alt}
              className={`h-full w-full object-cover ${item.imageClassName}`}
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
