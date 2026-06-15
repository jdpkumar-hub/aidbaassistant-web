type AuthEmail = {
  to: string;
  url: string;
};

export async function sendVerificationEmail({ to, url }: AuthEmail) {
  console.info("[auth] verification email", { to, url });
}

export async function sendPasswordResetEmail({ to, url }: AuthEmail) {
  console.info("[auth] password reset email", { to, url });
}
