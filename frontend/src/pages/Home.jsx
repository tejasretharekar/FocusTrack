// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Timer, Apple, Dumbbell, Trophy, LayoutDashboard } from 'lucide-react';

const quotes = [
    "Focus on being productive instead of busy.",
    "Discipline is choosing between what you want now and what you want most.",
    "The secret of getting ahead is getting started.",
    "Don't stop when you're tired. Stop when you're done."
];

const features = [
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={32} />, color: 'from-focusOrange to-orange-400' },
    { name: 'Pomodoro', path: '/pomodoro', icon: <Timer size={32} />, color: 'from-focusPurple to-purple-400' },
    { name: 'Diet', path: '/diet', icon: <Apple size={32} />, color: 'from-green-600 to-green-400' },
    { name: 'Workout', path: '/workout', icon: <Dumbbell size={32} />, color: 'from-red-600 to-red-400' },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={32} />, color: 'from-yellow-600 to-yellow-400' },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={32} />, color: 'from-blue-600 to-blue-400' }
];

export default function Home() {
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const navigate = useNavigate();

    // Handle quote fading and rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // Start fade out
            setTimeout(() => {
                setQuoteIndex((prev) => (prev + 1) % quotes.length);
                setFade(true); // Start fade in
            }, 500); // Wait for fade out to finish before changing text
        }, 6000); // Change quote every 6 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-[#1a0b2e] via-[#121212] to-[#2d1406] flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Motivational Quote Section */}
            <div className="flex-1 flex items-center justify-center w-full max-w-3xl text-center px-4">
                <h1
                    className={`text-3xl md:text-5xl font-bold text-focusText transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                >
                    "{quotes[quoteIndex]}"
                </h1>
            </div>

            {/* Navigation Buttons Grid */}
            <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-12">
                {features.map((feature) => (
                    <button
                        key={feature.name}
                        onClick={() => navigate(feature.path)}
                        className={`group relative flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl bg-focusCard shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-800 hover:border-gray-600 overflow-hidden`}
                    >
                        {/* Gradient Background Hover Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                        <div className={`text-gray-400 group-hover:text-white transition-colors duration-300 mb-4`}>
                            {feature.icon}
                        </div>
                        <span className="text-lg md:text-xl font-semibold text-focusText tracking-wide">
                            {feature.name}
                        </span>
                    </button>
                ))}
            </div>

        </div>
    );
}