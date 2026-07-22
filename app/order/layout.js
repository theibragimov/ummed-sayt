import Script from 'next/script';

export const metadata = {
  other: { 'color-scheme': 'light' },
};

export default function OrderLayout({ children }) {
  return (
    <>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
      {children}
    </>
  );
}
