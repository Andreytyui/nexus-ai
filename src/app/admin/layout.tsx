export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        html, body {
          overflow: auto !important;
          cursor: auto !important;
          height: auto !important;
        }
      `}</style>
      {children}
    </>
  );
}
