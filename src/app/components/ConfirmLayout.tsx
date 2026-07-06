export default function ConfirmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-10">
          Confirm and pay
        </h1>
        {children}
      </div>
    </div>
  );
}