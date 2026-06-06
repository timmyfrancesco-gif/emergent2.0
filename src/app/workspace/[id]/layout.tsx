export function generateStaticParams() {
  return [{ id: 'demo' }, { id: 'new' }];
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
