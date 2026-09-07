import { ScanBarcode } from "lucide-react"

export default function Scanner() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ScanBarcode className="size-7" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-medium">Scanner</h1>
        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          Work in progress
        </span>
      </div>

      <p className="max-w-xs text-sm text-muted-foreground">
        Barcode scanning isn't ready yet. Soon you'll be able to point your
        camera at a product and log it straight into your day.
      </p>
    </div>
  )
}
