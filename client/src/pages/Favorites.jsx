import React, { useState, useEffect } from 'react';
import { Layout, List, Card, Tag, Empty, message, Spin, Button } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import { getFavorites, updateFavoriteStatus } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        // 用户未登录时重定向到登录页
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchFavorites = async () => {
            try {
                const response = await getFavorites(user.id);
                setFavorites(response.data);
            } catch (error) {
                console.error('获取收藏失败:', error);
                message.error('获取收藏失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [user, navigate]);

    // 添加取消收藏的处理函数
    const handleUnfavorite = async (noteId) => {
        try {
            await updateFavoriteStatus(noteId, false);
            message.success('已取消收藏');
            // 刷新收藏列表
            const response = await getFavorites(user.id);
            setFavorites(response.data);
        } catch (error) {
            console.error('取消收藏失败:', error);
            message.error('取消收藏失败，请稍后重试');
        }
    };

    return (
        <Layout>
            <Navbar />
            <Layout style={{ marginLeft: 200 }}>
                <Content className="p-6">
                    <Card 
                        title={
                            <div className="flex items-center gap-2">
                                <StarFilled style={{ color: '#fadb14' }} />
                                <span>我的收藏</span>
                            </div>
                        }
                    >
                        {loading ? (
                            <div className="flex justify-center items-center p-8">
                                <Spin size="large" tip="加载中..." />
                            </div>
                        ) : favorites.length > 0 ? (
                            <List
                                dataSource={favorites}
                                renderItem={item => (
                                    <List.Item>
                                        <Card 
                                            title={item.title} 
                                            style={{ width: '100%' }}
                                            extra={
                                                <div className="flex gap-2">
                                                    <Button 
                                                        type="link"
                                                        onClick={() => navigate(`/notes/${item.id}`)}
                                                    >
                                                        查看详情
                                                    </Button>
                                                    <Button
                                                        type="link"
                                                        danger
                                                        icon={<StarOutlined />}
                                                        onClick={() => handleUnfavorite(item.id)}
                                                    >
                                                        取消收藏
                                                    </Button>
                                                </div>
                                            }
                                        >
                                            <p className="line-clamp-2">{item.content}</p>
                                            <div className="mt-4">
                                                {item.tags?.map(tag => (
                                                    <Tag key={tag} color="blue">{tag}</Tag>
                                                ))}
                                            </div>
                                            <div className="mt-2 text-gray-400 text-sm">
                                                收藏时间：{new Date(item.created_at).toLocaleDateString()}
                                            </div>
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty 
                                description="暂无收藏的笔记" 
                                className="py-8"
                            />
                        )}
                    </Card>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Favorites;