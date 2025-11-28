import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Achievement {
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

interface EarnedAchievement {
    id: number;
    achievement: {
        id: number;
        name: string;
        description: string;
        icon: string;
    };
    year: number;
    month: number;
    value_achieved: number;
    achieved_at: string;
}

interface AchievementsIndexProps {
    progress: Achievement[];
    earnedAchievements: EarnedAchievement[];
}

export default function Index({ progress, earnedAchievements }: AchievementsIndexProps) {
    const getIconEmoji = (icon: string) => {
        if (icon.includes('trophy')) {
            if (icon.includes('bronze')) return '🥉';
            if (icon.includes('silver')) return '🥈';
            if (icon.includes('gold')) return '🥇';
            if (icon.includes('platinum')) return '🏆';
            if (icon.includes('diamond')) return '💎';
            return '🏆';
        }
        if (icon.includes('mountain')) {
            if (icon.includes('bronze')) return '⛰️';
            if (icon.includes('silver')) return '🗻';
            if (icon.includes('gold')) return '🏔️';
            if (icon.includes('platinum')) return '🏔️';
            return '⛰️';
        }
        return '🏆';
    };

    const getMonthName = (month: number) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[month - 1];
    };

    const distanceAchievements = progress.filter(a => a.type === 'distance');
    const elevationAchievements = progress.filter(a => a.type === 'elevation');

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Achievements
                </h2>
            }
        >
            <Head title="Achievements" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Current Month Progress */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Current Month Progress
                        </h3>

                        {/* Distance Achievements */}
                        <div className="mb-6">
                            <h4 className="text-md font-medium text-gray-700 mb-3">Distance Challenges</h4>
                            <div className="space-y-4">
                                {distanceAchievements.map((achievement) => (
                                    <div key={achievement.id} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center">
                                                <span className="text-3xl mr-3">{getIconEmoji(achievement.icon)}</span>
                                                <div>
                                                    <h5 className="font-semibold text-gray-900">{achievement.name}</h5>
                                                    <p className="text-sm text-gray-600">{achievement.description}</p>
                                                </div>
                                            </div>
                                            {achievement.is_earned && (
                                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                                    ✓ Earned
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>{achievement.current_value} / {achievement.target_value} km</span>
                                                <span>{achievement.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${
                                                        achievement.is_earned ? 'bg-green-600' : 'bg-blue-600'
                                                    }`}
                                                    style={{ width: `${Math.min(achievement.progress, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Elevation Achievements */}
                        {elevationAchievements.length > 0 && (
                            <div>
                                <h4 className="text-md font-medium text-gray-700 mb-3">Elevation Challenges</h4>
                                <div className="space-y-4">
                                    {elevationAchievements.map((achievement) => (
                                        <div key={achievement.id} className="border rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center">
                                                    <span className="text-3xl mr-3">{getIconEmoji(achievement.icon)}</span>
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900">{achievement.name}</h5>
                                                        <p className="text-sm text-gray-600">{achievement.description}</p>
                                                    </div>
                                                </div>
                                                {achievement.is_earned && (
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                                        ✓ Earned
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-3">
                                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                    <span>{achievement.current_value} / {achievement.target_value} m</span>
                                                    <span>{achievement.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className={`h-2.5 rounded-full ${
                                                            achievement.is_earned ? 'bg-green-600' : 'bg-purple-600'
                                                        }`}
                                                        style={{ width: `${Math.min(achievement.progress, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Earned Achievements */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Achievement History
                        </h3>

                        {earnedAchievements.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No achievements earned yet. Keep running to unlock them!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {earnedAchievements.map((earned) => (
                                    <div key={earned.id} className="border rounded-lg p-4 bg-gradient-to-br from-yellow-50 to-white">
                                        <div className="flex items-center mb-2">
                                            <span className="text-4xl mr-3">{getIconEmoji(earned.achievement.icon)}</span>
                                            <div>
                                                <h5 className="font-semibold text-gray-900">{earned.achievement.name}</h5>
                                                <p className="text-xs text-gray-600">{earned.achievement.description}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="flex justify-between text-xs text-gray-600">
                                                <span>{getMonthName(earned.month)} {earned.year}</span>
                                                <span>{earned.value_achieved} km</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Earned on {earned.achieved_at}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
