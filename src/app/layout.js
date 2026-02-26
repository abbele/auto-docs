export const metadata = {
  title: 'Workshop: Documentation-as-Code & AI Context Engineering',
  description: 'Dallo scripting manuale alla documentazione self-aware',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
