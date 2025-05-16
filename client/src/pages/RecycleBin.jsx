import React, { useState, useEffect } from 'react';
import { Layout, List, Card, Button, message, Modal, Empty } from 'antd';
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const RecycleBin = () => {
    const [deletedNotes, setDeletedNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchDeletedNotes();
    }, [user, navigate]);

    const fetchDeletedNotes = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/notes/deleted/${user.id}`);
            const data = await response.json();
            setDeletedNotes(data);
        } catch (error) {
            console.error('获取已删除笔记失败:', error);
            message.error('获取已删除笔记失败');
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (noteId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/notes/restore/${noteId}`, {
                method: 'PUT'
            });
            if (response.ok) {
                message.success('笔记恢复成功');
                fetchDeletedNotes();
            }
        } catch (error) {
            console.error('恢复笔记失败:', error);
            message.error('恢复笔记失败');
        }
    };

    const handlePermanentDelete = async (noteId) => {
        Modal.confirm({
            title: '永久删除',
            content: '确定要永久删除这个笔记吗？此操作不可恢复！',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/notes/permanent-delete/${noteId}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        message.success('笔记已永久删除');
                        fetchDeletedNotes();
                    }
                } catch (error) {
                    console.error('永久删除笔记失败:', error);
                    message.error('永久删除笔记失败');
                }
            }
        });
    };

    return (
        <Layout>
            <Navbar />
            <Layout style={{ marginLeft: 200 }}>
                <Content className="p-6">
                    <Card 
                        title={
                            <div className="flex items-center gap-2">
                                <DeleteOutlined />
                                <span>回收站</span>
                            </div>
                        }
                    >
                        {loading ? (
                            <div>加载中...</div>
                        ) : deletedNotes.length > 0 ? (
                            <List
                                grid={{ gutter: 16, column: 3 }}
                                dataSource={deletedNotes}
                                renderItem={note => (
                                    <List.Item>
                                        <Card 
                                            title={note.title}
                                            extra={
                                                <div className="flex gap-2">
                                                    <Button 
                                                        type="link" 
                                                        icon={<UndoOutlined />}
                                                        onClick={() => handleRestore(note.id)}
                                                    >
                                                        恢复
                                                    </Button>
                                                    <Button 
                                                        type="link" 
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handlePermanentDelete(note.id)}
                                                    >
                                                        永久删除
                                                    </Button>
                                                </div>
                                            }
                                        >
                                            <p className="line-clamp-3">{note.content}</p>
                                            <div className="text-gray-400 text-sm mt-2">
                                                删除时间：{new Date(note.deleted_at).toLocaleString()}
                                            </div>
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty description="回收站是空的" />
                        )}
                    </Card>
                </Content>
            </Layout>
        </Layout>
    );
};

export default RecycleBin;