"use client";

import {
  useState,
  useCallback,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { createClient } from "@/lib/supabase/client";

interface RegisterFormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  jobTitle: string;
  country: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  company?: string;
  jobTitle?: string;
  country?: string;
  form?: string;
}

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Netherlands",
  "Ireland",
  "Australia",
  "Singapore",
  "India",
  "Japan",
  "Brazil",
  "Mexico",
  "Sweden",
  "Switzerland",
  "United Arab Emirates",
  "South Africa",
  "Israel",
  "Spain",
  "Italy",
  "Other",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "w-full rounded-lg border bg-navy-950 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-silver-400 transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20";

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-silver-300"
    >
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

function TextInput({
  id,
  name,
  type = "text",
  value,
  placeholder,
  autoComplete,
  error,
  onChange,
}: {
  id: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={Boolean(error)}
      className={`${fieldClass} ${
        error ? "border-red-500/60" : "border-white/10"
      }`}
    />
  );
}

function PasswordInput({
  id,
  name,
  value,
  placeholder,
  autoComplete,
  error,
  onChange,
}: {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className={`${fieldClass} pr-10 ${
          error ? "border-red-500/60" : "border-white/10"
        }`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-400 hover:text-silver-300"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function CountrySelect({
  id,
  name,
  value,
  error,
  onChange,
}: {
  id: string;
  name: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={Boolean(error)}
      className={`${fieldClass} ${
        error ? "border-red-500/60" : "border-white/10"
      }`}
    >
      <option value="" className="bg-navy-900 text-silver-400">
        Select your country
      </option>
      {COUNTRIES.map((country) => (
        <option key={country} value={country} className="bg-navy-900">
          {country}
        </option>
      ))}
    </select>
  );
}

function OAuthButton({
  icon,
  label,
  onClick,
  disabled,
  variant = "dark",
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "dark" | "light";
}) {
  const base =
    "flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "light"
      ? "border-white/15 bg-white text-navy-950 hover:bg-silver-300"
      : "border-white/15 bg-navy-950 text-white hover:bg-navy-800";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`${base} ${styles}`}
    >
      {icon}
      {label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.86z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.92H1.3v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.31 14.33A7.2 7.2 0 0 1 4.9 12c0-.81.14-1.6.4-2.33V6.58H1.3A11.98 11.98 0 0 0 0 12c0 1.93.47 3.76 1.3 5.42l4.01-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.3 6.58l4.01 3.09C6.25 6.85 8.89 4.75 12 4.75z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

function validate(form: RegisterFormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) errors.fullName = "Full name is required.";

  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!form.company.trim()) errors.company = "Company is required.";
  if (!form.jobTitle.trim()) errors.jobTitle = "Job title is required.";
  if (!form.country) errors.country = "Select a country.";

  return errors;
}

const INITIAL_FORM: RegisterFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  company: "",
  jobTitle: "",
  country: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(
    null
  );

  async function handleOAuth(provider: "google" | "github") {
    setOauthLoading(provider);
    setErrors({});

    const supabase = createClient();
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("next", "/dashboard");

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl.toString() },
    });

    if (error) {
      setErrors({ form: error.message });
      setOauthLoading(null);
    }
  }

  const updateField = useCallback(
    (field: keyof RegisterFormState) => (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    },
    []
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: form.email.trim(),
          password: form.password,
          options: {
            data: { full_name: form.fullName.trim() },
          },
        });

      if (signUpError) {
        setErrors({ form: signUpError.message });
        return;
      }

      const authUserId = signUpData.user?.id;
      if (!authUserId) {
        setErrors({
          form: "Account created, but confirmation is required before you can sign in.",
        });
        return;
      }

      const { error: usersError } = await supabase.from("users").insert({
        id: authUserId,
        auth_user_id: authUserId,
        email: form.email.trim(),
        name: form.fullName.trim(),
        role: "customer",
        provider: "email",
        created_at: new Date().toISOString(),
      });

      if (usersError) {
        setErrors({ form: usersError.message });
        return;
      }

      const { error: metaError } = await supabase.from("users_meta").insert({
        auth_user_id: authUserId,
        email: form.email.trim(),
        company_name: form.company.trim(),
        job_title: form.jobTitle.trim(),
        country: form.country,
      });

      if (metaError) {
        setErrors({ form: metaError.message });
        return;
      }

      setSuccess(true);
      setForm(INITIAL_FORM);

      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (err) {
      setErrors({
        form:
          err instanceof Error
            ? err.message
            : "Something went wrong while creating your account.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start analyzing AWR reports and optimizing Oracle performance."
    >
      {success && (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Account created successfully. Redirecting you to sign in...</span>
        </div>
      )}

      {errors.form && (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <FieldLabel htmlFor="fullName">Full name</FieldLabel>
          <TextInput
            id="fullName"
            name="fullName"
            value={form.fullName}
            placeholder="Jordan Reyes"
            autoComplete="name"
            error={errors.fullName}
            onChange={updateField("fullName")}
          />
          <FieldError message={errors.fullName} />
        </div>

        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <TextInput
            id="email"
            name="email"
            type="email"
            value={form.email}
            placeholder="you@company.com"
            autoComplete="email"
            error={errors.email}
            onChange={updateField("email")}
          />
          <FieldError message={errors.email} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <PasswordInput
              id="password"
              name="password"
              value={form.password}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              error={errors.password}
              onChange={updateField("password")}
            />
            <FieldError message={errors.password} />
          </div>

          <div>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              placeholder="Re-enter password"
              autoComplete="new-password"
              error={errors.confirmPassword}
              onChange={updateField("confirmPassword")}
            />
            <FieldError message={errors.confirmPassword} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="company">Company</FieldLabel>
            <TextInput
              id="company"
              name="company"
              value={form.company}
              placeholder="Acme Corp"
              autoComplete="organization"
              error={errors.company}
              onChange={updateField("company")}
            />
            <FieldError message={errors.company} />
          </div>

          <div>
            <FieldLabel htmlFor="jobTitle">Job title</FieldLabel>
            <TextInput
              id="jobTitle"
              name="jobTitle"
              value={form.jobTitle}
              placeholder="Database Administrator"
              autoComplete="organization-title"
              error={errors.jobTitle}
              onChange={updateField("jobTitle")}
            />
            <FieldError message={errors.jobTitle} />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="country">Country</FieldLabel>
          <CountrySelect
            id="country"
            name="country"
            value={form.country}
            error={errors.country}
            onChange={updateField("country")}
          />
          <FieldError message={errors.country} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-wider text-silver-400">
          Or continue with
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <OAuthButton
          variant="light"
          icon={
            oauthLoading === "google" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )
          }
          label={
            oauthLoading === "google" ? "Redirecting..." : "Continue with Google"
          }
          onClick={() => handleOAuth("google")}
          disabled={oauthLoading !== null}
        />
        <OAuthButton
          icon={
            oauthLoading === "github" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GithubIcon />
            )
          }
          label={
            oauthLoading === "github" ? "Redirecting..." : "Continue with GitHub"
          }
          onClick={() => handleOAuth("github")}
          disabled={oauthLoading !== null}
        />
      </div>

      <p className="mt-8 text-center text-sm text-silver-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-accent hover:text-accent-hover"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
