import fetcher from '../dataProvider/index';

const API_BASE_URL = 'https://fantv-apis.fantiger.com/v1';

export const createLyrics = async (text) => {
  try {
    const response = await fetcher.post(
      `${API_BASE_URL}/video/text-to-script`,
      {
        type: 'lyrics',
        text,
      }
    );
    if (!response) throw new Error('Failed to create lyrics');
    return await response;
  } catch (error) {
    console.error('Error creating lyrics:', error);
    throw error;
  }
};

export const generateAudio = async (text) => {
  try {
    // const response = await fetcher.post(`${API_BASE_URL}/video/text-to-video`, {
    const response = await fetcher.post(
      `http://localhost:8000/v1/generate-song`,
      {
        // contentType: 'video',
        prompt: text,
      }
    );
    if (!response) throw new Error('Failed to create video');
    return response;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

export const fetchVideoStatus = async (videoId) => {
  const response = await fetcher.get(
    `${API_BASE_URL}/video/text-to-video/${videoId}`
  );
  if (!response) {
    throw new Error('Failed to fetch video status');
  }
  return response;
};

export const fetchListAPI = async () => {
  const response = await fetcher.get(`${API_BASE_URL}/video/text-to-video`);
  if (!response) {
    throw new Error('Failed to fetch list');
  }
  return response;
};
