import { createServiceRoleClient } from './supabase/service-role'

/**
 * Upload an image to Supabase Storage
 * @param file - The image file to upload
 * @param bucket - The storage bucket name (default: 'products')
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(file: File, bucket: string = 'products'): Promise<string> {
    const supabase = createServiceRoleClient()

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) {
        throw new Error(`Failed to upload image: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

    return publicUrl
}

/**
 * Upload multiple images to Supabase Storage
 * @param files - Array of image files to upload
 * @param bucket - The storage bucket name (default: 'products')
 * @returns Array of public URLs of the uploaded images
 */
export async function uploadImages(files: File[], bucket: string = 'products'): Promise<string[]> {
    const uploadPromises = files.map(file => uploadImage(file, bucket))
    return Promise.all(uploadPromises)
}

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL of the image to delete
 * @param bucket - The storage bucket name (default: 'products')
 */
export async function deleteImage(url: string, bucket: string = 'products'): Promise<void> {
    const supabase = createServiceRoleClient()

    // Extract file path from URL
    const urlParts = url.split('/')
    const filePath = urlParts[urlParts.length - 1]

    const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

    if (error) {
        throw new Error(`Failed to delete image: ${error.message}`)
    }
}
