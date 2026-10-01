"use client";

import { ExperienceHero } from "./brand-experience";
import { LinkButton } from "./link-button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  TextField,
  MenuItem,
  Alert,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import Image from "next/image";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  requestSchema,
  safeReturn,
} from "@/lib/validation";
import { services } from "@/lib/catalog";
import {
  api,
  useAuth,
} from "./providers";
import { Logo } from "./layout";

export function RequestForm({
  kind = "General enquiry",
  listingId,
  subject = "",
  onSuccess,
}: {
  kind?: string;
  listingId?: string;
  subject?: string;
  onSuccess?: () => void;
}) {
  const { user } = useAuth();
  const [error, setError] =
    useState("");
  const [reference, setReference] =
    useState("");
  const [details, setDetails] =
    useState<Record<string, string>>(
      {},
    );

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<
    z.infer<typeof requestSchema>
  >({
    resolver:
      zodResolver(requestSchema),
    defaultValues: {
      kind,
      name: user?.name ?? "",
      email: user?.email ?? "",
      subject: subject || kind,
      message: "",
      listingId,
    },
  });

  const logistics =
    /logistics/i.test(kind);
  const trade =
    /trade|import/i.test(kind);
  const marketing =
    /marketing|strategy/i.test(kind);
  const property =
    /viewing|property/i.test(kind);
  const artisan =
    /artisan|project/i.test(kind);
  const apply =
    /application/i.test(kind);

  const extra = logistics
    ? [
        "Origin",
        "Destination",
        "Shipment type",
        "Weight (kg)",
        "Volume (m³)",
        "Transport mode",
        "Desired date",
      ]
    : trade
      ? [
          "Import or export",
          "Origin country",
          "Destination country",
          "Product category",
          "Estimated quantity",
          "Transport method",
        ]
      : marketing
        ? [
            "Business name",
            "Objectives",
            "Services required",
            "Budget range",
            "Timeline",
          ]
        : property
          ? [
              "Preferred viewing date",
              "Preferred time",
              "Buying or renting",
            ]
          : artisan
            ? [
                "Project type",
                "Budget range",
                "Project deadline",
              ]
            : apply
              ? [
                  "Experience",
                  "Portfolio or CV link",
                ]
              : [];

  if (reference)
    return (
      <Alert severity="success">
        <b>Request received.</b>

        <p>
          Reference:{" "}
          {reference
            .slice(0, 8)
            .toUpperCase()}
        </p>

        <p>
          {user
            ? "You can follow up in your dashboard."
            : "Your enquiry has been recorded."}
        </p>

        {user && (
          <LinkButton href="/dashboard/requests">
            View my requests
          </LinkButton>
        )}
      </Alert>
    );

  return (
    <form
      className="form-stack"
      noValidate
      onSubmit={handleSubmit(
        async (values) => {
          setError("");

          try {
            const result = await api<{
              entry: {
                id: string;
              };
            }>(
              user
                ? "request"
                : "contact",
              {
                ...values,
                details,
              },
            );

            setReference(
              result.entry.id,
            );

            onSuccess?.();
          } catch (e) {
            setError(
              (e as Error).message,
            );
          }
        },
      )}
    >
      <div className="form-grid">
        <TextField
          label="Full name"
          {...register("name")}
          error={!!errors.name}
          helperText={
            errors.name?.message
          }
        />

        <TextField
          label="Email address"
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={
            errors.email?.message
          }
        />

        <TextField
          label="Phone number (optional)"
          {...register("phone")}
        />

        <TextField
          label="Subject"
          {...register("subject")}
          error={!!errors.subject}
          helperText={
            errors.subject?.message
          }
        />

        {extra.map((label) => (
          <TextField
            key={label}
            label={label}
            type={
              /date|deadline/i.test(
                label,
              )
                ? "date"
                : "text"
            }
            slotProps={
              /date|deadline/i.test(
                label,
              )
                ? {
                    inputLabel: {
                      shrink: true,
                    },
                  }
                : undefined
            }
            value={
              details[label] ?? ""
            }
            onChange={(e) =>
              setDetails({
                ...details,
                [label]:
                  e.target.value,
              })
            }
          />
        ))}

        <TextField
          className="full"
          multiline
          minRows={4}
          label={
            apply
              ? "Tell us why you are a good fit"
              : "Tell us what you need"
          }
          {...register("message")}
          error={!!errors.message}
          helperText={
            errors.message?.message
          }
        />
      </div>

      {!user &&
        kind !==
          "General enquiry" && (
          <Alert severity="info">
            This will be recorded
            as a guest enquiry.{" "}
            <Link href="/login">
              Sign in
            </Link>{" "}
            to track requests and
            messages in your dashboard.
          </Alert>
        )}

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Sending…"
          : apply
            ? "Send application"
            : "Send request"}
      </Button>

      <p className="small-caption">
        By sending this request,
        you agree to share these
        details with Solid Connect
        and the relevant service
        provider.
      </p>
    </form>
  );
}

export function Contact() {
  return (
    <>
      <ExperienceHero
        title="Let’s make your next move happen."
        description="Bring your ambition. We’ll start with a conversation."
        eyebrow="Contact Solid Connect"
      />

      <div className="workspace">
        <div className="container content-grid">
          <div>
            <div className="eyebrow">
              <span />
              Let’s connect
            </div>

            <h2>
              Tell us what’s next.
            </h2>

            <p
              style={{
                margin: "20px 0",
              }}
            >
              A new hire. A new
              market. A place to
              call your own.
              Whatever you have in
              mind, we’re ready to
              start a conversation.
            </p>

            <div className="contact-photo">
              <Image
                src="/images/business-studio.png"
                alt="A welcoming collaborative studio"
                fill
                sizes="(max-width:700px) 90vw, 40vw"
              />
            </div>

            <div className="panel">
              <h3>
                One team. Seven
                ways to help.
              </h3>

              <p>
                Choose the service
                that fits your
                needs, or tell us
                about a challenge
                that brings several
                together.
              </p>

              <ul>
                {services.map(
                  (s) => (
                    <li
                      key={
                        s.slug
                      }
                    >
                      <Link
                        href={`/services/${s.slug}`}
                      >
                        {
                          s.name
                        }
                      </Link>
                    </li>
                  ),
                )}
              </ul>

              <h3
                style={{
                  marginTop: 28,
                }}
              >
                What happens next?
              </h3>

              <p>
                Start with the
                outcome you are
                looking for, the
                service you need,
                and any important
                location, budget,
                or timing details.
                Your enquiry
                creates a reference
                that keeps the
                conversation
                connected to your
                request.
              </p>

              <p>
                If you have an
                account, you can
                follow up in My
                Requests and
                Messages. Before
                any work begins,
                confirm the scope,
                availability,
                fees, and next
                steps with the
                relevant provider.
              </p>

              <p className="small-caption">
                Contact details and
                office location are
                awaiting company
                confirmation. Use
                this form to record
                an enquiry in the
                demo.
              </p>
            </div>
          </div>

          <div className="panel">
            <h2>Get in touch</h2>
            <RequestForm />
          </div>
        </div>
      </div>
    </>
  );
}

export function AuthForm({
  mode,
}: {
  mode:
    | "login"
    | "register"
    | "forgot"
    | "reset";
}) {
  const { refresh } = useAuth();
  const router = useRouter();
  const params =
    useSearchParams();

  const [type, setType] =
    useState("Individual");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [show, setShow] =
    useState(false);

  const schema = z.object({
    name:
      mode === "register"
        ? z
            .string()
            .min(
              2,
              "Enter your full name.",
            )
        : z.string(),

    email:
      mode === "reset"
        ? z.string()
        : z.email(
            "Enter a valid email address.",
          ),

    password:
      mode === "forgot"
        ? z.string()
        : mode === "login"
          ? z
              .string()
              .min(
                1,
                "Enter your password.",
              )
          : z
              .string()
              .min(
                10,
                "Use at least 10 characters.",
              )
              .max(100),

    accountType:
      z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver:
      zodResolver(schema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      accountType:
        "Individual",
    },
  });

  const title =
    mode === "register"
      ? "Your next connection starts here."
      : mode === "forgot"
        ? "Forgot your password?"
        : mode === "reset"
          ? "Choose a new password."
          : "Welcome back.";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-art">
          <Image
            src="/images/hero.png"
            alt="Business professionals connecting"
            fill
            sizes="450px"
          />

          <div>
            <div className="eyebrow">
              Make your next move
            </div>

            <h2>
              Opportunity starts
              <br />
              with a connection.
            </h2>

            <p>
              Find your people.
              Grow your business.
              Build something that
              lasts.
            </p>
          </div>
        </div>

        <div className="auth-form">
          <Logo />

          <h1>{title}</h1>

          <p>
            {mode === "register"
              ? "Create your account. Discover a world of possibilities."
              : mode === "login"
                ? "Sign in to pick up where you left off."
                : "We’ll help you get back to your connections."}
          </p>

          {mode ===
            "register" && (
            <div className="auth-type">
              {[
                "Individual",
                "Business",
              ].map((t) => (
                <Button
                  key={t}
                  variant={
                    type === t
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    setType(t)
                  }
                  fullWidth
                >
                  {t}
                </Button>
              ))}
            </div>
          )}

          <form
            noValidate
            className="form-stack"
            onSubmit={handleSubmit(
              async (
                values,
              ) => {
                setError("");

                try {
                  const result =
                    await api<{
                      message?: string;
                    }>(
                      mode,
                      {
                        ...values,
                        accountType:
                          type,
                        token:
                          params.get(
                            "token",
                          ),
                      },
                    );

                  if (
                    mode ===
                    "forgot"
                  ) {
                    setSuccess(
                      result.message ??
                        "Check your email.",
                    );

                    return;
                  }

                  if (
                    mode ===
                    "reset"
                  ) {
                    setSuccess(
                      "Password updated. You can now sign in.",
                    );

                    return;
                  }

                  await refresh();

                  router.push(
                    safeReturn(
                      params.get(
                        "next",
                      ),
                    ),
                  );
                } catch (e) {
                  setError(
                    (
                      e as Error
                    ).message,
                  );
                }
              },
            )}
          >
            {mode ===
              "register" && (
              <TextField
                label="Full name"
                autoComplete="name"
                {...register(
                  "name",
                )}
                error={
                  !!errors.name
                }
                helperText={
                  errors.name
                    ?.message
                }
              />
            )}{" "}

            {mode !==
              "reset" && (
              <TextField
                label="Email address"
                type="email"
                autoComplete="email"
                {...register(
                  "email",
                )}
                error={
                  !!errors.email
                }
                helperText={
                  errors.email
                    ?.message
                }
              />
            )}{" "}

            {mode !==
              "forgot" && (
              <TextField
                label="Password"
                type={
                  show
                    ? "text"
                    : "password"
                }
                autoComplete={
                  mode ===
                  "login"
                    ? "current-password"
                    : "new-password"
                }
                {...register(
                  "password",
                )}
                error={
                  !!errors.password
                }
                helperText={
                  errors.password
                    ?.message ??
                  (mode ===
                  "register"
                    ? "Use at least 10 characters."
                    : undefined)
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <IconButton
                        aria-label={
                          show
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          setShow(
                            !show,
                          )
                        }
                      >
                        {show ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    ),
                  },
                }}
              />
            )}

            {mode ===
              "login" && (
              <Link
                className="text-link"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            )}

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success">
                {success}
              </Alert>
            )}

            <Button
              variant="contained"
              color="secondary"
              type="submit"
              disabled={
                isSubmitting
              }
            >
              {isSubmitting
                ? "Please wait…"
                : mode ===
                    "register"
                  ? "Create account"
                  : mode ===
                      "forgot"
                    ? "Send reset link"
                    : mode ===
                        "reset"
                      ? "Update password"
                      : "Sign in"}
            </Button>
          </form>

          <div className="auth-alt">
            {mode ===
            "login" ? (
              <>
                New to Solid
                Connect?{" "}
                <Link href="/register">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an
                account?{" "}
                <Link href="/login">
                  Sign in
                </Link>
              </>
            )}
          </div>

          {mode ===
            "register" && (
            <p
              className="small-caption"
              style={{
                marginTop: 20,
              }}
            >
              By creating an
              account, you agree to
              our{" "}
              <Link href="/terms">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy">
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <TextField
      select
      label="Category"
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
    >
      {[
        "Jobs",
        "Artisans",
        "Properties",
        "Products",
        "Logistics",
        "Business Services",
      ].map((x) => (
        <MenuItem
          key={x}
          value={x}
        >
          {x}
        </MenuItem>
      ))}
    </TextField>
  );
}

/*
 * Email verification page
 *
 * A valid email verification token can now
 * be consumed without requiring the user to
 * already have an active login session.
 */
export function VerifyEmail() {
  const params =
    useSearchParams();

  const {
    user,
    loading,
    refresh,
  } = useAuth();

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const token =
    params.get("token");

  const verifyEmail =
    async () => {
      if (!token) return;

      setBusy(true);
      setError("");
      setMessage("");

      try {
        const response =
          await api<{
            message: string;
          }>(
            "verify-email",
            { token },
          );

        setMessage(
          response.message,
        );

        /*
         * If the user is currently logged in,
         * refresh the session-side account data
         * so the UI reflects emailVerified=true.
         *
         * If they are logged out, refresh is still
         * safe and the successful verification
         * message remains visible.
         */
        await refresh();
      } catch (e) {
        setError(
          (e as Error).message,
        );
      } finally {
        setBusy(false);
      }
    };

  const sendVerification =
    async () => {
      setBusy(true);
      setError("");
      setMessage("");

      try {
        const response =
          await api<{
            message: string;
          }>(
            "send-verification",
            {},
          );

        setMessage(
          response.message,
        );
      } catch (e) {
        setError(
          (e as Error).message,
        );
      } finally {
        setBusy(false);
      }
    };

  return (
    <section className="workspace">
      <div className="panel wide-form">
        <h1>
          Verify your email
        </h1>

        <p
          style={{
            margin: "20px 0",
          }}
        >
          Confirm your email
          address to keep your
          account details up to
          date.
        </p>

        {loading ? (
          <p>
            Loading…
          </p>
        ) : token ? (
          /*
           * A token in the URL is enough to
           * display the confirmation action.
           *
           * The user does NOT need to sign in
           * first.
           */
          <Button
            variant="contained"
            disabled={
              busy || !!message
            }
            onClick={
              verifyEmail
            }
          >
            {busy
              ? "Verifying…"
              : "Confirm email address"}
          </Button>
        ) : user ? (
          /*
           * Logged-in users who arrive here
           * without a token can request a new
           * verification email.
           */
          <Button
            variant="contained"
            disabled={
              busy || !!message
            }
            onClick={
              sendVerification
            }
          >
            {busy
              ? "Sending…"
              : "Send verification link"}
          </Button>
        ) : (
          /*
           * A logged-out user without a token
           * must sign in before requesting a
           * verification email.
           */
          <LinkButton href="/login">
            Sign in to send a
            verification email
          </LinkButton>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ mt: 3 }}
          >
            {error}
          </Alert>
        )}

        {message && (
          <Alert
            severity="success"
            sx={{ mt: 3 }}
          >
            {message}
          </Alert>
        )}

        {user && (
          <LinkButton
            href="/dashboard/profile"
            sx={{ mt: 2 }}
          >
            Back to profile
          </LinkButton>
        )}

        {!user &&
          token &&
          message && (
            <LinkButton
              href="/login"
              sx={{ mt: 2 }}
            >
              Sign in
            </LinkButton>
          )}
      </div>
    </section>
  );
}