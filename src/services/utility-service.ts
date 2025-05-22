const isNullOrEmpty = (input: any) => {
  return (
    input === null ||
    input === "null" ||
    typeof input === "undefined" ||
    input === "" ||
    input === " " ||
    input.length === 0 ||
    input === "null null" ||
    input === "undefined undefined"
  )
}

const appendLeadingZero = (n: number) => (n < 10 ? `0${n}` : `${n}`)

const getFormattedTimeDuration = (
  duration: number,
  removeZeroHours = true
): string => {
  const hours = Math.floor(duration / 3600)
  const leftOverMinutes = duration - hours * 3600
  const minutes = Math.floor(leftOverMinutes / 60)
  const seconds = leftOverMinutes - minutes * 60

  return removeZeroHours && hours === 0
    ? `${minutes}:${appendLeadingZero(seconds)}`
    : `${hours}:${appendLeadingZero(minutes)}:${appendLeadingZero(seconds)}`
}

const getFormattedDate = (dateTimeValue: Date): string => {
  if (dateTimeValue) {
    const dateTime = new Date(dateTimeValue.valueOf())
    const options: Intl.DateTimeFormatOptions = {
      // hour12: true,
      // hour: "numeric",
      // minute: "2-digit",
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return dateTime.toLocaleDateString("en-US", options)
  }
  return ""
}

const getFormattedDateTime = (dateTimeValue: Date): string => {
  if (dateTimeValue) {
    const dateTime = new Date(dateTimeValue.valueOf())
    const options: Intl.DateTimeFormatOptions = {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return dateTime.toLocaleDateString("en-US", options)
  }
  return ""
}

const filterDummyJerseyNumbers = (jerseyNumber: string) => {
  return jerseyNumber && jerseyNumber != "9999" ? jerseyNumber : ""
}

export const utilService = {
  isNullOrEmpty,
  getFormattedTimeDuration,
  getFormattedDateTime,
  getFormattedDate,
  filterDummyJerseyNumbers,
}
