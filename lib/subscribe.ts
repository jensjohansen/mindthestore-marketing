import { createVerificationToken } from './verificationToken'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length <= 254 && EMAIL_RE.test(email)
}

export class SubscribeConfigError extends Error {}
export class SubscribeProviderError extends Error {}

/**
 * Adds an email to the site's Resend Audience and sends a short confirmation
 * email. This is the durable subscriber list until the Neon CRM
 * (docs/mindthestore/mindthestore-tech-design.md §2.7) is provisioned.
 *
 * Requires RESEND_API_KEY and RESEND_AUDIENCE_ID env vars. If either is
 * missing, throws SubscribeConfigError rather than pretending to succeed.
 */
export async function addSubscriber(email: string, source: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID

  if (!apiKey || !audienceId) {
    throw new SubscribeConfigError(
      'Email capture is not configured yet (missing RESEND_API_KEY / RESEND_AUDIENCE_ID).'
    )
  }

  const contactRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, unsubscribed: false }),
  })

  if (!contactRes.ok && contactRes.status !== 409) {
    const body = await contactRes.text().catch(() => '')
    throw new SubscribeProviderError(`Resend contact create failed (${contactRes.status}): ${body}`)
  }

  const fromAddress = process.env.RESEND_FROM_ADDRESS || 'MindTheStore.ai <hello@mindthestore.ai>'

  let continueUrl: string
  let subject: string
  if (source === 'business-promotion') {
    let token: string
    try {
      token = await createVerificationToken(email, source)
    } catch (err) {
      throw new SubscribeProviderError(
        `Could not create a verification token: ${err instanceof Error ? err.message : 'unknown'}`
      )
    }
    continueUrl = `https://mindthestore.ai/business-promotion/vercel?token=${encodeURIComponent(token)}`
    subject = 'Confirm your MindTheStore.ai business setup'
  } else {
    continueUrl =
      'https://mindthestore.ai/free-niche?email=' + encodeURIComponent(email) + '&source=' + encodeURIComponent(source)
    subject = 'Your free niche starting point'
  }

  const sendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: email,
      subject,
      text:
        "Thanks for signing up.\n\n" +
        "Next step: " + continueUrl + "\n\n" +
        "No payment required for this step.\n\n" +
        "— MindTheStore.ai\n\n" +
        "If you didn't request this, you can ignore this email or reply to unsubscribe.",
    }),
  })

  if (!sendRes.ok) {
    const body = await sendRes.text().catch(() => '')
    throw new SubscribeProviderError(`Resend send failed (${sendRes.status}): ${body}`)
  }
}
