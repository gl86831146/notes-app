import React, { useState, useEffect } from 'react';
import { Layout, Card, Tag, Button, message } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { getNote, updateFavoriteStatus } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const { Content } = Layout;

const Note = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const fetchedNote = await getNote(id);
        setNote(fetchedNote.data);
      } catch (error) {
        console.error('获取笔记详情失败:', error);
        message.error('获取笔记详情失败');
        navigate('/notes');
      }
    };

    fetchNoteDetails();
  }, [id, navigate]);

  // 添加收藏/取消收藏处理函数
  const handleFavoriteToggle = async () => {
    try {
      setLoading(true);
      await updateFavoriteStatus(id, !note.is_favorite);
      setNote(prev => ({ ...prev, is_favorite: !prev.is_favorite }));
      message.success(note.is_favorite ? '已取消收藏' : '已添加收藏');
    } catch (error) {
      console.error('更新收藏状态失败:', error);
      message.error('操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (!note) return <div>Loading...</div>;

  return (
    <Layout>
      <Navbar />
      <Layout style={{ marginLeft: 200 }}>
        <Content className="p-6">
          <Card 
            className="note-card" 
            hoverable
            title={
              <div className="flex justify-between items-center">
                <span>{note.title}</span>
                <Button
                  type="link"
                  icon={note.is_favorite ? <StarFilled style={{ color: '#fadb14' }} /> : <StarOutlined />}
                  onClick={handleFavoriteToggle}
                  loading={loading}
                >
                  {note.is_favorite ? '取消收藏' : '收藏'}
                </Button>
              </div>
            }
          >
            <p className="mb-4">{note.content}</p>
            <div className="my-4">
              {note.tags?.map((tag) => (
                <Tag color="cyan" key={tag}>
                  {tag}
                </Tag>
              ))}
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Note;