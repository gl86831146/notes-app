import React, { useState, useEffect } from 'react';
import { Layout, List, Card, Button, Modal, Input, message, Popconfirm } from 'antd';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const { Content, Sider } = Layout;

const Categories = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [categories, setCategories] = useState([]);
  // 添加新的状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  // 添加编辑相关的状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        alert('获取分类失败');
      }
    };

    fetchCategoriesData();
  }, []);

  // 添加创建分类的处理函数
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      message.error('分类名称不能为空');
      return;
    }

    try {
      await createCategory({ name: newCategoryName, userId: user.id });
      message.success('创建分类成功');
      // 刷新分类列表
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories.data);
      // 重置状态
      setIsModalVisible(false);
      setNewCategoryName('');
    } catch (error) {
      console.error('Failed to create category:', error);
      message.error('创建分类失败');
    }
  };

  // 添加编辑分类的处理函数
  const handleEditCategory = async () => {
    if (!editCategoryName.trim()) {
      message.error('分类名称不能为空');
      return;
    }

    try {
      await updateCategory(editingCategory.id, { 
        name: editCategoryName,
        userId: user.id 
      });
      message.success('更新分类成功');
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories.data);
      setEditModalVisible(false);
      setEditingCategory(null);
      setEditCategoryName('');
    } catch (error) {
      console.error('Failed to update category:', error);
      message.error('更新分类失败');
    }
  };

  // 添加删除分类的处理函数
  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      message.success('删除分类成功');
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories.data);
    } catch (error) {
      console.error('Failed to delete category:', error);
      message.error('删除分类失败');
    }
  };

  // 修改编辑分类的Modal部分
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">分类列表</h1>
            {/* 添加创建分类按钮 */}
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              创建分类
            </Button>
          </div>
          
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={categories}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <Card hoverable>
                  <Card.Meta title={item.name} />
                  <div className="mt-4 flex gap-2">
                    <Button 
                      type="link" 
                      onClick={() => navigate(`/notes/categories/${item.id}`)}
                    >
                      查看分类笔记
                    </Button>
                    <Button
                      type="link"
                      onClick={() => {
                        setEditingCategory(item);
                        setEditCategoryName(item.name);
                        setEditModalVisible(true);
                      }}
                    >
                      编辑
                    </Button>
                    <Popconfirm
                      title="确定要删除这个分类吗？"
                      description="删除后无法恢复，该分类下的笔记将失去分类"
                      onConfirm={() => handleDeleteCategory(item.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button type="link" danger>
                        删除
                      </Button>
                    </Popconfirm>
                  </div>
                </Card>
              </List.Item>
            )}
          />

          {/* 修改编辑分类的Modal */}
          <Modal
            title="编辑分类"
            open={editModalVisible}
            onOk={handleEditCategory}
            onCancel={() => {
              setEditModalVisible(false);
              setEditingCategory(null);
              setEditCategoryName('');
            }}
          >
            <Input
              placeholder="请输入新的分类名称"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
            />
          </Modal>

          {/* 修改创建分类的Modal */}
          <Modal
            title="创建新分类"
            open={isModalVisible}
            onOk={handleCreateCategory}
            onCancel={() => {
              setIsModalVisible(false);
              setNewCategoryName('');
            }}
          >
            <Input
              placeholder="请输入分类名称"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Categories;