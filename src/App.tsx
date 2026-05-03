import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import OceanCanvas from "@/components/OceanCanvas";
import MusicPlayer from "@/components/MusicPlayer";
import ZhuuAIChat from "@/components/ZhuuAIChat";
import Home from "@/pages/Home";
import SpeedTest from "@/pages/SpeedTest";
import Portfolio from "@/pages/Portfolio";
import Community from "@/pages/Community";
import Links from "@/pages/Links";
import Feedback from "@/pages/Feedback";
import AIPage from "@/pages/AIPage";
import Linktree from "@/pages/Linktree";

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center ocean-bg">
      <div className="text-center px-4">
        <div className="text-8xl mb-6" style={{ filter: "drop-shadow(0 0 20px rgba(0,255,255,0.4))" }}>🌊</div>
        <h1 className="text-7xl font-black gradient-text mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>404</h1>
        <p className="text-cyan-200/60 mb-8 text-lg">This page is lost somewhere in the deep ocean...</p>
        <a href="/" className="neon-btn-solid px-8 py-3.5 rounded-full font-semibold text-base inline-block">
          ← Surface
        </a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/speedtest" component={SpeedTest} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/community" component={Community} />
      <Route path="/links" component={Links} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/ai" component={AIPage} />
      <Route path="/linktree" component={Linktree} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={""}>
          <OceanCanvas />
          <div className="relative" style={{ zIndex: 1 }}>
            <Navbar />
            <main className="page-enter">
              <Router />
            </main>
            <BottomNav />
          </div>
          <MusicPlayer />
          <ZhuuAIChat />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
