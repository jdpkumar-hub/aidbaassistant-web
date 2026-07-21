interface ProgressHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
}

export default function ProgressHeader({
  step,
  totalSteps,
  title,
  subtitle,
}: ProgressHeaderProps) {
  const progress = (step / totalSteps) * 100;

  const steps = [
    "Profile",
    "Professional",
    "Preferences",
    "Finish",
  ];

  return (
    <div className="mb-10">

      <div className="flex items-center justify-between">

        <div>

          <div className="text-sm font-semibold text-accent">
            Step {step} of {totalSteps}
          </div>

          <h1 className="mt-2 text-4xl font-bold">
            {title}
          </h1>

          <p className="mt-2 text-silver-400">
            {subtitle}
          </p>

        </div>

        <div className="hidden md:block rounded-xl bg-accent/10 px-5 py-4">

          <div className="text-xs uppercase tracking-wide text-accent">
            Profile Completion
          </div>

          <div className="mt-2 text-3xl font-bold">
            {Math.round(progress)}%
          </div>

        </div>

      </div>

      <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">

        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />

      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">

        {steps.map((label, index) => {

          const current = index + 1;

          return (

            <div
              key={label}
              className={`rounded-xl border p-4 text-center transition-all ${
                current < step
                  ? "border-green-500 bg-green-500/10"
                  : current === step
                  ? "border-accent bg-accent/10"
                  : "border-white/10 bg-white/5"
              }`}
            >

              <div className="text-2xl">

                {current < step ? "✓" : current}

              </div>

              <div className="mt-2 text-sm font-medium">
                {label}
              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}