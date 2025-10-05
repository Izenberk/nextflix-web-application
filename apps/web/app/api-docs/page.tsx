export default function ApiDocsPage() {
  const url =
    (process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3000').replace(/\/$/, '') + '/docs';

  return (
    <main className="h-[calc(100vh-2rem)] m-4 border rounded overflow-hidden">
      <iframe src={url} className="w-full h-full" />
    </main>
  );
}