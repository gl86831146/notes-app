import { useEffect, useState } from 'react';
import { Layout, List, Card, Tag, Button, Modal, message } from 'antd';  // 添加 Layout
import { getNotes, deleteNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import React from 'react';

const { Content } = Layout;

const Notes = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [notes, setNotes] = useState([]);
  const [modalVisible,setModalVisible] = useState(false);
  const [SelectNoteId,setSelectNoteId] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      const fetchNotesData = await getNotes(user.id);
      setNotes(fetchNotesData.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      alert('获取笔记失败');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Layout>
      <Navbar />
      <Layout style={{ marginLeft: 200 }}>
        <Content className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">笔记列表</h1>
            <Button type="primary" onClick={() => navigate('/create-note')}>
              创建笔记
            </Button>
          </div>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={notes}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <Card className="bg-blue-100" hoverable>
                  <Card.Meta
                    title={item.title}
                    description={item.content.substring(0, 100) + '...'}
                  />
                  <div className="my-4">
                    {item.tags.map((tag) => (
                      <Tag color="cyan" key={tag}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button type="link" onClick={() => navigate(`/notes/${item.id}`)}>
                      查看
                    </Button>
                    <Button type="link" onClick={() => navigate(`/notes/edit/${item.id}`)}>
                      编辑
                    </Button>
                    <Button
                      type="link"
                      danger
                      onClick={() => {
                        setModalVisible(true);
                        setSelectNoteId(item.id);
                      }}
                    >
                      删除
                    </Button>
                  </div>
                </Card>
              </List.Item>
            )}
          />
          <Modal
            title="确认删除"
            visible={modalVisible}
            onOk={async () => {
              try {
                await deleteNote(SelectNoteId);
                message.success('删除成功');
                fetchNotes();
              } catch (error) {
                console.error('Failed to delete note:', error);
               message.success('删除笔记失败');
              }finally{
                setModalVisible(false);
                setSelectNoteId(null);
              }
            }}
            onCancel={() => {
              setModalVisible(false);
              setSelectNoteId(null);
            }}
          >
            <p>确定要删除该笔记吗？此操作不可恢复</p>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Notes;