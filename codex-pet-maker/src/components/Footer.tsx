export function Footer() {
  return (
    <footer className="text-center py-8 border-t border-zinc-800 text-zinc-500 text-sm">
      <p>
        Built by{' '}
        <a
          href="https://github.com/Autopilot-11/Build-Your-Pet"
          target="_blank"
          rel="noreferrer"
          className="text-orange-400 hover:text-orange-300"
        >
          Leon
        </a>
        {' · '}
        All processing is client-side · No data leaves your browser
      </p>
    </footer>
  )
}
