export function ThemeInitScript() {
  const script = `(() => {
    try {
      const stored = localStorage.getItem('ljds-theme');
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const theme = stored === 'light' || stored === 'dark' ? stored : system;
      document.documentElement.setAttribute('data-theme', theme);
    } catch {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
