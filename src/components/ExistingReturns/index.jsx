import {
  Table,
  Tabs,
  Input,
  Select,
  Button,
  Space,
  Badge,
  Layout,
  Typography,
  Card,
  Flex,
} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import { PageHeader } from '../shared';

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const PAGINATION_PAGE_SIZE = 10;

// Custom CSS for pagination buttons
const paginationStyles = `
  .ant-pagination-prev,
  .ant-pagination-next {
    border: 1px solid #d9d9d9 !important;
    border-radius: 6px !important;
    background-color: #ffffff !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    margin: 0 4px !important;
  }
  
  .ant-pagination-prev:hover,
  .ant-pagination-next:hover {
    border-color: #40a9ff !important;
    background-color: #f0f8ff !important;
  }
  
  .ant-pagination-disabled.ant-pagination-prev,
  .ant-pagination-disabled.ant-pagination-next {
    border-color: #f0f0f0 !important;
    background-color: #f5f5f5 !important;
    box-shadow: none !important;
  }
`;

// TODO: replace with real data

const data = [
  {
    key: '1',
    return: 'AL 2620',
    description: 'Sellers Use Tax Return',
    state: 'Alabama',
    regNumber: 'SLU-22089',
    frequency: 'Monthly',
    filingMethod: 'Electronic',
    effective: '03/01/2024',
    expiration: '-',
    status: 'Active',
  },
  {
    key: '2',
    return: 'AL 9501',
    description:
      'State-Administered Local Tax Return (Must add non-state administered local tax forms separately)',
    state: 'Alabama',
    regNumber: 'LCL-22089',
    frequency: 'Quarterly',
    filingMethod: 'Electronic',
    effective: '01/01/2022',
    expiration: '-',
    status: 'Active',
  },
  {
    key: '3',
    return: 'GA ST3 Sales',
    description: 'Sales and Use Tax Return',
    state: 'Georgia',
    regNumber: '53452662',
    frequency: 'Quarterly',
    filingMethod: 'Electronic',
    effective: '08/01/2022',
    expiration: '-',
    status: 'Active',
  },
  {
    key: '4',
    return: 'HI G 49',
    description: 'General Excise/Use Tax Annual Return and Reconciliation',
    state: 'Hawaii',
    regNumber: '12452351',
    frequency: 'Annually',
    filingMethod: 'Electronic',
    effective: '01/01/2022',
    expiration: '-',
    status: 'Active',
  },
  {
    key: '5',
    return: 'VA ST 9',
    description: 'Virginia Retail Sales and Use Tax Return',
    state: 'Virginia',
    regNumber: 'ST9-12412',
    frequency: 'Monthly',
    filingMethod: 'Electronic',
    effective: '08/01/2023',
    expiration: '-',
    status: 'Active',
  },
  {
    key: '6',
    return: 'CA BOE 401',
    description: 'California Sales and Use Tax Return',
    state: 'California',
    regNumber: 'CA-789123',
    frequency: 'Monthly',
    filingMethod: 'Electronic',
    effective: '02/15/2024',
    expiration: '-',
    status: 'Active',
  },
  {
    key: '7',
    return: 'TX 01-114',
    description: 'Texas Sales and Use Tax Return',
    state: 'Texas',
    regNumber: 'TX-456789',
    frequency: 'Quarterly',
    filingMethod: 'Paper',
    effective: '05/01/2023',
    expiration: '-',
    status: 'Active',
  },
  {
    key: '8',
    return: 'FL DR-15',
    description: 'Florida Sales and Use Tax Return',
    state: 'Florida',
    regNumber: 'FL-987654',
    frequency: 'Monthly',
    filingMethod: 'Electronic',
    effective: '12/01/2023',
    expiration: '-',
    status: 'Active',
  },
  {
    key: '9',
    return: 'NY ST-100',
    description: 'New York Sales Tax Return',
    state: 'New York',
    regNumber: 'NY-123456',
    frequency: 'Quarterly',
    filingMethod: 'Electronic',
    effective: '03/15/2024',
    expiration: '-',
    status: 'Active',
  },
  {
    key: '10',
    return: 'WA ETA 1',
    description: 'Washington Excise Tax Return',
    state: 'Washington',
    regNumber: 'WA-555777',
    frequency: 'Monthly',
    filingMethod: 'Electronic',
    effective: '01/01/2024',
    expiration: '-',
    status: 'Active',
  },
  {
    key: '11',
    return: 'CO DR 0100',
    description: 'Colorado Sales Tax Return',
    state: 'Colorado',
    regNumber: 'CO-333999',
    frequency: 'Quarterly',
    filingMethod: 'Paper',
    effective: '07/01/2023',
    expiration: '06/30/2024',
    status: 'Pending',
  },
  {
    key: '12',
    return: 'IL ST-1',
    description: 'Illinois Sales Tax Return',
    state: 'Illinois',
    regNumber: 'IL-777333',
    frequency: 'Monthly',
    filingMethod: 'Electronic',
    effective: '04/01/2024',
    expiration: '-',
    status: 'Active',
  },
];

const columns = [
  {
    title: 'Return',
    dataIndex: 'return',
    key: 'return',
    width: '25%',
    sorter: (a, b) => a.return.localeCompare(b.return),
    render: (text, record) => (
      <div>
        <a style={{ color: '#1890ff', fontWeight: 500 }}>{text}</a>
        <br />
        <small style={{ color: '#8c8c8c' }}>{record.description}</small>
      </div>
    ),
  },
  {
    title: 'State',
    dataIndex: 'state',
    key: 'state',
    width: '12%',
    sorter: (a, b) => a.state.localeCompare(b.state),
  },
  {
    title: 'Registration #',
    dataIndex: 'regNumber',
    key: 'regNumber',
    width: '15%',
  },
  {
    title: 'Frequency',
    dataIndex: 'frequency',
    key: 'frequency',
    width: '12%',
  },
  {
    title: 'Filing method',
    dataIndex: 'filingMethod',
    key: 'filingMethod',
    width: '12%',
  },
  {
    title: 'Effective',
    dataIndex: 'effective',
    key: 'effective',
    width: '12%',
  },
  {
    title: 'Expiration',
    dataIndex: 'expiration',
    key: 'expiration',
    width: '12%',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    sorter: (a, b) => a.status.localeCompare(b.status),
    render: (status) => (
      <div style={{ whiteSpace: 'nowrap' }}>
        <Badge status="success" text={status} />
      </div>
    ),
  },
];

const TabsSection = ({ activeTab, setActiveTab }) => (
  <Tabs activeKey={activeTab} onChange={setActiveTab}>
    <TabPane tab="Active" key="1" />
    <TabPane tab="Pending" key="2" />
    <TabPane tab="Expired" key="3" />
    <TabPane tab="All" key="4" />
  </Tabs>
);

TabsSection.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

const FiltersSection = ({
  searchText,
  setSearchText,
  regionFilter,
  setRegionFilter,
  frequencyFilter,
  setFrequencyFilter,
  filingMethodFilter,
  setFilingMethodFilter,
  handleReset,
  handleSearch,
  regionOptions,
  frequencyOptions,
  filingMethodOptions,
}) => (
  <Card>
    <Flex
      align="center"
      justify="space-between"
      wrap="wrap"
      gap="middle"
      style={{ width: '100%' }}
    >
      <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
        <div
          style={{
            flex: 1,
            minWidth: '200px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Search:</span>
          <div style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
            <Input
              placeholder="All"
              style={{
                width: '100%',
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRight: 'none',
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: '150px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Region:</span>
          <Select
            placeholder="All"
            style={{ width: '100%' }}
            value={regionFilter === 'all' ? undefined : regionFilter}
            onChange={(value) => setRegionFilter(value || 'all')}
          >
            <Option value="all">All</Option>
            {regionOptions.map((state) => (
              <Option key={state.toLowerCase()} value={state.toLowerCase()}>
                {state}
              </Option>
            ))}
          </Select>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: '150px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Frequency:</span>
          <Select
            placeholder="All"
            style={{ width: '100%' }}
            value={frequencyFilter === 'all' ? undefined : frequencyFilter}
            onChange={(value) => setFrequencyFilter(value || 'all')}
          >
            <Option value="all">All</Option>
            {frequencyOptions.map((freq) => (
              <Option key={freq.toLowerCase()} value={freq.toLowerCase()}>
                {freq}
              </Option>
            ))}
          </Select>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: '180px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>Filing method:</span>
          <Select
            placeholder="All"
            style={{ width: '100%' }}
            value={
              filingMethodFilter === 'all' ? undefined : filingMethodFilter
            }
            onChange={(value) => setFilingMethodFilter(value || 'all')}
          >
            <Option value="all">All</Option>
            {filingMethodOptions.map((method) => (
              <Option key={method.toLowerCase()} value={method.toLowerCase()}>
                {method}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Button onClick={handleReset}>Reset</Button>
      </div>
    </Flex>
  </Card>
);

FiltersSection.propTypes = {
  searchText: PropTypes.string.isRequired,
  setSearchText: PropTypes.func.isRequired,
  regionFilter: PropTypes.string.isRequired,
  setRegionFilter: PropTypes.func.isRequired,
  frequencyFilter: PropTypes.string.isRequired,
  setFrequencyFilter: PropTypes.func.isRequired,
  filingMethodFilter: PropTypes.string.isRequired,
  setFilingMethodFilter: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  regionOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  frequencyOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  filingMethodOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const Upper = ({
  activeTab,
  setActiveTab,
  searchText,
  setSearchText,
  regionFilter,
  setRegionFilter,
  frequencyFilter,
  setFrequencyFilter,
  filingMethodFilter,
  setFilingMethodFilter,
  handleReset,
  handleSearch,
  regionOptions,
  frequencyOptions,
  filingMethodOptions,
}) => (
  <Space direction="vertical" size="large" style={{ width: '100%' }}>
    <TabsSection activeTab={activeTab} setActiveTab={setActiveTab} />
    <FiltersSection
      searchText={searchText}
      setSearchText={setSearchText}
      regionFilter={regionFilter}
      setRegionFilter={setRegionFilter}
      frequencyFilter={frequencyFilter}
      setFrequencyFilter={setFrequencyFilter}
      filingMethodFilter={filingMethodFilter}
      setFilingMethodFilter={setFilingMethodFilter}
      handleReset={handleReset}
      handleSearch={handleSearch}
      regionOptions={regionOptions}
      frequencyOptions={frequencyOptions}
      filingMethodOptions={filingMethodOptions}
    />
  </Space>
);

Upper.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
  setSearchText: PropTypes.func.isRequired,
  regionFilter: PropTypes.string.isRequired,
  setRegionFilter: PropTypes.func.isRequired,
  frequencyFilter: PropTypes.string.isRequired,
  setFrequencyFilter: PropTypes.func.isRequired,
  filingMethodFilter: PropTypes.string.isRequired,
  setFilingMethodFilter: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  regionOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  frequencyOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  filingMethodOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const Lower = ({ filteredData }) => (
  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
    <Card>
      <div style={{ textAlign: 'right', marginBottom: '24px' }}>
        <Button type="default" icon={<PlusOutlined />}>
          Add a tax return
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          position: ['bottomRight'],
          showSizeChanger: false,
          showQuickJumper: false,
          pageSize: PAGINATION_PAGE_SIZE,
          showTotal: false,
          itemRender: (_, type, originalElement) => {
            if (type === 'prev' || type === 'next') {
              return originalElement;
            }
            return null;
          },
        }}
        bordered={false}
        size="middle"
        showSorterTooltip={false}
      />
    </Card>
  </Space>
);

Lower.propTypes = {
  filteredData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const ExistingReturns = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [searchText, setSearchText] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [filingMethodFilter, setFilingMethodFilter] = useState('all');
  const [filteredData, setFilteredData] = useState(() =>
    // Initialize with Active status items since default tab is '1' (Active)
    data.filter((item) => item.status === 'Active')
  );

  // Extract unique options from data for filters
  const regionOptions = useMemo(() => {
    const states = data.map((item) => item.state);
    // Sort alphabetically
    return [...new Set(states)].sort();
  }, []);

  const frequencyOptions = useMemo(() => {
    const frequencies = data.map((item) => item.frequency);
    return [...new Set(frequencies)].sort();
  }, []);

  const filingMethodOptions = useMemo(() => {
    const methods = data.map((item) => item.filingMethod);
    return [...new Set(methods)].sort();
  }, []);

  // Filter data when any filter changes
  useEffect(() => {
    let filtered = data;

    // Filter by active tab (status)
    if (activeTab !== '4') {
      // '4' is "All" tab
      const statusMap = {
        1: 'Active',
        2: 'Pending',
        3: 'Expired',
      };
      const targetStatus = statusMap[activeTab];
      filtered = filtered.filter((item) => item.status === targetStatus);
    }

    // Filter by region
    if (regionFilter !== 'all') {
      filtered = filtered.filter(
        (item) => item.state.toLowerCase() === regionFilter.toLowerCase()
      );
    }

    // Filter by frequency
    if (frequencyFilter !== 'all') {
      filtered = filtered.filter(
        (item) => item.frequency.toLowerCase() === frequencyFilter.toLowerCase()
      );
    }

    // Filter by filing method
    if (filingMethodFilter !== 'all') {
      filtered = filtered.filter(
        (item) =>
          item.filingMethod.toLowerCase() === filingMethodFilter.toLowerCase()
      );
    }

    // Filter by search text
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.return.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.state.toLowerCase().includes(searchLower) ||
          item.regNumber.toLowerCase().includes(searchLower)
      );
    }

    setFilteredData(filtered);
  }, [
    activeTab,
    regionFilter,
    frequencyFilter,
    filingMethodFilter,
    searchText,
  ]);

  const handleSearch = useCallback(() => {
    // Filtering is now automatic via useEffect
    // This function is kept for the search icon click
    // but the actual filtering happens automatically when searchText changes
  }, []);

  const handleReset = useCallback(() => {
    setSearchText('');
    setRegionFilter('all');
    setFrequencyFilter('all');
    setFilingMethodFilter('all');
    // The useEffect will automatically filter with the reset values
  }, []);

  return (
    <>
      <style>{paginationStyles}</style>
      <PageHeader>
        <BreadcrumbMenu />
        <Content>
          <Title level={1}>Set up returns</Title>
          <Upper
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchText={searchText}
            setSearchText={setSearchText}
            regionFilter={regionFilter}
            setRegionFilter={setRegionFilter}
            frequencyFilter={frequencyFilter}
            setFrequencyFilter={setFrequencyFilter}
            filingMethodFilter={filingMethodFilter}
            setFilingMethodFilter={setFilingMethodFilter}
            handleReset={handleReset}
            handleSearch={handleSearch}
            regionOptions={regionOptions}
            frequencyOptions={frequencyOptions}
            filingMethodOptions={filingMethodOptions}
          />
        </Content>
      </PageHeader>
      <Content>
        <Layout>
          <Lower filteredData={filteredData} />
        </Layout>
      </Content>
    </>
  );
};

export default ExistingReturns;
