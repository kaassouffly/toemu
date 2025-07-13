# GitHub Copilot Agent Mode Entwicklungsanleitung für Nuxt/Vue mit Context7

## 📋 Inhaltsverzeichnis

1. [Grundlegende Setup-Anleitung](#1-grundlegende-setup-anleitung)
2. [Agent Mode Konfiguration](#2-agent-mode-konfiguration)
3. [Context7 Integration](#3-context7-integration)
4. [Projektstruktur für maximale Copilot-Effizienz](#4-projektstruktur-für-maximale-copilot-effizienz)
5. [Copilot-optimierte Entwicklungsworkflows](#5-copilot-optimierte-entwicklungsworkflows)
6. [Tech-Stack spezifische Anweisungen](#6-tech-stack-spezifische-anweisungen)
7. [Praktische Implementierung](#7-praktische-implementierung)

---

## 1. Grundlegende Setup-Anleitung

### VS Code und Copilot Installation

```bash
# 1. VS Code installieren (falls noch nicht vorhanden)
# Download von: https://code.visualstudio.com/

# 2. GitHub Copilot Extension installieren
code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat

# 3. GitHub Account mit Copilot Zugang verbinden
# In VS Code: Ctrl+Shift+P → "GitHub: Sign In"
```

### Agent Mode aktivieren

1. Öffne VS Code Settings (`Ctrl+,`)
2. Suche nach "github.copilot.chat.agent.enabled"
3. Aktiviere die Option
4. Restart VS Code

### Copilot Dashboard Setup

- Copilot Icon in der Status Bar zeigt den aktuellen Status
- Click auf das Icon öffnet das Dashboard mit:
  - Model Selection
  - Chat Mode Auswahl
  - Tool Configuration

---

## 2. Agent Mode Konfiguration

### Agent Mode Features

Agent Mode ist ein autonomer Pair-Programmer, der:

- Multi-Step Coding Tasks ausführt
- Terminal Commands ausführt
- Fehler erkennt und automatisch behebt
- Code über mehrere Dateien hinweg refactored

### Aktivierung und Nutzung

```markdown
1. Öffne Copilot Chat (Ctrl+Alt+I)
2. Wähle "Agent" aus dem Mode-Dropdown
3. Konfiguriere Tools über das 🔧 Icon:
   - web_search
   - file_operations
   - terminal_commands
   - context7 (nach Installation)
```

### Best Practices für Agent Mode

```typescript
/**
 * @agent-task Implementiere ein vollständiges Auth-System
 * @context Nuxt 3 mit Supabase Backend
 * @requirements
 * - JWT-basierte Authentifizierung
 * - Middleware für protected routes
 * - Composables für auth state
 * - Login/Register Komponenten mit @nuxt/ui
 *
 * Agent: Erstelle die komplette Struktur und implementiere alle Features
 */
```

---

## 3. Context7 Integration

### Was ist Context7?

Context7 ist ein Model Context Protocol (MCP) Server, der aktuelle Dokumentationen direkt in Copilot integriert. Statt auf veraltete Trainingsdaten zurückzugreifen, erhält Copilot Zugriff auf die neuesten Docs.

### Installation

```bash
# Context7 MCP Server installieren
npx -y @upstash/context7-mcp@latest
```

### VS Code Konfiguration

Füge zu deiner VS Code `settings.json` hinzu:

```json
{
  "mcp": {
    "servers": {
      "context7": {
        "command": "npx",
        "args": ["-y", "@upstash/context7-mcp"]
      }
    }
  }
}
```

### Nutzung in Prompts

```markdown
# Einfache Nutzung - füge "use context7" ans Ende deines Prompts

"Erstelle eine Nuxt 3 Middleware für JWT Validierung use context7"

# Spezifische Library angeben

"Implementiere Supabase Auth mit Nuxt. use library /supabase/supabase"

# Automatische Aktivierung via .copilotignore

[[calls]]
match = "when the user requests Nuxt, Vue, or any package documentation"
tool = "context7"
```

---

## 4. Projektstruktur für maximale Copilot-Effizienz

### Empfohlene Nuxt 3 Projektstruktur

```bash
project-root/
├── .copilot/                      # Copilot-spezifische Konfiguration
│   ├── project-context.md         # Globaler Projekt-Kontext
│   ├── conventions.md             # Coding Standards & Konventionen
│   ├── tech-stack.md              # Detaillierte Tech-Stack Docs
│   └── prompts/                   # Wiederverwendbare Prompts
│       ├── component-creation.prompt.md
│       ├── api-endpoint.prompt.md
│       └── testing.prompt.md
├── .github/
│   ├── copilot-instructions.md   # Custom Instructions für Team
│   └── prompts/                   # Shared Team Prompts
├── apps/                          # PNPM Workspace Apps
│   ├── web/                       # Haupt-Nuxt-App
│   └── admin/                     # Admin-Panel
├── packages/                      # Shared Packages
│   ├── ui/                        # Gemeinsame UI-Komponenten
│   ├── utils/                     # Utility Functions
│   └── types/                     # TypeScript Types
├── pnpm-workspace.yaml
└── README.md
```

### Project Context Datei (.copilot/project-context.md)

```markdown
# Projekt: [Projektname]

## Übersicht

Dies ist eine Nuxt 3 Anwendung mit Vue 3 Composition API, entwickelt als PNPM Monorepo.

## Tech Stack

- **Frontend Framework**: Nuxt 3.x mit Vue 3.5
- **Package Manager**: PNPM 9.x (Workspace-basiert)
- **Styling**: Tailwind CSS v4 mit @nuxtjs/tailwindcss
- **UI Library**: @nuxt/ui (Nuxt UI v3)
- **State Management**: Pinia (via @pinia/nuxt)
- **Animations**: @vueuse/motion
- **Sound**: @vueuse/sound
- **Flow Diagrams**: vue-flow
- **Backend**: Supabase (@nuxtjs/supabase)
- **Testing**: Vitest + @nuxt/test-utils
- **Linting**: ESLint mit @nuxt/eslint

## Architektur-Prinzipien

1. **Composition API First**: Verwende `<script setup>` in allen Komponenten
2. **TypeScript Everywhere**: Vollständige Type-Safety
3. **Component-Driven**: Atomic Design Prinzipien
4. **Server-First**: SSR/ISR wo möglich, SPA nur wenn nötig
5. **Performance**: Code-Splitting, Lazy Loading, Image Optimization

## Coding Konventionen

- Komponenten: PascalCase (UserProfile.vue)
- Composables: camelCase mit 'use' prefix (useAuth.ts)
- Utilities: camelCase (formatDate.ts)
- API Routes: kebab-case (/api/user-profile)
- Stores: camelCase mit 'Store' suffix (userStore.ts)

## Ordnerstruktur-Konventionen

- /components: Wiederverwendbare UI-Komponenten
- /composables: Vue Composables und Hooks
- /pages: Nuxt File-based Routing
- /server/api: Nitro API Routes
- /stores: Pinia Stores
- /utils: Helper Functions
- /types: TypeScript Definitionen
```

### Tech Stack Dokumentation (.copilot/tech-stack.md)

````markdown
# Tech Stack Details

## Nuxt 3 Konfiguration

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxt/eslint",
  ],

  ui: {
    global: true,
    icons: ["heroicons", "lucide"],
  },

  css: ["~/assets/css/main.css"],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/dashboard",
      exclude: ["/", "/auth/*"],
    },
  },
});
```
````

## Paket-Spezifische Nutzung

### @nuxt/ui v3

- Verwendet Reka UI + Tailwind CSS
- Komponenten: UButton, UCard, UModal, UForm
- Theming via app.config.ts

### @vueuse/motion

```vue
<template>
  <div v-motion-slide-in-from-bottom>Animated Content</div>
</template>
```

### vue-flow

```vue
<script setup>
import { VueFlow } from "@vue-flow/core";
import "@vue-flow/core/dist/style.css";
</script>
```

### Supabase Integration

```typescript
// composables/useSupabase.ts
export const useSupabase = () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  return { client, user };
};
```

````

---

## 5. Copilot-optimierte Entwicklungsworkflows

### Daily Workflow für Solo-Entwickler

#### Morgen-Routine (10 min)

```markdown
## Tagesplanung mit Copilot

1. Öffne `.copilot/daily-log.md`
2. Frage Copilot im Agent Mode:
   "Analysiere meine gestrigen Commits und TODOs. Was sollte heute priorisiert werden?"

3. Erstelle Tagesplan:
````

## [Datum] - Tagesziele

### Priorität 1: Feature X

- [ ] Component struktur planen
- [ ] API endpoint implementieren
- [ ] Tests schreiben

### Priorität 2: Bug Fixes

- [ ] Issue #123 beheben
- [ ] Performance-Optimierung Dashboard

### Context für Copilot:

- Fokus auf User Auth Flow
- Verwende Supabase RLS
- Mobile-First Design

```

```

#### Feature Development Workflow

```markdown
## Neues Feature: User Dashboard

### 1. Planning Phase (Agent Mode)

"Plane die Implementierung eines User Dashboards für unsere Nuxt App.
Analysiere die bestehende Projektstruktur und schlage eine Komponenten-Hierarchie vor.
Berücksichtige: Mobile-First, @nuxt/ui components, Supabase data fetching.
use context7"

### 2. Implementation Phase

"Implementiere das geplante Dashboard. Beginne mit:

1. Page Component unter /pages/dashboard/index.vue
2. Layout unter /layouts/dashboard.vue
3. Komponenten unter /components/dashboard/
4. Composables für data fetching
5. Pinia store für dashboard state
   Nutze @nuxt/ui und Tailwind für styling. use context7"

### 3. Testing Phase

"Schreibe Tests für alle Dashboard-Komponenten mit Vitest.
Teste: Rendering, User Interactions, Data Loading States, Error Handling"
```

### Prompt Templates für häufige Aufgaben

#### Component Creation (.github/prompts/component-creation.prompt.md)

````markdown
# Vue Component Creation Template

Erstelle eine neue Vue-Komponente mit folgenden Spezifikationen:

## Component Name: #[ComponentName]

## Anforderungen:

- Nuxt 3 / Vue 3 Composition API mit <script setup>
- TypeScript mit vollständigen Types
- Props validation mit TypeScript interfaces
- Emits mit proper typing
- @nuxt/ui für Base-Components
- Tailwind CSS für Styling
- Responsive Design (Mobile-First)
- Accessibility (ARIA labels, keyboard navigation)
- Loading und Error States

## Props:

#[Props Liste]

## Events:

#[Events Liste]

## Composables zu verwenden:

- useNuxtData() für SSR-safe data fetching
- useAsyncData() für async operations
- #[Weitere Composables]

## Beispiel-Usage:

```vue
<template>
  <ComponentName :prop1="value" @event="handler" />
</template>
```
````

Implementiere die Komponente vollständig mit allen Best Practices.
use context7 für aktuelle Nuxt/Vue Dokumentation.

````

#### API Route Creation (.github/prompts/api-endpoint.prompt.md)

```markdown
# Nitro API Route Template

Erstelle eine neue API Route für Nuxt 3:

## Endpoint: /api/#[endpoint-path]
## Method: #[GET|POST|PUT|DELETE|PATCH]

## Funktionalität:
#[Beschreibung der Funktionalität]

## Requirements:
- Nitro Server Engine kompatibel
- TypeScript mit proper typing
- Zod für request/response validation
- Supabase integration wo nötig
- Error handling mit proper HTTP status codes
- Rate limiting mit Redis/Upstash
- CORS configuration
- Authentication check via JWT

## Request Schema:
```typescript
#[Request Type Definition]
````

## Response Schema:

```typescript
#[Response Type Definition]
```

## Security:

- [ ] Input validation
- [ ] SQL injection prevention (wenn DB-Zugriff)
- [ ] Rate limiting
- [ ] Authentication required: #[yes/no]
- [ ] Authorization: #[role-based/owner-only/public]

Implementiere mit Best Practices und use context7.

````

### Wiederverwendbare Snippets

#### Nuxt Page mit Data Fetching

```vue
<!-- copilot: erstelle eine Nuxt page mit SSR data fetching, error handling, loading states
     verwende useAsyncData, definiere proper TypeScript types,
     implementiere SEO meta tags mit useSeoMeta -->
````

#### Pinia Store

```typescript
// copilot: erstelle einen typsicheren Pinia store für [Feature]
// verwende Setup-Store syntax, implementiere actions für CRUD operations,
// nutze Supabase für persistence, handle loading und error states
```

#### Composable mit Auto-Refresh

```typescript
// copilot: erstelle einen composable der Daten von Supabase fetched
// implementiere auto-refresh alle 30 sekunden, websocket subscriptions,
// optimistic updates, und proper TypeScript typing
```

---

## 6. Tech-Stack spezifische Anweisungen

### PNPM Workspace Management

```markdown
## PNPM Workspace Commands für Copilot

# Neues Package erstellen

"Erstelle ein neues shared UI package unter packages/ui mit:

- Vite als Build-Tool
- Vue 3 component library setup
- TypeScript konfiguration
- Export configuration für Nuxt auto-import"

# Workspace Dependencies

"Füge @workspace:ui als dependency zu apps/web hinzu und konfiguriere auto-imports"
```

### Nuxt-spezifische Patterns

#### Auto-Imports Configuration

```typescript
// copilot: konfiguriere Nuxt auto-imports für unser UI package
// nuxt.config.ts
export default defineNuxtConfig({
  imports: {
    dirs: ["stores", "composables/*/index.{ts,js,mjs,mts}"],
  },
  components: [
    { path: "~/components", pathPrefix: false },
    { path: "~/packages/ui/components", prefix: "UI", pathPrefix: false },
  ],
});
```

#### Server-Side Composables

```typescript
// copilot: erstelle einen server-only composable für Supabase Admin operations
// nutze useStorage() für caching, implementiere proper error boundaries
```

### Tailwind CSS mit @nuxt/ui

```vue
<!-- copilot: style diese Komponente mit Tailwind CSS
     - verwende @nuxt/ui color conventions (primary, gray)
     - implementiere dark mode support via color-mode
     - nutze Tailwind v4 features wo möglich
     - responsive breakpoints: sm, md, lg, xl -->
```

### VueUse Integration

```typescript
// copilot: implementiere diese Features mit @vueuse:
// - useIntersectionObserver für lazy loading
// - useVirtualList für performance
// - useDebounce für search input
// - useLocalStorage mit encryption
```

### Supabase Best Practices

```typescript
// copilot: implementiere Supabase RLS policies für diese Tabelle
// erstelle matching TypeScript types aus der DB-Struktur
// implementiere einen composable mit optimistic updates
// füge real-time subscriptions hinzu
```

---

## 7. Praktische Implementierung

### Schritt-für-Schritt Projekt-Setup

#### Phase 1: Projekt Initialisierung

```bash
# Terminal Commands für Copilot Agent Mode
"Initialisiere ein neues Nuxt 3 Projekt mit PNPM workspace:
1. Erstelle Monorepo-Struktur
2. Installiere alle dependencies aus unserem tech-stack
3. Konfiguriere TypeScript, ESLint, und Prettier
4. Setup Git mit .gitignore
Führe alle Commands aus und zeige mir den Fortschritt"
```

#### Phase 2: Basis-Konfiguration

```markdown
"Konfiguriere das Nuxt-Projekt vollständig:

1. Erstelle nuxt.config.ts mit allen unseren Modulen
2. Setup Tailwind CSS mit custom theme
3. Konfiguriere Supabase mit environment variables
4. Erstelle app.config.ts für UI theming
5. Setup error.vue und app.vue
   use context7 für aktuelle Konfigurationen"
```

#### Phase 3: Core Features

```markdown
"Implementiere die Core Features unserer App:

1. Authentication System:

   - Login/Register Pages mit @nuxt/ui forms
   - Middleware für protected routes
   - User store mit Pinia
   - Supabase auth integration

2. Layout System:

   - Default layout mit Navigation
   - Dashboard layout für authenticated users
   - Mobile-responsive mit @vueuse/core

3. Component Library:
   - Erstelle base components in packages/ui
   - Implementiere Storybook-ähnliche Dokumentation
   - Setup auto-imports

Nutze Agent Mode für die vollständige Implementierung"
```

### Debugging & Optimization Workflow

```markdown
## Performance Optimierung mit Copilot

"Analysiere die Performance unserer Nuxt App:

1. Führe Lighthouse audit aus
2. Identifiziere Bottlenecks
3. Implementiere Optimierungen:
   - Image lazy loading mit @nuxt/image
   - Component code-splitting
   - Route prefetching
   - Bundle size optimization
4. Messe Verbesserungen
   use context7 für Best Practices"
```

### Testing Strategy

```markdown
## Comprehensive Testing Setup

"Erstelle eine vollständige Test-Suite:

1. Unit Tests mit Vitest für alle Komponenten
2. Integration Tests für API routes
3. E2E Tests mit Playwright für kritische User Flows
4. Setup CI/CD pipeline mit GitHub Actions
   Verwende @nuxt/test-utils und befolge Best Practices"
```

---

## 📚 Zusätzliche Ressourcen

### Wichtige Keyboard Shortcuts

- `Ctrl+I`: Inline Chat starten
- `Ctrl+Alt+I`: Chat View öffnen
- `Tab`: Suggestion akzeptieren
- `Alt+]`: Nächste Suggestion
- `Alt+[`: Vorherige Suggestion
- `Shift+Ctrl+I`: Agent Mode aktivieren

### Model Context Protocol (MCP) Erweiterungen

- Context7: Aktuelle Dokumentationen
- GitHub MCP: Repository Integration
- Obsidian MCP: Knowledge Base
- Figma MCP: Design Integration

### Monitoring & Maintenance

- Regelmäßige Context-Updates in .copilot/
- Prompt-Performance tracking
- Model-Updates beobachten (GPT-4o, Claude Sonnet)
- Community Best Practices verfolgen

### Troubleshooting

- Cache leeren: "Copilot: Clear Cache"
- Neustart bei Problemen
- Context7 manuell triggern mit "use context7"
- Fallback auf Web-Search mit #fetch URLs
