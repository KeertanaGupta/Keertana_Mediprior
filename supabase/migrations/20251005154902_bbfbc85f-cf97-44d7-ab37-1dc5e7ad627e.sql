-- Create profiles table for user health information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  dob DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  weight DECIMAL,
  height DECIMAL,
  substance_use TEXT,
  history TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create reports table for medical documents
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  report_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reports
CREATE POLICY "Users can view their own reports"
  ON public.reports
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports"
  ON public.reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
  ON public.reports
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
  ON public.reports
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for medical reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-reports', 'medical-reports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for medical reports
CREATE POLICY "Users can view their own reports"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'medical-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own reports"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'medical-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own reports"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'medical-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();