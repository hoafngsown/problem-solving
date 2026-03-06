import { SwapForm } from "./components/SwapForm";
import { motion } from "framer-motion";

function App() {
  return (
    <div className="min-h-screen w-full bg-[#050511] font-sans flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-600/10 blur-[120px]" />
      </div>

      <div className="z-10 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-6 h-6 text-white"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-slate-400">
            FancySwap
          </h1>
        </motion.div>

        <SwapForm />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-slate-500 text-sm flex gap-6"
        >
          <a href="#" className="hover:text-slate-300 transition-colors">
            Help Center
          </a>
          <a href="#" className="hover:text-slate-300 transition-colors">
            Documentation
          </a>
          <a href="#" className="hover:text-slate-300 transition-colors">
            Terms of Service
          </a>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
