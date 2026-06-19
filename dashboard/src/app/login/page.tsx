export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-surface rounded-xl p-8 border border-border max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">AutoMod Pro</h1>
        <p className="text-gray-400 mb-6">Sign in with Discord to manage your server</p>
        <a
          href="/api/auth/discord"
          className="bg-accent hover:bg-accent/80 text-white font-semibold px-6 py-3 rounded-lg inline-block transition-colors"
        >
          Login with Discord
        </a>
      </div>
    </div>
  );
}
