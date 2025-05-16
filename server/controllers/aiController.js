import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-0a2a348821e24cd4b720828e05697377'
});

export const generateContent = async (req, res) => {
    try {
        if (!req.body.prompt) {
            return res.status(400).json({
                success: false,
                error: '提示词不能为空'
            });
        }

        console.log('收到请求:', req.body.prompt);

        // 添加美化提示
        const beautifyPrompt = `请以优雅、专业的方式重写以下内容，使用适当的排版和格式：

${req.body.prompt}

要求：
1. 使用清晰的标题和小标题
2. 适当使用项目符号或编号
3. 重要概念用加粗处理
4. 保持段落间适当的空白
5. 必要时使用表格或列表
6. 使用Markdown格式`;

        const completion = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "你是一个专业的技术文档编辑，擅长将文本转换为结构清晰、格式优美的文档。"
                },
                {
                    role: "user",
                    content: beautifyPrompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            stream: false
        });
        
        const aiResponse = completion.choices[0].message.content;
        
        res.json({
            success: true,
            response: aiResponse
        });
    } catch (error) {
        console.error('AI 服务错误:', error);
        res.status(500).json({ 
            success: false,
            error: error.message || 'AI 服务出错' 
        });
    }
};