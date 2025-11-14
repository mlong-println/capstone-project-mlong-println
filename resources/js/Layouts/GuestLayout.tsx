import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
            {/* Three theme backgrounds split equally */}
            <div className="absolute inset-0 flex">
                {/* Sunset theme - Left third */}
                <div className="w-1/3 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600"></div>
                
                {/* Ocean theme - Middle third */}
                <div className="w-1/3 bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600"></div>
                
                {/* Forest theme - Right third */}
                <div className="w-1/3 bg-gradient-to-br from-green-400 via-emerald-500 to-lime-600"></div>
            </div>

            {/* Content overlay */}
            <div className="relative z-10 w-full px-6">
                {/* Logo/Brand */}
                <div className="mb-8 text-center">
                    <Link href="/">
                        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
                            RunConnect
                        </h1>
                        <p className="mt-2 text-lg text-white/90 drop-shadow">
                            Your Running Community
                        </p>
                    </Link>
                </div>

                {/* Login form card */}
                <div className="mx-auto w-full overflow-hidden bg-white/95 backdrop-blur-sm px-8 py-8 shadow-2xl sm:max-w-md rounded-2xl border border-white/20">
                    {children}
                </div>

                {/* Footer text */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-white drop-shadow">
                        Choose your theme after logging in
                    </p>
                </div>
            </div>
        </div>
    );
}
