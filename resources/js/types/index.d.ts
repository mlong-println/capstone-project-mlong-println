// resources/js/types/index.d.ts

/**
 * User model used by the application.
 * Extend this as your users table/schema evolves.
 */
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

/**
 * Global PageProps type used by Inertia pages.
 * IMPORTANT: auth.user must be User | null because guests have no user.
 * This aligns with HandleInertiaRequests::share() and routes/web.php where
 * $request->user() returns null when not authenticated.
 */
export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null; // allow null for guests
    };
};