// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = 'dzbbncoqj'
export const CLOUDINARY_UPLOAD_PRESET = 'maison_products'

// Upload an image file to Cloudinary
export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', 'maison/products')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) throw new Error('Image upload failed')
  const data = await res.json()
  return data.secure_url // Returns the image URL
}
