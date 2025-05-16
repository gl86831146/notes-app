import { Layout, Typography, Row, Col, Card, Statistic } from 'antd';
import { FileTextOutlined, StarOutlined, FolderOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/userStore';
import { getUserStats } from '@/api/noteApi';
import React, { useState, useEffect } from 'react';

const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
    const { user } = useStore();
    const [stats, setStats] = useState({
        totalNotes: 0,
        favoriteNotes: 0,
        totalCategories: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (user) {
                try {
                    const response = await getUserStats(user.id);
                    setStats(response.data);
                } catch (error) {
                    console.error('获取统计数据失败:', error);
                }
            }
        };

        fetchStats();
    }, [user]);

    return (
        <Layout>
            <Navbar />
            <Layout style={{ marginLeft: 200 }}>
                <Content className="p-6">
                    <div className="mb-8">
                        {user ? (
                            <Title level={2}>欢迎回来，{user.nickname || user.username}</Title>
                        ) : (
                            <Title level={2}>欢迎来到笔记应用</Title>
                        )}
                    </div>

                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <Card>
                                <Statistic 
                                    title="笔记总数" 
                                    value={stats.totalNotes} 
                                    prefix={<FileTextOutlined />} 
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic 
                                    title="收藏笔记" 
                                    value={stats.favoriteNotes} 
                                    prefix={<StarOutlined />} 
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic 
                                    title="分类总数" 
                                    value={stats.totalCategories} 
                                    prefix={<FolderOutlined />} 
                                />
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;