/*
 * Contents of this file was produced with a help of a code generation tool and
 * subsequently reviewed and edited by a human.
 *
 * While some of the code was created by an AI assisted service, manual adjustments
 * have been made to ensure correctness, readability, functionality and compliance
 * to Avalara's coding standards and guidelines.
 * Any future modifications should be approached with caution to avoid
 * overwriting the manual changes.
 *
 *
 * This source code is owned by Avalara Inc. Unauthorized copying of this file,
 * via any medium, is strictly prohibited. Proprietary and confidential.
 *
 * For more information, refer to the documentation or contact the development team.
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Card,
  ColorPicker,
  Upload,
  message,
  Space,
  Divider,
  Typography,
} from 'antd';
import { UploadOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import {
  clearBrandingConfig,
  loadBrandingConfig,
  saveBrandingConfig,
} from './brandingConfig.js';

const { Text } = Typography;

const BrandingPanel = ({ onConfigUpdate }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  // Load initial configuration
  useEffect(() => {
    const config = loadBrandingConfig();
    form.setFieldsValue({
      partnerName: config.branding.partnerName,
      colorPrimary: config.theme.colorPrimary,
    });

    if (config.branding.logoUrl) {
      setLogoPreview(config.branding.logoUrl);
    }

    if (config.branding.faviconUrl) {
      setFaviconPreview(config.branding.faviconUrl);
    }
  }, [form]);

  const handleLogoUpload = (info) => {
    // Check for file in standard Ant Design Upload structure
    const file = info.file || (info.fileList && info.fileList[0]);
    if (file) {
      // If it has originFileObj (standard Ant Design structure)
      if (file.originFileObj) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoPreview(e.target.result);
        };
        reader.readAsDataURL(file.originFileObj);
      } else {
        console.error('Logo file is not a valid File object:', file);
        messageApi.error('Failed to process logo file. Please try again.');
      }
    } else {
      console.error('Logo file is undefined:', info);
      messageApi.error('Failed to process logo file. Please try again.');
    }
  };

  const handleFaviconUpload = (info) => {
    // Check for file in standard Ant Design Upload structure
    const file = info.file || (info.fileList && info.fileList[0]);
    if (file) {
      // If it has originFileObj (standard Ant Design structure)
      if (file.originFileObj) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFaviconPreview(e.target.result);
        };
        reader.readAsDataURL(file.originFileObj);
      } else {
        console.error('Favicon file is not a valid File object:', file);
        messageApi.error('Failed to process favicon file. Please try again.');
      }
    } else {
      console.error('Favicon file is undefined:', info);
      messageApi.error('Failed to process favicon file. Please try again.');
    }
  };

  const handleReset = () => {
    clearBrandingConfig();
    const defaultConfig = loadBrandingConfig();
    form.setFieldsValue({
      partnerName: defaultConfig.branding.partnerName,
      colorPrimary: defaultConfig.theme.colorPrimary,
    });
    setLogoPreview(defaultConfig.branding.logoUrl);
    setFaviconPreview(defaultConfig.branding.faviconUrl);

    if (onConfigUpdate) {
      onConfigUpdate(defaultConfig);
    }

    messageApi.success('Reset to default branding configuration');
  };

  const handleSubmit = (values) => {
    const config = {
      theme: {
        colorPrimary: values.colorPrimary,
      },
      branding: {
        partnerName: values.partnerName,
        logoUrl: logoPreview,
        faviconUrl: faviconPreview,
      },
    };
    const success = saveBrandingConfig(config);

    if (success) {
      messageApi.success('Branding configuration saved successfully');

      if (onConfigUpdate) {
        onConfigUpdate(config);
      }
    } else {
      messageApi.error('Failed to save branding configuration');
    }
  };

  const uploadProps = {
    maxCount: 1,
  };

  return (
    <Card title="Admin Branding Panel">
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div style={{ maxWidth: 800 }}>
          <Form.Item
            name="partnerName"
            label="Partner Name"
            rules={[{ required: true, message: 'Please enter partner name' }]}
          >
            <Input placeholder="Enter partner name" />
          </Form.Item>
          <Form.Item label="Logo">
            <Upload
              {...uploadProps}
              onChange={handleLogoUpload}
              showUploadList={false}
              accept="image/png,image/jpeg,image/svg+xml"
            >
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Recommended size: 200x50px, PNG or SVG format with transparent
              background
            </Text>
            {logoPreview && (
              <div style={{ marginTop: 16 }}>
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  style={{ maxHeight: 100, maxWidth: '100%' }}
                />
              </div>
            )}
          </Form.Item>
          <Form.Item label="Favicon">
            <Upload
              {...uploadProps}
              onChange={handleFaviconUpload}
              showUploadList={false}
              accept="image/png,image/x-icon,image/jpeg"
            >
              <Button icon={<UploadOutlined />}>Upload Favicon</Button>
            </Upload>
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Recommended size: 32x32px, ICO or PNG format
            </Text>
            {faviconPreview && (
              <div style={{ marginTop: 16 }}>
                <img
                  src={faviconPreview}
                  alt="Favicon Preview"
                  style={{ maxHeight: 32, maxWidth: 32 }}
                />
              </div>
            )}
          </Form.Item>
          <Form.Item name="colorPrimary" label="Primary Color">
            <ColorPicker
              format="hex"
              showText={true}
              onChange={(color, hex) => {
                form.setFieldValue('colorPrimary', color.toHexString());
              }}
            />
          </Form.Item>
        </div>

        <Divider />

        <Space>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Save Configuration
          </Button>
          <Button onClick={handleReset} icon={<UndoOutlined />}>
            Reset to Default
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

BrandingPanel.propTypes = {
  onConfigUpdate: PropTypes.func,
};

export default BrandingPanel;
