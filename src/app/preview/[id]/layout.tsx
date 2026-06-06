export function generateStaticParams() {
  return [{ id: 'demo' }];
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
