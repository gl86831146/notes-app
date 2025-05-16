import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tag, Select, message } from 'antd';
import { getCategories } from '@/api/categoryApi';

import PropTypes from 'prop-types';

const NoteForm = ({ initialValues, onSubmit, submitText = '提交' }) => {

NoteForm.propTypes = {
    initialValues: PropTypes.shape({
        title: PropTypes.string,
        content: PropTypes.string,
        categoryId: PropTypes.number,
        tags: PropTypes.arrayOf(PropTypes.string)
    }),
    onSubmit: PropTypes.func.isRequired,
    submitText: PropTypes.string
};
    const [form] = Form.useForm();
    const [tags, setTags] = useState(initialValues?.tags || []);
    const [inputTag, setInputTag] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                message.error('获取分类失败');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
            setTags(initialValues.tags || []);
        }
    }, [initialValues, form]);

    const handleInputTagChange = (e) => {
        setInputTag(e.target.value);
    };

    const handleAddTag = () => {
        if (inputTag && !tags.includes(inputTag)) {
            setTags([...tags, inputTag]);
            setInputTag('');
        }
    };

    const handleRemoveTag = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        setTags(newTags);
    };

    const handleSubmit = async (values) => {
        await onSubmit({ ...values, tags });
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="max-w-2xl mx-auto"
        >
            <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: '请输入标题' }]}
            >
                <Input placeholder="请输入笔记标题" />
            </Form.Item>

            <Form.Item
                label="内容"
                name="content"
                rules={[{ required: true, message: '请输入内容' }]}
            >
                <Input.TextArea rows={6} placeholder="请输入笔记内容" />
            </Form.Item>

            <Form.Item
                label="类型"
                name="categoryId"
                rules={[{ required: true, message: '请选择类型' }]}
            >
                <Select placeholder="请选择类型">
                    {categories.map((category) => (
                        <Select.Option key={category.id} value={category.id}>
                            {category.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <div className="mb-4">
                <label className="block mb-2">标签</label>
                <div className="flex gap-2 mb-2">
                    <Input
                        value={inputTag}
                        onChange={handleInputTagChange}
                        placeholder="请输入标签"
                        onPressEnter={handleAddTag}
                    />
                    <Button type="primary" onClick={handleAddTag}>
                        添加
                    </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {tags.map((tag) => (
                        <Tag key={tag} closable onClose={() => handleRemoveTag(tag)}>
                            {tag}
                        </Tag>
                    ))}
                </div>
            </div>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {submitText}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default NoteForm;