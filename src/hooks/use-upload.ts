export function useUpload() {
    const uploadImage = async (file: File, carouselId: number) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('carouselId', carouselId.toString())

        const response = await fetch('/api/minio', {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            throw new Error('Failed to upload image')
        }

        const data = await response.json()
        return data
    }

    return { uploadImage }
}
