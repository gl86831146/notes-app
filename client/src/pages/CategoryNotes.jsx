
import React, { useState, useEffect } from 'react';
import { Layout, List, Card, Tag, Button } from 'antd';
import { getNotesByCategory } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const { Content, Sider } = Layout;

const CategoryNotes = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const fetchNotesByCategory = async () => {
      try {
        const fetchedNotes = await getNotesByCategory(user.id, categoryId);
        setNotes(fetchedNotes.data);
      } catch (error) {
        console.error('Failed to fetch notes by category:', error);
        alert('获取笔记失败');
      }
    };

    fetchNotesByCategory();
  }, [categoryId]);

  if (!notes) return <div>Loading...</div>;

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Navbar />
      </Sider>
      <Layout style={{ marginLeft: 200, minHeight: '100vh' }}>
        <Content className="p-6">
          <h1 className="text-2xl font-bold mb-6">分类笔记列表</h1>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={notes}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <Card hoverable>
                  <Card.Meta
                    title={item.title}
                    description={item.content.substring(0, 60) + '...'}
                  />
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-4">
                      {item.tags.map((tag) => (
                        <Tag color="cyan" key={tag}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                  <div className="mt-4">
                    <Button type="link" onClick={() => navigate(`/notes/${item.id}`)}>
                      查看详情
                    </Button>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CategoryNotes;

