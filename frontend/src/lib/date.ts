export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function toMonthParam(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

export function parseISODate(value?: string): Date | undefined {
  if (!value) return undefined
  // handle both "YYYY-MM-DD" and full ISO "YYYY-MM-DDT..." (the API returns the latter)
  const [year, month, day] = value.slice(0, 10).split("-").map(Number)
  return new Date(year, month - 1, day)
}

function ordinal(day: number): string {
  const suffixes = ["th", "st", "nd", "rd"]
  const remainder = day % 100
  return `${day}${suffixes[(remainder - 20) % 10] ?? suffixes[remainder] ?? suffixes[0]}`
}

/** Formats an ISO date string as e.g. "18th December, 2002". */
export function formatBirthDate(value?: string): string {
  const date = parseISODate(value)
  if (!date) return "—"
  const month = date.toLocaleString("en-US", { month: "long" })
  return `${ordinal(date.getDate())} ${month}, ${date.getFullYear()}`
}
