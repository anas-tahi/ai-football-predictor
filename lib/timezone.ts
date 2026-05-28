export function formatInUserTimezone(utcDate: string, locale = "en-US") {
  const date = new Date(utcDate);
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function todayIsoDate() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}
