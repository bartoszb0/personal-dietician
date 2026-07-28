import LogoutBtn from "@/components/common/LogoutBtn"

export default function Profile() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h1 className="text-xl font-medium">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Your settings and targets — coming soon.
        </p>
      </div>
      <LogoutBtn />
    </div>
  )
}
