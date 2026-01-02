import type {
  ReportAuthor,
  AuthorFormData,
  AuthorsResponse,
  AuthorResponse,
} from '@/lib/types/reports';

// Mock authors database
const mockAuthors: ReportAuthor[] = [
  {
    id: 'auth-001',
    name: 'Deepa Pandey',
    role: 'Principal Consultant',
    credentials:
      '15+ years of experience in healthcare market research, specializing in digital health transformation',
    bio: 'Deepa is a seasoned healthcare analyst with extensive experience in digital health, telemedicine, and healthcare IT markets. She has led numerous research projects for Fortune 500 companies and government agencies.',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'auth-002',
    name: 'Dr. Michael Chen',
    role: 'Lead Analyst',
    credentials:
      'Medical device innovation expert with extensive experience in Asia Pacific markets',
    bio: 'Dr. Chen holds a PhD in Biomedical Engineering and has over 12 years of experience in medical device market research. His expertise spans regulatory analysis, competitive intelligence, and market forecasting.',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'auth-003',
    name: 'Sarah Williams',
    role: 'Senior Research Analyst',
    credentials: 'Pharmaceutical industry specialist with 10+ years in market analysis',
    bio: 'Sarah specializes in pharmaceutical market dynamics, drug development trends, and regulatory landscapes across global markets.',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'auth-004',
    name: 'Dr. Rajesh Kumar',
    role: 'Healthcare Policy Expert',
    credentials: 'Former WHO consultant with expertise in healthcare systems and policy analysis',
    bio: 'Dr. Kumar has worked with international health organizations and governments on healthcare policy reform. His research focuses on healthcare access, quality, and affordability.',
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: 'auth-005',
    name: 'Emily Roberts',
    role: 'Market Research Manager',
    credentials: 'Biotechnology and life sciences market research specialist',
    bio: 'Emily has extensive experience in biotechnology market analysis, with a focus on gene therapy, personalized medicine, and innovative therapeutics.',
    createdAt: new Date('2024-03-01').toISOString(),
    updatedAt: new Date('2024-03-01').toISOString(),
  },
];

// Mock API functions
export async function fetchAuthorsMock(): Promise<AuthorsResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Sort by name
  const sorted = [...mockAuthors].sort((a, b) => a.name.localeCompare(b.name));

  return {
    authors: sorted,
    total: sorted.length,
  };
}

export async function fetchAuthorByIdMock(id: string): Promise<AuthorResponse> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const author = mockAuthors.find(a => a.id === id);
  if (!author) {
    throw new Error('Author not found');
  }

  return { author };
}

export async function createAuthorMock(data: AuthorFormData): Promise<AuthorResponse> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const newAuthor: ReportAuthor = {
    id: `auth-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockAuthors.push(newAuthor);
  return { author: newAuthor };
}

export async function updateAuthorMock(
  id: string,
  data: Partial<AuthorFormData>
): Promise<AuthorResponse> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const index = mockAuthors.findIndex(a => a.id === id);
  if (index === -1) {
    throw new Error('Author not found');
  }

  const updated: ReportAuthor = {
    ...mockAuthors[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockAuthors[index] = updated;
  return { author: updated };
}

export async function deleteAuthorMock(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockAuthors.findIndex(a => a.id === id);
  if (index === -1) {
    throw new Error('Author not found');
  }

  mockAuthors.splice(index, 1);
}
