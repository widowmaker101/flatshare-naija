export const metadata = {
  title: "Flatshare Naija",
  description: "Frontend powered by Next.js 14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
