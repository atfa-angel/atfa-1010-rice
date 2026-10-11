// Set NEXT_PUBLIC_REGISTRATION_OPEN=false (and redeploy) to close registration.
export const REGISTRATION_OPEN = process.env.NEXT_PUBLIC_REGISTRATION_OPEN !== "false";
