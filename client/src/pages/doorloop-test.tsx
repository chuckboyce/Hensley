export default function DoorLoopTest() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">DoorLoop iFrame Test</h1>
        <p className="text-muted-foreground mb-4">
          Testing if DoorLoop allows embedding via iframe...
        </p>
        
        <div className="border-4 border-primary rounded-lg overflow-hidden" style={{ height: '800px' }}>
          <iframe
            src="https://74458621.app.doorloop.com/auth/login"
            className="w-full h-full"
            title="DoorLoop Login Test"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>

        <div className="mt-6 p-4 bg-secondary rounded-lg">
          <h2 className="font-semibold mb-2">What to look for:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>✅ If you see the DoorLoop login page above → iframe works!</li>
            <li>❌ If you see a blank box or error → DoorLoop blocks iframes</li>
            <li>Check browser console (F12) for any "X-Frame-Options" or "CSP" errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
