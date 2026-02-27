export default function ProductSkeleton() {
  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: "1rem",
        border: "1px solid var(--border)",
        background: "var(--bg-card)",
      }}
    >
      {/* Header */}
      <div className="skeleton" style={{ height: "7rem" }} />
      {/* Body */}
      <div className="p-4 flex flex-col gap-2.5">
        <div className="skeleton" style={{ height: "0.65rem", width: "3.5rem" }} />
        <div className="skeleton" style={{ height: "1rem", width: "70%" }} />
        <div className="skeleton" style={{ height: "0.75rem", width: "100%" }} />
        <div className="skeleton" style={{ height: "0.75rem", width: "80%" }} />
        <div className="flex gap-1.5 mt-1">
          <div className="skeleton" style={{ height: "1.25rem", width: "3.5rem", borderRadius: "999px" }} />
          <div className="skeleton" style={{ height: "1.25rem", width: "4rem", borderRadius: "999px" }} />
          <div className="skeleton" style={{ height: "1.25rem", width: "3rem", borderRadius: "999px" }} />
        </div>
        <div className="flex justify-between pt-3 mt-1" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="skeleton" style={{ height: "1rem", width: "3rem" }} />
          <div className="skeleton" style={{ height: "0.75rem", width: "5rem" }} />
        </div>
      </div>
    </div>
  );
}
