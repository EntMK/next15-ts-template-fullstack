import StepSections from "@/components/3d-scroll/StepSections";
import "@/styles/3d-scroll.css";

export default function ThreeDScrollPage() {
  return (
    <div
      style={{
        fontFamily:
          "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "#121314",
        fontWeight: 500,
      }}
    >
      <StepSections />
    </div>
  );
}
