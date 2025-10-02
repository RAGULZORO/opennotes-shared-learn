-- Add new columns for categorization
ALTER TABLE public.notes 
ADD COLUMN category VARCHAR(50),
ADD COLUMN unit VARCHAR(50),
ADD COLUMN year INTEGER,
ADD COLUMN semester INTEGER,
ADD COLUMN department VARCHAR(100),
ADD COLUMN question_paper_year VARCHAR(50);

-- Add check constraint for category
ALTER TABLE public.notes
ADD CONSTRAINT check_category 
CHECK (category IN ('study_material', 'question_paper', 'lab_manual'));

-- Add check constraint for year
ALTER TABLE public.notes
ADD CONSTRAINT check_year 
CHECK (year >= 1 AND year <= 4);

-- Add check constraint for semester
ALTER TABLE public.notes
ADD CONSTRAINT check_semester 
CHECK (semester >= 1 AND semester <= 8);