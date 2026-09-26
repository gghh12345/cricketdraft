const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tpzkmjpkeqoocrjxueac.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY; // Loaded from Render Environment Variables

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
