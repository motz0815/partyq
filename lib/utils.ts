import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Constructs a full URL based on the provided path and environment variables.
 *
 * This function prioritizes the following environment variables to determine the base URL:
 * 1. `NEXT_PUBLIC_SITE_URL` - Should be set to your site URL in the production environment.
 * 2. `NEXT_PUBLIC_VERCEL_URL` - Automatically set by Vercel if `NEXT_PUBLIC_SITE_URL` is not set.
 *
 * If neither environment variable is set, it defaults to `http://localhost:3000/` for local development.
 *
 * The function ensures that:
 * - The base URL does not have a trailing slash.
 * - The base URL includes `https://` if it is not `localhost`.
 * - The provided path does not start with a slash to avoid double slashes in the final URL.
 *
 * @param {string} [path=""] - The path to append to the base URL.
 * @returns {string} - The constructed full URL.
 */
export const getURL = (path: string = "") => {
    // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL &&
        process.env.NEXT_PUBLIC_SITE_URL.trim() !== ""
            ? process.env.NEXT_PUBLIC_SITE_URL
            : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
              process?.env?.NEXT_PUBLIC_VERCEL_URL &&
                process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ""
              ? process.env.NEXT_PUBLIC_VERCEL_URL
              : // If neither is set, default to localhost for local development.
                "http://localhost:3000/"

    // Trim the URL and remove trailing slash if exists.
    url = url.replace(/\/+$/, "")
    // Make sure to include `https://` when not localhost.
    url = url.includes("http") ? url : `https://${url}`
    // Ensure path starts without a slash to avoid double slashes in the final URL.
    path = path.replace(/^\/+/, "")

    // Concatenate the URL and the path.
    return path ? `${url}/${path}` : url
}

const toastKeyMap: { [key: string]: string[] } = {
    status: ["status", "status_description"],
    error: ["error", "error_description"],
}

const getToastRedirect = (
    path: string,
    toastType: string,
    toastName: string,
    toastDescription: string = "",
    disableButton: boolean = false,
    arbitraryParams: string = "",
): string => {
    const [nameKey, descriptionKey] = toastKeyMap[toastType]

    let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`

    if (toastDescription) {
        redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`
    }

    if (disableButton) {
        redirectPath += `&disable_button=true`
    }

    if (arbitraryParams) {
        redirectPath += `&${arbitraryParams}`
    }

    return redirectPath
}

export const getStatusRedirect = (
    path: string,
    statusName: string,
    statusDescription: string = "",
    disableButton: boolean = false,
    arbitraryParams: string = "",
) =>
    getToastRedirect(
        path,
        "status",
        statusName,
        statusDescription,
        disableButton,
        arbitraryParams,
    )

export const getErrorRedirect = (
    path: string,
    errorName: string,
    errorDescription: string = "",
    disableButton: boolean = false,
    arbitraryParams: string = "",
) =>
    getToastRedirect(
        path,
        "error",
        errorName,
        errorDescription,
        disableButton,
        arbitraryParams,
    )
