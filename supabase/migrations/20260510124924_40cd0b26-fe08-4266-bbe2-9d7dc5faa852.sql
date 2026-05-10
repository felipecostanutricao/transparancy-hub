
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.crns_banidos (
  crn text PRIMARY KEY,
  motivo text,
  banido_em timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.crns_banidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read banned CRNs" ON public.crns_banidos
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage banned CRNs" ON public.crns_banidos
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.despesas_cfn ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read despesas" ON public.despesas_cfn
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage despesas" ON public.despesas_cfn
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.comentarios_nutri ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read visible comments" ON public.comentarios_nutri
  FOR SELECT TO anon, authenticated USING (status_moderacao = 'visivel');
CREATE POLICY "Admins can read all comments" ON public.comentarios_nutri
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can insert comments with terms" ON public.comentarios_nutri
  FOR INSERT TO anon, authenticated WITH CHECK (termo_aceite = true);
CREATE POLICY "Admins can moderate comments" ON public.comentarios_nutri
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.log_acessos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log access" ON public.log_acessos
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read access logs" ON public.log_acessos
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.block_banned_crn()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.crns_banidos WHERE crn = NEW.crn) THEN
    RAISE EXCEPTION 'CRN % está banido', NEW.crn USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_block_banned_crn
BEFORE INSERT ON public.comentarios_nutri
FOR EACH ROW EXECUTE FUNCTION public.block_banned_crn();
