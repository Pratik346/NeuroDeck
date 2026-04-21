import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Brain,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navItem = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 
     ${
       isActive(path)
         ? "bg-white/10 text-white shadow-lg"
         : "text-white/70 hover:text-white hover:bg-white/5"
     }`;

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50"
    >
      {/* Background */}
      <div className="relative backdrop-blur-2xl bg-black/50 border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">

        {/* Gradient Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-xl opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text hover:scale-105 transition"
          >
            SmartCards AI
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">

            {user ? (
              <>
                {/* User Badge */}
                <div className="px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm">
                  👋 {user.name}
                </div>

                <Link to="/dashboard" className={navItem("/dashboard")}>
                  <LayoutDashboard size={16} /> Dashboard
                </Link>

                <Link to="/analytics" className={navItem("/analytics")}>
                  <BarChart3 size={16} /> Analytics
                </Link>

                <Link to="/interview" className={navItem("/interview")}>
                  <Brain size={16} /> Interview
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl 
                  bg-gradient-to-r from-red-500/70 to-pink-500/70 
                  hover:from-red-500 hover:to-pink-500 
                  text-white text-sm shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white/70 hover:text-white transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl 
                  bg-gradient-to-r from-indigo-500 to-purple-600 
                  text-white font-medium shadow-lg 
                  hover:scale-105 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-white/10 bg-black/80 backdrop-blur-xl"
            >
              <div className="px-6 py-5 flex flex-col gap-4">

                {user ? (
                  <>
                    <div className="text-sm text-white/60">
                      Signed in as{" "}
                      <span className="text-white font-semibold">
                        {user.name}
                      </span>
                    </div>

                    <Link to="/dashboard" className={navItem("/dashboard")}>
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>

                    <Link to="/analytics" className={navItem("/analytics")}>
                      <BarChart3 size={16} /> Analytics
                    </Link>

                    <Link to="/interview" className={navItem("/interview")}>
                      <Brain size={16} /> Interview
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-300 mt-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-white/70">
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;