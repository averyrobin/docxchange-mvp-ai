import React, { useState, useEffect } from 'react';

const DocXchangeFullPrototype = () => {
  const [currentView, setCurrentView] = useState('home');
  const [currentStep, setCurrentStep] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processingIndex, setProcessingIndex] = useState(-1);
  const [matchedDocs, setMatchedDocs] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [demoState, setDemoState] = useState('home');
  const [rejections, setRejections] = useState({});

  // Applications the client has
  const applications = [
    { id: 'onboarding', name: 'Business Onboarding', type: 'Commercial Onboarding', status: 'In Progress', date: 'Started Jan 15, 2026', taskCount: 3, entity: 'Port City Coffee' },
    { id: 'cre-loan', name: 'CRE Loan', type: 'Commercial Real Estate', status: 'In Progress', date: 'Started Feb 1, 2026', taskCount: 2, entity: 'Port City Coffee' },
    { id: 'loc', name: 'Line of Credit', type: 'Revolving Credit', status: 'Submitted', date: 'Started Jan 28, 2026', taskCount: 0, entity: 'Port City Coffee' },
  ];

  // Documents organized by context — relationship, loan, collateral
  const requestedDocs = [
    // Relationship docs (Port City Coffee)
    { id: 'articles', name: 'Articles of Incorporation', description: 'Current filing', entity: 'Port City Coffee', entityIcon: '🏢', context: 'Relationship', contextDetail: 'Business Entity', required: true },
    { id: 'financial-stmt', name: 'Business Financial Statements', description: 'Year ending 2024', entity: 'Port City Coffee', entityIcon: '🏢', context: 'Relationship', contextDetail: 'Business Entity', required: true },
    { id: 'tax-return-biz-2024', name: 'Business Tax Return', description: '2024 (or extension if filed)', entity: 'Port City Coffee', entityIcon: '🏢', context: 'Relationship', contextDetail: 'Business Entity', required: true },
    { id: 'tax-return-biz-2023', name: 'Business Tax Return', description: '2023', entity: 'Port City Coffee', entityIcon: '🏢', context: 'Relationship', contextDetail: 'Business Entity', required: true },
    { id: 'tax-return-biz-2022', name: 'Business Tax Return', description: '2022', entity: 'Port City Coffee', entityIcon: '🏢', context: 'Relationship', contextDetail: 'Business Entity', required: true },
    { id: 'bank-stmts', name: 'Bank Statements', description: 'Oct – Dec 2024 (last 3 months)', entity: 'Port City Coffee', entityIcon: '🏢', context: 'Relationship', contextDetail: 'Business Entity', required: true },
    // Personal docs (Lilliana)
    { id: 'drivers-license', name: 'Government-Issued Photo ID', description: 'Valid, non-expired', entity: 'Lilliana Jacobs', entityIcon: '👤', context: 'Relationship', contextDetail: 'Beneficial Owner', required: true },
    { id: 'personal-tax-2024', name: 'Personal Tax Return', description: '2024 (or extension if filed)', entity: 'Lilliana Jacobs', entityIcon: '👤', context: 'Relationship', contextDetail: 'Beneficial Owner', required: true },
    { id: 'personal-tax-2023', name: 'Personal Tax Return', description: '2023', entity: 'Lilliana Jacobs', entityIcon: '👤', context: 'Relationship', contextDetail: 'Beneficial Owner', required: true },
    // Loan docs (CRE Loan)
    { id: 'purchase-agreement', name: 'Purchase & Sale Agreement', description: 'Fully executed copy', entity: 'CRE Loan — Port City Coffee', entityIcon: '📋', context: 'Loan', contextDetail: 'CRE Loan #2026-0134', required: true },
    { id: 'rent-roll', name: 'Rent Roll', description: 'Current as of Jan 2026', entity: 'CRE Loan — Port City Coffee', entityIcon: '📋', context: 'Loan', contextDetail: 'CRE Loan #2026-0134', required: true },
    { id: 'env-report', name: 'Phase I Environmental Report', description: 'Within last 12 months', entity: 'CRE Loan — Port City Coffee', entityIcon: '📋', context: 'Loan', contextDetail: 'CRE Loan #2026-0134', required: true },
    // Collateral docs
    { id: 'appraisal', name: 'Commercial Real Estate Appraisal', description: 'Within last 12 months', entity: '123 Main St, Wilmington NC', entityIcon: '🏗️', context: 'Collateral', contextDetail: 'Property — 123 Main St', required: true },
    { id: 'title-report', name: 'Title Report', description: 'Current commitment', entity: '123 Main St, Wilmington NC', entityIcon: '🏗️', context: 'Collateral', contextDetail: 'Property — 123 Main St', required: true },
    { id: 'insurance-cert', name: 'Property Insurance Certificate', description: 'Coverage through 2026', entity: '123 Main St, Wilmington NC', entityIcon: '🏗️', context: 'Collateral', contextDetail: 'Property — 123 Main St', required: true },
  ];

  const simulatedFiles = [
    { name: 'AO_PortCity.pdf', size: '1.2 MB' },
    { name: 'PCC_Financials_2024.pdf', size: '3.4 MB' },
    { name: 'BusinessTaxReturn2024.pdf', size: '2.1 MB' },
    { name: 'BusinessTaxReturn2023.pdf', size: '1.9 MB' },
    { name: 'BusinessTaxReturn2022.pdf', size: '1.7 MB' },
    { name: 'Chase_Statements_Q4.pdf', size: '890 KB' },
    { name: 'Lilliana_DL.jpg', size: '842 KB' },
    { name: '1040_Jacobs_2024.pdf', size: '1.8 MB' },
    { name: '1040_Jacobs_2023.pdf', size: '1.6 MB' },
    { name: 'PSA_123Main.pdf', size: '4.2 MB' },
    { name: 'RentRoll_123Main.xlsx', size: '340 KB' },
    { name: 'PhaseI_Environmental.pdf', size: '8.1 MB' },
    { name: 'Appraisal_123Main.pdf', size: '6.7 MB' },
    { name: 'TitleReport_WilmNC.pdf', size: '2.3 MB' },
    { name: 'InsuranceCert_Property.pdf', size: '450 KB' },
    { name: 'UtilityBill_PCC.pdf', size: '180 KB' },
  ];

  const aiMatches = [
    { fileIdx: 0, docId: 'articles', confidence: 97, reasoning: 'Incorporation filing language detected. State of NC registration. Entity name "Port City Coffee LLC" identified.' },
    { fileIdx: 1, docId: 'financial-stmt', confidence: 94, reasoning: 'Balance sheet and income statement detected. Entity "Port City Coffee" on header. Period ending December 2024 — matches requested year.' },
    { fileIdx: 2, docId: 'tax-return-biz-2024', confidence: 96, reasoning: 'IRS Form 1120S detected. EIN matches Port City Coffee. Tax year 2024 extracted — matches requested year 2024.' },
    { fileIdx: 3, docId: 'tax-return-biz-2023', confidence: 95, reasoning: 'IRS Form 1120S detected. EIN matches Port City Coffee. Tax year 2023 extracted — matches requested year 2023.' },
    { fileIdx: 4, docId: 'tax-return-biz-2022', confidence: 94, reasoning: 'IRS Form 1120S detected. EIN matches Port City Coffee. Tax year 2022 extracted — matches requested year 2022.' },
    { fileIdx: 5, docId: 'bank-stmts', confidence: 88, reasoning: 'Chase Bank statements. Account holder "Port City Coffee LLC". Statements for Oct, Nov, Dec 2024 — matches requested period.' },
    { fileIdx: 6, docId: 'drivers-license', confidence: 96, reasoning: 'NC driver\'s license. Name "Lilliana M. Jacobs" matches beneficial owner. Expiration 2028 — valid, non-expired.' },
    { fileIdx: 7, docId: 'personal-tax-2024', confidence: 93, reasoning: 'IRS Form 1040 detected. Taxpayer "Lilliana Jacobs". Tax year 2024 extracted — matches requested year 2024.' },
    { fileIdx: 8, docId: 'personal-tax-2023', confidence: 92, reasoning: 'IRS Form 1040 detected. Taxpayer "Lilliana Jacobs". Tax year 2023 extracted — matches requested year 2023.' },
    { fileIdx: 9, docId: 'purchase-agreement', confidence: 95, reasoning: 'Purchase and sale agreement for property at 123 Main St, Wilmington NC. Buyer: Port City Coffee LLC. Fully executed with signatures.' },
    { fileIdx: 10, docId: 'rent-roll', confidence: 89, reasoning: 'Rent roll spreadsheet. Property address 123 Main St. Lists 4 commercial tenants. Dated January 2026 — current.' },
    { fileIdx: 11, docId: 'env-report', confidence: 92, reasoning: 'Phase I Environmental Site Assessment. Property: 123 Main St, Wilmington NC. Report dated March 2025 — within 12 months.' },
    { fileIdx: 12, docId: 'appraisal', confidence: 96, reasoning: 'Commercial real estate appraisal report. Subject property: 123 Main St. Effective date September 2025 — within 12 months.' },
    { fileIdx: 13, docId: 'title-report', confidence: 90, reasoning: 'Title commitment from First American Title. Property: 123 Main St, Wilmington NC. Commitment date January 2026 — current.' },
    { fileIdx: 14, docId: 'insurance-cert', confidence: 87, reasoning: 'ACORD certificate of insurance. Property location matches 123 Main St. Coverage period through December 2026.' },
    { fileIdx: 15, docId: null, confidence: 0, reasoning: 'Utility bill for Port City Coffee — not matched to any requested document. Sent to banker for review.' },
  ];

  const colors = {
    primary: '#0B2545', primaryLight: '#134074',
    accent: '#13A89E', accentLight: '#E8F8F7',
    surface: '#FAFBFC', white: '#FFFFFF',
    text: '#1B2A4A', textSecondary: '#5A6B8A', textMuted: '#8E99AE',
    border: '#E2E8F0', borderLight: '#F0F3F7',
    success: '#10B981', successBg: '#ECFDF5', successBorder: '#A7F3D0',
    warning: '#F59E0B', warningBg: '#FFFBEB', warningBorder: '#FDE68A',
    error: '#EF4444', errorBg: '#FEF2F2',
    pending: '#6366F1', pendingBg: '#EEF2FF',
    aiBg: '#F5F3FF', aiBorder: '#C4B5FD', aiAccent: '#7C3AED',
    loanBg: '#EFF6FF', loanBorder: '#93C5FD', loanAccent: '#2563EB',
    collateralBg: '#FFF7ED', collateralBorder: '#FDBA74', collateralAccent: '#C2410C',
  };

  useEffect(() => {
    if (demoState === 'home') {
      setCurrentView('home'); setUploadedFiles([]); setMatchedDocs([]); setCurrentStep('upload'); setRejections({});
    } else if (demoState === 'docs-upload') {
      setCurrentView('docs'); setCurrentStep('upload'); setUploadedFiles([]); setMatchedDocs([]); setRejections({});
    } else if (demoState === 'docs-reconcile') {
      setCurrentView('docs'); setCurrentStep('reconcile');
      setUploadedFiles(simulatedFiles); setMatchedDocs(aiMatches); setRejections({});
    } else if (demoState === 'docs-partial') {
      setCurrentView('docs'); setCurrentStep('reconcile');
      setUploadedFiles(simulatedFiles.slice(0, 9));
      setMatchedDocs(aiMatches.slice(0, 9));
      setRejections({});
    } else if (demoState === 'docs-complete') {
      setCurrentView('docs'); setCurrentStep('complete');
      setUploadedFiles(simulatedFiles);
      setMatchedDocs(aiMatches.filter(m => m.docId !== null));
      setRejections({});
    } else if (demoState === 'docs-rejected') {
      setCurrentView('docs'); setCurrentStep('rejected');
      setUploadedFiles(simulatedFiles);
      setMatchedDocs(aiMatches.filter(m => m.docId !== null));
      setRejections({
        'financial-stmt': {
          reason: 'The uploaded document is from 2022. Please provide financial statements for the year ending 2024.',
          rejectedFile: 'PCC_Financials_2024.pdf',
          rejectedBy: 'Krista Shelton',
          rejectedDate: 'Feb 12, 2026',
        },
        'env-report': {
          reason: 'This appears to be a Phase II report, not Phase I. Please upload the Phase I Environmental Site Assessment.',
          rejectedFile: 'PhaseI_Environmental.pdf',
          rejectedBy: 'Krista Shelton',
          rejectedDate: 'Feb 12, 2026',
        },
      });
    }
    setExpandedDoc(null);
  }, [demoState]);

  const simulateUploadAndProcess = () => {
    setUploadedFiles(simulatedFiles);
    setCurrentStep('processing');
    setProcessingIndex(0);
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx >= simulatedFiles.length) {
        clearInterval(interval);
        setTimeout(() => {
          setMatchedDocs(aiMatches);
          setCurrentStep('reconcile');
          setProcessingIndex(-1);
        }, 500);
      } else { setProcessingIndex(idx); }
    }, 450);
  };

  const removeMatch = (fileIdx) => {
    setMatchedDocs(prev => prev.filter(m => m.fileIdx !== fileIdx));
  };

  const getMatchForDoc = (docId) => matchedDocs.find(m => m.docId === docId);
  const getUnmatchedFiles = () => matchedDocs.filter(m => m.docId === null);
  const getMatchedCount = () => matchedDocs.filter(m => m.docId !== null).length;
  const getMissingDocs = () => requestedDocs.filter(d => !matchedDocs.find(m => m.docId === d.id));
  const getRejectedCount = () => Object.keys(rejections).length;
  const isRejected = (docId) => !!rejections[docId];

  const contextColors = (ctx) => {
    if (ctx === 'Loan') return { bg: colors.loanBg, border: colors.loanBorder, accent: colors.loanAccent, icon: '📋' };
    if (ctx === 'Collateral') return { bg: colors.collateralBg, border: colors.collateralBorder, accent: colors.collateralAccent, icon: '🏗️' };
    return { bg: '#F0FDF4', border: colors.successBorder, accent: colors.success, icon: '🏢' };
  };

  const totalDocsNeeded = requestedDocs.length;

  // ==================== HEADER ====================
  const Header = () => (
    <header style={{
      backgroundColor: colors.primary,
      padding: '0 24px', height: '56px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '6px',
          background: `linear-gradient(135deg, ${colors.accent}, #0EA5E9)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: '800', color: 'white',
        }}>n</div>
        <span style={{ color: 'white', fontSize: '15px', fontWeight: '600' }}>
          First National Bank
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Lilliana Jacobs</span>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          backgroundColor: colors.accent, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '13px', fontWeight: '700',
        }}>LJ</div>
      </div>
    </header>
  );

  // Document-to-application mapping
  const appDocs = {
    'onboarding': requestedDocs.filter(d => d.context === 'Relationship'),
    'cre-loan': requestedDocs.filter(d => d.context === 'Loan' || d.context === 'Collateral'),
    'loc': [],
  };

  // ==================== HOME DASHBOARD ====================
  const HomeView = () => {
    const [expandedApp, setExpandedApp] = useState(null);

    return (
      <div style={{ minHeight: 'calc(100vh - 56px)' }}>
        {/* Hero */}
        <div style={{
          backgroundColor: colors.primary,
          padding: '40px 24px 48px 24px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '6px',
              background: `linear-gradient(135deg, ${colors.accent}, #0EA5E9)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: '800', color: 'white',
            }}>n</div>
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: '0 0 4px 0' }}>
            Good morning, Lilliana 👋
          </p>
          <h1 style={{
            fontSize: '26px', fontWeight: '700', color: 'white',
            margin: 0, fontFamily: "'Instrument Serif', Georgia, serif",
          }}>
            Where would you like to continue?
          </h1>
        </div>

        <div style={{ maxWidth: '520px', margin: '-24px auto 0 auto', padding: '0 20px 40px 20px' }}>

          {/* Applications with documents underneath */}
          {applications.map((app) => {
            const docs = appDocs[app.id] || [];
            const docCount = docs.length;
            const isExpanded = expandedApp === app.id;
            const hasDocuments = docCount > 0;

            return (
              <div key={app.id} style={{
                borderRadius: '12px', overflow: 'hidden',
                backgroundColor: colors.white,
                border: `1px solid ${colors.border}`,
                marginBottom: '10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                {/* Application header */}
                <div
                  onClick={() => hasDocuments && setExpandedApp(isExpanded ? null : app.id)}
                  style={{
                    padding: '16px 18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: hasDocuments ? 'pointer' : 'default',
                    borderBottom: isExpanded ? `1px solid ${colors.borderLight}` : 'none',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <p style={{ fontSize: '15px', fontWeight: '600', color: colors.text, margin: 0 }}>
                        {app.name}
                      </p>
                      {docCount > 0 && (
                        <span style={{
                          backgroundColor: colors.error, color: 'white',
                          fontSize: '10px', fontWeight: '700',
                          padding: '2px 7px', borderRadius: '8px',
                        }}>
                          {docCount} Doc{docCount > 1 ? 's' : ''}
                        </span>
                      )}
                      {app.taskCount > 0 && (
                        <span style={{
                          backgroundColor: colors.pending, color: 'white',
                          fontSize: '10px', fontWeight: '700',
                          padding: '2px 7px', borderRadius: '8px',
                        }}>
                          {app.taskCount} Task{app.taskCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>
                      {app.date}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {hasDocuments && (
                      <span style={{
                        color: colors.textMuted, fontSize: '16px',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        display: 'inline-block',
                      }}>›</span>
                    )}
                    {!hasDocuments && (
                      <span style={{ color: colors.textMuted, fontSize: '16px' }}>›</span>
                    )}
                  </div>
                </div>

                {/* Expanded document list */}
                {isExpanded && hasDocuments && (
                  <div style={{ padding: '4px 0' }}>
                    {/* Group docs by context within this application */}
                    {['Relationship', 'Loan', 'Collateral'].map(context => {
                      const contextDocs = docs.filter(d => d.context === context);
                      if (contextDocs.length === 0) return null;
                      const cc = contextColors(context);

                      return (
                        <div key={context}>
                          <div style={{
                            padding: '6px 18px',
                            backgroundColor: cc.bg,
                            display: 'flex', alignItems: 'center', gap: '6px',
                          }}>
                            <span style={{
                              fontSize: '10px', fontWeight: '700', color: cc.accent,
                              textTransform: 'uppercase', letterSpacing: '0.05em',
                            }}>{context}</span>
                            <span style={{ fontSize: '10px', color: colors.textMuted }}>· {contextDocs.length} docs</span>
                          </div>

                          {/* Group by entity within context */}
                          {Object.entries(contextDocs.reduce((g, d) => {
                            if (!g[d.entity]) g[d.entity] = { icon: d.entityIcon, detail: d.contextDetail, docs: [] };
                            g[d.entity].docs.push(d);
                            return g;
                          }, {})).map(([entity, group]) => (
                            <div key={entity} style={{ padding: '6px 18px 4px 18px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                <span style={{ fontSize: '13px' }}>{group.icon}</span>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: colors.text }}>{entity}</span>
                              </div>
                              {group.docs.map(doc => (
                                <div key={doc.id} style={{
                                  display: 'flex', alignItems: 'center', gap: '6px',
                                  padding: '3px 0 3px 20px',
                                }}>
                                  <span style={{
                                    width: '5px', height: '5px', borderRadius: '50%',
                                    backgroundColor: colors.error, flexShrink: 0,
                                  }} />
                                  <span style={{ fontSize: '12px', color: colors.textSecondary }}>{doc.name}</span>
                                  {doc.description && <span style={{ fontSize: '11px', color: colors.textMuted }}>— {doc.description}</span>}
                                  <span style={{
                                    fontSize: '10px', color: colors.error, fontWeight: '500',
                                    marginLeft: 'auto',
                                  }}>To Do</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      );
                    })}

                    {/* Upload for this application */}
                    <div style={{
                      padding: '10px 18px',
                      borderTop: `1px solid ${colors.borderLight}`,
                    }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setCurrentView('docs'); setCurrentStep('upload'); }}
                        style={{
                          width: '100%', padding: '8px',
                          borderRadius: '8px', border: `1px dashed ${colors.accent}`,
                          backgroundColor: colors.accentLight,
                          color: colors.accent, fontSize: '12px', fontWeight: '600',
                          cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}
                      >
                        <span>↑</span> Upload documents for {app.name}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Documents — bulk AI upload */}
          <div
            onClick={() => { setCurrentView('docs'); setCurrentStep('upload'); }}
            style={{
              borderRadius: '12px', padding: '16px 18px',
              backgroundColor: colors.white,
              border: `1px solid ${colors.border}`,
              cursor: 'pointer', marginBottom: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <p style={{ fontSize: '15px', fontWeight: '600', color: colors.text, margin: 0 }}>
                  Documents
                </p>
                <span style={{
                  backgroundColor: colors.error, color: 'white',
                  fontSize: '10px', fontWeight: '700',
                  padding: '2px 7px', borderRadius: '8px',
                }}>
                  {totalDocsNeeded} To Do
                </span>
              </div>
              <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>
                Across all applications
              </p>
            </div>
            <span style={{ color: colors.textMuted, fontSize: '20px' }}>›</span>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: colors.textMuted }}>🔒</span>
              <span style={{ fontSize: '11px', color: colors.textMuted }}>FDIC</span>
            </div>
            <p style={{ fontSize: '11px', color: colors.textMuted, margin: '0 0 2px 0' }}>
              Privacy Policy | Terms & Conditions
            </p>
            <p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>
              Powered by <strong>nCino</strong>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ==================== UPLOAD VIEW (FILE STAGING) ====================
  const UploadView = () => {
    const [stagedFiles, setStagedFiles] = useState([]);

    const addFiles = () => {
      const remaining = simulatedFiles.filter(f => !stagedFiles.find(s => s.name === f.name));
      if (stagedFiles.length === 0) {
        setStagedFiles(simulatedFiles.slice(0, 7));
      } else {
        setStagedFiles(prev => [...prev, ...remaining.slice(0, 6)]);
      }
    };

    const removeFile = (idx) => {
      setStagedFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const submitForProcessing = () => {
      setUploadedFiles(simulatedFiles);
      setCurrentStep('processing');
      setProcessingIndex(0);
      let idx = 0;
      const interval = setInterval(() => {
        idx++;
        if (idx >= simulatedFiles.length) {
          clearInterval(interval);
          setTimeout(() => {
            setMatchedDocs(aiMatches);
            setCurrentStep('reconcile');
            setProcessingIndex(-1);
          }, 500);
        } else { setProcessingIndex(idx); }
      }, 450);
    };

    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '28px 20px' }}>
        <button onClick={() => { setCurrentView('home'); setDemoState('home'); }} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', padding: '4px 0',
          fontSize: '13px', color: colors.textSecondary, cursor: 'pointer', marginBottom: '16px',
        }}>← Back to home</button>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '24px', fontWeight: '700', color: colors.text,
            margin: '0 0 6px 0', fontFamily: "'Instrument Serif', Georgia, serif",
          }}>Upload your documents</h1>
          <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0, lineHeight: '1.5' }}>
            Your banker has requested {requestedDocs.length} documents. Add your files below, review
            what you've staged, then submit — Banking Advisor will match them automatically.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(); }}
          onClick={() => addFiles()}
          style={{
            padding: stagedFiles.length > 0 ? '20px 40px' : '50px 40px',
            borderRadius: '16px',
            border: `2px dashed ${dragOver ? colors.accent : colors.border}`,
            backgroundColor: dragOver ? colors.accentLight : colors.white,
            textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease',
            marginBottom: '16px',
          }}
        >
          <div style={{
            width: stagedFiles.length > 0 ? '36px' : '56px',
            height: stagedFiles.length > 0 ? '36px' : '56px',
            borderRadius: '50%',
            backgroundColor: dragOver ? colors.accentLight : colors.pendingBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px auto',
            fontSize: stagedFiles.length > 0 ? '16px' : '24px',
          }}>↑</div>
          <p style={{ fontSize: stagedFiles.length > 0 ? '14px' : '16px', fontWeight: '600', color: colors.text, margin: '0 0 4px 0' }}>
            {stagedFiles.length > 0 ? 'Drop more files or click to browse' : 'Drag & drop your documents here'}
          </p>
          {stagedFiles.length === 0 && (
            <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '0 0 2px 0' }}>or click to browse</p>
          )}
          <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>PDF, JPG, PNG, XLSX · Up to 10 MB each · Up to 15 files</p>
        </div>

        {/* Staged files list */}
        {stagedFiles.length > 0 && (
          <div style={{
            borderRadius: '12px', border: `1px solid ${colors.border}`,
            backgroundColor: colors.white, overflow: 'hidden', marginBottom: '16px',
          }}>
            <div style={{
              padding: '12px 18px', borderBottom: `1px solid ${colors.borderLight}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: '#F8FAFC',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: colors.text, margin: 0 }}>
                  Staged files
                </p>
                <span style={{
                  fontSize: '11px', fontWeight: '600', color: colors.accent,
                  backgroundColor: colors.accentLight, padding: '2px 8px', borderRadius: '10px',
                }}>{stagedFiles.length}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setStagedFiles([]); }}
                style={{
                  background: 'none', border: 'none', padding: '2px 0',
                  fontSize: '12px', color: colors.error, cursor: 'pointer',
                }}
              >
                Clear all
              </button>
            </div>
            {stagedFiles.map((file, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 18px',
                borderBottom: idx < stagedFiles.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  backgroundColor: colors.pendingBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', flexShrink: 0,
                }}>
                  {file.name.endsWith('.pdf') ? '📄' : file.name.endsWith('.xlsx') ? '📊' : '🖼️'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: colors.text, margin: 0 }}>{file.name}</p>
                  <p style={{ fontSize: '11px', color: colors.textMuted, margin: '1px 0 0 0' }}>{file.size}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  style={{
                    background: 'none', border: 'none', padding: '4px 8px',
                    fontSize: '18px', color: colors.textMuted, cursor: 'pointer',
                    lineHeight: 1, borderRadius: '4px',
                  }}
                  title="Remove file"
                >×</button>
              </div>
            ))}
          </div>
        )}

        {/* Submit button */}
        {stagedFiles.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 0', borderTop: `1px solid ${colors.borderLight}`,
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: colors.aiAccent }}>✦</span>
              <span style={{ fontSize: '13px', color: colors.textSecondary }}>
                Banking Advisor will match to your {requestedDocs.length} requested documents
              </span>
            </div>
            <button
              onClick={submitForProcessing}
              style={{
                backgroundColor: colors.accent, color: 'white',
                border: 'none', borderRadius: '8px', padding: '11px 22px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Submit {stagedFiles.length} file{stagedFiles.length > 1 ? 's' : ''} →
            </button>
          </div>
        )}

        {/* What's been requested */}
        <div style={{ borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: colors.white, overflow: 'hidden' }}>
          <div style={{
            padding: '13px 18px', borderBottom: `1px solid ${colors.borderLight}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: colors.text, margin: 0 }}>What your banker requested</p>
            <span style={{ fontSize: '12px', color: colors.textMuted }}>{requestedDocs.length} documents</span>
          </div>

          {['Relationship', 'Loan', 'Collateral'].map(context => {
            const docs = requestedDocs.filter(d => d.context === context);
            if (docs.length === 0) return null;
            const cc = contextColors(context);
            return (
              <div key={context}>
                <div style={{
                  padding: '8px 18px', backgroundColor: cc.bg,
                  borderBottom: `1px solid ${colors.borderLight}`,
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span style={{
                    fontSize: '11px', fontWeight: '700', color: cc.accent,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{context} Documents</span>
                  <span style={{ fontSize: '11px', color: colors.textMuted }}>· {docs.length}</span>
                </div>
                {Object.entries(docs.reduce((g, d) => {
                  if (!g[d.entity]) g[d.entity] = { icon: d.entityIcon, detail: d.contextDetail, docs: [] };
                  g[d.entity].docs.push(d);
                  return g;
                }, {})).map(([entity, group]) => (
                  <div key={entity} style={{ padding: '8px 18px 6px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px' }}>{group.icon}</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{entity}</span>
                      <span style={{ fontSize: '11px', color: colors.textMuted }}>· {group.detail}</span>
                    </div>
                    {group.docs.map(doc => (
                      <div key={doc.id} style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0 4px 20px',
                      }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: colors.border, flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: colors.textSecondary }}>{doc.name}</span>
                        {doc.description && <span style={{ fontSize: '11px', color: colors.textMuted }}>— {doc.description}</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ==================== PROCESSING VIEW ====================
  const ProcessingView = () => (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.aiAccent}, ${colors.accent})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px auto', fontSize: '24px', color: 'white',
          animation: 'pulse 1.5s ease infinite',
        }}>✦</div>
        <h2 style={{
          fontSize: '20px', fontWeight: '700', color: colors.text,
          margin: '0 0 4px 0', fontFamily: "'Instrument Serif', Georgia, serif",
        }}>Analyzing your documents...</h2>
        <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
          Banking Advisor is identifying and matching each document
        </p>
      </div>
      <div style={{ borderRadius: '12px', border: `1px solid ${colors.aiBorder}`, backgroundColor: colors.white, overflow: 'hidden' }}>
        {simulatedFiles.map((file, idx) => {
          const isProcessed = idx < processingIndex;
          const isProcessing = idx === processingIndex;
          const match = isProcessed ? aiMatches[idx] : null;
          return (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 18px',
              borderBottom: idx < simulatedFiles.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
              backgroundColor: isProcessing ? colors.aiBg : 'transparent',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', flexShrink: 0,
                backgroundColor: isProcessed ? colors.successBg : isProcessing ? colors.aiBg : colors.borderLight,
                color: isProcessed ? colors.success : isProcessing ? colors.aiAccent : colors.textMuted,
                border: isProcessing ? `2px solid ${colors.aiAccent}` : 'none',
              }}>{isProcessed ? '✓' : isProcessing ? '✦' : '○'}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '500', color: colors.text, margin: 0 }}>{file.name}</p>
                <p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>{file.size}</p>
              </div>
              {isProcessed && match && (
                <span style={{ fontSize: '11px', fontWeight: '500', color: match.docId ? colors.success : colors.warning }}>
                  {match.docId ? `Matched · ${match.confidence}%` : 'No match'}
                </span>
              )}
              {isProcessing && (
                <span style={{ fontSize: '11px', fontWeight: '500', color: colors.aiAccent, animation: 'fadeInOut 1s ease infinite' }}>
                  Analyzing...
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: '14px' }}>
        <div style={{ height: '4px', borderRadius: '2px', backgroundColor: colors.borderLight, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '2px',
            background: `linear-gradient(90deg, ${colors.aiAccent}, ${colors.accent})`,
            width: `${((processingIndex + 1) / simulatedFiles.length) * 100}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
        <p style={{ fontSize: '11px', color: colors.textMuted, margin: '6px 0 0 0', textAlign: 'center' }}>
          {Math.min(processingIndex + 1, simulatedFiles.length)} of {simulatedFiles.length} processed
        </p>
      </div>
    </div>
  );

  // ==================== RECONCILIATION VIEW ====================
  const ReconcileView = () => {
    const matched = getMatchedCount();
    const missing = getMissingDocs();
    const unmatched = getUnmatchedFiles();

    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '28px 20px' }}>
        <button onClick={() => { setCurrentView('home'); setDemoState('home'); }} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', padding: '4px 0',
          fontSize: '13px', color: colors.textSecondary, cursor: 'pointer', marginBottom: '16px',
        }}>← Back to home</button>

        <h1 style={{
          fontSize: '24px', fontWeight: '700', color: colors.text,
          margin: '0 0 6px 0', fontFamily: "'Instrument Serif', Georgia, serif",
        }}>Review your documents</h1>
        <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '0 0 20px 0' }}>
          Banking Advisor matched your uploads to the requested documents. Review the results and confirm.
        </p>

        {/* Summary */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', backgroundColor: colors.successBg, border: `1px solid ${colors.successBorder}` }}>
            <p style={{ fontSize: '22px', fontWeight: '700', color: colors.success, margin: 0 }}>{matched}</p>
            <p style={{ fontSize: '11px', color: colors.success, margin: '2px 0 0 0' }}>Matched</p>
          </div>
          {missing.length > 0 && (
            <div style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', backgroundColor: colors.warningBg, border: `1px solid ${colors.warningBorder}` }}>
              <p style={{ fontSize: '22px', fontWeight: '700', color: colors.warning, margin: 0 }}>{missing.length}</p>
              <p style={{ fontSize: '11px', color: colors.warning, margin: '2px 0 0 0' }}>Still needed</p>
            </div>
          )}
          {unmatched.length > 0 && (
            <div style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', backgroundColor: colors.aiBg, border: `1px solid ${colors.aiBorder}` }}>
              <p style={{ fontSize: '22px', fontWeight: '700', color: colors.aiAccent, margin: 0 }}>{unmatched.length}</p>
              <p style={{ fontSize: '11px', color: colors.aiAccent, margin: '2px 0 0 0' }}>Unmatched</p>
            </div>
          )}
        </div>

        {/* Documents by context */}
        {['Relationship', 'Loan', 'Collateral'].map(context => {
          const docs = requestedDocs.filter(d => d.context === context);
          if (docs.length === 0) return null;
          const cc = contextColors(context);

          return (
            <div key={context} style={{
              marginBottom: '14px', borderRadius: '12px',
              border: `1px solid ${colors.border}`, backgroundColor: colors.white, overflow: 'hidden',
            }}>
              {/* Context header */}
              <div style={{
                padding: '10px 18px', backgroundColor: cc.bg,
                borderBottom: `1px solid ${colors.borderLight}`,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{
                  fontSize: '11px', fontWeight: '700', color: cc.accent,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{context} Documents</span>
                <span style={{ fontSize: '11px', color: colors.textMuted }}>
                  · {docs.filter(d => getMatchForDoc(d.id)).length}/{docs.length} matched
                </span>
              </div>

              {/* Group by entity */}
              {Object.entries(docs.reduce((g, d) => {
                if (!g[d.entity]) g[d.entity] = { icon: d.entityIcon, detail: d.contextDetail, docs: [] };
                g[d.entity].docs.push(d);
                return g;
              }, {})).map(([entity, group]) => (
                <div key={entity}>
                  <div style={{
                    padding: '8px 18px', backgroundColor: '#FAFBFC',
                    borderBottom: `1px solid ${colors.borderLight}`,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <span style={{ fontSize: '14px' }}>{group.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{entity}</span>
                    <span style={{ fontSize: '11px', color: colors.textMuted }}>· {group.detail}</span>
                  </div>
                  {group.docs.map((doc, idx) => {
                    const match = getMatchForDoc(doc.id);
                    const file = match ? uploadedFiles[match.fileIdx] : null;
                    const isExpanded = expandedDoc === doc.id;
                    return (
                      <div key={doc.id} style={{
                        borderBottom: idx < group.docs.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                      }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px',
                        }}>
                          <div style={{
                            width: '26px', height: '26px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, fontSize: '12px', fontWeight: '700',
                            backgroundColor: match ? colors.successBg : colors.warningBg,
                            color: match ? colors.success : colors.warning,
                          }}>{match ? '✓' : '?'}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                              <p style={{ fontSize: '14px', fontWeight: '500', color: colors.text, margin: 0 }}>{doc.name}</p>
                              {doc.description && <span style={{ fontSize: '11px', color: colors.textMuted }}>— {doc.description}</span>}
                            </div>
                            {match && file ? (
                              <p style={{ fontSize: '12px', color: colors.success, margin: '1px 0 0 0' }}>
                                {file.name} · {file.size} · {match.confidence}% match
                              </p>
                            ) : (
                              <p style={{ fontSize: '12px', color: colors.warning, margin: '1px 0 0 0' }}>No matching file uploaded</p>
                            )}
                          </div>
                          {match ? (
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button onClick={() => setExpandedDoc(isExpanded ? null : doc.id)} style={{
                                background: 'none', border: `1px solid ${colors.border}`, borderRadius: '6px',
                                padding: '4px 9px', fontSize: '11px', color: colors.textSecondary, cursor: 'pointer',
                              }}>{isExpanded ? 'Hide' : 'Details'}</button>
                              <button onClick={() => removeMatch(match.fileIdx)} style={{
                                background: 'none', border: `1px solid ${colors.border}`, borderRadius: '6px',
                                padding: '4px 9px', fontSize: '11px', color: colors.error, cursor: 'pointer',
                              }}>Remove</button>
                            </div>
                          ) : (
                            <button style={{
                              background: 'none', border: `1px solid ${colors.accent}`, borderRadius: '6px',
                              padding: '4px 10px', fontSize: '11px', color: colors.accent, fontWeight: '500', cursor: 'pointer',
                            }}>Upload</button>
                          )}
                        </div>
                        {isExpanded && match && (
                          <div style={{
                            margin: '0 18px 12px 18px', padding: '10px 14px', borderRadius: '8px',
                            backgroundColor: colors.aiBg, border: `1px solid ${colors.aiBorder}`,
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '11px', color: colors.aiAccent }}>✦</span>
                              <span style={{ fontSize: '11px', fontWeight: '600', color: colors.aiAccent }}>
                                Banking Advisor · {match.confidence}% confidence
                              </span>
                            </div>
                            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, lineHeight: '1.5' }}>
                              {match.reasoning}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}

        {/* Unmatched */}
        {unmatched.length > 0 && (
          <div style={{
            marginBottom: '14px', borderRadius: '12px',
            border: `1px solid ${colors.aiBorder}`, backgroundColor: colors.white, overflow: 'hidden',
          }}>
            <div style={{
              padding: '10px 18px', backgroundColor: colors.aiBg,
              borderBottom: `1px solid ${colors.aiBorder}`,
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: colors.aiAccent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Additional Files (Unmatched)
              </span>
            </div>
            {unmatched.map(match => {
              const file = uploadedFiles[match.fileIdx];
              if (!file) return null;
              return (
                <div key={match.fileIdx} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px',
                }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    backgroundColor: colors.aiBg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', color: colors.aiAccent,
                  }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: colors.text, margin: 0 }}>{file.name}</p>
                    <p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>Sent to banker for review</p>
                  </div>
                  <button onClick={() => removeMatch(match.fileIdx)} style={{
                    background: 'none', border: `1px solid ${colors.border}`, borderRadius: '6px',
                    padding: '4px 9px', fontSize: '11px', color: colors.error, cursor: 'pointer',
                  }}>Remove</button>
                </div>
              );
            })}
          </div>
        )}

        {/* Missing alert */}
        {missing.length > 0 && (
          <div style={{
            padding: '14px 18px', borderRadius: '10px',
            backgroundColor: colors.warningBg, border: `1px solid ${colors.warningBorder}`, marginBottom: '14px',
          }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#92400E', margin: '0 0 6px 0' }}>
              {missing.length} document{missing.length > 1 ? 's' : ''} still needed
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {missing.map(doc => (
                <span key={doc.id} style={{
                  padding: '3px 9px', borderRadius: '14px',
                  backgroundColor: 'white', border: `1px solid ${colors.warningBorder}`,
                  fontSize: '11px', color: '#92400E',
                }}>{doc.name}{doc.description ? ` (${doc.description})` : ''}</span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: '20px', paddingTop: '18px', borderTop: `1px solid ${colors.borderLight}`,
        }}>
          <button onClick={() => { setCurrentStep('upload'); setUploadedFiles([]); setMatchedDocs([]); }} style={{
            background: 'none', border: `1px solid ${colors.border}`, borderRadius: '8px',
            padding: '10px 16px', fontSize: '13px', color: colors.textSecondary, cursor: 'pointer',
          }}>Upload more files</button>
          <button onClick={() => setCurrentStep('complete')} style={{
            backgroundColor: colors.accent, color: 'white', border: 'none', borderRadius: '8px',
            padding: '11px 22px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
          }}>Confirm & submit ({matched})</button>
        </div>
      </div>
    );
  };

  // ==================== COMPLETE VIEW ====================
  const CompleteView = () => (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%',
        backgroundColor: colors.successBg, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px auto', fontSize: '28px', color: colors.success,
      }}>✓</div>
      <h1 style={{
        fontSize: '24px', fontWeight: '700', color: colors.text,
        margin: '0 0 8px 0', fontFamily: "'Instrument Serif', Georgia, serif",
      }}>Documents submitted</h1>
      <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '0 0 28px 0', lineHeight: '1.6' }}>
        Submitted to Krista Shelton at First National Bank. You'll be notified if anything else is needed.
      </p>
      <div style={{
        borderRadius: '12px', border: `1px solid ${colors.border}`,
        backgroundColor: colors.white, padding: '16px', textAlign: 'left', marginBottom: '24px',
      }}>
        {['Relationship', 'Loan', 'Collateral'].map(context => {
          const contextMatches = matchedDocs.filter(m => {
            const doc = requestedDocs.find(d => d.id === m.docId);
            return doc && doc.context === context;
          });
          if (contextMatches.length === 0) return null;
          const cc = contextColors(context);
          return (
            <div key={context} style={{ marginBottom: '12px' }}>
              <p style={{
                fontSize: '11px', fontWeight: '700', color: cc.accent,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                margin: '0 0 6px 0',
              }}>{context}</p>
              {contextMatches.map(match => {
                const doc = requestedDocs.find(d => d.id === match.docId);
                const file = uploadedFiles[match.fileIdx];
                if (!doc || !file) return null;
                return (
                  <div key={match.fileIdx} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 0', borderBottom: `1px solid ${colors.borderLight}`,
                  }}>
                    <span style={{ fontSize: '13px', color: colors.success }}>✓</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: colors.text, margin: 0 }}>{doc.name}{doc.description ? ` — ${doc.description}` : ''}</p>
                      <p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>{file.name} · {doc.entity}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <button onClick={() => { setCurrentView('home'); setDemoState('home'); }} style={{
        background: 'none', border: `1px solid ${colors.border}`, borderRadius: '8px',
        padding: '10px 20px', fontSize: '13px', color: colors.textSecondary, cursor: 'pointer',
      }}>Return to portal</button>
    </div>
  );

  // ==================== REJECTED VIEW ====================
  const RejectedView = () => {
    const rejectedIds = Object.keys(rejections);
    const acceptedMatches = matchedDocs.filter(m => m.docId && !rejections[m.docId]);
    const rejectedMatches = matchedDocs.filter(m => m.docId && rejections[m.docId]);

    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '28px 20px' }}>
        <button onClick={() => { setCurrentView('home'); setDemoState('home'); }} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', padding: '4px 0',
          fontSize: '13px', color: colors.textSecondary, cursor: 'pointer', marginBottom: '16px',
        }}>← Back to home</button>

        <h1 style={{
          fontSize: '24px', fontWeight: '700', color: colors.text,
          margin: '0 0 6px 0', fontFamily: "'Instrument Serif', Georgia, serif",
        }}>Your documents</h1>
        <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '0 0 20px 0' }}>
          Your banker has reviewed your uploads. Most documents were accepted, but {rejectedIds.length} need{rejectedIds.length === 1 ? 's' : ''} to be re-uploaded.
        </p>

        {/* Alert banner */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '12px',
          padding: '14px 18px', borderRadius: '10px',
          backgroundColor: colors.errorBg, border: '1px solid #FECACA',
          marginBottom: '20px',
        }}>
          <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>⚠</span>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: colors.error, margin: '0 0 2px 0' }}>
              {rejectedIds.length} document{rejectedIds.length > 1 ? 's' : ''} rejected
            </p>
            <p style={{ fontSize: '13px', color: '#B91C1C', margin: 0 }}>
              Your banker has provided feedback below. Please upload corrected versions.
            </p>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', backgroundColor: colors.successBg, border: `1px solid ${colors.successBorder}` }}>
            <p style={{ fontSize: '22px', fontWeight: '700', color: colors.success, margin: 0 }}>{acceptedMatches.length}</p>
            <p style={{ fontSize: '11px', color: colors.success, margin: '2px 0 0 0' }}>Accepted</p>
          </div>
          <div style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', backgroundColor: colors.errorBg, border: '1px solid #FECACA' }}>
            <p style={{ fontSize: '22px', fontWeight: '700', color: colors.error, margin: 0 }}>{rejectedIds.length}</p>
            <p style={{ fontSize: '11px', color: colors.error, margin: '2px 0 0 0' }}>Needs re-upload</p>
          </div>
        </div>

        {/* Documents by context */}
        {['Relationship', 'Loan', 'Collateral'].map(context => {
          const docs = requestedDocs.filter(d => d.context === context);
          if (docs.length === 0) return null;
          const cc = contextColors(context);
          const hasRejectedInCtx = docs.some(d => rejections[d.id]);

          return (
            <div key={context} style={{
              marginBottom: '14px', borderRadius: '12px',
              border: `1px solid ${hasRejectedInCtx ? '#FECACA' : colors.border}`,
              backgroundColor: colors.white, overflow: 'hidden',
            }}>
              <div style={{
                padding: '10px 18px', backgroundColor: cc.bg,
                borderBottom: `1px solid ${colors.borderLight}`,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{
                  fontSize: '11px', fontWeight: '700', color: cc.accent,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{context} Documents</span>
                {hasRejectedInCtx && (
                  <span style={{
                    fontSize: '10px', fontWeight: '600', color: colors.error,
                    backgroundColor: colors.errorBg, padding: '2px 7px', borderRadius: '8px',
                  }}>Action needed</span>
                )}
              </div>

              {Object.entries(docs.reduce((g, d) => {
                if (!g[d.entity]) g[d.entity] = { icon: d.entityIcon, detail: d.contextDetail, docs: [] };
                g[d.entity].docs.push(d);
                return g;
              }, {})).map(([entity, group]) => (
                <div key={entity}>
                  <div style={{
                    padding: '8px 18px', backgroundColor: '#FAFBFC',
                    borderBottom: `1px solid ${colors.borderLight}`,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <span style={{ fontSize: '14px' }}>{group.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{entity}</span>
                    <span style={{ fontSize: '11px', color: colors.textMuted }}>· {group.detail}</span>
                  </div>
                  {group.docs.map((doc, idx) => {
                    const match = getMatchForDoc(doc.id);
                    const file = match ? uploadedFiles[match.fileIdx] : null;
                    const rej = rejections[doc.id];

                    return (
                      <div key={doc.id} style={{
                        borderBottom: idx < group.docs.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                      }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px',
                        }}>
                          {/* Status icon */}
                          <div style={{
                            width: '26px', height: '26px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, fontSize: '12px', fontWeight: '700',
                            backgroundColor: rej ? colors.errorBg : colors.successBg,
                            color: rej ? colors.error : colors.success,
                          }}>{rej ? '!' : '✓'}</div>

                          {/* Doc info */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                              <p style={{ fontSize: '14px', fontWeight: '500', color: colors.text, margin: 0 }}>
                                {doc.name}
                              </p>
                              {doc.description && <span style={{ fontSize: '11px', color: colors.textMuted }}>— {doc.description}</span>}
                            </div>
                            {rej ? (
                              <p style={{ fontSize: '12px', color: colors.error, margin: '1px 0 0 0' }}>
                                Rejected · {rej.rejectedFile}
                              </p>
                            ) : match && file ? (
                              <p style={{ fontSize: '12px', color: colors.success, margin: '1px 0 0 0' }}>
                                Accepted · {file.name}
                              </p>
                            ) : null}
                          </div>

                          {/* Status badge */}
                          <span style={{
                            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                            backgroundColor: rej ? colors.errorBg : colors.successBg,
                            color: rej ? colors.error : colors.success,
                          }}>
                            {rej ? 'Re-upload needed' : 'Accepted'}
                          </span>
                        </div>

                        {/* Rejection reason + re-upload zone */}
                        {rej && (
                          <div style={{ padding: '0 18px 14px 18px' }}>
                            {/* Rejection reason */}
                            <div style={{
                              padding: '10px 14px', borderRadius: '8px',
                              backgroundColor: colors.errorBg,
                              borderLeft: `3px solid ${colors.error}`,
                              marginBottom: '10px',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <p style={{ fontSize: '12px', fontWeight: '600', color: colors.error, margin: 0 }}>
                                  Reason from {rej.rejectedBy}
                                </p>
                                <span style={{ fontSize: '11px', color: '#B91C1C' }}>· {rej.rejectedDate}</span>
                              </div>
                              <p style={{ fontSize: '13px', color: '#991B1B', margin: 0, lineHeight: '1.5' }}>
                                {rej.reason}
                              </p>
                            </div>

                            {/* Previously uploaded file */}
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '8px 12px', borderRadius: '8px',
                              backgroundColor: '#FEF2F2', border: '1px dashed #FECACA',
                              marginBottom: '10px',
                            }}>
                              <span style={{ fontSize: '14px' }}>📄</span>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '12px', color: '#991B1B', margin: 0 }}>
                                  <span style={{ textDecoration: 'line-through' }}>{rej.rejectedFile}</span>
                                  <span style={{ fontStyle: 'italic', marginLeft: '6px' }}>— rejected</span>
                                </p>
                              </div>
                            </div>

                            {/* Re-upload drop zone */}
                            <div
                              style={{
                                padding: '20px',
                                borderRadius: '10px',
                                border: `2px dashed ${colors.border}`,
                                backgroundColor: '#FAFBFC',
                                textAlign: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                backgroundColor: colors.pendingBg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 8px', fontSize: '16px',
                              }}>↑</div>
                              <p style={{ fontSize: '13px', fontWeight: '500', color: colors.text, margin: '0 0 2px 0' }}>
                                Upload a corrected version
                              </p>
                              <p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>
                                Drag & drop or click to browse
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}

        {/* Contact */}
        <div style={{
          marginTop: '24px', padding: '14px 18px', borderRadius: '10px',
          backgroundColor: '#F8FAFC', border: `1px solid ${colors.borderLight}`,
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            backgroundColor: colors.primaryLight, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '12px', fontWeight: '700',
          }}>KS</div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: colors.text, margin: 0 }}>
              Questions about a rejection? Contact your banker
            </p>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>
              Krista Shelton · krista.shelton@firstnationalbank.com
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ==================== MAIN ====================
  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      backgroundColor: colors.surface, minHeight: '100vh',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      <Header />

      {/* Demo selector */}
      <div style={{
        backgroundColor: '#F0F3FF', padding: '8px 24px',
        display: 'flex', alignItems: 'center', gap: '10px',
        borderBottom: `1px solid ${colors.border}`, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '11px', fontWeight: '700', color: colors.primary, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Demo:
        </span>
        {[
          { key: 'home', label: 'Home Dashboard' },
          { key: 'docs-upload', label: 'Bulk Upload' },
          { key: 'docs-reconcile', label: 'AI Reconciliation (Full)' },
          { key: 'docs-partial', label: 'Partial Match' },
          { key: 'docs-complete', label: 'Submitted' },
          { key: 'docs-rejected', label: 'Banker Rejected' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setDemoState(key)} style={{
            padding: '5px 12px', borderRadius: '6px',
            border: demoState === key ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
            backgroundColor: demoState === key ? 'white' : '#F8FAFC',
            color: demoState === key ? colors.primary : colors.textSecondary,
            fontSize: '12px', fontWeight: demoState === key ? '600' : '400', cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

      {currentView === 'home' && <HomeView />}
      {currentView === 'docs' && currentStep === 'upload' && <UploadView />}
      {currentView === 'docs' && currentStep === 'processing' && <ProcessingView />}
      {currentView === 'docs' && currentStep === 'reconcile' && <ReconcileView />}
      {currentView === 'docs' && currentStep === 'complete' && <CompleteView />}
      {currentView === 'docs' && currentStep === 'rejected' && <RejectedView />}

      <style>{`
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
        @keyframes fadeInOut { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        button:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
};

export default DocXchangeFullPrototype;
