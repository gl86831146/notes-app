
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, Avatar, Space, Button } from 'antd';
import {
    UserOutlined,
    HomeOutlined,
    RobotOutlined,
    FileTextOutlined,
    EditOutlined,
    StarOutlined,
    TagOutlined,
    AppstoreOutlined,
    DeleteOutlined,  // 添加删除图标
} from '@ant-design/icons';
import { useStore } from '@/store/userStore';

const { Sider } = Layout;
const { Text } = Typography;

const Navbar = () => {
    const { user, logout } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        if (window.confirm('确定退出')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <Sider
            width={200}
            theme="light"
            style={{
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
            }}
        >
            <div className="p-4">
                {user ? (
                    <Space direction="vertical" align="center" className="w-full">
                        {user.avatar_url ? (
                            <Avatar size={64} src={user.avatar_url} />
                        ) : (
                            <Avatar size={64} icon={<UserOutlined />} />
                        )}
                        <Text strong>{user.nickname || user.username}</Text>
                        <Button type="link" danger onClick={handleLogout}>
                            退出登录
                        </Button>
                    </Space>
                ) : (
                    <Button type="primary" block onClick={() => navigate('/login')}>
                        登录
                    </Button>
                )}
            </div>
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={[
                    {
                        key: '/',
                        icon: <HomeOutlined />,
                        label: '开始',
                        onClick: () => navigate('/'),
                    },
                    {
                        key: '/ai-write',
                        icon: <RobotOutlined />,
                        label: 'AI 写作',
                        onClick: () => navigate('/ai-write'),
                    },
                    {
                        key: '/notes',
                        icon: <FileTextOutlined />,
                        label: '我的笔记',
                        onClick: () => navigate('/notes'),
                    },
                    {
                        key: '/create-note',
                        icon: <EditOutlined />,
                        label: '新建笔记',
                        onClick: () => navigate('/create-note'),
                    },
                    {
                        key: '/favorites',
                        icon: <StarOutlined />,
                        label: '我的收藏',
                        onClick: () => navigate('/favorites'),
                    },
                    {
                        key: '/categories',
                        icon: <AppstoreOutlined />,
                        label: '分类管理',
                        onClick: () => navigate('/categories'),
                    },
                    {
                        key: '/recycle-bin',
                        icon: <DeleteOutlined />,
                        label: '回收站',
                        onClick: () => navigate('/recycle-bin'),
                    },
                ]}
            />
        </Sider>
    );
};

export default Navbar;