-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';
-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	user_id uuid DEFAULT gen_random_uuid() NOT NULL,
	email varchar DEFAULT ''::character varying NOT NULL,
	"name" varchar DEFAULT ''::character varying NOT NULL,
	"password" varchar DEFAULT ''::character varying NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (user_id)
);

-- Permissions

ALTER TABLE public.users OWNER TO postgres;
GRANT ALL ON TABLE public.users TO postgres;


-- public.projects definition

-- Drop table

-- DROP TABLE public.projects;

CREATE TABLE public.projects (
	project_id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	"name" varchar DEFAULT ''::character varying NOT NULL,
	description varchar DEFAULT ''::character varying NOT NULL,
	CONSTRAINT projects_pk PRIMARY KEY (project_id),
	CONSTRAINT projects_users_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.projects OWNER TO postgres;
GRANT ALL ON TABLE public.projects TO postgres;


-- public.visualisations definition

-- Drop table

-- DROP TABLE public.visualisations;

CREATE TABLE public.visualisations (
	visualisation_id uuid DEFAULT gen_random_uuid() NOT NULL,
	project_id uuid NOT NULL,
	"name" varchar DEFAULT ''::character varying NOT NULL,
	description varchar DEFAULT ''::character varying NOT NULL,
	type varchar DEFAULT 'avg'::character varying NOT NULL,
	CONSTRAINT visualisations_pk PRIMARY KEY (visualisation_id),
	CONSTRAINT visualisations_projects_fk FOREIGN KEY (project_id) REFERENCES public.projects(project_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.visualisations OWNER TO postgres;
GRANT ALL ON TABLE public.visualisations TO postgres;


-- public.tokens definition

-- Drop table

-- DROP TABLE public.tokens;

CREATE TABLE public.tokens (
	token_id uuid DEFAULT gen_random_uuid() NOT NULL,
	project_id uuid NOT NULL,
	"name" varchar DEFAULT ''::character varying NOT NULL,
	description varchar DEFAULT ''::character varying NOT NULL,
	"token" varchar DEFAULT ''::character varying NOT NULL,
	CONSTRAINT tokens_pk PRIMARY KEY (token_id),
	CONSTRAINT tokens_unique UNIQUE (token),
	CONSTRAINT tokens_projects_fk FOREIGN KEY (project_id) REFERENCES public.projects(project_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.tokens OWNER TO postgres;
GRANT ALL ON TABLE public.tokens TO postgres;


-- public."data" definition

-- Drop table

-- DROP TABLE public."data";

CREATE TABLE public."data" (
	visualisation_id uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	value numeric NOT NULL,
	CONSTRAINT data_pk PRIMARY KEY (visualisation_id, "timestamp", value),
	CONSTRAINT data_visualisations_fk FOREIGN KEY (visualisation_id) REFERENCES public.visualisations(visualisation_id)
);

-- Permissions

ALTER TABLE public."data" OWNER TO postgres;
GRANT ALL ON TABLE public."data" TO postgres;




-- Permissions

GRANT ALL ON SCHEMA public TO pg_database_owner;
GRANT USAGE ON SCHEMA public TO public;