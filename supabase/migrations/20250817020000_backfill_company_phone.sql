-- Backfill company and phone from additional_data for existing rows
UPDATE public.leads
SET 
  company = COALESCE(
    company,
    additional_data->>'Company',
    additional_data->>'company',
    additional_data->>'Company Name',
    additional_data->>'company_name',
    additional_data->>'Organization',
    additional_data->>'organization',
    additional_data->>'Organization Name',
    additional_data->>'organization_name',
    additional_data->>'Employer',
    additional_data->>'employer',
    additional_data->>'Employer Name',
    additional_data->>'employer_name',
    (additional_data->'company'->>'name'),
    (additional_data->'organization'->>'name'),
    (additional_data->'employer'->>'name')
  ),
  phone = COALESCE(
    phone,
    additional_data->>'Phone Number',
    additional_data->>'Phone',
    additional_data->>'Mobile',
    additional_data->>'Mobile Phone',
    additional_data->>'mobile',
    additional_data->>'mobile_phone',
    additional_data->>'Work Phone',
    additional_data->>'work_phone',
    additional_data->>'Direct Dial',
    additional_data->>'direct_dial',
    additional_data->>'directDial'
  );


