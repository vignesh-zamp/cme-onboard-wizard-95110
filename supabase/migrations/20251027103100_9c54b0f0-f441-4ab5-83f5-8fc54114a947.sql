-- Enable uploads to knowledge-base bucket
CREATE POLICY "Allow uploads to knowledge-base bucket"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'knowledge-base');

-- Allow reading from knowledge-base bucket
CREATE POLICY "Allow reading from knowledge-base bucket"
ON storage.objects
FOR SELECT
USING (bucket_id = 'knowledge-base');

-- Allow updates to knowledge-base bucket
CREATE POLICY "Allow updates to knowledge-base bucket"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'knowledge-base')
WITH CHECK (bucket_id = 'knowledge-base');

-- Allow deletes from knowledge-base bucket
CREATE POLICY "Allow deletes from knowledge-base bucket"
ON storage.objects
FOR DELETE
USING (bucket_id = 'knowledge-base');