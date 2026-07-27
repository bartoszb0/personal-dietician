import LogoutBtn from "@/components/common/LogoutBtn"

export default function Home() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <LogoutBtn />
      </div>
    </div>
  )
}
