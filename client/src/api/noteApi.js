import axiosInstance from './axiosInstance';

// 创建笔记
export const createNote = async (noteData) => {
    return axiosInstance.post('/notes', noteData);
};

// 查询某个用户的所有笔记
export const getNotes = async (userId) => {
    return axiosInstance.get(`/notes/user/${userId}`);
};

// 查询笔记详情
export const getNote = async (noteId) => {
    return axiosInstance.get(`/notes/${noteId}`);
};

// 查询某个用户某个分类的所有笔记
export const getNotesByCategory = async (userId, categoryId) => {
    return axiosInstance.get(`/notes/categories/${userId}/${categoryId}`);
};

// 更新笔记
export const updateNote = async (noteId, noteData) => {
    return axiosInstance.put(`/notes/${noteId}`, noteData);
};

// 删除笔记
export const deleteNote = async (noteId) => {
    return axiosInstance.delete(`/notes/${noteId}`);
};

// 获取收藏的笔记
export const getFavorites = async (userId) => {
    // 修改路径以匹配后端路由
    return axiosInstance.get(`/notes/user/${userId}?favorite=true`);
};

// 更新收藏状态
export const updateFavoriteStatus = async (noteId, isFavorite) => {
    return axiosInstance.put(`/notes/${noteId}/favorite`, { isFavorite });
};



// 获取用户的统计数据
export const getUserStats = async (userId) => {
    return axiosInstance.get(`/notes/stats/${userId}`);
};

// 获取已删除的笔记
export const getDeletedNotes = async (userId) => {
    return axiosInstance.get(`/notes/deleted/${userId}`);
};

// 恢复已删除的笔记
export const restoreNote = async (noteId) => {
    return axiosInstance.put(`/notes/restore/${noteId}`);
};

// 永久删除笔记
export const permanentDeleteNote = async (noteId) => {
    return axiosInstance.delete(`/notes/permanent-delete/${noteId}`);
};
Promise.all
