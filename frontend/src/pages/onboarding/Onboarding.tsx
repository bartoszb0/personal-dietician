import "@ncdai/react-wheel-picker/style.css"
import { useState } from "react"

import { Button } from "@/components/ui/button"

import { ActivityStep } from "./components/ActivityStep"
import { BirthDateStep } from "./components/BirthDateStep"
import { GoalStep } from "./components/GoalStep"
import { HeightStep } from "./components/HeightStep"
import { ReviewStep } from "./components/ReviewStep"
import { SexStep } from "./components/SexStep"
import { WeightStep } from "./components/WeightStep"
import { STEPS } from "@/constants/onboarding/steps"
import type { Answers } from "@/types/onboarding"

export default function Onboarding() {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({
    birthDate: "2000-01-01",
    heightCm: "175",
    weightKg: "70",
  })

  const step = STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === STEPS.length - 1

  const set = (patch: Partial<Answers>) =>
    setAnswers((prev) => ({ ...prev, ...patch }))

  const next = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  const back = () => setStepIndex((i) => Math.max(i - 1, 0))

  const canContinue = (() => {
    switch (step) {
      case "sex":
        return answers.sex != null
      case "birthDate":
        return !!answers.birthDate
      case "height":
        return !!answers.heightCm
      case "weight":
        return !!answers.weightKg
      case "activity":
        return answers.activityLevel != null
      case "goal":
        return answers.goal != null
      case "review":
        return true
    }
  })()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* progress */}
        <div className="mb-8">
          <div className="mb-2 text-sm text-muted-foreground">
            Step {stepIndex + 1} of {STEPS.length}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* step content */}
        <div className="min-h-64">
          {step === "sex" && <SexStep answers={answers} set={set} />}
          {step === "birthDate" && <BirthDateStep answers={answers} set={set} />}
          {step === "height" && <HeightStep answers={answers} set={set} />}
          {step === "weight" && <WeightStep answers={answers} set={set} />}
          {step === "activity" && <ActivityStep answers={answers} set={set} />}
          {step === "goal" && <GoalStep answers={answers} set={set} />}
          {step === "review" && <ReviewStep answers={answers} set={set} />}
        </div>

        {/* nav */}
        <div className="mt-8 flex gap-3">
          {!isFirst && (
            <Button variant="outline" onClick={back} className="flex-1">
              Back
            </Button>
          )}
          {isLast ? (
            <Button className="flex-1" disabled={!canContinue}>
              Finish
            </Button>
          ) : (
            <Button onClick={next} disabled={!canContinue} className="flex-1">
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
