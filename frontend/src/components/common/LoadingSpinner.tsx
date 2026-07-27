import { Spinner } from "../ui/spinner"

export default function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="size-14" />
    </div>
  )
}
