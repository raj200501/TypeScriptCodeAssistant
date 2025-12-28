# UI QA Report

- [P1] Issue: Header navigation lacks a clear active state across routes. Impact: Users lose orientation when moving between pages. Fix: Add active link styling and stronger hover states in the top nav.
- [P1] Issue: Editor toolbar actions are grouped inconsistently, with no clear primary action. Impact: Users hesitate on where to start the workflow. Fix: Introduce a structured toolbar with primary/secondary buttons and consistent spacing.
- [P2] Issue: Diagnostics list lacks severity badges and visual hierarchy. Impact: Important issues are not easy to scan. Fix: Add severity badges, rule labels, and structured spacing per diagnostic item.
- [P2] Issue: Quick fix preview lacks inline diff context. Impact: Users cannot quickly understand what changes. Fix: Add an inline diff view with added/removed lines.
- [P1] Issue: Snippets page has no search or empty state guidance. Impact: Large snippet sets are hard to navigate. Fix: Add search input and enhanced empty state copy.
- [P2] Issue: Snippets detail information is buried in the editor pane. Impact: Metadata is hard to access. Fix: Add a drawer or side panel with snippet metadata and actions.
- [P2] Issue: History list lacks actionable affordances and detail view. Impact: Users cannot inspect a specific run. Fix: Make history cards clickable with a run detail modal.
- [P2] Issue: Settings layout is a single column without clear grouping. Impact: Hard to scan available options. Fix: Introduce tabs and card-based sections with toggles.
- [P1] Issue: Light/dark theme is not available. Impact: Reduced accessibility and preference support. Fix: Add theme toggle with persisted preference.
- [P2] Issue: Loading states are missing for snippets and history. Impact: Interface feels unresponsive on slow networks. Fix: Add skeletons/spinners during async fetches.
- [P2] Issue: Buttons and cards have inconsistent radius and shadow styling. Impact: UI feels uneven. Fix: Create shared design tokens and consistent component styles.
- [P2] Issue: Footer content feels isolated from the rest of the layout. Impact: Lower perceived quality. Fix: Apply matching surface styling and badges.
- [P2] Issue: Focus states are minimal on buttons and links. Impact: Accessibility suffers for keyboard users. Fix: Add focus-visible outlines across interactive elements.
- [P1] Issue: Home page hero lacks structured meta information. Impact: Value proposition feels generic. Fix: Add badges and call-to-action grouping for quick scanning.
