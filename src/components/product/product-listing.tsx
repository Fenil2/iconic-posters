import Link from "next/link";
import { Frown } from "lucide-react";
import { FilterSidebar } from "./filter-sidebar";
import { ListingToolbar } from "./listing-toolbar";
import { ProductGrid } from "./product-grid";
import { Pagination } from "./pagination";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/server/queries/products";
import { safe } from "@/server/queries/content";
import { countActiveFilters } from "@/lib/filters";
import type { ProductFilters } from "@/types";

interface ProductListingProps {
  filters: ProductFilters;
  title: string;
  description?: string;
  breadcrumb?: { label: string; href: string }[];
  hideSidebar?: boolean;
}

/**
 * Full catalogue listing surface: heading, faceted sidebar, sort toolbar,
 * product grid and pagination. Reused by category, search and collection pages.
 */
export async function ProductListing({
  filters,
  title,
  description,
  breadcrumb,
  hideSidebar = false,
}: ProductListingProps) {
  const { products, total, page, pageCount } = await safe(
    () => getProducts(filters),
    { products: [], total: 0, page: 1, pageCount: 1 },
  );
  const activeCount = countActiveFilters(filters);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      {/* Breadcrumb */}
      {breadcrumb && (
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          {breadcrumb.map((b) => (
            <span key={b.href} className="flex items-center gap-1.5">
              <span>/</span>
              <Link href={b.href} className="hover:text-foreground">
                {b.label}
              </Link>
            </span>
          ))}
        </nav>
      )}

      <header className="mb-6 max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </header>

      <div
        className={
          hideSidebar
            ? ""
            : "grid gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]"
        }
      >
        {!hideSidebar && (
          <aside className="hidden lg:block">
            <div className="sticky top-[88px] max-h-[calc(100dvh-100px)] overflow-y-auto scrollbar-thin pr-2">
              <FilterSidebar />
            </div>
          </aside>
        )}

        <div>
          <ListingToolbar total={total} activeCount={activeCount} />

          {products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              <div className="mt-12">
                <Pagination page={page} pageCount={pageCount} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-24 text-center">
              <Frown className="size-10 text-muted-foreground" />
              <div>
                <p className="font-medium">No posters match these filters</p>
                <p className="text-sm text-muted-foreground">
                  Try widening your price range or clearing a few filters.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/shop">Browse all posters</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
