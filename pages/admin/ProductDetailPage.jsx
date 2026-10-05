import { useParams } from "react-router-dom";
import { ProductDetailView } from "../../components/products/ProductDetailView";
import { useProductDetailPage } from "../../hooks/products/useProductDetailPage";

export function ProductDetailPage() {
  const { id } = useParams();
  const pageState = useProductDetailPage(id);

  return (
    <ProductDetailView
      item={pageState.item}
      loading={pageState.loading}
      error={pageState.error}
    />
  );
}
