import type {
  Report,
  ReportsResponse,
  ReportFilters,
  ReportResponse,
  ReportFormData,
} from '@/lib/types/reports';

// Sample HTML content for sections
const SAMPLE_EXECUTIVE_SUMMARY = `<h2>Executive Summary</h2><p>This comprehensive market research report provides an in-depth analysis of the healthcare sector, covering market size, growth drivers, competitive landscape, and future trends. The market is expected to grow at a CAGR of <strong>8.5%</strong> from 2024 to 2030.</p><ul><li>Market valued at $XX billion in 2024</li><li>Key growth drivers include technological advancement and aging population</li><li>Major players are investing heavily in R&D</li></ul>`;

const SAMPLE_MARKET_OVERVIEW = `<h2>Market Overview</h2><p>The global healthcare market has witnessed significant transformation driven by digital innovation, changing patient demographics, and regulatory reforms. The shift towards value-based care and personalized medicine is reshaping the industry landscape.</p><p>Key market dynamics include:</p><ul><li>Increasing healthcare expenditure globally</li><li>Rising chronic disease prevalence</li><li>Technological advancements in diagnostics and treatment</li><li>Growing focus on preventive healthcare</li></ul>`;

const SAMPLE_MARKET_SIZE = `<h2>Market Size & Forecast</h2><p>The market was valued at approximately <strong>$XXX billion</strong> in 2024 and is projected to reach <strong>$YYY billion</strong> by 2030, registering a CAGR of 8.5% during the forecast period.</p><table><thead><tr><th>Year</th><th>Market Size ($ Billion)</th><th>Growth Rate (%)</th></tr></thead><tbody><tr><td>2024</td><td>XXX</td><td>-</td></tr><tr><td>2025</td><td>XXX</td><td>8.2%</td></tr><tr><td>2030</td><td>YYY</td><td>8.5%</td></tr></tbody></table>`;

const SAMPLE_COMPETITIVE = `<h2>Competitive Landscape</h2><p>The market is characterized by intense competition among established players and emerging startups. Key competitive strategies include:</p><ul><li>Product innovation and R&D investment</li><li>Strategic partnerships and acquisitions</li><li>Geographic expansion into emerging markets</li><li>Focus on customer experience and digital solutions</li></ul><p>The market concentration is moderate, with the top 5 players accounting for approximately 45% of market share.</p>`;

const SAMPLE_KEY_PLAYERS = `<h2>Key Players</h2><ul><li><strong>Company A</strong> - Market leader with 15% market share, focusing on innovative diagnostics</li><li><strong>Company B</strong> - Strong presence in North America, specializing in medical devices</li><li><strong>Company C</strong> - Rapidly growing player in the digital health segment</li><li><strong>Company D</strong> - Established pharmaceutical company expanding into biotechnology</li><li><strong>Company E</strong> - Leading telemedicine platform with global reach</li></ul>`;

const SAMPLE_REGIONAL = `<h2>Regional Analysis</h2><h3>North America</h3><p>Largest market share (40%), driven by advanced healthcare infrastructure and high healthcare spending.</p><h3>Europe</h3><p>Second-largest market (30%), with strong regulatory framework and focus on innovation.</p><h3>Asia Pacific</h3><p>Fastest-growing region (expected CAGR of 12%), fueled by rising middle class and improving healthcare access.</p>`;

const SAMPLE_TRENDS = `<h2>Trends & Opportunities</h2><p>Key emerging trends shaping the market:</p><ul><li><strong>AI and Machine Learning</strong> - Transforming diagnostics and treatment planning</li><li><strong>Telemedicine Adoption</strong> - Accelerated by COVID-19, now a permanent fixture</li><li><strong>Personalized Medicine</strong> - Tailored treatments based on genetic profiles</li><li><strong>Wearable Health Tech</strong> - Continuous monitoring and preventive care</li><li><strong>Value-Based Care Models</strong> - Shift from volume to outcomes-based reimbursement</li></ul>`;

const SAMPLE_CONCLUSION = `<h2>Conclusion</h2><p>The healthcare market presents significant growth opportunities driven by technological innovation, demographic shifts, and evolving patient expectations. Companies that invest in digital transformation, focus on patient outcomes, and adapt to regulatory changes will be well-positioned for success.</p><p><strong>Key Takeaways:</strong></p><ul><li>Market expected to grow at 8.5% CAGR through 2030</li><li>Digital health and AI are major growth catalysts</li><li>Asia Pacific offers highest growth potential</li><li>Strategic partnerships will be critical for market expansion</li></ul>`;

const SAMPLE_MARKET_DETAILS = `<h2>Market Details</h2><p>The healthcare market is undergoing significant transformation driven by technological innovation, changing demographics, and evolving regulatory landscapes. This section provides detailed insights into market dynamics, stakeholder analysis, and key market characteristics.</p><ul><li>Market fragmentation and consolidation trends</li><li>Value chain analysis</li><li>Regulatory environment overview</li><li>Reimbursement landscape</li></ul>`;

const SAMPLE_KEY_FINDINGS = `<h2>Key Findings</h2><p>Based on comprehensive market analysis, the following key findings have emerged:</p><ul><li><strong>Market Growth:</strong> The market is expected to grow at a robust CAGR of 8.5% through 2030</li><li><strong>Technology Impact:</strong> AI and digital health are primary growth drivers</li><li><strong>Regional Dynamics:</strong> Asia Pacific shows highest growth potential</li><li><strong>Competitive Landscape:</strong> Moderate concentration with top 5 players holding 45% market share</li><li><strong>Innovation Trends:</strong> Focus on personalized medicine and value-based care models</li></ul>`;

const SAMPLE_TABLE_OF_CONTENTS = `<h2>Table of Contents</h2><ol><li>Executive Summary</li><li>Market Overview</li><li>Market Size & Forecast</li><li>Competitive Analysis</li><li>Key Market Players</li><li>Regional Analysis</li><li>Market Trends & Opportunities</li><li>Key Findings & Insights</li><li>Conclusion & Recommendations</li></ol>`;

const SAMPLE_MARKET_DRIVERS = `<h2>Market Drivers</h2><p>Key factors driving market growth include:</p><ul><li><strong>Digital health technology adoption:</strong> Rapid adoption of digital health solutions accelerated by pandemic</li><li><strong>Healthcare infrastructure investment:</strong> Governments and private sector investing in modernization</li><li><strong>Regulatory support:</strong> Favorable policies and reimbursement frameworks emerging globally</li><li><strong>Rising healthcare spending:</strong> Increasing per capita healthcare expenditure in emerging markets</li><li><strong>Technological innovation:</strong> AI, IoT, and 5G enabling new healthcare delivery models</li></ul>`;

const SAMPLE_CHALLENGES = `<h2>Challenges & Restraints</h2><p>The market faces several challenges that may impact growth:</p><ul><li><strong>Data privacy and security concerns:</strong> Increasing cyber threats and stringent data protection regulations</li><li><strong>High implementation costs:</strong> Significant upfront investment required for digital transformation</li><li><strong>Regulatory complexity:</strong> Varying compliance requirements across different markets</li><li><strong>Interoperability issues:</strong> Lack of standardization in healthcare IT systems</li><li><strong>Resistance to change:</strong> Traditional healthcare providers slow to adopt new technologies</li></ul>`;

// Utility: Generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Mock database
const mockReports: Report[] = [
  // Published Reports
  {
    id: 'rpt-001',
    title: 'Global Telemedicine Market Analysis 2024-2030',
    slug: 'global-telemedicine-market-analysis-2024-2030',
    summary:
      'Comprehensive analysis of the telemedicine market including growth drivers, challenges, and future outlook across major geographies.',
    category: 'Telemedicine',
    geography: ['Global', 'North America', 'Europe', 'Asia Pacific'],
    publishDate: new Date('2024-12-15').toISOString(),
    price: 4999,
    discountedPrice: 3999,
    pageCount: 145,
    formats: ['PDF', 'Excel'],
    marketMetrics: {
      currentRevenue: '$87.4 billion',
      currentYear: 2024,
      forecastRevenue: '$286.2 billion',
      forecastYear: 2032,
      cagr: '16.8%',
      cagrStartYear: 2025,
      cagrEndYear: 2032,
    },
    authorIds: ['auth-001', 'auth-002'],
    keyPlayers: [
      { name: 'Teladoc Health, Inc.', marketShare: '14.2%', rank: 1 },
      { name: 'Amwell (American Well)', marketShare: '8.7%', rank: 2 },
      { name: 'Doctor on Demand', marketShare: '6.3%', rank: 3 },
      { name: 'MDLIVE Inc.', marketShare: '5.9%', rank: 4 },
      { name: 'Ping An Healthcare Technology', marketShare: '4.8%', rank: 5 },
    ],
    accessType: 'paid',
    status: 'published',
    sections: {
      executiveSummary: SAMPLE_EXECUTIVE_SUMMARY,
      marketOverview: SAMPLE_MARKET_OVERVIEW,
      marketSize: SAMPLE_MARKET_SIZE,
      competitive: SAMPLE_COMPETITIVE,
      keyPlayers: SAMPLE_KEY_PLAYERS,
      regional: SAMPLE_REGIONAL,
      trends: SAMPLE_TRENDS,
      conclusion: SAMPLE_CONCLUSION,
      marketDetails: SAMPLE_MARKET_DETAILS,
      keyFindings: SAMPLE_KEY_FINDINGS,
      tableOfContents: SAMPLE_TABLE_OF_CONTENTS,
      marketDrivers: SAMPLE_MARKET_DRIVERS,
      challenges: SAMPLE_CHALLENGES,
    },
    metadata: {
      metaTitle: 'Global Telemedicine Market Analysis 2024-2030 | Healthcare Insights',
      metaDescription:
        'In-depth analysis of the global telemedicine market with forecasts, competitive landscape, and growth opportunities.',
      keywords: ['telemedicine', 'digital health', 'remote care', 'virtual consultation'],
    },
    versions: [
      {
        id: 'v-001-1',
        versionNumber: 1,
        summary: 'Initial publication',
        createdAt: new Date('2024-12-15').toISOString(),
        author: { id: 'user1', email: 'admin@example.com', name: 'Admin User' },
        sections: {
          executiveSummary: SAMPLE_EXECUTIVE_SUMMARY,
          marketOverview: SAMPLE_MARKET_OVERVIEW,
          marketSize: SAMPLE_MARKET_SIZE,
          competitive: SAMPLE_COMPETITIVE,
          keyPlayers: SAMPLE_KEY_PLAYERS,
          regional: SAMPLE_REGIONAL,
          trends: SAMPLE_TRENDS,
          conclusion: SAMPLE_CONCLUSION,
          marketDetails: SAMPLE_MARKET_DETAILS,
          keyFindings: SAMPLE_KEY_FINDINGS,
          tableOfContents: SAMPLE_TABLE_OF_CONTENTS,
          marketDrivers: SAMPLE_MARKET_DRIVERS,
          challenges: SAMPLE_CHALLENGES,
        },
        metadata: {
          metaTitle: 'Global Telemedicine Market Analysis 2024-2030 | Healthcare Insights',
          metaDescription:
            'In-depth analysis of the global telemedicine market with forecasts, competitive landscape, and growth opportunities.',
          keywords: ['telemedicine', 'digital health', 'remote care', 'virtual consultation'],
        },
      },
    ],
    createdAt: new Date('2024-12-10').toISOString(),
    updatedAt: new Date('2024-12-15').toISOString(),
    author: { id: 'user1', email: 'admin@example.com', name: 'Admin User' },
  },
  {
    id: 'rpt-002',
    title: 'Medical Devices Market Report - North America',
    slug: 'medical-devices-market-report-north-america',
    summary:
      'Detailed examination of the North American medical devices market, covering regulatory landscape, innovation trends, and market forecasts.',
    category: 'Medical Devices',
    geography: ['North America'],
    publishDate: new Date('2024-12-10').toISOString(),
    price: 3999,
    discountedPrice: 3199,
    accessType: 'paid',
    status: 'published',
    sections: {
      executiveSummary: SAMPLE_EXECUTIVE_SUMMARY,
      marketOverview: SAMPLE_MARKET_OVERVIEW,
      marketSize: SAMPLE_MARKET_SIZE,
      competitive: SAMPLE_COMPETITIVE,
      keyPlayers: SAMPLE_KEY_PLAYERS,
      regional:
        '<h2>North America Focus</h2><p>The North American medical devices market is the largest globally, driven by advanced healthcare infrastructure, high R&D spending, and strong regulatory frameworks from the FDA.</p>',
      trends: SAMPLE_TRENDS,
      conclusion: SAMPLE_CONCLUSION,
      marketDetails: SAMPLE_MARKET_DETAILS,
      keyFindings: SAMPLE_KEY_FINDINGS,
      tableOfContents: SAMPLE_TABLE_OF_CONTENTS,
      marketDrivers: SAMPLE_MARKET_DRIVERS,
      challenges: SAMPLE_CHALLENGES,
    },
    metadata: {
      metaTitle: 'Medical Devices Market Report - North America | In-Depth Analysis',
      metaDescription:
        'Comprehensive report on the North American medical devices market with insights on regulations, innovation, and growth.',
      keywords: ['medical devices', 'FDA', 'healthcare equipment', 'North America'],
    },
    versions: [],
    createdAt: new Date('2024-12-05').toISOString(),
    updatedAt: new Date('2024-12-10').toISOString(),
    author: { id: 'user2', email: 'editor@example.com', name: 'Editor User' },
  },
  {
    id: 'rpt-003',
    title: 'Pharmaceutical Industry Trends 2025',
    slug: 'pharmaceutical-industry-trends-2025',
    summary:
      'Analysis of emerging trends in the pharmaceutical industry including personalized medicine, biosimilars, and digital therapeutics.',
    category: 'Pharmaceuticals',
    geography: ['Global'],
    publishDate: new Date('2024-12-01').toISOString(),
    price: 5999,
    discountedPrice: 5999,
    accessType: 'paid',
    status: 'published',
    sections: {
      executiveSummary: SAMPLE_EXECUTIVE_SUMMARY,
      marketOverview: SAMPLE_MARKET_OVERVIEW,
      marketSize: SAMPLE_MARKET_SIZE,
      competitive: SAMPLE_COMPETITIVE,
      keyPlayers:
        '<h2>Key Pharmaceutical Companies</h2><ul><li>Pfizer - Leading in mRNA vaccine technology</li><li>Johnson & Johnson - Diversified healthcare portfolio</li><li>Roche - Oncology and diagnostics leader</li><li>Novartis - Focus on gene therapy and rare diseases</li></ul>',
      regional: SAMPLE_REGIONAL,
      trends: SAMPLE_TRENDS,
      conclusion: SAMPLE_CONCLUSION,
      marketDetails: SAMPLE_MARKET_DETAILS,
      keyFindings: SAMPLE_KEY_FINDINGS,
      tableOfContents: SAMPLE_TABLE_OF_CONTENTS,
      marketDrivers: SAMPLE_MARKET_DRIVERS,
      challenges: SAMPLE_CHALLENGES,
    },
    metadata: {
      metaTitle: 'Pharmaceutical Industry Trends 2025 | Market Research Report',
      metaDescription:
        'Explore the latest trends shaping the pharmaceutical industry in 2025, including AI-driven drug discovery and personalized medicine.',
      keywords: ['pharmaceuticals', 'drug development', 'biosimilars', 'personalized medicine'],
    },
    versions: [],
    createdAt: new Date('2024-11-25').toISOString(),
    updatedAt: new Date('2024-12-01').toISOString(),
    author: { id: 'user1', email: 'admin@example.com', name: 'Admin User' },
  },
  {
    id: 'rpt-004',
    title: 'Healthcare IT Market - Cloud Solutions and AI',
    slug: 'healthcare-it-market-cloud-solutions-and-ai',
    summary:
      'Comprehensive study of the healthcare IT market focusing on cloud-based solutions, AI applications, and cybersecurity.',
    category: 'Healthcare IT',
    geography: ['Global', 'North America', 'Europe'],
    publishDate: new Date('2024-11-28').toISOString(),
    price: 4499,
    discountedPrice: 4499,
    accessType: 'paid',
    status: 'published',
    sections: {
      executiveSummary: SAMPLE_EXECUTIVE_SUMMARY,
      marketOverview: SAMPLE_MARKET_OVERVIEW,
      marketSize: SAMPLE_MARKET_SIZE,
      competitive: SAMPLE_COMPETITIVE,
      keyPlayers: '',
      regional: SAMPLE_REGIONAL,
      trends: SAMPLE_TRENDS,
      conclusion: SAMPLE_CONCLUSION,
      marketDetails: SAMPLE_MARKET_DETAILS,
      keyFindings: SAMPLE_KEY_FINDINGS,
      tableOfContents: SAMPLE_TABLE_OF_CONTENTS,
      marketDrivers: SAMPLE_MARKET_DRIVERS,
      challenges: SAMPLE_CHALLENGES,
    },
    metadata: {
      metaTitle: 'Healthcare IT Market - Cloud Solutions and AI | 2024 Report',
      metaDescription:
        'In-depth analysis of the healthcare IT market, covering cloud adoption, AI integration, and cybersecurity trends.',
      keywords: ['healthcare IT', 'cloud computing', 'AI in healthcare', 'EHR systems'],
    },
    versions: [],
    createdAt: new Date('2024-11-20').toISOString(),
    updatedAt: new Date('2024-11-28').toISOString(),
    author: { id: 'user2', email: 'editor@example.com', name: 'Editor User' },
  },
  {
    id: 'rpt-005',
    title: 'Biotechnology Market Outlook - Gene Therapy Focus',
    slug: 'biotechnology-market-outlook-gene-therapy-focus',
    summary:
      'Market analysis of the biotechnology sector with special emphasis on gene therapy advancements and CRISPR technology.',
    category: 'Biotechnology',
    geography: ['Global', 'North America'],
    publishDate: new Date('2024-11-20').toISOString(),
    price: 6999,
    discountedPrice: 6999,
    accessType: 'paid',
    status: 'published',
    sections: {
      executiveSummary: SAMPLE_EXECUTIVE_SUMMARY,
      marketOverview: SAMPLE_MARKET_OVERVIEW,
      marketSize: SAMPLE_MARKET_SIZE,
      competitive: SAMPLE_COMPETITIVE,
      keyPlayers: SAMPLE_KEY_PLAYERS,
      regional: SAMPLE_REGIONAL,
      trends:
        '<h2>Gene Therapy Trends</h2><p>Gene therapy is revolutionizing biotechnology with breakthroughs in CRISPR-Cas9 technology, CAR-T cell therapy, and mRNA vaccines. The market is expected to reach $10B by 2028.</p>',
      conclusion: SAMPLE_CONCLUSION,
      marketDetails: SAMPLE_MARKET_DETAILS,
      keyFindings: SAMPLE_KEY_FINDINGS,
      tableOfContents: SAMPLE_TABLE_OF_CONTENTS,
      marketDrivers: SAMPLE_MARKET_DRIVERS,
      challenges: SAMPLE_CHALLENGES,
    },
    metadata: {
      metaTitle: 'Biotechnology Market Outlook - Gene Therapy Focus | 2024',
      metaDescription:
        'Explore the biotechnology market with focus on gene therapy, CRISPR technology, and innovative treatment modalities.',
      keywords: ['biotechnology', 'gene therapy', 'CRISPR', 'CAR-T therapy'],
    },
    versions: [],
    createdAt: new Date('2024-11-15').toISOString(),
    updatedAt: new Date('2024-11-20').toISOString(),
    author: { id: 'user1', email: 'admin@example.com', name: 'Admin User' },
  },
  {
    id: 'rpt-006',
    title: 'Diagnostic Technologies - Point-of-Care Testing',
    slug: 'diagnostic-technologies-point-of-care-testing',
    summary:
      'Analysis of diagnostic technologies market with emphasis on point-of-care testing, rapid diagnostics, and molecular testing.',
    category: 'Diagnostics',
    geography: ['Global'],
    publishDate: new Date('2024-11-15').toISOString(),
    price: 3499,
    discountedPrice: 3499,
    accessType: 'paid',
    status: 'published',
    sections: {
      executiveSummary: SAMPLE_EXECUTIVE_SUMMARY,
      marketOverview: SAMPLE_MARKET_OVERVIEW,
      marketSize: SAMPLE_MARKET_SIZE,
      competitive: SAMPLE_COMPETITIVE,
      keyPlayers: '',
      regional: SAMPLE_REGIONAL,
      trends: SAMPLE_TRENDS,
      conclusion: SAMPLE_CONCLUSION,
      marketDetails: SAMPLE_MARKET_DETAILS,
      keyFindings: SAMPLE_KEY_FINDINGS,
      tableOfContents: SAMPLE_TABLE_OF_CONTENTS,
      marketDrivers: SAMPLE_MARKET_DRIVERS,
      challenges: SAMPLE_CHALLENGES,
    },
    metadata: {
      metaTitle: 'Diagnostic Technologies - Point-of-Care Testing | Market Report',
      metaDescription:
        'Comprehensive analysis of diagnostic technologies market covering POCT, rapid tests, and molecular diagnostics.',
      keywords: ['diagnostics', 'point-of-care testing', 'rapid diagnostics', 'molecular testing'],
    },
    versions: [],
    createdAt: new Date('2024-11-10').toISOString(),
    updatedAt: new Date('2024-11-15').toISOString(),
    author: { id: 'user2', email: 'editor@example.com', name: 'Editor User' },
  },
  {
    id: 'rpt-007',
    title: 'Digital Health Ecosystem - Consumer Trends',
    slug: 'digital-health-ecosystem-consumer-trends',
    summary:
      'Exploration of the digital health ecosystem from a consumer perspective, including wearables, health apps, and patient engagement.',
    category: 'Digital Health',
    geography: ['Global', 'North America', 'Europe', 'Asia Pacific'],
    publishDate: new Date('2024-11-08').toISOString(),
    price: 0,
    discountedPrice: 0,
    accessType: 'free',
    status: 'published',
    sections: {
      executiveSummary: SAMPLE_EXECUTIVE_SUMMARY,
      marketOverview: SAMPLE_MARKET_OVERVIEW,
      marketSize: SAMPLE_MARKET_SIZE,
      competitive: SAMPLE_COMPETITIVE,
      keyPlayers: SAMPLE_KEY_PLAYERS,
      regional: SAMPLE_REGIONAL,
      trends: SAMPLE_TRENDS,
      conclusion: SAMPLE_CONCLUSION,
      marketDetails: SAMPLE_MARKET_DETAILS,
      keyFindings: SAMPLE_KEY_FINDINGS,
      tableOfContents: SAMPLE_TABLE_OF_CONTENTS,
      marketDrivers: SAMPLE_MARKET_DRIVERS,
      challenges: SAMPLE_CHALLENGES,
    },
    metadata: {
      metaTitle: 'Digital Health Ecosystem - Consumer Trends | Free Report',
      metaDescription:
        'Free report on digital health trends from consumer perspective, covering wearables, apps, and patient engagement.',
      keywords: ['digital health', 'wearables', 'health apps', 'consumer health'],
    },
    versions: [],
    createdAt: new Date('2024-11-01').toISOString(),
    updatedAt: new Date('2024-11-08').toISOString(),
    author: { id: 'user1', email: 'admin@example.com', name: 'Admin User' },
  },
  {
    id: 'rpt-008',
    title: 'Clinical Research Outsourcing Trends',
    slug: 'clinical-research-outsourcing-trends',
    summary:
      'Market intelligence on clinical research outsourcing, covering CROs, virtual trials, and decentralized research models.',
    category: 'Clinical Research',
    geography: ['Global'],
    publishDate: new Date('2024-10-25').toISOString(),
    price: 4999,
    discountedPrice: 4999,
    accessType: 'paid',
    status: 'published',
    sections: {
      executiveSummary: SAMPLE_EXECUTIVE_SUMMARY,
      marketOverview: SAMPLE_MARKET_OVERVIEW,
      marketSize: SAMPLE_MARKET_SIZE,
      competitive: SAMPLE_COMPETITIVE,
      keyPlayers: '',
      regional: SAMPLE_REGIONAL,
      trends: SAMPLE_TRENDS,
      conclusion: SAMPLE_CONCLUSION,
      marketDetails: SAMPLE_MARKET_DETAILS,
      keyFindings: SAMPLE_KEY_FINDINGS,
      tableOfContents: SAMPLE_TABLE_OF_CONTENTS,
      marketDrivers: SAMPLE_MARKET_DRIVERS,
      challenges: SAMPLE_CHALLENGES,
    },
    metadata: {
      metaTitle: 'Clinical Research Outsourcing Trends | CRO Market Report',
      metaDescription:
        'Analysis of clinical research outsourcing market, including CRO trends, virtual trials, and decentralized models.',
      keywords: ['clinical research', 'CRO', 'virtual trials', 'clinical trials'],
    },
    versions: [],
    createdAt: new Date('2024-10-20').toISOString(),
    updatedAt: new Date('2024-10-25').toISOString(),
    author: { id: 'user2', email: 'editor@example.com', name: 'Editor User' },
  },
  {
    id: 'rpt-009',
    title: 'Asia Pacific Healthcare Market Overview',
    slug: 'asia-pacific-healthcare-market-overview',
    summary:
      'Regional analysis of the Asia Pacific healthcare market, highlighting growth opportunities and challenges across key countries.',
    category: 'Other',
    geography: ['Asia Pacific'],
    publishDate: new Date('2024-10-18').toISOString(),
    price: 3999,
    discountedPrice: 3999,
    accessType: 'paid',
    status: 'published',
    sections: {
      executiveSummary: SAMPLE_EXECUTIVE_SUMMARY,
      marketOverview: SAMPLE_MARKET_OVERVIEW,
      marketSize: SAMPLE_MARKET_SIZE,
      competitive: SAMPLE_COMPETITIVE,
      keyPlayers: SAMPLE_KEY_PLAYERS,
      regional:
        '<h2>Asia Pacific Regional Breakdown</h2><h3>China</h3><p>Largest market in the region, driven by government healthcare reforms and rising middle class.</p><h3>India</h3><p>Rapidly growing market with focus on affordable healthcare solutions.</p><h3>Japan</h3><p>Mature market with aging population driving demand for senior care.</p>',
      trends: SAMPLE_TRENDS,
      conclusion: SAMPLE_CONCLUSION,
      marketDetails: SAMPLE_MARKET_DETAILS,
      keyFindings: SAMPLE_KEY_FINDINGS,
      tableOfContents: SAMPLE_TABLE_OF_CONTENTS,
      marketDrivers: SAMPLE_MARKET_DRIVERS,
      challenges: SAMPLE_CHALLENGES,
    },
    metadata: {
      metaTitle: 'Asia Pacific Healthcare Market Overview | Regional Analysis',
      metaDescription:
        'Comprehensive overview of the Asia Pacific healthcare market with country-specific insights and growth forecasts.',
      keywords: ['Asia Pacific', 'healthcare market', 'China healthcare', 'India healthcare'],
    },
    versions: [],
    createdAt: new Date('2024-10-10').toISOString(),
    updatedAt: new Date('2024-10-18').toISOString(),
    author: { id: 'user1', email: 'admin@example.com', name: 'Admin User' },
  },
  {
    id: 'rpt-010',
    title: 'Emerging Markets Healthcare Investment Guide',
    slug: 'emerging-markets-healthcare-investment-guide',
    summary:
      'Investment opportunities and risk analysis for healthcare ventures in emerging markets including Latin America, Middle East, and Africa.',
    category: 'Other',
    geography: ['Latin America', 'Middle East & Africa'],
    publishDate: new Date('2024-10-10').toISOString(),
    price: 0,
    discountedPrice: 0,
    accessType: 'free',
    status: 'published',
    sections: {
      executiveSummary: SAMPLE_EXECUTIVE_SUMMARY,
      marketOverview: SAMPLE_MARKET_OVERVIEW,
      marketSize: SAMPLE_MARKET_SIZE,
      competitive: SAMPLE_COMPETITIVE,
      keyPlayers: '',
      regional: SAMPLE_REGIONAL,
      trends: SAMPLE_TRENDS,
      conclusion: SAMPLE_CONCLUSION,
      marketDetails: SAMPLE_MARKET_DETAILS,
      keyFindings: SAMPLE_KEY_FINDINGS,
      tableOfContents: SAMPLE_TABLE_OF_CONTENTS,
      marketDrivers: SAMPLE_MARKET_DRIVERS,
      challenges: SAMPLE_CHALLENGES,
    },
    metadata: {
      metaTitle: 'Emerging Markets Healthcare Investment Guide | Free Report',
      metaDescription:
        'Free guide to healthcare investment opportunities in emerging markets across Latin America, Middle East, and Africa.',
      keywords: [
        'emerging markets',
        'healthcare investment',
        'Latin America',
        'Middle East',
        'Africa',
      ],
    },
    versions: [],
    createdAt: new Date('2024-10-05').toISOString(),
    updatedAt: new Date('2024-10-10').toISOString(),
    author: { id: 'user2', email: 'editor@example.com', name: 'Editor User' },
  },

  // Draft Reports
  {
    id: 'rpt-011',
    title: 'Wearable Health Devices Market - Draft',
    slug: 'wearable-health-devices-market-draft',
    summary:
      'Market analysis of wearable health devices including smartwatches, fitness trackers, and medical-grade wearables.',
    category: 'Digital Health',
    geography: ['Global', 'North America'],
    publishDate: new Date('2025-01-15').toISOString(),
    price: 4499,
    discountedPrice: 4499,
    accessType: 'paid',
    status: 'draft',
    sections: {
      executiveSummary: SAMPLE_EXECUTIVE_SUMMARY,
      marketOverview: SAMPLE_MARKET_OVERVIEW,
      marketSize: SAMPLE_MARKET_SIZE,
      competitive: '<h2>Competitive Landscape</h2><p>Draft content - to be completed...</p>',
      keyPlayers: '',
      regional: '',
      trends: '',
      conclusion: '<h2>Conclusion</h2><p>Draft - pending final analysis...</p>',
      marketDetails: '',
      keyFindings: '',
      tableOfContents: '',
      marketDrivers: '',
      challenges: '',
    },
    metadata: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
    versions: [],
    createdAt: new Date('2024-12-20').toISOString(),
    updatedAt: new Date('2024-12-23').toISOString(),
    author: { id: 'user1', email: 'admin@example.com', name: 'Admin User' },
  },
  {
    id: 'rpt-012',
    title: 'Mental Health Tech Solutions - Draft',
    slug: 'mental-health-tech-solutions-draft',
    summary:
      'Analysis of digital mental health solutions including therapy apps, AI-powered counseling, and remote monitoring.',
    category: 'Digital Health',
    geography: ['Global'],
    publishDate: new Date('2025-02-01').toISOString(),
    price: 3999,
    discountedPrice: 3999,
    accessType: 'paid',
    status: 'draft',
    sections: {
      executiveSummary: '<h2>Executive Summary</h2><p>Draft content...</p>',
      marketOverview: SAMPLE_MARKET_OVERVIEW,
      marketSize: '',
      competitive: '',
      keyPlayers: '',
      regional: '',
      trends: '',
      conclusion: '',
      marketDetails: '',
      keyFindings: '',
      tableOfContents: '',
      marketDrivers: '',
      challenges: '',
    },
    metadata: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
    versions: [],
    createdAt: new Date('2024-12-18').toISOString(),
    updatedAt: new Date('2024-12-22').toISOString(),
    author: { id: 'user2', email: 'editor@example.com', name: 'Editor User' },
  },
  {
    id: 'rpt-013',
    title: 'Blockchain in Healthcare - Draft',
    slug: 'blockchain-in-healthcare-draft',
    summary:
      'Exploration of blockchain applications in healthcare including data security, supply chain, and patient records management.',
    category: 'Healthcare IT',
    geography: ['Global'],
    publishDate: new Date('2025-02-15').toISOString(),
    price: 5499,
    discountedPrice: 5499,
    accessType: 'paid',
    status: 'draft',
    sections: {
      executiveSummary: SAMPLE_EXECUTIVE_SUMMARY,
      marketOverview: '',
      marketSize: '',
      competitive: '',
      keyPlayers: '',
      regional: '',
      trends: '',
      conclusion: '',
      marketDetails: '',
      keyFindings: '',
      tableOfContents: '',
      marketDrivers: '',
      challenges: '',
    },
    metadata: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
    versions: [],
    createdAt: new Date('2024-12-15').toISOString(),
    updatedAt: new Date('2024-12-20').toISOString(),
    author: { id: 'user1', email: 'admin@example.com', name: 'Admin User' },
  },
  {
    id: 'rpt-014',
    title: 'Robotic Surgery Market Analysis - Draft',
    slug: 'robotic-surgery-market-analysis-draft',
    summary:
      'Market study on robotic surgery systems, including technology trends, adoption rates, and competitive landscape.',
    category: 'Medical Devices',
    geography: ['North America', 'Europe'],
    publishDate: new Date('2025-03-01').toISOString(),
    price: 6499,
    discountedPrice: 6499,
    accessType: 'paid',
    status: 'draft',
    sections: {
      executiveSummary:
        '<h2>Executive Summary</h2><p>The robotic surgery market is experiencing rapid growth...</p>',
      marketOverview: SAMPLE_MARKET_OVERVIEW,
      marketSize: SAMPLE_MARKET_SIZE,
      competitive: '',
      keyPlayers: '',
      regional: '',
      trends: '',
      conclusion: '',
      marketDetails: '',
      keyFindings: '',
      tableOfContents: '',
      marketDrivers: '',
      challenges: '',
    },
    metadata: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
    versions: [],
    createdAt: new Date('2024-12-12').toISOString(),
    updatedAt: new Date('2024-12-19').toISOString(),
    author: { id: 'user2', email: 'editor@example.com', name: 'Editor User' },
  },
  {
    id: 'rpt-015',
    title: 'Precision Medicine Market - Draft',
    slug: 'precision-medicine-market-draft',
    summary:
      'Comprehensive analysis of precision medicine market including genomics, targeted therapies, and companion diagnostics.',
    category: 'Biotechnology',
    geography: ['Global'],
    publishDate: new Date('2025-03-15').toISOString(),
    price: 7999,
    discountedPrice: 7999,
    accessType: 'paid',
    status: 'draft',
    sections: {
      executiveSummary: '',
      marketOverview: '',
      marketSize: '',
      competitive: '',
      keyPlayers: '',
      regional: '',
      trends: '',
      conclusion: '',
      marketDetails: '',
      keyFindings: '',
      tableOfContents: '',
      marketDrivers: '',
      challenges: '',
    },
    metadata: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
    versions: [],
    createdAt: new Date('2024-12-08').toISOString(),
    updatedAt: new Date('2024-12-18').toISOString(),
    author: { id: 'user1', email: 'admin@example.com', name: 'Admin User' },
  },
];

// Mock API functions
export async function fetchReportsMock(filters?: ReportFilters): Promise<ReportsResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  let filtered = [...mockReports];

  // Apply filters
  if (filters?.status) {
    filtered = filtered.filter(r => r.status === filters.status);
  }
  if (filters?.category) {
    filtered = filtered.filter(r => r.category === filters.category);
  }
  if (filters?.geography) {
    filtered = filtered.filter(r => r.geography.includes(filters.geography!));
  }
  if (filters?.accessType) {
    filtered = filtered.filter(r => r.accessType === filters.accessType);
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      r => r.title.toLowerCase().includes(search) || r.summary.toLowerCase().includes(search)
    );
  }

  // Sort by updatedAt (newest first)
  filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // Pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const reports = filtered.slice(start, end);

  return { reports, total, page, limit, totalPages };
}

export async function fetchReportByIdMock(id: string): Promise<ReportResponse> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const report = mockReports.find(r => r.id === id);
  if (!report) {
    throw new Error('Report not found');
  }

  return { report };
}

export async function createReportMock(data: ReportFormData): Promise<ReportResponse> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const newReport: Report = {
    id: `rpt-${Date.now()}`,
    slug: generateSlug(data.title),
    publishDate: new Date().toISOString(),
    ...data,
    versions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: { id: 'user1', email: 'admin@example.com', name: 'Admin User' },
  };

  mockReports.unshift(newReport);
  return { report: newReport };
}

export async function updateReportMock(
  id: string,
  data: Partial<ReportFormData>
): Promise<ReportResponse> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const index = mockReports.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error('Report not found');
  }

  const updated: Report = {
    ...mockReports[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // Add version if status changed to published
  if (data.status === 'published' && mockReports[index].status === 'draft') {
    const newVersion = {
      id: `v-${Date.now()}`,
      versionNumber: (updated.versions?.length || 0) + 1,
      summary: 'Published report',
      createdAt: new Date().toISOString(),
      author: { id: 'user1', email: 'admin@example.com', name: 'Admin User' },
      sections: updated.sections,
      metadata: updated.metadata,
    };
    updated.versions = [...(updated.versions || []), newVersion];
  }

  mockReports[index] = updated;
  return { report: updated };
}

export async function deleteReportMock(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const index = mockReports.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error('Report not found');
  }

  mockReports.splice(index, 1);
}
