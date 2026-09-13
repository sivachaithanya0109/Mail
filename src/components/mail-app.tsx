import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Archive, ArchiveX, ArrowLeft, BadgeCheck, CalendarDays, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  Clock3, Copy, Download, ExternalLink, FileText, FolderInput, Grid3X3, Inbox, Info, Lightbulb, LockKeyhole, Mail, MailOpen,
  Maximize2, Menu, MessageSquarePlus, Minimize2, MoreVertical, Paperclip, PenLine,
  Plus, Printer, RefreshCw, Reply, Search, Send, Settings, ShoppingBag, SlidersHorizontal,
  Smile, Sparkles, Star, Tag, Trash2, Type, UserRound, X, Link2, Video,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { initialEmails, type EmailCategory, type EmailMessage } from "@/data/emails";
import { cn } from "@/lib/utils";

const categories: Array<{ name: EmailCategory; icon: typeof Inbox }> = [
  { name: "Primary", icon: Inbox }, { name: "Promotions", icon: Tag },
  { name: "Social", icon: MessageSquarePlus }, { name: "Updates", icon: Info },
];

const folders = [
  { name: "Inbox", icon: Inbox }, { name: "Starred", icon: Star },
  { name: "Snoozed", icon: Clock3 }, { name: "Sent", icon: Send },
  { name: "Drafts", icon: FileText }, { name: "Purchases", icon: ShoppingBag },
  { name: "More", icon: ChevronDown },
] as const;

function IconButton({ label, children, className, ...props }: { label: string; children: ReactNode; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className={cn("mail-icon-btn", className)} aria-label={label} {...props}>{children}</Button></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>;
}

function Header({ query, setQuery, sidebarOpen, setSidebarOpen }: { query: string; setQuery: (v: string) => void; sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void }) {
  return <header className="mail-header">
    <div className="mail-brand-area"><IconButton label="Main menu" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu /></IconButton><img src="/icon-192.png" alt="vmail logo" width={32} height={32} className="mail-logo-mark" /><span>vmail</span></div>
    <div className="mail-search"><IconButton label="Search"><Search /></IconButton><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search mail" aria-label="Search mail" />{query && <IconButton label="Clear search" onClick={() => setQuery("")}><X /></IconButton>}<IconButton label="Show search options"><SlidersHorizontal /></IconButton></div>
    <div className="mail-header-actions"><IconButton label="Support"><CircleHelp /></IconButton><IconButton label="Settings"><Settings /></IconButton><IconButton label="Assistant"><Sparkles /></IconButton><IconButton label="Apps"><Grid3X3 /></IconButton><Button variant="ghost" size="icon" className="mail-avatar-button" aria-label="Account: Taylor Reed">TR</Button></div>
  </header>;
}

function Sidebar({ open, folder, setFolder, unread, onCompose }: { open: boolean; folder: string; setFolder: (v: string) => void; unread: number; onCompose: () => void }) {
  return <aside className={cn("mail-sidebar", !open && "mail-sidebar-collapsed")}>
    <Button className="compose-button" onClick={onCompose}><PenLine />{open && <span>Compose</span>}</Button>
     <nav aria-label="Mail folders" className="folder-nav">{folders.map(({ name, icon: Icon }) => <Button key={name} variant="ghost" className={cn("folder-item", folder === name && "folder-item-active")} onClick={() => setFolder(name)}><Icon />{open && <><span>{name}</span>{name === "Inbox" && <b>{unread}</b>}{name === "Drafts" && <b>3</b>}{name === "Purchases" && <b>763</b>}</>}</Button>)}</nav>
    {open && <div className="labels"><div className="labels-title"><span>Labels</span><IconButton label="Create label"><Plus /></IconButton></div><div className="label-item"><span className="label-dot label-dot-work" />Work</div><div className="label-item"><span className="label-dot label-dot-personal" />Personal</div><div className="label-item"><span className="label-dot label-dot-travel" />Travel</div></div>}
  </aside>;
}

function Toolbar({ selectedCount, allSelected, onSelectAll, onAction, reader, onBack, position, total, onNavigate }: { selectedCount: number; allSelected: boolean; onSelectAll: () => void; onAction: (action: string) => void; reader?: boolean; onBack?: () => void; position?: number; total: number; onNavigate?: (delta: number) => void }) {
  return <div className={cn("mail-toolbar", reader && "reader-toolbar")}><div className="toolbar-group">
    {reader ? <IconButton label="Back to messages" onClick={onBack}><ArrowLeft /></IconButton> : <div className="select-control"><Checkbox checked={allSelected} onCheckedChange={onSelectAll} aria-label="Select all messages"/><ChevronDown /></div>}
    {!reader && selectedCount === 0 && <IconButton label="Refresh" onClick={() => onAction("Inbox refreshed")}><RefreshCw /></IconButton>}
    {(reader || selectedCount > 0) && <><IconButton label="Archive" onClick={() => onAction("archive")}><Archive /></IconButton><IconButton label="Report spam" onClick={() => onAction("spam")}><ArchiveX /></IconButton><IconButton label="Delete" onClick={() => onAction("delete")}><Trash2 /></IconButton><span className="toolbar-divider"/><IconButton label="Mark unread" onClick={() => onAction("unread")}><MailOpen /></IconButton><IconButton label="Snooze" onClick={() => onAction("snooze")}><Clock3 /></IconButton>{reader && <><IconButton label="Add to tasks"><CheckCircle2 /></IconButton><span className="toolbar-divider"/><IconButton label="Move to"><FolderInput /></IconButton><IconButton label="Labels"><Tag /></IconButton></>}</>}
    <IconButton label="More actions"><MoreVertical /></IconButton>{selectedCount > 0 && <span className="selected-count">{selectedCount} selected</span>}
  </div><div className="toolbar-group pagination"><span>{reader && position ? `${position} of ` : "1–"}{total}</span><IconButton label="Newer" disabled={reader && position === 1} onClick={() => onNavigate?.(-1)}><ChevronLeft /></IconButton><IconButton label="Older" disabled={reader && position === total} onClick={() => onNavigate?.(1)}><ChevronRight /></IconButton></div></div>;
}

function CategoryTabs({ active, setActive }: { active: EmailCategory; setActive: (v: EmailCategory) => void }) {
  return <div className="category-tabs" role="tablist">{categories.map(({ name, icon: Icon }) => <Button key={name} variant="ghost" role="tab" aria-selected={active === name} onClick={() => setActive(name)} className={cn("category-tab", active === name && "category-tab-active")}><Icon /><span>{name}</span>{name === "Promotions" && <span className="new-chip">3 new</span>}</Button>)}</div>;
}

function MobileCategoryBundles({ setActive }: { setActive: (v: EmailCategory) => void }) {
  const bundles: Array<{ name: EmailCategory; icon: typeof Tag; detail: string; count: string }> = [
    { name: "Social", icon: MessageSquarePlus, detail: "Teamboard — Jordan mentioned you…", count: "4 new" },
    { name: "Updates", icon: Info, detail: "Northstar Security — New sign-in…", count: "6 new" },
    { name: "Promotions", icon: Tag, detail: "The Product Brief — Seven lessons…", count: "3 new" },
  ];
  return <div className="mobile-category-bundles">{bundles.map(({ name, icon: Icon, detail, count }) => <Button key={name} variant="ghost" className={`mobile-category mobile-category-${name.toLowerCase()}`} onClick={() => setActive(name)}><Icon/><span><b>{name}</b><small>{detail}</small></span><em>{count}</em></Button>)}</div>;
}

function MobileBottomNav({ unread }: { unread: number }) {
  return <nav className="mobile-bottom-nav" aria-label="App navigation"><Button variant="ghost" className="mobile-nav-active" aria-label="Mail"><span><Mail/></span><b>{unread > 99 ? "99+" : unread}</b></Button><Button variant="ghost" aria-label="Meet"><Video/></Button></nav>;
}

function EmailRow({ email, selected, onSelect, onStar, onOpen, onAction }: { email: EmailMessage; selected: boolean; onSelect: () => void; onStar: () => void; onOpen: () => void; onAction: (action: string) => void }) {
  return <div className={cn("email-row", email.unread && "email-unread", selected && "email-selected")} onClick={onOpen} tabIndex={0} role="button" onKeyDown={(e) => { if (e.key === "Enter") onOpen(); }}>
    <div className="row-controls" onClick={(e) => e.stopPropagation()}><span className="mobile-row-avatar">{email.avatar}</span><Checkbox checked={selected} onCheckedChange={onSelect} aria-label={`Select ${email.subject}`} /><IconButton label={email.starred ? "Unstar" : "Star"} onClick={onStar} className={cn("row-icon", email.starred && "starred")}><Star fill={email.starred ? "currentColor" : "none"}/></IconButton><span className={cn("importance", email.important && "important")} title="Important">›</span></div>
    <span className="email-sender">{email.sender}</span><div className="email-summary"><span className="email-subject">{email.subject}</span><span className="email-preview"> — {email.preview}</span>{email.attachment && <Paperclip className="attachment-icon"/>}</div><span className="email-date">{email.date}</span><div className="row-quick-actions" onClick={(e) => e.stopPropagation()}><IconButton label="Archive" onClick={() => onAction("archive")}><Archive /></IconButton><IconButton label="Delete" onClick={() => onAction("delete")}><Trash2 /></IconButton><IconButton label={email.unread ? "Mark as read" : "Mark as unread"} onClick={() => onAction("unread")}><MailOpen /></IconButton><IconButton label="Snooze" onClick={() => onAction("snooze")}><Clock3 /></IconButton></div>
  </div>;
}

function SecurityModal({ open, setOpen, email }: { open: boolean; setOpen: (v: boolean) => void; email: EmailMessage }) {
  const fields = [
    ["Message ID", `<demo-${email.id}.20260909@mail.example>`], ["Created", email.fullDate], ["From", `${email.sender} <${email.senderEmail}>`], ["To", email.recipient], ["Reply-To", email.senderEmail], ["MIME-Version", "1.0"], ["Authentication", `spf=pass; dkim=pass; dmarc=pass header.from=${email.senderEmail.split("@")[1]}`], ["SPF", `PASS (sender IP 192.0.2.${20 + email.id})`], ["DKIM", `PASS (selector=mail2026; domain=${email.senderEmail.split("@")[1]})`], ["DMARC", "PASS (policy=quarantine; alignment=relaxed)"], ["Encryption", "TLS 1.3 with AES_256_GCM"], ["Mail server", "mx-demo01.example.net"], ["Received", `from outbound.example.net (192.0.2.${20 + email.id}) by mx-demo01.example.net with ESMTPS id DEMO${email.id}`],
  ];
  const copyHeaders = () => { void navigator.clipboard?.writeText(fields.map(([key, value]) => `${key}: ${value}`).join("\n")); toast.success("Original message copied"); };
  const domain = email.senderEmail.split("@")[1];
  return <Dialog open={open} onOpenChange={setOpen}><DialogContent className="security-modal"><div className="mobile-security-sheet"><DialogTitle>Security details</DialogTitle><div><span>Mailed by:</span><b>{domain}</b><span>Signed by:</span><b>{domain}</b><span>Security:</span><b><LockKeyhole/>Standard encryption (TLS).</b></div><Button variant="link" onClick={() => setOpen(false)}>Learn more</Button></div><div className="desktop-security-content"><DialogHeader className="security-modal-header"><div><DialogTitle>Original Message</DialogTitle><DialogDescription>{email.subject}</DialogDescription></div><div className="original-actions"><Button variant="outline" onClick={copyHeaders}><Copy />Copy to clipboard</Button><IconButton label="Download original"><Download /></IconButton></div></DialogHeader><div className="original-summary"><div><b>Message ID</b><span>&lt;demo-{email.id}.20260909@mail.example&gt;</span></div><div><b>Created at</b><span>{email.fullDate}</span></div><div><b>From</b><span>{email.sender} &lt;{email.senderEmail}&gt;</span></div><div><b>To</b><span>{email.recipient}</span></div><div><b>Subject</b><span>{email.subject}</span></div></div><div className="auth-results"><div><CheckCircle2/><span><b>SPF:</b> PASS with IP 192.0.2.{20 + email.id}</span></div><div><CheckCircle2/><span><b>DKIM:</b> PASS with domain {domain}</span></div><div><CheckCircle2/><span><b>DMARC:</b> PASS</span></div></div><div className="original-heading"><b>Original message</b></div><dl className="metadata-list">{fields.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl><p className="demo-note">The delivery information shown here is fictional and for interface demonstration only.</p></div></DialogContent></Dialog>;
}

function SenderDetails({ email, onSecurity }: { email: EmailMessage; onSecurity: () => void }) {
  const domain = email.senderEmail.split("@")[1];
  return <Popover><PopoverTrigger asChild><Button variant="ghost" className="sender-details-trigger">to me <ChevronDown /></Button></PopoverTrigger><PopoverContent align="start" sideOffset={4} className="sender-popover"><div className="popover-grid"><span>from:</span><b>{email.sender} &lt;{email.senderEmail}&gt;</b><span>to:</span><b>{email.recipient}</b><span>date:</span><b>{email.fullDate}</b><span>subject:</span><b>{email.subject}</b><span>mailed-by:</span><b>{domain}</b><span>signed-by:</span><b>{domain}</b><span>security:</span><b className="security-line"><LockKeyhole /> <span>Standard encryption (TLS)</span><Button variant="link" onClick={onSecurity}>View details</Button></b></div></PopoverContent></Popover>;
}

function EmailReader({ email, onBack, onAction, onNavigate, position, total }: { email: EmailMessage; onBack: () => void; onAction: (action: string) => void; onNavigate: (delta: number) => void; position: number; total: number }) {
  const [securityOpen, setSecurityOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  return <div className="reader"><Toolbar selectedCount={0} allSelected={false} onSelectAll={() => {}} onAction={onAction} reader onBack={onBack} position={position} total={total} onNavigate={onNavigate}/><article className="message"><div className="subject-line"><h1>{email.subject}</h1>{email.important && <span className="important-pill">Inbox</span>}<IconButton label="Star"><Star /></IconButton><IconButton label="Print all"><Printer /></IconButton><IconButton label="Open in new window"><ExternalLink /></IconButton></div><div className="sender-card"><div className="sender-block"><div className="sender-avatar">{email.avatar}</div><div className="sender-meta"><div className="sender-name-line"><b>{email.sender}</b><span>&lt;{email.senderEmail}&gt;</span><BadgeCheck /></div><div className="desktop-sender-details"><SenderDetails email={email} onSecurity={() => setSecurityOpen(true)}/></div><Button variant="ghost" className="mobile-sender-details" onClick={() => setDetailsOpen(!detailsOpen)}>to me <ChevronDown className={detailsOpen ? "details-open" : ""}/></Button></div><Button variant="link" className="unsubscribe">Unsubscribe</Button><div className="message-time"><span>{email.time} ({email.date === "Sep 9" ? "2 hours ago" : email.date})</span><IconButton label={email.starred ? "Unstar" : "Star"}><Star fill={email.starred ? "currentColor" : "none"}/></IconButton><IconButton label="Add reaction"><Smile /></IconButton><IconButton label="Reply"><Reply /></IconButton><IconButton label="More"><MoreVertical /></IconButton></div></div>{detailsOpen && <div className="mobile-recipient-panel"><div><span>From</span><b>{email.sender} · {email.senderEmail}</b><span>To</span><b>{email.recipient}</b><span>Date</span><b>{email.fullDate}</b></div><div className="mobile-encryption"><LockKeyhole/><span>Standard encryption (TLS).<Button variant="link" onClick={() => setSecurityOpen(true)}>See security details</Button></span></div></div>}<div className="message-body">{email.body.map((p, i) => <p key={i}>{p}</p>)}</div>{email.attachment && <div className="attachments"><b>1 attachment</b><Button variant="outline" className="attachment-card"><FileText/><span>{email.attachment}<small>Demo file</small></span></Button></div>}</div><div className="reply-actions"><Button variant="outline"><Reply/> Reply</Button><Button variant="outline"><Send/> Forward</Button><IconButton label="Add reaction"><Smile /></IconButton></div></article><SecurityModal open={securityOpen} setOpen={setSecurityOpen} email={email}/></div>;
}

function AppRail() {
  return <aside className="app-rail" aria-label="Workspace apps"><IconButton label="Calendar"><CalendarDays className="rail-calendar" /></IconButton><IconButton label="Notes"><Lightbulb className="rail-notes" /></IconButton><IconButton label="Tasks"><CheckCircle2 className="rail-tasks" /></IconButton><IconButton label="Contacts"><UserRound className="rail-contacts" /></IconButton><span className="rail-divider"/><IconButton label="Add apps"><Plus /></IconButton></aside>;
}

function ComposeWindow({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState(false); const [subject, setSubject] = useState("");
  const send = () => { toast.success("Message sent", { description: "This was a local prototype action." }); onClose(); };
  return <section className="compose-window" aria-label="New message"><div className="compose-title"><b>New message</b><div><IconButton label="Minimize"><Minimize2 /></IconButton><IconButton label="Full screen"><Maximize2 /></IconButton><IconButton label="Save and close" onClick={onClose}><X /></IconButton></div></div><div className="compose-field"><span>Recipients</span><input aria-label="Recipients"/><Button variant="ghost" onClick={() => setExpanded(!expanded)}>Cc&nbsp;&nbsp;Bcc</Button></div>{expanded && <><div className="compose-field"><span>Cc</span><input aria-label="Cc recipients"/></div><div className="compose-field"><span>Bcc</span><input aria-label="Bcc recipients"/></div></>}<div className="compose-field"><input aria-label="Subject" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)}/></div><textarea aria-label="Message body" autoFocus/><div className="format-bar"><IconButton label="Formatting options"><Type /></IconButton><b>B</b><i>I</i><u>U</u></div><div className="compose-actions"><Button onClick={send}>Send <ChevronDown /></Button><IconButton label="Formatting options"><Type /></IconButton><IconButton label="Attach files"><Paperclip /></IconButton><IconButton label="Insert link"><Link2 /></IconButton><IconButton label="Insert emoji"><Smile /></IconButton><span/><IconButton label="Discard draft" onClick={onClose}><Trash2 /></IconButton></div></section>;
}

export function MailApp() {
  const [emails, setEmails] = useState(initialEmails); const [sidebarOpen, setSidebarOpen] = useState(true); const [folder, setFolder] = useState("Inbox"); const [category, setCategory] = useState<EmailCategory>("Primary"); const [selected, setSelected] = useState<Set<number>>(new Set()); const [openId, setOpenId] = useState<number | null>(null); const [query, setQuery] = useState(""); const [compose, setCompose] = useState(false);
  useEffect(() => { if (window.matchMedia("(max-width: 900px)").matches) setSidebarOpen(false); }, []);
  const visible = useMemo(() => emails.filter((e) => {
    const folderMatch = folder === "Starred" ? e.starred : folder === "More" ? e.folder === "Archive" : e.folder === folder;
    const categoryMatch = folder !== "Inbox" || e.category === category;
    const needle = query.toLowerCase(); const searchMatch = !needle || [e.sender, e.senderEmail, e.subject, e.preview, ...e.body].join(" ").toLowerCase().includes(needle);
    return folderMatch && categoryMatch && searchMatch;
  }), [emails, folder, category, query]);
  const openEmail = emails.find((e) => e.id === openId); const unread = emails.filter((e) => e.folder === "Inbox" && e.unread).length;
  const toggleSelected = (id: number) => setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const selectAll = () => setSelected(selected.size === visible.length ? new Set() : new Set(visible.map((e) => e.id)));
  const mutate = (action: string, targetId?: number) => {
    const ids = targetId ? new Set([targetId]) : selected;
    if (action === "Inbox refreshed") { toast.success(action); return; }
    setEmails((prev) => prev.map((e) => ids.has(e.id) ? action === "delete" ? { ...e, folder: "Trash" } : action === "archive" ? { ...e, folder: "Archive" } : action === "snooze" ? { ...e, folder: "Snoozed" } : action === "unread" ? { ...e, unread: true } : e : e));
    toast.success(action === "spam" ? "Reported as spam" : action === "unread" ? "Marked as unread" : action === "snooze" ? "Snoozed" : action === "delete" ? "Moved to trash" : "Archived"); setSelected(new Set()); if (openId !== null) setOpenId(null);
  };
  const navigateReader = (delta: number) => { const index = visible.findIndex((e) => e.id === openId); const next = visible[index + delta]; if (next) setOpenId(next.id); };
  const changeFolder = (value: string) => { setFolder(value); setOpenId(null); setSelected(new Set()); };
  const setMobileCategory = (value: EmailCategory) => { setCategory(value); setSelected(new Set()); };
  return <TooltipProvider delayDuration={400}><div className={cn("mail-app", openEmail && "mobile-reader-open")}><Header query={query} setQuery={setQuery} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/><div className="mail-layout"><Sidebar open={sidebarOpen} folder={folder} setFolder={changeFolder} unread={unread} onCompose={() => setCompose(true)}/><main className="mail-main">{openEmail ? <EmailReader email={openEmail} onBack={() => setOpenId(null)} onAction={(a) => mutate(a, openEmail.id)} onNavigate={navigateReader} position={visible.findIndex((e) => e.id === openEmail.id) + 1} total={visible.length}/> : <><Toolbar selectedCount={selected.size} allSelected={visible.length > 0 && selected.size === visible.length} onSelectAll={selectAll} onAction={mutate} total={visible.length}/>{folder === "Inbox" && !query && <><CategoryTabs active={category} setActive={setMobileCategory}/>{category === "Primary" && <MobileCategoryBundles setActive={setMobileCategory}/>}</>}<div className="mobile-list-heading">{query ? "Search results" : folder}</div><div className="email-list">{visible.length ? visible.map((email) => <EmailRow key={email.id} email={email} selected={selected.has(email.id)} onSelect={() => toggleSelected(email.id)} onStar={() => setEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, starred: !e.starred } : e))} onAction={(action) => mutate(action, email.id)} onOpen={() => { setOpenId(email.id); setEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, unread: false } : e)); }}/>) : <div className="empty-state"><Mail/><h2>No messages here</h2><p>Try another folder, category, or search.</p></div>}</div><Button className="mobile-compose" onClick={() => setCompose(true)}><PenLine/><span>Compose</span></Button></>}</main><AppRail /></div><MobileBottomNav unread={unread}/>{compose && <ComposeWindow onClose={() => setCompose(false)}/>}</div></TooltipProvider>;
}