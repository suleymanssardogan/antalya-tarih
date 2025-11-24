import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uliarzhlxdjshuautrui.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsaWFyemhseGRqc2h1YXV0cnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzQ4NDAsImV4cCI6MjA3NzY1MDg0MH0.dkyBV6wYhnTc_m-Bbq1VZH1fxTO_laQty5Ed2RDg8hU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

