CREATE TABLE public.profiles (id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, full_name text NOT NULL DEFAULT '', headline text NOT NULL DEFAULT '', location text NOT NULL DEFAULT '', skills text NOT NULL DEFAULT '', bio text NOT NULL DEFAULT '');
GRANT SELECT,INSERT,UPDATE ON public.profiles TO authenticated; GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_profile ON public.profiles FOR ALL TO authenticated USING (id=auth.uid()) WITH CHECK (id=auth.uid());
CREATE FUNCTION public.create_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN INSERT INTO public.profiles(id,full_name) VALUES(new.id,coalesce(new.raw_user_meta_data->>'full_name','')); RETURN new; END; $$;
CREATE TRIGGER create_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_profile();
CREATE TABLE public.jobs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner_id uuid, title text NOT NULL, company text NOT NULL, location text NOT NULL, type text NOT NULL DEFAULT 'Full-time', category text NOT NULL DEFAULT 'Engineering', salary text NOT NULL DEFAULT 'Competitive', description text NOT NULL, requirements text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.jobs TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.jobs TO authenticated; GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY public_jobs ON public.jobs FOR SELECT TO anon,authenticated USING(true);
CREATE POLICY owner_jobs ON public.jobs FOR ALL TO authenticated USING(owner_id=auth.uid()) WITH CHECK(owner_id=auth.uid());
CREATE TABLE public.saved_jobs (user_id uuid NOT NULL, job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL, PRIMARY KEY(user_id,job_id));
GRANT SELECT,INSERT,DELETE ON public.saved_jobs TO authenticated; GRANT ALL ON public.saved_jobs TO service_role;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_saved ON public.saved_jobs FOR ALL TO authenticated USING(user_id=auth.uid()) WITH CHECK(user_id=auth.uid());
CREATE TABLE public.applications(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL,job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,full_name text NOT NULL,email text NOT NULL,cover_letter text NOT NULL DEFAULT '',resume_path text NOT NULL DEFAULT '',status text NOT NULL DEFAULT 'Applied' CHECK(status IN ('Applied','Reviewing','Interview','Offer','Rejected')),created_at timestamptz NOT NULL DEFAULT now(),UNIQUE(user_id,job_id));
GRANT SELECT,INSERT ON public.applications TO authenticated; GRANT UPDATE(status) ON public.applications TO authenticated; GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY read_applications ON public.applications FOR SELECT TO authenticated USING(user_id=auth.uid() OR EXISTS(SELECT 1 FROM public.jobs WHERE jobs.id=job_id AND jobs.owner_id=auth.uid()));
CREATE POLICY submit_application ON public.applications FOR INSERT TO authenticated WITH CHECK(user_id=auth.uid() AND status='Applied');
CREATE POLICY manage_applicants ON public.applications FOR UPDATE TO authenticated USING(EXISTS(SELECT 1 FROM public.jobs WHERE jobs.id=job_id AND jobs.owner_id=auth.uid())) WITH CHECK(EXISTS(SELECT 1 FROM public.jobs WHERE jobs.id=job_id AND jobs.owner_id=auth.uid()));
CREATE POLICY upload_resume ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id='resumes' AND (storage.foldername(name))[1]=auth.uid()::text);
CREATE POLICY read_resume ON storage.objects FOR SELECT TO authenticated USING(bucket_id='resumes' AND ((storage.foldername(name))[1]=auth.uid()::text OR EXISTS(SELECT 1 FROM public.applications a JOIN public.jobs j ON j.id=a.job_id WHERE a.resume_path=name AND j.owner_id=auth.uid())));
INSERT INTO public.jobs(title,company,location,type,category,salary,description,requirements) VALUES
('Product Designer','Linear','San Francisco, CA','Full-time','Design','$90k – $130k','Help us craft thoughtful, beautifully simple tools that empower teams to build better software. Work alongside a small team that cares deeply about quality.','Figma proficiency; Strong portfolio; Collaborative mindset'),
('Frontend Developer','Notion','Remote','Full-time','Engineering','$100k – $150k','Build delightful, accessible experiences for millions of people. Bring our flexible workspace to life with a talented product team.','React and TypeScript; Web accessibility; Attention to detail'),
('Marketing Intern','Spotify','New York, NY','Internship','Marketing','$25 – $35 / hr','Connect creators with their next fans. Support creative campaigns, analyze performance and bring fresh ideas to a global music platform.','Currently enrolled student; Great communication; Passion for music'),
('UX Research Intern','Figma','San Francisco, CA','Internship','Design','$30 – $40 / hr','Explore how teams design together. Assist with user interviews, usability studies and research synthesis.','Research curiosity; Analytical thinking; Clear writing'),
('Data Analyst','Airbnb','Remote','Full-time','Data','$85k – $120k','Turn complex data into clear insights and help shape the future of travel. Partner with product and operations teams.','SQL; Python or R; Data storytelling'),
('Software Engineer','Stripe','Seattle, WA','Full-time','Engineering','$120k – $170k','Build reliable infrastructure that helps businesses grow. Solve meaningful technical challenges with a collaborative team.','Programming fundamentals; API design; Problem solving'),
('Brand Designer','Canva','Austin, TX','Part-time','Design','$45 – $65 / hr','Create expressive brand experiences that inspire people to design. Collaborate on campaigns and visual storytelling.','Visual design portfolio; Adobe Creative Suite; Typography'),
('Business Operations Intern','Microsoft','Seattle, WA','Internship','Business','$28 – $38 / hr','Learn how global teams operate. Support projects, track business metrics and contribute to process improvements.','Excel; Organization; Communication');