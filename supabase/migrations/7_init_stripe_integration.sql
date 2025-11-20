-- Stripe integration setup
-- Note: Stripe customer creation/deletion is handled via Edge Functions
-- (create-stripe-session and stripe-webhook) rather than database triggers/FDW

-- Security policy: Users can read their own profile data (including Stripe customer ID)
-- This policy ensures users can only see their own profile information
create policy "Users can read own profile data"
  on public.profiles
  for select
  using (auth.uid() = user_id);