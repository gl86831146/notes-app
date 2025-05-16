import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { updateNote, getNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NoteForm from '@/components/NoteForm';

const EditNote = () => {
    const navigate = useNavigate();
    const { noteId } = useParams();
    const { user } = useStore();
    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await getNote(noteId);
                setInitialValues(response.data);
            } catch (error) {
                console.error('Failed to fetch note:', error);
                message.error('获取笔记失败');
            }
        };
        fetchNote();
    }, [noteId]);

    const handleSubmit = async (noteData) => {
        try {
            await updateNote(noteId, { ...noteData, userId: user.id });
            message.success('笔记更新成功');
            navigate('/notes');
        } catch (error) {
            console.error('Failed to update note:', error);
            message.error('笔记更新失败');
        }
    };

    return (
        <>
            <Navbar />
            <div className="p-4">
                {initialValues && (
                    <NoteForm
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        submitText="更新笔记"
                    />
                )}
            </div>
        </>
    );
};

export default EditNote;
