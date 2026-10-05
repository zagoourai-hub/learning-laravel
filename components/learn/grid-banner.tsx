import { FlickeringGrid } from "@/components/magicui/flickering-grid";

// Faint decorative banner. The parent must be `relative`; it sits behind the content.
export function GridBanner() {
  return (
    <div
      aria-hidden="true"
      className="absolute top-0 left-0 z-0 h-[200px] w-full [mask-image:linear-gradient(to_top,transparent_25%,black_95%)] motion-reduce:hidden"
    >
      <FlickeringGrid
        className="absolute top-0 left-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.2}
        flickerChance={0.05}
      />
    </div>
  );
}
