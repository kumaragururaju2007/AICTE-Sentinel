/**
 * AICTE Sentinel - Supabase Document Vault & Storage Service
 * Team Valora | Smart India Hackathon 2026
 */

import { supabase } from '../lib/supabaseClient'

const BUCKET_NAME = 'aicte-documents'
const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25 MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

export const documentService = {
  /**
   * Upload file to private Supabase Storage bucket and record database metadata.
   */
  async uploadDocument({
    file,
    applicationId,
    institutionId,
    documentType,
    documentName,
    expiryDate = null,
  }) {
    if (!file) throw new Error('No file selected for upload')

    // File size restriction
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds 25 MB statutory limit (${(file.size / (1024 * 1024)).toFixed(1)} MB)`)
    }

    // MIME type validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file format. Only PDF, JPG, and PNG files are accepted under AICTE guidelines.')
    }

    const { data: { user } } = await supabase.auth.getUser()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `${institutionId}/${applicationId}/${Date.now()}_${sanitizedFileName}`

    // 1. Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (storageError) throw storageError

    // 2. Insert metadata into public.documents table
    const { data, error: dbError } = await supabase
      .from('documents')
      .insert({
        application_id: applicationId,
        institution_id: institutionId,
        document_name: documentName || file.name,
        document_type: documentType,
        storage_path: storagePath,
        verification_status: 'PENDING',
        expiry_date: expiryDate,
        uploaded_by: user?.id,
      })
      .select()
      .single()

    if (dbError) throw dbError

    // 3. Record Audit Log
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'DOCUMENT_UPLOADED',
      entity_type: 'DOCUMENT',
      entity_id: data.id,
      new_value: { document_name: data.document_name, type: documentType, path: storagePath },
    })

    return data
  },

  /**
   * Fetch documents for an application.
   */
  async getDocumentsByApplication(applicationId) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', applicationId)
      .order('uploaded_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  /**
   * Generate secure, time-limited signed URL for private document download.
   */
  async getSignedUrl(storagePath, expiresInSeconds = 300) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, expiresInSeconds)

    if (error) throw error
    return data.signedUrl
  },

  /**
   * Scrutiny Officer document verification.
   */
  async verifyDocument(documentId, verificationStatus, remarks = '') {
    const { data, error } = await supabase
      .from('documents')
      .update({ verification_status: verificationStatus })
      .eq('id', documentId)
      .select()
      .single()

    if (error) throw error

    // Record Audit Log
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'DOCUMENT_VERIFIED',
      entity_type: 'DOCUMENT',
      entity_id: documentId,
      new_value: { status: verificationStatus, remarks },
    })

    return data
  },
}

export default documentService

