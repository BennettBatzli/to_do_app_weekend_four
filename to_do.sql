CREATE TABLE to_do
(
  id serial NOT NULL,
  task_name character varying(255) NOT NULL,
  complete boolean NOT NULL DEFAULT false,
  CONSTRAINT to_do_pkey PRIMARY KEY (id)
);