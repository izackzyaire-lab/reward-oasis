import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Video, 
  Layout, 
  Wallet, 
  User, 
  LogOut, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle2, 
  Zap, 
  ArrowUpRight, 
  ChevronRight, 
  Star,
  ShieldCheck,
  Smartphone,
  Trophy,
  History,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';

// --- Types ---
type Page = 'landing' | 'dashboard' | 'ads' | 'tasks' | 'withdraw' | 'profile';

interface UserData {
  name: string;
  email: string;
  balance: number;
  totalEarned: number;
  completedTasks: number;
  watchedAds: number;
  level: number;
  exp: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: 'social' | 'survey' | 'app' | 'game';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: React.ReactNode;
}

interface Ad {
  id: string;
  title: string;
  reward: number;
  duration: number; // in seconds
  thumbnail: string;
  description: string;
}

// --- Data ---
const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Follow on X', description: 'Follow our official handle on X (formerly Twitter)', reward: 0.50, category: 'social', difficulty: 'Easy', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 't2', title: 'Install Hustle App', description: 'Download and open our partner app for 5 minutes', reward: 2.50, category: 'app', difficulty: 'Medium', icon: <Smartphone className="w-5 h-5" /> },
  { id: 't3', title: 'Quick Survey', description: 'Share your thoughts on digital marketing trends', reward: 1.20, category: 'survey', difficulty: 'Easy', icon: <Award className="w-5 h-5" /> },
  { id: 't4', title: 'Complete Level 5', description: 'Reach Level 5 in Hustler Hero game', reward: 5.00, category: 'game', difficulty: 'Hard', icon: <Zap className="w-5 h-5" /> },
];

const MOCK_ADS: Ad[] = [
  { id: 'a1', title: 'Crypto Invest 2024', reward: 0.15, duration: 15, thumbnail: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/de6970f7-85f0-4a27-b589-9e79ab1e166d/ad-thumbnails-a34d68f0-1776113050100.webp', description: 'Learn the latest crypto trends.' },
  { id: 'a2', title: 'Best Food Delivery', reward: 0.20, duration: 30, thumbnail: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/de6970f7-85f0-4a27-b589-9e79ab1e166d/ad-thumbnails-a34d68f0-1776113050100.webp', description: 'Get 50% off on your first order.' },
  { id: 'a3', title: 'Modern CRM Tool', reward: 0.10, duration: 10, thumbnail: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/de6970f7-85f0-4a27-b589-9e79ab1e166d/ad-thumbnails-a34d68f0-1776113050100.webp', description: 'Optimize your sales flow today.' },
];

// --- Components ---

const Navbar = ({ activePage, setActivePage, isLoggedIn, logout }: { activePage: Page, setActivePage: (p: Page) => void, isLoggedIn: boolean, logout: () => void }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 px-6 py-3 flex justify-between items-center z-50 md:top-0 md:bottom-auto md:px-12 md:py-4">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActivePage(isLoggedIn ? 'dashboard' : 'landing')}>
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
          <Zap className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-lg hidden sm:inline tracking-tight text-zinc-900 dark:text-zinc-50">Hustler<span className="text-emerald-600">Hub</span></span>
      </div>

      {isLoggedIn && (
        <div className="flex gap-4 md:gap-8 items-center">
          {[
            { id: 'dashboard', icon: Home, label: 'Home' },
            { id: 'ads', icon: Video, label: 'Ads' },
            { id: 'tasks', icon: Layout, label: 'Tasks' },
            { id: 'withdraw', icon: Wallet, label: 'Cashout' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as Page)}
              className={`flex flex-col items-center gap-1 transition-colors ${activePage === item.id ? 'text-emerald-600' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setActivePage('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${activePage === 'profile' ? 'text-emerald-600' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider">Profile</span>
          </button>
        </div>
      )}

      {!isLoggedIn && (
        <div className="flex gap-4">
          <button onClick={() => setActivePage('landing')} className="text-sm font-medium hover:text-emerald-600">Sign In</button>
          <button onClick={() => setActivePage('landing')} className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all">Join Free</button>
        </div>
      )}
    </nav>
  );
};

const LandingPage = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-20 md:pt-32 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Real Payouts Guaranteed
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight mb-6">
            Turn Your <span className="text-emerald-600">Screen Time</span> Into Real Cash.
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-lg leading-relaxed">
            HustlerHub is the world's leading micro-tasking platform. Watch ads, complete surveys, and try apps to earn rewards that you can withdraw instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onLogin}
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transform hover:-translate-y-1 transition-all"
            >
              Start Earning Now
            </button>
            <button className="flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 px-8 py-4 rounded-xl text-lg font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              How it works
            </button>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-200 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-sm text-zinc-500">Trusted by 50,000+ hustlers</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/10 blur-[120px] rounded-full"></div>
          <div className="relative bg-zinc-900 rounded-[2.5rem] border-[8px] border-zinc-800 overflow-hidden shadow-2xl aspect-[9/19] max-w-[320px] mx-auto">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/de6970f7-85f0-4a27-b589-9e79ab1e166d/hero-image-72450f3e-1776113049204.webp" 
              className="w-full h-full object-cover opacity-90"
              alt="Dashboard Preview"
            />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-zinc-800 rounded-full"></div>
          </div>
          
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute top-1/4 -right-4 md:-right-12 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                <ArrowUpRight className="text-emerald-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Last Payout</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">$425.50</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 5, delay: 1 }}
            className="absolute bottom-1/4 -left-4 md:-left-12 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Tasks Complete</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">1,204+</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Featured Section */}
      <div className="mt-32 border-t border-zinc-100 dark:border-zinc-900 pt-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-zinc-400 text-sm font-bold uppercase tracking-[0.2em] mb-12">Proudly Powered By</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-black italic">AD-NET</span>
            <span className="text-2xl font-black italic">GLOBAL-APP</span>
            <span className="text-2xl font-black italic">CASH-STREAM</span>
            <span className="text-2xl font-black italic">HUSTLE-SYNC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ userData, setActivePage }: { userData: UserData, setActivePage: (p: Page) => void }) => {
  return (
    <div className="pt-8 pb-32 max-w-5xl mx-auto px-6">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">Hello, {userData.name.split(' ')[0]}!</h1>
          <p className="text-zinc-500">Ready for today's hustle?</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Level {userData.level}</span>
          </div>
          <div className="w-24 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-600" style={{ width: `${userData.exp}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4">
            <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">Current Balance</p>
            <Wallet className="w-6 h-6 text-emerald-200" />
          </div>
          <h2 className="text-4xl font-black mb-6">${userData.balance.toFixed(2)}</h2>
          <button 
            onClick={() => setActivePage('withdraw')}
            className="w-full bg-white text-emerald-700 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Withdraw Cash
          </button>
        </motion.div>

        <div className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Total Earned</p>
              <h3 className="text-3xl font-bold text-zinc-50 mt-1">${userData.totalEarned.toFixed(2)}</h3>
            </div>
            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center">
              <TrendingUp className="text-emerald-500 w-6 h-6" />
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 text-emerald-500 text-sm font-bold">
            <ArrowUpRight className="w-4 h-4" />
            +12% from last week
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Work Progress</p>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{userData.completedTasks + userData.watchedAds}</h3>
            </div>
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="text-blue-600 w-6 h-6" />
            </div>
          </div>
          <p className="text-zinc-400 text-sm mt-8">Tasks & Ads completed today</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Quick Tasks</h3>
            <button onClick={() => setActivePage('tasks')} className="text-emerald-600 text-sm font-bold flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {MOCK_TASKS.slice(0, 3).map((task) => (
              <div key={task.id} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {task.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{task.title}</h4>
                  <p className="text-xs text-zinc-500 line-clamp-1">{task.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-600 font-black">+${task.reward.toFixed(2)}</span>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">{task.difficulty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-80">
          <h3 className="text-xl font-bold mb-6">Daily Ad Bonus</h3>
          <div 
            onClick={() => setActivePage('ads')}
            className="relative group cursor-pointer overflow-hidden rounded-[2rem] border border-zinc-200 dark:border-zinc-800 aspect-square"
          >
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/de6970f7-85f0-4a27-b589-9e79ab1e166d/ad-thumbnails-a34d68f0-1776113050100.webp" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              alt="Ad Thumbnail"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded w-fit mb-2">HOT DEAL</span>
              <h4 className="text-white font-bold text-lg leading-tight mb-4">Watch & Earn $0.20 Instantly</h4>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Clock className="w-4 h-4" /> 30 Seconds
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdsPage = ({ onAdComplete }: { onAdComplete: (reward: number) => void }) => {
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWatching && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isWatching && timeLeft === 0) {
      setIsWatching(false);
      if (selectedAd) {
        onAdComplete(selectedAd.reward);
        toast.success(`Reward earned: $${selectedAd.reward.toFixed(2)}`, {
          icon: <Zap className="w-4 h-4 text-emerald-500" />
        });
        setSelectedAd(null);
      }
    }
    return () => clearInterval(timer);
  }, [isWatching, timeLeft, selectedAd, onAdComplete]);

  const startAd = (ad: Ad) => {
    setSelectedAd(ad);
    setTimeLeft(ad.duration);
    setIsWatching(true);
  };

  return (
    <div className="pt-8 pb-32 max-w-5xl mx-auto px-6">
      <h1 className="text-3xl font-black mb-2">Watch Ads</h1>
      <p className="text-zinc-500 mb-10">High-paying video advertisements updated every hour.</p>

      {isWatching && selectedAd ? (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
          <div className="flex justify-between items-center p-6 bg-zinc-900 border-b border-zinc-800">
            <h2 className="text-white font-bold">{selectedAd.title}</h2>
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 text-sm">Do not close window</span>
              <div className="bg-emerald-600 text-white px-4 py-1 rounded-full font-black min-w-[60px] text-center">
                {timeLeft}s
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center bg-zinc-950 relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <motion.div 
               animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
               transition={{ repeat: Infinity, duration: 10 }}
               className="relative z-10 w-full max-w-4xl aspect-video bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800"
             >
                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">Advertisement Playing...</h3>
                  <p className="text-zinc-500 max-w-md">You are currently earning rewards for watching this advertisement. Please wait for the timer to complete.</p>
                  
                  <div className="mt-12 w-full max-w-sm bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: selectedAd.duration, ease: 'linear' }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>
             </motion.div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_ADS.map((ad) => (
            <motion.div 
              key={ad.id} 
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-lg flex flex-col"
            >
              <div className="relative aspect-video">
                <img src={ad.thumbnail} alt={ad.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2">
                  <Clock className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs font-bold text-white">{ad.duration}s</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
                <p className="text-sm text-zinc-500 mb-6 flex-1">{ad.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Payout</span>
                    <span className="text-2xl font-black text-emerald-600">${ad.reward.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => startAd(ad)}
                    className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const TasksPage = ({ onTaskComplete }: { onTaskComplete: (reward: number) => void }) => {
  const [filter, setFilter] = useState<'all' | 'social' | 'survey' | 'app' | 'game'>('all');

  const filteredTasks = filter === 'all' ? MOCK_TASKS : MOCK_TASKS.filter(t => t.category === filter);

  const handleComplete = (task: Task) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: `Verifying task: ${task.title}...`,
      success: () => {
        onTaskComplete(task.reward);
        return `Success! $${task.reward.toFixed(2)} added to your balance.`;
      },
      error: 'Failed to verify task. Try again.'
    });
  };

  return (
    <div className="pt-8 pb-32 max-w-5xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black mb-2">Available Tasks</h1>
          <p className="text-zinc-500">Complete simple actions to earn high rewards.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'social', 'survey', 'app', 'game'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap ${filter === f ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2rem] flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-emerald-600">
                {task.icon}
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                {task.difficulty}
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2">{task.title}</h3>
            <p className="text-zinc-500 text-sm mb-8 flex-1">{task.description}</p>

            <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 uppercase font-bold">Reward</span>
                <span className="text-2xl font-black text-emerald-600">${task.reward.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => handleComplete(task)}
                className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 group-hover:px-8"
              >
                Complete <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WithdrawPage = ({ balance }: { balance: number }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'paypal' | 'crypto' | 'giftcard'>('paypal');

  const handleWithdraw = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val < 10) {
      toast.error('Minimum withdrawal is $10.00');
      return;
    }
    if (val > balance) {
      toast.error('Insufficient balance');
      return;
    }
    
    toast.success(`Withdrawal request for $${val.toFixed(2)} submitted!`, {
      description: 'Funds will be processed within 24-48 hours.'
    });
    setAmount('');
  };

  return (
    <div className="pt-8 pb-32 max-w-5xl mx-auto px-6">
      <h1 className="text-3xl font-black mb-2">Cashout</h1>
      <p className="text-zinc-500 mb-10">Select your preferred method to withdraw your earnings.</p>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem]">
            <h3 className="text-lg font-bold mb-6">Withdrawal Amount</h3>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-zinc-400">$</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-3xl py-8 pl-12 pr-6 text-4xl font-black focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-zinc-500">Min: $10.00</span>
              <button 
                onClick={() => setAmount(balance.toFixed(2))}
                className="text-emerald-600 font-bold"
              >
                Use Max Balance
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem]">
            <h3 className="text-lg font-bold mb-6">Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'paypal', label: 'PayPal', color: 'blue' },
                { id: 'crypto', label: 'Bitcoin', color: 'orange' },
                { id: 'giftcard', label: 'Gift Card', color: 'emerald' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === m.id ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' : 'border-zinc-100 dark:border-zinc-800'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800`}>
                     <Wallet className="w-5 h-5 text-zinc-600" />
                  </div>
                  <span className="font-bold text-sm">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleWithdraw}
            className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] text-xl font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transform hover:-translate-y-1 transition-all"
          >
            Confirm Withdrawal
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 p-6 rounded-[2.5rem] text-white">
            <p className="text-zinc-500 text-sm uppercase font-bold tracking-widest mb-2">Available Now</p>
            <h4 className="text-4xl font-black mb-6">${balance.toFixed(2)}</h4>
            <div className="space-y-4 pt-6 border-t border-zinc-800">
               <div className="flex justify-between text-sm">
                 <span className="text-zinc-500">Status</span>
                 <span className="text-emerald-500 font-bold">Verified User</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-zinc-500">Tier</span>
                 <span className="text-white font-bold">Gold Hustler</span>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2.5rem]">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600" /> Recent Payouts
            </h4>
            <div className="space-y-4">
               {[
                 { id: 1, date: 'Oct 12', amount: 45.00, status: 'Completed' },
                 { id: 2, date: 'Oct 05', amount: 20.00, status: 'Completed' },
               ].map(p => (
                 <div key={p.id} className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800 last:border-0">
                    <div>
                      <p className="font-bold text-sm">${p.amount.toFixed(2)}</p>
                      <p className="text-[10px] text-zinc-500">{p.date}</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                      {p.status}
                    </span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ userData, logout }: { userData: UserData, logout: () => void }) => {
  return (
    <div className="pt-8 pb-32 max-w-2xl mx-auto px-6">
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-4 border-4 border-white dark:border-zinc-950 shadow-xl mx-auto overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`} alt="avatar" />
          </div>
          <button className="absolute bottom-4 right-0 bg-zinc-900 text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-zinc-950">
            <User className="w-4 h-4" />
          </button>
        </div>
        <h1 className="text-3xl font-black">{userData.name}</h1>
        <p className="text-zinc-500">{userData.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Total Earned</p>
          <p className="text-2xl font-black text-emerald-600">${userData.totalEarned.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Tasks Done</p>
          <p className="text-2xl font-black text-blue-600">{userData.completedTasks}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden mb-8">
        {[
          { icon: History, label: 'Earning History', color: 'text-zinc-500' },
          { icon: ShieldCheck, label: 'Security & Privacy', color: 'text-zinc-500' },
          { icon: AlertCircle, label: 'Help & Support', color: 'text-zinc-500' },
        ].map((item, idx) => (
          <button 
            key={idx}
            className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0"
          >
            <div className="flex items-center gap-4">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="font-bold text-zinc-700 dark:text-zinc-300">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-300" />
          </button>
        ))}
      </div>

      <button 
        onClick={logout}
        className="w-full flex items-center justify-center gap-3 p-5 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-3xl font-bold hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Log Out Account
      </button>

      <p className="text-center text-[10px] text-zinc-400 mt-12 uppercase font-black tracking-[0.2em]">HustlerHub v1.2.0-beta</p>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activePage, setActivePage] = useState<Page>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: 'Alex Hustler',
    email: 'alex@hustlerhub.app',
    balance: 12.40,
    totalEarned: 154.20,
    completedTasks: 84,
    watchedAds: 122,
    level: 14,
    exp: 65,
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActivePage('dashboard');
    toast.success('Welcome back, Alex!');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActivePage('landing');
    toast('Logged out successfully');
  };

  const handleReward = (reward: number) => {
    setUserData(prev => ({
      ...prev,
      balance: prev.balance + reward,
      totalEarned: prev.totalEarned + reward,
      exp: prev.exp + 5 > 100 ? 0 : prev.exp + 5,
      level: prev.exp + 5 > 100 ? prev.level + 1 : prev.level
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-200 dark:selection:bg-emerald-800">
      <Toaster position="top-center" />
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isLoggedIn={isLoggedIn} 
        logout={handleLogout}
      />
      
      <main className="pb-24">
        <AnimatePresence mode="wait">
          {activePage === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LandingPage onLogin={handleLogin} />
            </motion.div>
          )}
          {activePage === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Dashboard userData={userData} setActivePage={setActivePage} />
            </motion.div>
          )}
          {activePage === 'ads' && (
            <motion.div key="ads" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AdsPage onAdComplete={handleReward} />
            </motion.div>
          )}
          {activePage === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <TasksPage onTaskComplete={handleReward} />
            </motion.div>
          )}
          {activePage === 'withdraw' && (
            <motion.div key="withdraw" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <WithdrawPage balance={userData.balance} />
            </motion.div>
          )}
          {activePage === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ProfilePage userData={userData} logout={handleLogout} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}