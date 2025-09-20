// medipulso/api/lib/reminderClient.js
const REMINDER_URL = process.env.REMINDER_API_URL;
const REMINDER_TOKEN = process.env.REMINDER_API_TOKEN;
const ENABLED = String(process.env.REMINDERS_ENABLED).toLowerCase() === 'true';

export async function emitReminderEvent(payload) {
  if (!ENABLED) return;

  const res = await fetch(`${REMINDER_URL}/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REMINDER_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    // Do not throw to avoid breaking user requests; just log.
    console.error('[reminders] API error', res.status, txt);
    return;
  }
}
