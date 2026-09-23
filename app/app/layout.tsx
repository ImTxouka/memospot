export const metadata = {
  title: 'MemoSpot',
  description: 'Ton second cerveau pour ne plus rien perdre',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
