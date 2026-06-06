export function generateStaticParams() {
  return [{ slug: 'demo' }];
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
