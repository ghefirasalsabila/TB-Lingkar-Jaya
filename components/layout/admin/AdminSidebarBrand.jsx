import { BrandMark } from "../../common/BrandMark";
import { BRAND_SHORT_NAME } from "../../../constants/brand";

export function AdminSidebarBrand() {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 backdrop-blur-sm group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0 group-data-[collapsible=icon]:backdrop-blur-none">
      <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
        <BrandMark className="size-10 shrink-0 rounded-2xl" decorative />

        <div className="min-w-0 group-data-[collapsible=icon]:hidden">
          <p className="text-sm font-semibold tracking-wide text-white">{BRAND_SHORT_NAME}</p>
        </div>
      </div>
    </div>
  );
}
