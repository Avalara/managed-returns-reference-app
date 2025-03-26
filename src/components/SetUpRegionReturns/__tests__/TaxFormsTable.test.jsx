import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TaxFormsTable from '../TaxFormsTable';

// Mock data for testing
const mockData = [
  {
    description: 'Description 1',
    taxAuthorityId: 111,
    taxFormCode: 'TaxFormCode 1',
    taxAuthority: 'TaxAuthorityName 1',
    taxFormName: 'TaxFormName 1',
    taxTypes: ['Tax Type 1', 'Tax Type 2'],
    recommended: true,
    purpose: 'Purpose 1',
  },
  {
    description: 'Description 2',
    taxAuthorityId: 114,
    taxFormCode: 'TaxFormCode 2',
    taxAuthority: 'TaxAuthorityName 2',
    taxFormName: 'TaxFormName 2',
    taxTypes: ['Tax Type 3'],
    recommended: false,
    purpose: 'Purpose 2',
  },
  {
    description: 'Description 3',
    taxAuthorityId: 117,
    taxFormCode: 'TaxFormCode 3',
    taxAuthority: 'TaxAuthorityName 3',
    taxFormName: 'TaxFormName 3',
    taxTypes: ['Tax Type 1', 'Tax Type 2'],
    purpose: 'Purpose 3',
    recommended: false,
  },
  {
    description: 'Description 4',
    taxAuthorityId: 118,
    taxFormCode: 'TaxFormCode 4',
    taxAuthority: 'TaxAuthorityName 4',
    taxFormName: 'TaxFormName 4',
    taxTypes: ['Tax Type 1', 'Tax Type 2'],
    recommended: false,
  },
  {
    description: 'Description 5',
    taxAuthorityId: 119,
    taxFormCode: 'TaxFormCode 5',
    taxAuthority: 'TaxAuthorityName 5',
    taxFormName: 'TaxFormName 5',
    taxTypes: ['Tax Type 1', 'Tax Type 2'],
    recommended: false,
  },
  {
    description: 'Description 6',
    taxAuthorityId: 6330,
    taxFormCode: 'TaxFormCode 6',
    taxAuthority: 'TaxAuthorityName 6',
    taxFormName: 'TaxFormName 6',
    taxTypes: ['Tax Type 1', 'Tax Type 2', 'Tax Type 3'],
    recommended: true,
  },
];

describe('TaxFormsTable', () => {
  it('should show loading state when loading prop is true', () => {
    render(<TaxFormsTable dataSource={mockData} loading={true} />);

    // Check for loading indicator
    const loadingIndicator = document.querySelector('.ant-spin');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('should render the table with data', () => {
    render(<TaxFormsTable dataSource={mockData} loading={false} />);

    // Check if column headers are rendered
    expect(screen.getByText('Return')).toBeInTheDocument();
    expect(screen.getByText('Form number')).toBeInTheDocument();

    // Check if data is rendered
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('TaxFormName 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('should display recommended tag for recommended returns', () => {
    render(<TaxFormsTable dataSource={mockData} loading={false} />);

    // There should be one "Recommended" tag visible for the first item
    const recommendedTags = screen.getAllByText('Recommended');
    expect(recommendedTags.length).toBe(2); // Only the first item in the current page is recommended
  });

  it('should handle pagination correctly', () => {
    // Create more mock data to test pagination with 10 items per page
    const extendedMockData = [
      ...mockData,
      {
        description: 'Description 7',
        taxAuthorityId: 7,
        taxFormCode: 'TaxFormCode 7',
        taxAuthority: 'TaxAuthorityName 7',
        taxFormName: 'TaxFormName 7',
        taxTypes: ['Tax Type 1'],
        recommended: false,
      },
      {
        description: 'Description 8',
        taxAuthorityId: 8,
        taxFormCode: 'TaxFormCode 8',
        taxAuthority: 'TaxAuthorityName 8',
        taxFormName: 'TaxFormName 8',
        taxTypes: ['Tax Type 2'],
        recommended: false,
      },
      {
        description: 'Description 9',
        taxAuthorityId: 9,
        taxFormCode: 'TaxFormCode 9',
        taxAuthority: 'TaxAuthorityName 9',
        taxFormName: 'TaxFormName 9',
        taxTypes: ['Tax Type 3'],
        recommended: false,
      },
      {
        description: 'Description 10',
        taxAuthorityId: 10,
        taxFormCode: 'TaxFormCode 10',
        taxAuthority: 'TaxAuthorityName 10',
        taxFormName: 'TaxFormName 10',
        taxTypes: ['Tax Type 1'],
        recommended: false,
      },
      {
        description: 'Description 11',
        taxAuthorityId: 11,
        taxFormCode: 'TaxFormCode 11',
        taxAuthority: 'TaxAuthorityName 11',
        taxFormName: 'TaxFormName 11',
        taxTypes: ['Tax Type 2'],
        recommended: false,
      },
    ];

    render(<TaxFormsTable dataSource={extendedMockData} loading={false} />);

    // First page should show first 10 items
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 10')).toBeInTheDocument();

    // Find and click the next page button using the pagination item
    const nextPageElement = document.querySelector('.ant-pagination-next');
    fireEvent.click(nextPageElement);

    // Second page should show the 11th item
    expect(screen.getByText('Description 11')).toBeInTheDocument();

    // First page items should not be visible anymore
    expect(screen.queryByText('Description 1')).not.toBeInTheDocument();
  });

  it('should expand rows to show additional information', () => {
    render(<TaxFormsTable dataSource={mockData} loading={false} />);

    // Find and click the expand button
    const expandButton = document.querySelector('.ant-table-row-expand-icon');
    fireEvent.click(expandButton);

    // Check if expanded content is visible
    expect(screen.getByText('Purpose 1')).toBeInTheDocument();
    expect(screen.getByText('Tax type')).toBeInTheDocument();
    expect(screen.getByText('Tax authority')).toBeInTheDocument();
    expect(screen.getByText('TaxAuthorityName 1')).toBeInTheDocument();
    expect(screen.getByText('Tax Type 1, Tax Type 2')).toBeInTheDocument();
  });

  it('should render "Set up returns" button for each row', () => {
    render(<TaxFormsTable dataSource={mockData} loading={false} />);

    // There should be 6 "Set up returns" buttons (one per row for all mock data items)
    const setupButtons = screen.getAllByText('Set up returns');
    expect(setupButtons.length).toBe(6);
  });

  it('should render empty table when no data is provided', () => {
    render(<TaxFormsTable dataSource={[]} loading={false} />);

    // Check for empty table message - using getAllByText since Ant Design might show this message multiple times
    const noDataMessages = screen.getAllByText('No data');
    expect(noDataMessages.length).toBeGreaterThan(0);
  });

  it('should handle page size correctly', () => {
    render(<TaxFormsTable dataSource={mockData} loading={false} />);

    // Should show all 6 items since it's less than the page size of 10
    const rows = document.querySelectorAll('.ant-table-row');
    expect(rows.length).toBe(6);
  });
});
