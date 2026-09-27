const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tpzkmjpkeqoocrjxueac.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY; // Loaded from Render Environment Variables

let supabase = null;
if (supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.warn("Failed to initialize Supabase, running in memory-only mode:", err.message);
  }
} else {
  console.log("Supabase key missing. Running in local memory-only mode.");
}

module.exports = supabase;
