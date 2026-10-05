import { AdminPageSeo } from "./AdminPageSeo";

export function PageHeader({ title, description, actions, seoPath }) {
  return (
    <>
      <AdminPageSeo title={title} description={description} path={seoPath} />

      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">{actions}</div> : null}
      </div>
    </>
  );
}
