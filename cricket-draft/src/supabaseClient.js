import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tpzkmjpkeqoocrjxueac.supabase.co';
const supabaseKey = 'sb_publishable_ayUUARCbybjyTqhXN7EU6w_NucLF1kb';

export const supabase = createClient(supabaseUrl, supabaseKey);
