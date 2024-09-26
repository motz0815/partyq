import { Database } from "@/types/database"
import { createClient, SupabaseClient } from "@supabase/supabase-js"

/**
 * Creates an admin client for Supabase.
 *
 * @remarks
 * This function uses the `SERVICE_ROLE_KEY` which must only be used in a secure server-side context
 * as it has admin privileges and can overwrite Row Level Security (RLS) policies.
 *
 * @returns {SupabaseClient<Database>} The Supabase client with admin privileges.
 */
export function createAdminClient(): SupabaseClient<Database> {
    // Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
    // as it has admin privileges and overwrites RLS policies!
    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
}
