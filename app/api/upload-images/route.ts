import { NextResponse } from 'next/server'
import { uploadImages } from '@/utils/image-upload'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const files = formData.getAll('images') as File[]

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No images provided' },
                { status: 400 }
            )
        }

        // Validate file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        for (const file of files) {
            if (!validTypes.includes(file.type)) {
                return NextResponse.json(
                    { error: `Invalid file type: ${file.name}. Only JPG, PNG, and WebP are allowed.` },
                    { status: 400 }
                )
            }

            // Validate file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                return NextResponse.json(
                    { error: `File too large: ${file.name}. Maximum size is 10MB.` },
                    { status: 400 }
                )
            }
        }

        // Upload images to Supabase Storage
        const imageUrls = await uploadImages(files)

        return NextResponse.json(
            {
                success: true,
                urls: imageUrls,
                message: `Successfully uploaded ${imageUrls.length} image(s)`
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Image upload error:', error)
        return NextResponse.json(
            {
                error: 'Failed to upload images',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
