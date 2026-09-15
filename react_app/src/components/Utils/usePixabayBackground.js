import { useEffect, useState } from 'react';
import axios from 'axios';

const FALLBACK_IMAGE = '/static/rose_bg.jpeg';

// Fetches a random Pixabay photo matching `query` and returns its URL,
// falling back to the local static image until the request resolves (or if
// it fails). See https://pixabay.com/api/docs/ for the image search params.
export default function usePixabayBackground(query, category) {
  const [imageUrl, setImageUrl] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    let cancelled = false;

    const fetchImage = async () => {
      try {
        const response = await axios.get('https://pixabay.com/api/', {
          params: {
            key: import.meta.env.REACT_APP_PIXBAY_KEY,
            q: query,
            category,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            per_page: 50,
          },
        });
        const hits = response.data.hits;
        if (!cancelled && hits && hits.length > 0) {
          const randomIndex = Math.floor(Math.random() * hits.length);
          setImageUrl(hits[randomIndex].largeImageURL);
        }
      } catch (error) {
        console.error('Error fetching Pixabay background image:', error);
      }
    };

    fetchImage();

    return () => {
      cancelled = true;
    };
  }, [query, category]);

  return imageUrl;
}
