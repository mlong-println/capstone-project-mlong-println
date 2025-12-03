<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserProfileController extends Controller
{
    /**
     * Display a list of users for finding/following
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        
        $users = User::query()
            ->where('id', '!=', auth()->id()) // Exclude current user
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->with('profile')
            ->orderBy('name')
            ->paginate(20);
        
        // Add follow status for each user
        $usersWithFollowStatus = $users->map(function ($user) {
            $follow = Follow::where('follower_id', auth()->id())
                ->where('following_id', $user->id)
                ->first();
            
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'location' => $user->profile?->location,
                'follow_status' => $follow?->status,
                'follow_id' => $follow?->id,
            ];
        });
        
        return Inertia::render('Users/Index', [
            'users' => $usersWithFollowStatus,
            'search' => $search,
        ]);
    }
    
    /**
     * Display a user's public profile
     */
    public function show(User $user): Response
    {
        $currentUser = auth()->user();
        $isOwnProfile = $currentUser && $currentUser->id === $user->id;
        
        // Get follow status
        $followStatus = null;
        $followId = null;
        $isFollowing = false;
        
        if ($currentUser && !$isOwnProfile) {
            $follow = Follow::where('follower_id', $currentUser->id)
                ->where('following_id', $user->id)
                ->first();
            
            if ($follow) {
                $followStatus = $follow->status;
                $followId = $follow->id;
                $isFollowing = $follow->status === 'approved';
            }
        }
        
        // Determine if user can view full profile
        // Full profile visible if: viewing own profile OR following each other
        $canViewFullProfile = $isOwnProfile || $isFollowing;
        
        // Basic profile info (always visible)
        $profileData = [
            'id' => $user->id,
            'name' => $user->name,
            'role' => $user->role,
        ];
        
        // Get user's profile for location
        $userProfile = $user->profile;
        if ($userProfile) {
            $profileData['location'] = $userProfile->location;
        }
        
        // Only show email if can view full profile
        if ($canViewFullProfile) {
            $profileData['email'] = $user->email;
        }
        
        // Get followers and following counts (always visible)
        $followersCount = Follow::where('following_id', $user->id)->approved()->count();
        $followingCount = Follow::where('follower_id', $user->id)->approved()->count();
        
        // Initialize data arrays
        $followers = [];
        $following = [];
        $pendingRequests = [];
        $stats = [
            'followers_count' => $followersCount,
            'following_count' => $followingCount,
            'total_runs' => 0,
            'total_distance' => 0,
        ];
        
        // Only load detailed data if can view full profile
        if ($canViewFullProfile) {
            // Get followers and following with approved status
            $followers = Follow::where('following_id', $user->id)
                ->approved()
                ->with('follower')
                ->get()
                ->map(fn($follow) => [
                    'id' => $follow->follower->id,
                    'name' => $follow->follower->name,
                    'email' => $follow->follower->email,
                ]);
            
            $following = Follow::where('follower_id', $user->id)
                ->approved()
                ->with('following')
                ->get()
                ->map(fn($follow) => [
                    'id' => $follow->following->id,
                    'name' => $follow->following->name,
                    'email' => $follow->following->email,
                ]);
            
            // Get pending follow requests (only if viewing own profile)
            if ($isOwnProfile) {
                $pendingRequests = Follow::where('following_id', $user->id)
                    ->pending()
                    ->with('follower')
                    ->get()
                    ->map(fn($follow) => [
                        'id' => $follow->id,
                        'follower' => [
                            'id' => $follow->follower->id,
                            'name' => $follow->follower->name,
                            'email' => $follow->follower->email,
                        ],
                        'created_at' => $follow->created_at,
                    ]);
            }
            
            // Get user stats
            $stats['total_runs'] = $user->runs()->count();
            $stats['total_distance'] = round($user->runs()->join('routes', 'runs.route_id', '=', 'routes.id')->sum('routes.distance'), 2);
        }
        
        return Inertia::render('Users/Show', [
            'profileUser' => $profileData,
            'followStatus' => $followStatus,
            'followId' => $followId,
            'followers' => $followers,
            'following' => $following,
            'pendingRequests' => $pendingRequests,
            'stats' => $stats,
            'isOwnProfile' => $isOwnProfile,
            'canViewFullProfile' => $canViewFullProfile,
        ]);
    }
}
