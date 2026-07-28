import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AccountCard({ email }: { email: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Account</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Email</span>
          <span className="font-medium">{email}</span>
        </div>
      </CardContent>
    </Card>
  )
}
