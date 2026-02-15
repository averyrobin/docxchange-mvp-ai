import { useState } from "react";

/* ── Tiny Icons ── */
const ChevronDown = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
);
const ChevronRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);
const UserIcon = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const BuildingIcon = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" />
    <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
  </svg>
);
const CheckCircle = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#34a853" stroke="white" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" /><polyline points="9 12 11.5 14.5 16 9.5" />
  </svg>
);
const DocIcon = ({ size = 14, color = "#5f6368" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);
const PersonalIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);
const RelatedPartiesIcon = ({ size = 14, color = "#5f6368" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const BusinessInfoIcon = ({ size = 14, complete = false }) => (
  complete ? <CheckCircle size={size} /> : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  )
);
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const DropdownArrow = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
);

/* ── Reusable Pieces ── */
const EntityBubble = ({ type, size = 28 }) => {
  const isBiz = type === "business";
  return (
    <div style={{
      width: size, height: size, borderRadius: isBiz ? 6 : "50%",
      background: isBiz ? "#e8f0fe" : "#e6f4ea",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      color: isBiz ? "#1967d2" : "#1e8e3e",
    }}>
      {isBiz ? <BuildingIcon size={size * 0.5} /> : <UserIcon size={size * 0.5} />}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const c = {
    complete: { bg: "#e6f4ea", color: "#1e8e3e", label: "Complete", dot: "#34a853" },
    in_progress: { bg: "#e8f0fe", color: "#1967d2", label: "In Progress", dot: "#4285f4" },
    not_started: { bg: "#f1f3f4", color: "#5f6368", label: "Not Started", dot: "#bdc1c6" },
    needs_review: { bg: "#fef7e0", color: "#b06000", label: "Needs Review", dot: "#f9ab00" },
  }[status] || { bg: "#f1f3f4", color: "#5f6368", label: "—", dot: "#bdc1c6" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 8px", borderRadius: 4, fontSize: 11.5, fontWeight: 500,
      background: c.bg, color: c.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
      {c.label}
    </span>
  );
};

const DocStatus = ({ collected, total }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div style={{ width: 40, height: 4, borderRadius: 99, background: "#e8eaed", overflow: "hidden" }}>
      <div style={{
        width: `${(collected / total) * 100}%`, height: "100%", borderRadius: 99,
        background: collected === total ? "#34a853" : "#4285f4",
      }} />
    </div>
    <span style={{ fontSize: 11.5, color: collected === total ? "#1e8e3e" : "#5f6368", fontWeight: 500 }}>
      {collected}/{total}
    </span>
  </div>
);

const OwnershipPill = ({ percentage, type }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 3,
    padding: "2px 7px", borderRadius: 4, fontSize: 11.5, fontWeight: 600,
    background: type === "Direct" ? "#e8f0fe" : "#f3e8fd",
    color: type === "Direct" ? "#1967d2" : "#7b1fa2",
  }}>
    {percentage}%
    <span style={{ fontWeight: 400, fontSize: 10.5, opacity: 0.8 }}>{type}</span>
  </span>
);

const NavItem = ({ icon, label, active, indent = 0, onClick }) => (
  <div onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 8,
    padding: `7px 12px 7px ${16 + indent}px`,
    fontSize: 13, color: active ? "#1967d2" : "#3c4043",
    fontWeight: active ? 600 : 400,
    background: active ? "#e8f0fe" : "transparent",
    borderLeft: active ? "3px solid #1967d2" : "3px solid transparent",
    cursor: "pointer", transition: "background 0.12s",
  }}>
    <span style={{ display: "flex", flexShrink: 0 }}>{icon}</span>{label}
  </div>
);

/* ══════════════════════════════════════════
   TREE VIEW (for business entities)
   ══════════════════════════════════════════ */

const TreeNode = ({ node, isRoot = false, parentConnector = true }) => {
  const isBiz = node.type === "business";
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Vertical connector from parent */}
      {!isRoot && (
        <div style={{ width: 2, height: 20, background: "#dadce0" }} />
      )}

      {/* Ownership badges above the node */}
      {node.ownership && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6, marginBottom: 4,
        }}>
          {node.ownership.map((o, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 11, fontWeight: 600,
              color: o.type === "Direct" ? "#1967d2" : "#7b1fa2",
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                background: o.type === "Direct" ? "#e8f0fe" : "#f3e8fd",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 8,
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span>{o.percentage}%</span>
              <span style={{ fontWeight: 400, fontSize: 10, opacity: 0.7 }}>{o.type}</span>
            </div>
          ))}
        </div>
      )}

      {/* The node card */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 16px",
        background: "white",
        border: isRoot ? "2px solid #1967d2" : "1px solid #dadce0",
        borderRadius: 8,
        boxShadow: isRoot ? "0 2px 8px rgba(25,103,210,0.1)" : "0 1px 3px rgba(0,0,0,0.04)",
        minWidth: 160,
        cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: isBiz ? 6 : "50%",
          background: isBiz ? "#e8f0fe" : "#e6f4ea",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {isBiz
            ? <BuildingIcon size={14} color="#1967d2" />
            : <UserIcon size={14} color="#1e8e3e" />
          }
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#202124", whiteSpace: "nowrap" }}>{node.name}</div>
          {node.role && (
            <div style={{ fontSize: 11, color: "#80868b", marginTop: 1 }}>Role: {node.role}</div>
          )}
        </div>
        <div style={{ marginLeft: 8, color: "#9aa0a6" }}>
          <DropdownArrow size={12} />
        </div>
      </div>

      {/* Children */}
      {hasChildren && (
        <>
          <div style={{ width: 2, height: 20, background: "#dadce0" }} />
          <div style={{
            display: "flex", gap: 0, position: "relative",
          }}>
            {/* Horizontal connector line */}
            {node.children.length > 1 && (
              <div style={{
                position: "absolute",
                top: 0,
                left: "calc(50% - " + ((node.children.length - 1) * 100) + "px)",
                right: "calc(50% - " + ((node.children.length - 1) * 100) + "px)",
                height: 2,
                background: "#dadce0",
              }} />
            )}
            {/* Actually, let's use a simpler horizontal line approach */}
            <div style={{ display: "flex", gap: 32, position: "relative" }}>
              {node.children.length > 1 && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  right: "50%",
                  height: 0,
                }}>
                  {/* We'll draw the horizontal bar spanning all children */}
                </div>
              )}
              {node.children.map((child, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  {node.children.length > 1 && (
                    <div style={{
                      position: "absolute", top: -2,
                      left: idx === 0 ? "50%" : 0,
                      right: idx === node.children.length - 1 ? "50%" : 0,
                      height: 2, background: "#dadce0",
                    }} />
                  )}
                  <TreeNode node={child} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ── Tree Data ── */
const LLC_TREE = {
  name: "Taylor Swift LLC",
  type: "business",
  role: null,
  children: [
    {
      name: "Taylor Swift",
      type: "individual",
      role: "Owner",
      ownership: [{ percentage: 50, type: "Direct" }],
      children: [],
    },
    {
      name: "Swifties Inc.",
      type: "business",
      role: "Owner",
      ownership: [{ percentage: 50, type: "Direct" }],
      children: [
        {
          name: "Taylor Swift",
          type: "individual",
          role: "Owner",
          ownership: [
            { percentage: 50, type: "Indirect" },
            { percentage: 100, type: "Direct" },
          ],
          children: [],
        },
      ],
    },
  ],
};

const SWIFTIES_TREE = {
  name: "Swifties Inc.",
  type: "business",
  role: null,
  children: [
    {
      name: "Taylor Swift",
      type: "individual",
      role: "Owner",
      ownership: [{ percentage: 100, type: "Direct" }],
      children: [],
    },
  ],
};

const TreeView = ({ title, tree }) => (
  <div style={{
    background: "white", borderRadius: 8, border: "1px solid #e0e0e0", overflow: "hidden",
  }}>
    <div style={{
      padding: "14px 16px", borderBottom: "1px solid #e8eaed",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#202124" }}>Related Parties</h2>
    </div>
    <div style={{
      padding: "32px 24px 40px",
      display: "flex", justifyContent: "center",
      overflowX: "auto",
      minHeight: 300,
    }}>
      <TreeNode node={tree} isRoot />
    </div>
  </div>
);


/* ══════════════════════════════════════════
   LIST VIEW (for individuals)
   ══════════════════════════════════════════ */

const LIST_PARTIES = [
  {
    id: 1, name: "Taylor Swift LLC", type: "business", role: "Owner",
    effectiveOwnership: 100, kycStatus: "in_progress",
    docsCollected: 2, docsTotal: 4, addedBy: "Banker",
    paths: [
      { type: "Direct", percentage: 50 },
      { type: "Indirect", percentage: 50, via: "Swifties Inc.", viaType: "business" },
    ],
  },
  {
    id: 2, name: "Swifties Inc.", type: "business", role: "Owner",
    effectiveOwnership: 100, kycStatus: "complete",
    docsCollected: 3, docsTotal: 3, addedBy: "Banker",
    paths: [{ type: "Direct", percentage: 100 }],
  },
  {
    id: 3, name: "Nashville Holdings Group", type: "business", role: "Beneficial Owner",
    effectiveOwnership: 25, kycStatus: "not_started",
    docsCollected: 0, docsTotal: 5, addedBy: "Client",
    paths: [{ type: "Indirect", percentage: 25, via: "Taylor Swift LLC", viaType: "business" }],
  },
  {
    id: 4, name: "Andrea Swift", type: "individual", role: "Authorized Signer",
    effectiveOwnership: null, kycStatus: "needs_review",
    docsCollected: 1, docsTotal: 2, addedBy: "Banker",
    paths: [{ type: "Direct", percentage: null }],
  },
];

const PartyRow = ({ party, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const canExpand = party.paths.length > 1 || party.paths.some(p => p.via);

  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid #e8eaed" }}>
      <div
        onClick={() => canExpand && setExpanded(!expanded)}
        style={{
          display: "grid",
          gridTemplateColumns: "24px 1.5fr 0.7fr 0.7fr 0.6fr 0.5fr 0.45fr",
          alignItems: "center", padding: "12px 16px",
          cursor: canExpand ? "pointer" : "default",
          background: expanded ? "#f8f9fa" : "transparent",
          transition: "background 0.12s",
        }}
        onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = "#f8f9fa"; }}
        onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ color: "#9aa0a6", display: "flex", alignItems: "center" }}>
          {canExpand ? (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <div style={{ width: 14 }} />}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <EntityBubble type={party.type} size={28} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, color: "#202124" }}>
              {party.name}
              <span style={{
                fontSize: 9.5, fontWeight: 600, padding: "1px 5px", borderRadius: 3,
                background: party.type === "business" ? "#e8f0fe" : "#e6f4ea",
                color: party.type === "business" ? "#1967d2" : "#1e8e3e",
                textTransform: "uppercase", letterSpacing: 0.4,
              }}>{party.type === "business" ? "BUS" : "IND"}</span>
            </div>
            <div style={{ fontSize: 11.5, color: "#80868b", marginTop: 1 }}>{party.role}</div>
          </div>
        </div>
        <div>
          {party.effectiveOwnership !== null ? (
            <div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#202124" }}>{party.effectiveOwnership}%</span>
              <div style={{ fontSize: 10.5, color: "#9aa0a6" }}>Effective</div>
            </div>
          ) : <span style={{ color: "#bdc1c6", fontSize: 12 }}>—</span>}
        </div>
        <div><StatusBadge status={party.kycStatus} /></div>
        <div><DocStatus collected={party.docsCollected} total={party.docsTotal} /></div>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11.5, fontWeight: 500,
            color: party.addedBy === "Client" ? "#7b1fa2" : "#1967d2",
            background: party.addedBy === "Client" ? "#f3e8fd" : "#e8f0fe",
            padding: "2px 7px", borderRadius: 4,
          }}>
            {party.addedBy === "Client" ? <UserIcon size={10} /> : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/></svg>
            )}
            {party.addedBy}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <button onClick={e => e.stopPropagation()} style={{
            padding: "4px 10px", borderRadius: 4, border: "1px solid #dadce0",
            background: "white", color: "#1967d2", fontSize: 12, fontWeight: 500, cursor: "pointer",
          }}>View</button>
        </div>
      </div>

      {expanded && (
        <div style={{ background: "#f1f3f4", borderTop: "1px solid #e8eaed" }}>
          {party.paths.map((path, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "24px 1.5fr 0.7fr 0.7fr 0.6fr 0.5fr 0.45fr",
              alignItems: "center", padding: "9px 16px 9px 44px",
              borderBottom: i < party.paths.length - 1 ? "1px dashed #dadce0" : "none",
            }}>
              <div />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 1, background: "#bdc1c6" }} />
                {path.via ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 11.5, color: "#80868b" }}>via</span>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "3px 8px", borderRadius: 4,
                      background: "white", border: "1px solid #dadce0", cursor: "pointer",
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#1967d2"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#dadce0"}
                    >
                      <EntityBubble type={path.viaType} size={16} />
                      <span style={{ fontSize: 12, fontWeight: 500, color: "#1967d2" }}>{path.via}</span>
                    </div>
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: "#5f6368" }}>Direct relationship</span>
                )}
              </div>
              <div>
                {path.percentage !== null
                  ? <OwnershipPill percentage={path.percentage} type={path.type} />
                  : <span style={{ fontSize: 11.5, color: "#80868b", fontStyle: "italic" }}>N/A</span>
                }
              </div>
              <div /><div /><div /><div />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ListView = () => (
  <div style={{
    background: "white", borderRadius: 8, border: "1px solid #e0e0e0", overflow: "hidden",
  }}>
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 16px", borderBottom: "1px solid #e8eaed",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#202124" }}>Related Parties</h2>
        <span style={{
          fontSize: 11, fontWeight: 600, color: "#5f6368",
          background: "#f1f3f4", padding: "2px 7px", borderRadius: 99,
        }}>{LIST_PARTIES.length}</span>
      </div>
      <button style={{
        padding: "6px 14px", borderRadius: 4, border: "none",
        background: "#1967d2", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer",
      }}>+ Add Party</button>
    </div>
    <div style={{
      display: "grid",
      gridTemplateColumns: "24px 1.5fr 0.7fr 0.7fr 0.6fr 0.5fr 0.45fr",
      padding: "8px 16px", background: "#f8f9fa", borderBottom: "1px solid #e8eaed",
      fontSize: 10.5, fontWeight: 600, color: "#80868b",
      textTransform: "uppercase", letterSpacing: 0.5,
    }}>
      <div /><div>Entity</div><div>Ownership</div><div>KYC / KYB</div><div>Docs</div><div>Added By</div><div style={{ textAlign: "right" }}>Actions</div>
    </div>
    {LIST_PARTIES.map((p, i) => <PartyRow key={p.id} party={p} isLast={i === LIST_PARTIES.length - 1} />)}

    {/* Legend */}
    <div style={{
      display: "flex", alignItems: "center", gap: 14, padding: "10px 16px",
      borderTop: "1px solid #e8eaed", fontSize: 10.5, color: "#9aa0a6",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ width: 7, height: 7, borderRadius: 2, background: "#e8f0fe" }} /> Direct
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ width: 7, height: 7, borderRadius: 2, background: "#f3e8fd" }} /> Indirect
      </div>
      <div>Click expandable rows to see ownership paths</div>
    </div>
  </div>
);


/* ══════════════════════════════════════════
   MAIN LAYOUT
   ══════════════════════════════════════════ */

export default function OnboardingCaseView() {
  const [activeNav, setActiveNav] = useState("ts-related-parties");

  const contentMap = {
    "llc-rp": <TreeView title="Taylor Swift LLC" tree={LLC_TREE} />,
    "si-rp": <TreeView title="Swifties Inc." tree={SWIFTIES_TREE} />,
    "ts-related-parties": <ListView />,
  };

  const placeholderContent = (label) => (
    <div style={{
      background: "white", borderRadius: 8, border: "1px solid #e0e0e0",
      padding: "48px 24px", textAlign: "center",
    }}>
      <div style={{ fontSize: 14, color: "#80868b" }}>{label}</div>
    </div>
  );

  const getContent = () => {
    if (contentMap[activeNav]) return contentMap[activeNav];
    const labels = {
      "case-details": "Case Details",
      "llc-biz": "Business Information — Taylor Swift LLC",
      "llc-docs": "Documents — Taylor Swift LLC",
      "ts-personal": "Personal Details — Taylor Swift",
      "ts-docs": "Documents — Taylor Swift",
      "si-biz": "Business Information — Swifties Inc.",
      "si-docs": "Documents — Swifties Inc.",
    };
    return placeholderContent(labels[activeNav] || "Select a section");
  };

  // Section label for the content header
  const sectionContext = {
    "llc-rp": "Taylor Swift LLC",
    "si-rp": "Swifties Inc.",
    "ts-related-parties": "Taylor Swift",
  };

  return (
    <div style={{
      fontFamily: "'Salesforce Sans', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "#f3f3f3", minHeight: "100vh", fontSize: 13, color: "#3c4043",
    }}>
      {/* ── Top Nav ── */}
      <div style={{
        background: "white", borderBottom: "1px solid #e0e0e0",
        padding: "0 16px", display: "flex", alignItems: "center", height: 44, gap: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,5px)", gap: 3, opacity: 0.4 }}>
            {[...Array(9)].map((_, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#5f6368" }} />)}
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1967d2", letterSpacing: -0.2 }}>nCino</span>
        </div>
        {["Home", "Leads", "Opportunities", "Relationships", "Applications", "Loans", "Deposits", "Onboarding"].map(item => (
          <span key={item} style={{
            fontSize: 12.5, color: item === "Onboarding" ? "#1967d2" : "#5f6368",
            fontWeight: item === "Onboarding" ? 600 : 400, cursor: "pointer", padding: "12px 0",
            borderBottom: item === "Onboarding" ? "2px solid #1967d2" : "2px solid transparent",
          }}>{item}</span>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 4, background: "#f1f3f4",
            fontSize: 12, color: "#80868b",
          }}><SearchIcon /> Search...</div>
        </div>
      </div>

      {/* ── Page Header ── */}
      <div style={{ background: "white", borderBottom: "1px solid #e0e0e0", padding: "16px 24px" }}>
        <div style={{ fontSize: 12, color: "#80868b", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ color: "#1967d2", cursor: "pointer" }}>All Onboarding</span>
          <span style={{ color: "#bdc1c6" }}>&gt;</span>
          <span style={{ color: "#1967d2", cursor: "pointer" }}>Taylor Swift LLC</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: "#e8f0fe",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <RelatedPartiesIcon size={18} color="#1967d2" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#202124" }}>OC-000006</span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
              background: "#e8f0fe", color: "#1967d2",
            }}>In Progress</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: "flex", padding: "16px 24px", gap: 16, alignItems: "flex-start" }}>

        {/* Left Nav */}
        <div style={{
          width: 220, flexShrink: 0, background: "white",
          borderRadius: 8, border: "1px solid #e0e0e0", overflow: "hidden",
        }}>
          <div style={{ padding: "10px 0 4px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#5f6368", textTransform: "uppercase", letterSpacing: 0.5, padding: "0 16px 6px" }}>Overview</div>
            <NavItem icon={<DocIcon />} label="Case Details" active={activeNav === "case-details"} onClick={() => setActiveNav("case-details")} />
          </div>

          <div style={{ height: 1, background: "#e8eaed", margin: "4px 12px" }} />

          <div style={{ padding: "8px 0 4px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#5f6368", textTransform: "uppercase", letterSpacing: 0.5, padding: "0 16px 6px" }}>Taylor Swift LLC</div>
            <NavItem icon={<BusinessInfoIcon complete />} label="Business Information" indent={4} active={activeNav === "llc-biz"} onClick={() => setActiveNav("llc-biz")} />
            <NavItem icon={<DocIcon />} label="Documents" indent={4} active={activeNav === "llc-docs"} onClick={() => setActiveNav("llc-docs")} />
            <NavItem icon={<RelatedPartiesIcon color={activeNav === "llc-rp" ? "#1967d2" : "#5f6368"} />} label="Related Parties" indent={4} active={activeNav === "llc-rp"} onClick={() => setActiveNav("llc-rp")} />
          </div>

          <div style={{ height: 1, background: "#e8eaed", margin: "4px 12px" }} />

          <div style={{ padding: "8px 0 4px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#5f6368", textTransform: "uppercase", letterSpacing: 0.5, padding: "0 16px 6px" }}>Taylor Swift</div>
            <NavItem icon={<PersonalIcon />} label="Personal Details" indent={4} active={activeNav === "ts-personal"} onClick={() => setActiveNav("ts-personal")} />
            <NavItem icon={<DocIcon />} label="Documents" indent={4} active={activeNav === "ts-docs"} onClick={() => setActiveNav("ts-docs")} />
            <NavItem icon={<RelatedPartiesIcon color={activeNav === "ts-related-parties" ? "#1967d2" : "#5f6368"} />} label="Related Parties" indent={4} active={activeNav === "ts-related-parties"} onClick={() => setActiveNav("ts-related-parties")} />
          </div>

          <div style={{ height: 1, background: "#e8eaed", margin: "4px 12px" }} />

          <div style={{ padding: "8px 0 8px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#5f6368", textTransform: "uppercase", letterSpacing: 0.5, padding: "0 16px 6px" }}>Swifties Inc.</div>
            <NavItem icon={<BusinessInfoIcon />} label="Business Information" indent={4} active={activeNav === "si-biz"} onClick={() => setActiveNav("si-biz")} />
            <NavItem icon={<DocIcon />} label="Documents" indent={4} active={activeNav === "si-docs"} onClick={() => setActiveNav("si-docs")} />
            <NavItem icon={<RelatedPartiesIcon color={activeNav === "si-rp" ? "#1967d2" : "#5f6368"} />} label="Related Parties" indent={4} active={activeNav === "si-rp"} onClick={() => setActiveNav("si-rp")} />
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Context breadcrumb for related parties views */}
          {sectionContext[activeNav] && (
            <div style={{
              fontSize: 12, color: "#80868b", marginBottom: 8,
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <span style={{ fontWeight: 500, color: "#5f6368" }}>{sectionContext[activeNav]}</span>
              <span style={{ color: "#bdc1c6" }}>›</span>
              <span>Related Parties</span>
              {activeNav !== "ts-related-parties" && (
                <span style={{
                  fontSize: 10, padding: "1px 6px", borderRadius: 3,
                  background: "#e8f0fe", color: "#1967d2", fontWeight: 600, marginLeft: 4,
                }}>TREE VIEW</span>
              )}
              {activeNav === "ts-related-parties" && (
                <span style={{
                  fontSize: 10, padding: "1px 6px", borderRadius: 3,
                  background: "#e6f4ea", color: "#1e8e3e", fontWeight: 600, marginLeft: 4,
                }}>LIST VIEW</span>
              )}
            </div>
          )}

          {getContent()}

          {/* Footer Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <button style={{
              padding: "8px 20px", borderRadius: 4, border: "1px solid #dadce0",
              background: "white", color: "#3c4043", fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}>Save</button>
            <button style={{
              padding: "8px 20px", borderRadius: 4, border: "none",
              background: "#1967d2", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>Navigate to Deals</button>
          </div>
        </div>
      </div>
    </div>
  );
}
