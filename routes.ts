/**
 * Routes that are public
 */

export const publicRoutes = [
    '/',
]


/**
 * Routes that are used authentication
 * These will redirect the user to the settings page
 * if they are already authenticated
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
]

/**
 * Routes that are used for the api authentication
 */
export const apiAuthPrefix = "/api/auth";

/**
 * the default login redirect path 
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
