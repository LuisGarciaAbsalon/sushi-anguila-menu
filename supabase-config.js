// ======================================================
// SUPABASE - ANGUILA SUSHI
// ======================================================

const SUPABASE_URL =
    "https://lhelatxkwowbbvrucpnw.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_lv7d1idqAJv3T9o9mm_NEg_hEnYMl7U";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );