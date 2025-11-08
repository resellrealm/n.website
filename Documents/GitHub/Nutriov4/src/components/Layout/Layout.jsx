import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  Camera, ChefHat, Target, Heart, Trophy, History as HistoryIcon,
  LayoutDashboard, Menu, User, LogOut, Lock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const userLevel = localStorage.getItem('userLevel') || '1'
  const userPoints = localStorage.getItem('userPoints') || '0'
  const userName = localStorage.getItem('userName') || 'User'
  const userStreak = localStorage.getItem('userStreak') || '0'

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', color: 'text-primary', premium: false },
    { path: '/analyze', icon: Camera, label: 'Analyze Meal', color: 'text-blue-500', premium: false },
    { path: '/meal-planner', icon: ChefHat, label: 'Meal Planner', color: 'text-purple-500', premium: true },
    { path: '/goals', icon: Target, label: 'Goals', color: 'text-orange-500', premium: true },
    { path: '/favourites', icon: Heart, label: 'My Favourites', color: 'text-red-500', premium: false },
    { path: '/achievements', icon: Trophy, label: 'Achievements', color: 'text-yellow-500', premium: false },
    { path: '/history', icon: HistoryIcon, label: 'History', color: 'text-indigo-500', premium: false },
    { path: '/account', icon: User, label: 'Account', color: 'text-gray-500', premium: false },
  ]

  const isPremiumUser = localStorage.getItem('userPlan') === 'premium';

  const handleNavClick = (item, e) => {
    if (item.premium && !isPremiumUser) {
      e.preventDefault();
      toast.error('This feature requires Premium. Upgrade in Account settings!');
      return;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed z-50 p-2 rounded-xl shadow-md
                     bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/40
                     hover:bg-white/40 transition safe-top"
          style={{ top: 'max(16px, calc(env(safe-area-inset-top) + 8px))', left: '16px' }}
          aria-label="Open menu"
        >
          <Menu size={22} className="text-gray-800 dark:text-gray-100" />
        </button>
      )}

      <AnimatePresence>
        {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`${isSidebarOpen ? 'fixed' : 'relative'} lg:relative w-72 bg-white dark:bg-gray-800 shadow-xl h-full z-40 overflow-y-auto`}
          >
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/50 backdrop-blur">
                    <img src="/nutrio-icon.png" alt="Nutrio" className="w-full h-full object-cover" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Nutrio
                  </h1>
                </div>
              </div>

              <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Level {userLevel}</span>
                  <span className="text-sm font-semibold text-primary">{userPoints} XP</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                    style={{ width: `${parseInt(userPoints) % 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {userLevel < 5 ? 'Nutrition Newbie' : userLevel < 10 ? 'Meal Master' : 'Macro Guru'}
                  </span>
                  <span className="text-xs text-orange-500 font-semibold">🔥 {userStreak} day streak</span>
                </div>
              </div>

              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isLocked = item.premium && !isPremiumUser
                    return (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                              isActive
                                ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-semibold'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                            } ${isLocked ? 'opacity-60' : ''}`
                          }
                          onClick={(e) => handleNavClick(item, e)}
                        >
                          <Icon className={`transition-colors duration-200 ${item.color}`} size={20} />
                          <span className="flex-1">{item.label}</span>
                          {isLocked && <Lock size={16} className="text-orange-500" />}
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                      {(userName[0] || 'U').toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Level {userLevel}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { localStorage.clear(); toast.success('Logged out successfully!'); navigate('/login') }}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full">
        <header className="safe-top bg-white dark:bg-gray-800 px-4 sm:px-6 lg:px-8 py-2 sticky top-0 z-30" />
        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
          <div className="w-full max-w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}

export default Layout