export async function fetchImageBlob(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        console.log(blob)
        return blob;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null; // Or throw an error if preferred
    }
}


