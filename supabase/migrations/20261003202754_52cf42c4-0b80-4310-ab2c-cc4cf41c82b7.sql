CREATE TABLE public.orders (
  id text PRIMARY KEY,
  status text NOT NULL DEFAULT 'waiting_payment' CHECK (status IN ('waiting_payment', 'paid', 'canceled')),
  amount_cents integer NOT NULL,
  customer jsonb NOT NULL,
  endereco text NOT NULL,
  cep text NOT NULL,
  frete jsonb NOT NULL,
  items jsonb NOT NULL,
  ip text,
  ua text,
  paid_at timestamptz,
  tracking_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE INDEX orders_created_at_idx ON public.orders (created_at DESC);

CREATE OR REPLACE FUNCTION public.set_orders_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.set_orders_updated_at();