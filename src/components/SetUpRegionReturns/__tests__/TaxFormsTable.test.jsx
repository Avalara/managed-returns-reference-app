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
    expect(recommendedTags.length).toBe(1); // Only the first item in the current page is recommended
  });

  it('should handle pagination correctly', () => {
    render(<TaxFormsTable dataSource={mockData} loading={false} />);

    // First page should show first 5 items
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();

    // Find and click the next page button using the pagination item
    const nextPageElement = document.querySelector('.ant-pagination-next');
    fireEvent.click(nextPageElement);

    // Second page should show the 6th item
    expect(screen.getByText('Description 6')).toBeInTheDocument();

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

    // There should be 5 "Set up returns" buttons (one per row on the first page)
    const setupButtons = screen.getAllByText('Set up returns');
    expect(setupButtons.length).toBe(5);
  });

  it('should render empty table when no data is provided', () => {
    render(<TaxFormsTable dataSource={[]} loading={false} />);

    // Check for empty table message - using getAllByText since Ant Design might show this message multiple times
    const noDataMessages = screen.getAllByText('No data');
    expect(noDataMessages.length).toBeGreaterThan(0);
  });

  it('should handle page size correctly', () => {
    render(<TaxFormsTable dataSource={mockData} loading={false} />);

    // Should show 5 items per page by default
    const rows = document.querySelectorAll('.ant-table-row');
    expect(rows.length).toBe(5);
  });
});
