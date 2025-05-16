import React, { useState } from 'react';
import { Layout, Card, Input, Button, message } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import { generateAIContent } from '@/api/aiApi';

const { Content } = Layout;
const { TextArea } = Input;

const AIWrite = () => {
    const [prompt, setPrompt] = useState('');  // 重命名为 prompt
    const [generatedContent, setGeneratedContent] = useState('');  // 新增用于存储生成的内容
    const [isLoading, setIsLoading] = useState(false);

    const handleAIWrite = async () => {
        if (!prompt.trim()) {
            message.warning('请输入提示词');
            return;
        }
        setIsLoading(true);
        try {
            const data = await generateAIContent(prompt);
            if (data && data.response) {
                setGeneratedContent(data.response);
                message.success('生成成功');
            } else {
                throw new Error('生成内容为空');
            }
        } catch (error) {
            console.error('AI 写作出错:', error);
            message.error(error.message || '生成失败，请稍后重试');
        } finally {
            setIsLoading(false);
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
                                <RobotOutlined />
                                <span>AI 写作助手</span>
                            </div>
                        }
                        className="max-w-4xl mx-auto"
                    >
                        <div className="flex flex-col gap-4">
                            <TextArea 
                                rows={4}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="请输入提示词，AI 将帮助您进行写作..."
                            />
                            {generatedContent && (
                                <TextArea 
                                    rows={8}
                                    value={generatedContent}
                                    onChange={(e) => setGeneratedContent(e.target.value)}
                                    placeholder="AI 生成的内容将显示在这里..."
                                />
                            )}
                            <div className="flex justify-between items-center">
                                <div className="text-gray-400 text-sm">
                                    支持自然语言输入，AI 将智能理解并协助创作
                                </div>
                                <Button 
                                    type="primary"
                                    onClick={handleAIWrite}
                                    loading={isLoading}
                                >
                                    开始创作
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AIWrite;
