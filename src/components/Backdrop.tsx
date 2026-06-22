/* Page-wide atmosphere: a fixed chromatic aurora wash plus a static grain layer.
   Both are fixed + pointer-events-none so they never trigger scroll repaints. */

export default function Backdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(58rem 40rem at 80% -10%, rgba(170,198,214,0.08), transparent 60%)," +
            "radial-gradient(50rem 38rem at 6% 14%, rgba(120,150,170,0.07), transparent 62%)," +
            "radial-gradient(46rem 40rem at 58% 110%, rgba(140,165,180,0.05), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.04] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}
