ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS nature_of_business text;

UPDATE public.clients
SET nature_of_business = CASE
  WHEN name ILIKE 'Aaron%' THEN 'Capital Goods (Elevators Manufacturers)'
  WHEN name ILIKE 'IBL%' THEN 'NBFC'
  WHEN name ILIKE 'Zorko%' THEN 'Quick Service Restaurant (QSR)'
  WHEN name ILIKE 'REM%' THEN 'Capital Goods (Automation Panel)'
  WHEN name ILIKE 'Aarya%' THEN 'EV Motorcycles'
  WHEN name ILIKE 'Cruizine%' THEN 'Medical Equipments (Surgical Products)'
  WHEN name ILIKE 'Candor%' THEN 'IVF Centres/Hospital'
  WHEN name ILIKE 'Express%' THEN 'Elevator Installers'
  WHEN name ILIKE 'Zestika%' THEN 'Black Pepper Manufacturer'
  WHEN name ILIKE 'Paramount%' THEN 'Textile Machine Manufacturer'
  WHEN name ILIKE 'Moonstar%' THEN 'Healthcare Marketing company'
  WHEN name ILIKE 'Olpad%' THEN 'Aqua Products'
  WHEN name ILIKE 'P.P Maniya%' OR name ILIKE 'P P Maniya%' THEN 'Multi Speciality Hospital'
  WHEN name ILIKE 'Arham%' THEN 'Stock Broker'
  ELSE nature_of_business
END
WHERE name ILIKE ANY (ARRAY[
  'Aaron%',
  'IBL%',
  'Zorko%',
  'REM%',
  'Aarya%',
  'Cruizine%',
  'Candor%',
  'Express%',
  'Zestika%',
  'Paramount%',
  'Moonstar%',
  'Olpad%',
  'P.P Maniya%',
  'P P Maniya%',
  'Arham%'
]);
