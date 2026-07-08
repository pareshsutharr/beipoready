import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  label?: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className
      )}
    >
      <InfiniteSlider gap={64} reverse duration={30} durationOnHover={90}>
        {logos.map((logo) => (
          <figure
            className="flex flex-col items-center justify-start gap-3"
            key={`logo-${logo.alt}`}
          >
            <img
              alt={logo.alt}
              className="pointer-events-none h-[66px] w-[148px] select-none object-contain md:h-[74px] md:w-[165px]"
              height={logo.height || "auto"}
              loading="lazy"
              src={logo.src}
              width={logo.width || "auto"}
            />
            {logo.label && (
              <figcaption className="max-w-36 select-none text-center font-sans text-xs font-semibold uppercase tracking-wide text-slate-500">
                {logo.label}
              </figcaption>
            )}
          </figure>
        ))}
      </InfiniteSlider>
    </div>
  );
}
