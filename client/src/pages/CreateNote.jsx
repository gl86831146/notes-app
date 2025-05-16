import React from 'react';
import { message } from 'antd';
import { createNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NoteForm from '@/components/NoteForm';

const CreateNote = () => {
    const navigate = useNavigate();
    const { user } = useStore();

    const handleSubmit = async (noteData) => {
        try {
            await createNote({ ...noteData, userId: user.id });
            message.success('笔记创建成功');
            navigate('/notes');
        } catch (error) {
            console.error('Failed to create note:', error);
            message.error('笔记创建失败');
        }
    };

    return (
        <>
            <Navbar />
            <div className="p-4">
                <NoteForm onSubmit={handleSubmit} submitText="创建笔记" />
            </div>
        </>
    );
};

export default CreateNote;
