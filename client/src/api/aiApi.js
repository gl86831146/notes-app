import axiosInstance from './axiosInstance';

export const generateAIContent = async (prompt) => {
    try {
        const response = await axiosInstance.post('ai/generate', { prompt });  // 移除 /api 前缀
        if (!response.data.success) {
            throw new Error(response.data.error || '生成失败');
        }
        return response.data;
    } catch (error) {
        console.error('API 错误:', error);
        throw new Error(error.response?.data?.error || error.message || '请求失败');
    }
};