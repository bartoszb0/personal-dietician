import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-medium">404</h1>
      <p className="text-sm text-muted-foreground">
        This page does not exist.
      </p>
      <Button variant="outline" render={<Link to="/" />}>
        Go home
      </Button>
    </div>
  )
}
