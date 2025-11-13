<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\DatabaseService;
use Illuminate\Validation\ValidationException;

class RegisteredUserController extends Controller
{
    protected $db;

    public function __construct(?DatabaseService $db = null)
    {
        $this->db = $db;
    }

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'role' => 'required|string|in:runner,trainer',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Use raw SQL if DatabaseService available, otherwise use Eloquent (for tests)
        if ($this->db) {
            // Check for existing email
            $existingUser = $this->db->fetch(
                "SELECT id FROM users WHERE email = ?",
                [$request->email]
            );

            if ($existingUser) {
                throw ValidationException::withMessages([
                    'email' => 'This email is already taken.',
                ]);
            }

            // Create user with raw SQL
            $this->db->executeQuery(
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                [
                    $request->name,
                    $request->email,
                    Hash::make($request->password),
                    $request->role
                ]
            );

            // Get the created user and convert to User model
            $userData = $this->db->fetch(
                "SELECT * FROM users WHERE email = ?",
                [$request->email]
            );

            // Create User model instance and manually set attributes including id
            $user = new User();
            $user->id = $userData['id'];
            $user->name = $userData['name'];
            $user->email = $userData['email'];
            $user->password = $userData['password'];
            $user->role = $userData['role'];
            $user->exists = true; // Mark as existing record
        } else {
            // Fallback for testing environment
            $request->validate([
                'email' => 'unique:users',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}