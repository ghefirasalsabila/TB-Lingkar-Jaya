import { Loader2, Save, SaveAll } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ProductFormFields } from "./ProductFormFields";

export function ProductFormCard({
  formLoading,
  form,
  categories,
  categoriesLoading,
  isOwner,
  isEditMode,
  saving,
  getLabelClassName,
  isFieldInvalid,
  onSubmit,
  onSaveAndAddAnother,
  onFormChange,
  onFieldBlur,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Formulir Barang</CardTitle>
      </CardHeader>
      <CardContent>
        {formLoading ? (
          <p className="mb-4 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
            Memuat data produk...
          </p>
        ) : null}
        <form className="space-y-6" noValidate onSubmit={onSubmit}>
          <ProductFormFields
            form={form}
            categories={categories}
            categoriesLoading={categoriesLoading}
            isOwner={isOwner}
            getLabelClassName={getLabelClassName}
            isFieldInvalid={isFieldInvalid}
            onFormChange={onFormChange}
            onFieldBlur={onFieldBlur}
          />

          <div className="flex flex-wrap justify-end gap-2">
            {!isEditMode ? (
              <Button type="button" variant="outline" onClick={onSaveAndAddAnother} disabled={saving || formLoading}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <SaveAll className="h-4 w-4" />}
                {saving ? "Menyimpan..." : "Simpan dan Tambahkan Lainnya"}
              </Button>
            ) : null}
            <Button type="submit" disabled={saving || formLoading}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
