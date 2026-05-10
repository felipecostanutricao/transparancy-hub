
ALTER TABLE public.air_travel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_comments ENABLE ROW LEVEL SECURITY;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.block_banned_crn() FROM PUBLIC, anon, authenticated;
