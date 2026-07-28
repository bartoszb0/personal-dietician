import { useQuery } from "@tanstack/react-query"

import { getMe } from "@/api/auth"
import { getCurrentNutritionTarget } from "@/api/nutrition"
import { getProfileData } from "@/api/profile"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import LogoutBtn from "@/components/common/LogoutBtn"

import AccountCard from "./components/AccountCard"
import DailyTargets from "./components/DailyTarget"
import ProfileDetails from "./components/ProfileDetails"

export default function Profile() {
  const { data: profile, isPending: profilePending } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfileData(),
  })
  const { data: me, isPending: mePending } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
  })
  const { data: target, isPending: targetPending } = useQuery({
    queryKey: ["current-target"],
    queryFn: () => getCurrentNutritionTarget(),
  })

  if (profilePending || mePending || targetPending) return <LoadingSpinner />
  if (!profile || !me || !target) return null

  return (
    <div className="flex flex-col gap-6 p-6">
      <AccountCard email={me.email} />
      <ProfileDetails profile={profile} />
      <DailyTargets target={target} />
      <LogoutBtn />
    </div>
  )
}
