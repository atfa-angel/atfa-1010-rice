import Image from "next/image";

export default function SiteHeader({
  eyebrow,
  title,
  actions,
}: {
  eyebrow?: string;
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <header>
      <div className="bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Image
            src="/atfa-logo.png"
            alt="澳洲臺灣同鄉會 Australian Taiwanese Friendship Association"
            width={1196}
            height={257}
            priority
            className="h-auto w-[240px] sm:w-[300px]"
          />
          {actions}
        </div>
      </div>
      <div className="bg-brand text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-center sm:px-6">
          {eyebrow && <p className="text-sm font-medium tracking-wide text-brand-border">{eyebrow}</p>}
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h1>
        </div>
      </div>
    </header>
  );
}
