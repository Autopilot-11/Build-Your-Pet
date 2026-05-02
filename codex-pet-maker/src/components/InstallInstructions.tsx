export function InstallInstructions() {
  return (
    <div className="w-full max-w-2xl mx-auto border-t border-zinc-800 pt-8">
      <h2 className="font-mono text-sm font-semibold text-orange-400 uppercase tracking-widest mb-4">
        How to install
      </h2>
      <ol className="space-y-2 text-zinc-300">
        {[
          'Unzip the downloaded file',
          'Move the folder to ~/.codex/pets/',
          'Open Codex → Settings → Appearance → Pets',
          'Select your pet and enjoy!',
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="font-mono text-orange-400 font-bold shrink-0">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-zinc-500 text-sm font-mono">
        mv ~/Downloads/{'<pet-id>'} ~/.codex/pets/
      </p>
    </div>
  )
}
