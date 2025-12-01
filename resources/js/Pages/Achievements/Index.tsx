import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Challenge {
    id: number;
    name: string;
    description: string;
    type: string;
    target_value: number;
    icon: string;
}

interface Progress {
    id: number;
    name: string;
    description: string;
    type: string;
    target_value: number;
    current_value: number;
    progress: number;
    icon: string;
    is_earned: boolean;
}

interface LeaderboardEntry {
    user_id: number;
    user_name: string;
    value: number;
    progress: number;
}

interface EarnedAchievement {
    id: number;
    achievement: {
        id: number;
        name: string;
        description: string;
        type: string;
        target_value: number;
        icon: string;
    };
    year: number;
    month: number;
    value_achieved: number;
    achieved_at: string;
}

interface AchievementsIndexProps {
    challenges: Challenge[];
    enrolledChallengeIds: number[];
    progress: Progress[];
    leaderboards: { [key: number]: LeaderboardEntry[] };
    earnedAchievements: EarnedAchievement[];
}

export default function Index({ challenges, enrolledChallengeIds, progress, leaderboards, earnedAchievements }: AchievementsIndexProps) {
    const handleJoin = (challengeId: number) => {
        router.post(`/achievements/${challengeId}/join`, {}, {
            preserveScroll: true,
        });
    };

    const handleLeave = (challengeId: number) => {
        if (confirm('Are you sure you want to leave this challenge?')) {
            router.delete(`/achievements/${challengeId}/leave`, {
                preserveScroll: true,
            });
        }
    };

    const getProgressForChallenge = (challengeId: number): Progress | undefined => {
        return progress.find(p => p.id === challengeId);
    };

    const isEnrolled = (challengeId: number): boolean => {
        return enrolledChallengeIds.includes(challengeId);
    };

    const getDistanceDisplay = (distance: number): string => {
        return `${distance}km`;
    };

    // Get badge gradient based on target value
    const getBadgeGradient = (targetValue: number, type: string): { light: string; dark: string } => {
        if (type === 'distance') {
            if (targetValue === 50) return { light: 'from-emerald-400 to-emerald-600', dark: 'from-emerald-600 to-emerald-700' };
            if (targetValue === 100) return { light: 'from-blue-400 to-blue-600', dark: 'from-blue-600 to-blue-700' };
            if (targetValue === 200) return { light: 'from-purple-400 to-purple-600', dark: 'from-purple-600 to-purple-700' };
            if (targetValue === 300) return { light: 'from-pink-400 to-pink-600', dark: 'from-pink-600 to-pink-700' };
            if (targetValue === 500) return { light: 'from-orange-400 to-orange-600', dark: 'from-orange-600 to-orange-700' };
            return { light: 'from-green-400 to-green-600', dark: 'from-green-600 to-green-700' };
        } else {
            if (targetValue === 250) return { light: 'from-teal-400 to-teal-600', dark: 'from-teal-600 to-teal-700' };
            if (targetValue === 500) return { light: 'from-cyan-400 to-cyan-600', dark: 'from-cyan-600 to-cyan-700' };
            if (targetValue === 1000) return { light: 'from-indigo-400 to-indigo-600', dark: 'from-indigo-600 to-indigo-700' };
            if (targetValue === 2000) return { light: 'from-violet-400 to-violet-600', dark: 'from-violet-600 to-violet-700' };
            if (targetValue === 5000) return { light: 'from-fuchsia-400 to-fuchsia-600', dark: 'from-fuchsia-600 to-fuchsia-700' };
            return { light: 'from-green-400 to-green-600', dark: 'from-green-600 to-green-700' };
        }
    };

    // Group challenges by type
    const distanceChallenges = challenges.filter(c => c.type === 'distance');
    const elevationChallenges = challenges.filter(c => c.type === 'elevation');

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Monthly Challenges
                </h2>
            }
        >
            <Head title="Challenges" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 bg-white/90 backdrop-blur-sm overflow-hidden shadow-sm sm:rounded-lg border border-white/20 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">How Challenges Work</h3>
                        <p className="text-sm text-gray-600">
                            Join monthly challenges to compete with other runners! Your progress is calculated from all runs logged during the current calendar month. 
                            Join a challenge to see the leaderboard and track your progress.
                        </p>
                    </div>

                    {/* Distance Challenges */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">🏃 Distance Challenges</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {distanceChallenges.map((challenge) => {
                                const enrolled = isEnrolled(challenge.id);
                                const challengeProgress = getProgressForChallenge(challenge.id);
                                const leaderboard = leaderboards[challenge.id] || [];

                                return (
                                    <div
                                        key={challenge.id}
                                        className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border-2 transition ${
                                            enrolled ? 'border-green-500' : 'border-white/20'
                                        }`}
                                    >
                                        <div className="p-6">
                                            {/* Challenge Icon/Badge */}
                                            <div className="flex justify-center mb-4">
                                                <div className="relative">
                                                    <div className={`w-24 h-32 bg-gradient-to-b ${getBadgeGradient(challenge.target_value, challenge.type).light} rounded-lg shadow-lg flex items-center justify-center`}>
                                                        <span className="text-white font-bold text-2xl">
                                                            {challenge.target_value}km
                                                        </span>
                                                    </div>
                                                    <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gradient-to-b ${getBadgeGradient(challenge.target_value, challenge.type).dark}`}
                                                         style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Challenge Info */}
                                            <h4 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                                {challenge.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 text-center mb-4">
                                                {challenge.description}
                                            </p>

                                            {/* Join/Leave Button */}
                                            {!enrolled ? (
                                                <button
                                                    onClick={() => handleJoin(challenge.id)}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                                                >
                                                    Join Challenge
                                                </button>
                                            ) : (
                                                <>
                                                    {/* Progress Bar */}
                                                    {challengeProgress && (
                                                        <div className="mb-4">
                                                            <div className="flex justify-between text-sm mb-1">
                                                                <span className="text-gray-700 font-medium">Your Progress</span>
                                                                <span className="text-gray-600">
                                                                    {challengeProgress.current_value} / {challenge.target_value} km
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                                <div
                                                                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                                                                    style={{ width: `${Math.min(challengeProgress.progress, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1 text-center">
                                                                {challengeProgress.progress.toFixed(1)}% Complete
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Leaderboard */}
                                                    {leaderboard.length > 0 && (
                                                        <div className="mb-4 bg-gray-50 rounded-lg p-3">
                                                            <h5 className="text-sm font-semibold text-gray-900 mb-2">
                                                                Leaderboard ({leaderboard.length} participants)
                                                            </h5>
                                                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                                                {leaderboard.slice(0, 5).map((entry, index) => (
                                                                    <div key={entry.user_id} className="flex justify-between text-xs">
                                                                        <span className="text-gray-700">
                                                                            {index + 1}. {entry.user_name}
                                                                        </span>
                                                                        <span className="text-gray-600 font-medium">
                                                                            {entry.value} km
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={() => handleLeave(challenge.id)}
                                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
                                                    >
                                                        Leave Challenge
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Elevation Challenges */}
                    {elevationChallenges.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">⛰️ Elevation Challenges</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {elevationChallenges.map((challenge) => {
                                    const enrolled = isEnrolled(challenge.id);
                                    const challengeProgress = getProgressForChallenge(challenge.id);
                                    const leaderboard = leaderboards[challenge.id] || [];

                                    return (
                                        <div
                                            key={challenge.id}
                                            className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border-2 transition ${
                                                enrolled ? 'border-green-500' : 'border-white/20'
                                            }`}
                                        >
                                            <div className="p-6">
                                                {/* Challenge Icon/Badge */}
                                                <div className="flex justify-center mb-4">
                                                    <div className="relative">
                                                        <div className={`w-24 h-32 bg-gradient-to-b ${getBadgeGradient(challenge.target_value, challenge.type).light} rounded-lg shadow-lg flex items-center justify-center`}>
                                                            <span className="text-white font-bold text-xl text-center">
                                                                {challenge.target_value}m
                                                            </span>
                                                        </div>
                                                        <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gradient-to-b ${getBadgeGradient(challenge.target_value, challenge.type).dark}`}
                                                             style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Challenge Info */}
                                                <h4 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                                    {challenge.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 text-center mb-4">
                                                    {challenge.description}
                                                </p>

                                                {/* Join/Leave Button */}
                                                {!enrolled ? (
                                                    <button
                                                        onClick={() => handleJoin(challenge.id)}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                                                    >
                                                        Join Challenge
                                                    </button>
                                                ) : (
                                                    <>
                                                        {/* Progress Bar */}
                                                        {challengeProgress && (
                                                            <div className="mb-4">
                                                                <div className="flex justify-between text-sm mb-1">
                                                                    <span className="text-gray-700 font-medium">Your Progress</span>
                                                                    <span className="text-gray-600">
                                                                        {challengeProgress.current_value} / {challenge.target_value} m
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                                    <div
                                                                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                                                                        style={{ width: `${Math.min(challengeProgress.progress, 100)}%` }}
                                                                    ></div>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1 text-center">
                                                                    {challengeProgress.progress.toFixed(1)}% Complete
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Leaderboard */}
                                                        {leaderboard.length > 0 && (
                                                            <div className="mb-4 bg-gray-50 rounded-lg p-3">
                                                                <h5 className="text-sm font-semibold text-gray-900 mb-2">
                                                                    Leaderboard ({leaderboard.length} participants)
                                                                </h5>
                                                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                                                    {leaderboard.slice(0, 5).map((entry, index) => (
                                                                        <div key={entry.user_id} className="flex justify-between text-xs">
                                                                            <span className="text-gray-700">
                                                                                {index + 1}. {entry.user_name}
                                                                            </span>
                                                                            <span className="text-gray-600 font-medium">
                                                                                {entry.value} m
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={() => handleLeave(challenge.id)}
                                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
                                                        >
                                                            Leave Challenge
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Trophy Case */}
                    {earnedAchievements.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">🏆 Trophy Case</h3>
                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg shadow-lg border-2 border-yellow-300 p-6">
                                <p className="text-sm text-gray-600 mb-4">
                                    Your earned achievements from all time
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    {earnedAchievements.map((earned) => (
                                        <div
                                            key={earned.id}
                                            className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-xl transition"
                                        >
                                            {/* Badge */}
                                            <div className="flex justify-center mb-2">
                                                <div className="relative">
                                                    <div className={`w-16 h-20 bg-gradient-to-b ${getBadgeGradient(earned.achievement.target_value, earned.achievement.type).light} rounded-lg shadow-lg flex items-center justify-center`}>
                                                        <span className="text-white font-bold text-sm">
                                                            {earned.achievement.target_value}{earned.achievement.type === 'distance' ? 'km' : 'm'}
                                                        </span>
                                                    </div>
                                                    <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-5 bg-gradient-to-b ${getBadgeGradient(earned.achievement.target_value, earned.achievement.type).dark}`}
                                                         style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Achievement Name */}
                                            <h5 className="text-xs font-semibold text-gray-900 mb-1">
                                                {earned.achievement.name}
                                            </h5>
                                            {/* Date */}
                                            <p className="text-xs text-gray-500">
                                                {new Date(earned.achieved_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </p>
                                            {/* Value Achieved */}
                                            <p className="text-xs text-gray-600 mt-1">
                                                {Number(earned.value_achieved).toFixed(1)}{earned.achievement.type === 'distance' ? 'km' : 'm'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
