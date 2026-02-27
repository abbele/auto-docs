"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useWorkshopResponses } from "../lib/useWorkshopResponses";
import { useWorkshopQuestions } from "../lib/useWorkshopQuestions";

const ACCENT = "#007ACC";
const BG_DARK = "#1E1E1E";
const BG_SIDEBAR = "#252526";
const BG_EDITOR = "#1E1E1E";
const BG_TAB_ACTIVE = "#1E1E1E";
const BG_TAB_INACTIVE = "#2D2D2D";
const BG_TITLEBAR = "#323233";
const BG_STATUSBAR = "#007ACC";
const BG_TERMINAL = "#1E1E1E";
const TEXT_PRIMARY = "#D4D4D4";
const TEXT_MUTED = "#808080";
const TEXT_SIDEBAR = "#CCCCCC";
const BORDER_COLOR = "#3C3C3C";
const LINE_HIGHLIGHT = "#2A2D2E";
const YELLOW = "#DCDCAA";
const BLUE = "#569CD6";
const GREEN = "#6A9955";
const ORANGE = "#CE9178";
const PURPLE = "#C586C0";
const CYAN = "#4EC9B0";
const LIGHT_BLUE = "#9CDCFE";
const WHITE = "#D4D4D4";
const COMMENT_COLOR = "#6A9955";
const PINK = "#C586C0";

const slides = [
  {
    id: "Welcome",
    folder: "workshop",
    title: "Welcome",
    icon: "md",
    content: {
      type: "welcome",
      lines: [],
    },
  },
  {
    id: "00_intro.md",
    folder: "workshop",
    title: "Intro",
    icon: "md",
    content: {
      type: "markdown",
      lines: [
        { type: "heading1", text: "# Workshop: Documentation-as-Code" },
        { type: "heading2", text: "## & AI Context Engineering" },
        { type: "blank", text: "" },
        { type: "quote", text: "> Dallo scripting manuale alla documentazione self-aware." },
        { type: "blank", text: "" },
        { type: "line", text: "---" },
        { type: "blank", text: "" },
        { type: "bullet", text: "- Doc minima, inesistente o che mente: affrontiamola" },
        { type: "bullet", text: "- Un flusso replicabile su qualsiasi stack" },
        { type: "bullet", text: "- Zero cerimonie, zero meeting in più" },
        { type: "bullet", text: "- Massima resa, minimo overhead" },
        { type: "blank", text: "" },
        { type: "comment", text: "<!-- Non stiamo aggiungendo burocrazia. Stiamo togliendo i problemi che ritroveremo al prossimo cambio team. -->" },
      ],
    },
  },
  {
    id: "01_debito.md",
    folder: "workshop",
    title: "Il Debito",
    icon: "md",
    content: {
      type: "markdown",
      lines: [
        { type: "heading1", text: "# Il debito più democratico" },
        { type: "blank", text: "" },
        { type: "text", text: "Colpisce tutti, senza eccezioni:" },
        { type: "bullet", text: "- dal progetto **Django fatto in fretta** tre anni fa" },
        { type: "bullet", text: "- al progettone **Nuxt 2 pieno di hotfix**" },
        { type: "blank", text: "" },
        { type: "text", text: "Il codice corre per soddisfare i client." },
        { type: "bold", text: "**La documentazione resta ferma per mancanza di tempo.**" },
        { type: "blank", text: "" },
        { type: "line", text: "---" },
        { type: "blank", text: "" },
        { type: "text", text: "Dopo un po' di tempo, il README è inutile o obsoleto." },
        { type: "text", text: "Un documento obsoleto non è solo inutile:" },
        { type: "bold", text: "**è pericoloso, perché genera call, rallenta e fa prendere decisioni sbagliate.**" },
        { type: "blank", text: "" },
        { type: "text", text: "Ruotano i team, cambiano i PM:" },
        { type: "italic", text: "_la codebase diventa una lingua dimenticata._" },
        { type: "blank", text: "" },
        { type: "comment", text: "<!-- Quante call avete fatto nell'ultimo mese che si potevano evitare con un file aggiornato? -->" },
        { type: "comment", text: "<!-- Quante ore e salute costa un onboarding oggi su un nostro progetto? -->" },
      ],
    },
  },
  {
    id: "02_regole.md",
    folder: "workshop",
    title: "Come",
    icon: "md",
    content: {
      type: "markdown",
      lines: [
        { type: "heading1", text: "# Come funziona questo workshop" },
        { type: "blank", text: "" },
        { type: "text", text: "Non ho risposte. Ho domande e un ambiente per testarle." },
        { type: "blank", text: "" },
        { type: "heading2", text: "## Cosa ci serve:" },
        { type: "bullet", text: "- Documentazione **automatica**, non manuale" },
        { type: "bullet", text: "- **Resiliente**: si aggiorna quando cambia il codice" },
        { type: "bullet", text: "- **Minimo intervento umano**" },
        { type: "blank", text: "" },
        { type: "comment", text: "<!-- Quanto minimo è 'minimo intervento'? -->" },
        { type: "comment", text: "<!-- Ci fidiamo di quello che genera? -->" },
        { type: "comment", text: "<!-- Quanto ci costa mantenerlo rispetto a scrivere la doc a mano? -->" },
        { type: "blank", text: "" },
        { type: "line", text: "---" },
        { type: "blank", text: "" },
        { type: "text", text: "Un sistema automatico va comunque mantenuto." },
        { type: "text", text: "E dobbiamo capire se fa davvero quello che promette." },
        { type: "blank", text: "" },
        { type: "italic", text: "_Il rischio concreto:_" },
        { type: "text", text: "\"nessuno scrive la doc\" → \"nessuno mantiene il sistema che la genera\"." },
        { type: "blank", text: "" },
        { type: "bold", text: "**Stiamo risolvendo il problema o stiamo creando un nuovo debito?**" },
        { type: "blank", text: "" },
        { type: "comment", text: "<!-- Manifesto #2: se non serve a niente, non serve nemmeno a noi. -->" },
        { type: "text", text: "Prima di costruire qualsiasi cosa, dobbiamo capire alcune cose." },
      ],
    },
  },
  {
    id: "03_per_chi.md",
    folder: "domande",
    title: "Per Chi?",
    icon: "md",
    content: {
      type: "markdown",
      lines: [
        { type: "heading1", text: "# Domanda 1: Per chi documentiamo?" },
        { type: "blank", text: "" },
        { type: "text", text: "Tre destinatari con esigenze in tensione tra loro:" },
        { type: "blank", text: "" },
        { type: "heading3", text: "### 🤖 Agenti AI" },
        { type: "text", text: "AGENTS.md per non generare allucinazioni sui pattern custom." },
        { type: "text", text: "Un LLM senza contesto ci suggerirà errori camuffati da soluzioni." },
        { type: "comment", text: "<!-- Quanti token di contesto sprechiamo perché l'agente non sa come lavoriamo? -->" },
        { type: "blank", text: "" },
        { type: "heading3", text: "### 👥 Colleghi" },
        { type: "text", text: "Abbattere il Bus Factor. Stop al reverse engineering da zero." },
        { type: "text", text: "Permettere cambi di progetto indolori, senza settimane di ramp-up." },
        { type: "comment", text: "<!-- Quante ore e salute costa un onboarding oggi su un nostro progetto? -->" },
        { type: "blank", text: "" },
        { type: "heading3", text: "### 📊 PM ed Esterni" },
        { type: "text", text: "Architettura tecnica leggibile per prendere decisioni di business." },
        { type: "comment", text: "<!-- Quante call servono a un PM per capire cosa può promettere al cliente? -->" },
        { type: "blank", text: "" },
        { type: "line", text: "---" },
        { type: "blank", text: "" },
        { type: "italic", text: "_Un file AGENTS.md per un LLM è radicalmente diverso da una doc per un PM._" },
        { type: "text", text: "Un contesto ben scritto risparmia token e riduce le allucinazioni." },
        { type: "text", text: "Un contesto scritto male li moltiplica entrambi." },
        { type: "blank", text: "" },
        { type: "bold", text: "**Quale destinatario ha la priorità reale?**" },
      ],
    },
  },
  {
    id: "04_codice.md",
    folder: "domande",
    title: "Il Codice",
    icon: "md",
    content: {
      type: "markdown",
      lines: [
        { type: "heading1", text: "# Domanda 2: Dobbiamo cambiare il modo in cui scriviamo?" },
        { type: "blank", text: "" },
        { type: "text", text: "L'automazione richiede standard. Ma a che prezzo?" },
        { type: "blank", text: "" },
        { type: "bullet", text: "- Ha senso imporre **Type Hinting rigoroso** su un micro-progetto di 3 mesi?" },
        { type: "bullet", text: "- Codice **\"veloce\"** vs codice **\"parser-friendly\"**: chi paga la differenza?" },
        { type: "bullet", text: "- Se avessimo scritto diversamente dall'inizio, **ci sarebbe servito oggi**?" },
        { type: "blank", text: "" },
        { type: "comment", text: "<!-- Dobbiamo cambiare il modo in cui scriviamo, o basta cambiare cosa succede dopo? -->" },
        { type: "comment", text: "<!-- Type Hinting rigoroso su tutto: investimento o spreco? -->" },
        { type: "comment", text: "<!-- Quanto tempo in più costa scrivere bene ora vs quanto ne perdiamo dopo? -->" },
        { type: "comment", text: "<!-- Chi decide lo standard, e su quale progetto? È l'occasione per definirlo? -->" },
        { type: "blank", text: "" },
        { type: "line", text: "---" },
        { type: "blank", text: "" },
        { type: "quote", text: "> Se non troviamo un punto di equilibrio" },
        { type: "quote", text: "> tra pragmatismo e rigore," },
        { type: "quote", text: "> torneremo al punto di partenza." },
        { type: "blank", text: "" },
        { type: "comment", text: "<!-- Ha senso avere un flusso, o stiamo risolvendo un problema che non tutti sentono? -->" },
        { type: "comment", text: "<!-- Manifesto #5: il fine guida, non i mezzi. Ma sperimentare ci piace. -->" },
      ],
    },
  },
  {
    id: "05_umani_parser.md",
    folder: "domande",
    title: "Umani vs Parser",
    icon: "md",
    content: {
      type: "markdown",
      lines: [
        { type: "heading1", text: "# Domande 3 & 4" },
        { type: "blank", text: "" },
        { type: "heading2", text: "## Per chi commentiamo?" },
        { type: "blank", text: "" },
        { type: "text", text: "Quando scriviamo un JSDoc o una docstring," },
        { type: "text", text: "per chi lo stiamo facendo?" },
        { type: "blank", text: "" },
        { type: "bullet", text: "- Per **noi del futuro**, che tra 6 mesi non ricorderemo perché" },
        { type: "bullet", text: "- Per **velocizzare la scrittura**: autocompletamento, tooltip, IDE" },
        { type: "bullet", text: "- Per **l'agente AI** che legge il contesto e ci suggerisce codice" },
        { type: "blank", text: "" },
        { type: "text", text: "Quando la risposta cambia, cambia il formato." },
        { type: "italic", text: "_Esiste un unico commento che soddisfi tutte e tre le esigenze?_" },
        { type: "comment", text: "<!-- Per chi commentiamo davvero? -->" },
        { type: "blank", text: "" },
        { type: "heading2", text: "## Dove vive la verità?" },
        { type: "blank", text: "" },
        { type: "text", text: "File `.md` nella repo — versionata col codice — o entità esterna?" },
        { type: "comment", text: "<!-- Chi se ne accorge quando doc e codice divergono? -->" },
        { type: "comment", text: "<!-- Dentro la repo o fuori? -->" },
        { type: "blank", text: "" },
        { type: "bold", text: "**Come garantiamo che la doc resti allineata**" },
        { type: "bold", text: "**con ogni push su GitLab?**" },
      ],
    },
  },
  {
    id: "06_limite_ai.py",
    folder: "problemi",
    title: "Limite AI",
    icon: "py",
    content: {
      type: "code",
      language: "python",
      lines: [
        { tokens: [{ text: "# L'AI legge la diff, ma non il contesto.", color: COMMENT_COLOR }] },
        { tokens: [{ text: "# La diff cattura il COSA. Non cattura mai il PERCHÉ.", color: COMMENT_COLOR }] },
        { tokens: [] },
        { tokens: [{ text: "class", color: BLUE }, { text: " DiffAnalysis", color: CYAN }, { text: ":", color: WHITE }] },
        { tokens: [{ text: '    """', color: ORANGE }] },
        { tokens: [{ text: "    La diff dice COSA è cambiato.", color: ORANGE }] },
        { tokens: [{ text: "    Non dice mai PERCHÉ.", color: ORANGE }] },
        { tokens: [{ text: "    Il contesto è nella testa del dev — e non ci resta a lungo.", color: ORANGE }] },
        { tokens: [{ text: '    """', color: ORANGE }] },
        { tokens: [] },
        { tokens: [{ text: "    ", color: WHITE }, { text: "# Backend: spostata validazione dal serializer al middleware custom", color: COMMENT_COLOR }] },
        { tokens: [{ text: "    what_changed", color: LIGHT_BLUE }, { text: " = ", color: WHITE }, { text: '"validation → middleware"', color: ORANGE }] },
        { tokens: [{ text: "    why_changed", color: LIGHT_BLUE }, { text: "  = ", color: WHITE }, { text: "None", color: BLUE }, { text: "  ", color: WHITE }, { text: "# Performance? Bug? Richiesta cliente?", color: COMMENT_COLOR }] },
        { tokens: [] },
        { tokens: [{ text: "    ", color: WHITE }, { text: "# Frontend: rimosso Pinia, usato composable nativo + caching custom", color: COMMENT_COLOR }] },
        { tokens: [{ text: "    what_changed", color: LIGHT_BLUE }, { text: " = ", color: WHITE }, { text: '"pinia → composable nativo"', color: ORANGE }] },
        { tokens: [{ text: "    why_changed", color: LIGHT_BLUE }, { text: "  = ", color: WHITE }, { text: "None", color: BLUE }, { text: "  ", color: WHITE }, { text: "# Bug SSR? Bundle size? Preferenza personale?", color: COMMENT_COLOR }] },
        { tokens: [] },
        { tokens: [] },
        { tokens: [{ text: "# Tra 6 mesi qualcuno reintrodurrà Pinia,", color: COMMENT_COLOR }] },
        { tokens: [{ text: "# convinto di 'migliorare' il codice.", color: COMMENT_COLOR }] },
        { tokens: [{ text: "# Romperà tutto di nuovo. La diff non lo fermerà.", color: COMMENT_COLOR }] },
        { tokens: [{ text: "# Solo il 'perché' documentato nel momento giusto può farlo.", color: COMMENT_COLOR }] },
      ],
    },
  },
  {
    id: "07_human_loop.ts",
    folder: "problemi",
    title: "Human Loop",
    icon: "ts",
    content: {
      type: "code",
      language: "typescript",
      lines: [
        { tokens: [{ text: "// L'umano nel loop — senza impazzire", color: COMMENT_COLOR }] },
        { tokens: [{ text: "// Il problema: l'AI documenta il COSA ma non il PERCHÉ.", color: COMMENT_COLOR }] },
        { tokens: [{ text: "// Il PERCHÉ sta nella testa del dev. E ci resta poco.", color: COMMENT_COLOR }] },
        { tokens: [{ text: "// Serve un modo per catturarlo nel momento giusto.", color: COMMENT_COLOR }] },
        { tokens: [] },
        { tokens: [{ text: "// Un'ipotesi: dare contesto strutturato a ogni push.", color: COMMENT_COLOR }] },
        { tokens: [{ text: "// Non per controllo. Non per uniformare. Solo per dare contesto.", color: COMMENT_COLOR }] },
        { tokens: [] },
        { tokens: [{ text: "interface", color: BLUE }, { text: " PushContext", color: CYAN }, { text: " {", color: WHITE }] },
        { tokens: [] },
        { tokens: [{ text: "  ", color: WHITE }, { text: "// Pre-compilato dall'AI leggendo la diff", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  ", color: WHITE }, { text: "// Il dev conferma o corregge in 10 secondi", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  cosa_cambia", color: LIGHT_BLUE }, { text: ": ", color: WHITE }, { text: "string", color: CYAN }, { text: ";", color: WHITE }, { text: '  // "Tolto Pinia, useState con caching custom"', color: COMMENT_COLOR }] },
        { tokens: [] },
        { tokens: [{ text: "  ", color: WHITE }, { text: "// Scritto dal dev — UNA riga", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  ", color: WHITE }, { text: "// È l'unica cosa che la diff non può dire da sola", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  perche_cambia", color: LIGHT_BLUE }, { text: ": ", color: WHITE }, { text: "string", color: CYAN }, { text: ";", color: WHITE }, { text: '  // "Pinia rompeva idratazione SSR su Nuxt 3"', color: COMMENT_COLOR }] },
        { tokens: [] },
        { tokens: [{ text: "  ", color: WHITE }, { text: "// Il campo che nessuno compila — ma vale oro tra 6 mesi", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  ", color: WHITE }, { text: "// Senza questo, qualcuno reintrodurrà Pinia e romperà tutto", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  cosa_si_rompe", color: LIGHT_BLUE }, { text: ": ", color: WHITE }, { text: "string", color: CYAN }, { text: ";", color: WHITE }, { text: '  // "SSR hydration mismatch su pagine con auth"', color: COMMENT_COLOR }] },
        { tokens: [] },
        { tokens: [{ text: "}", color: WHITE }] },
        { tokens: [] },
        { tokens: [{ text: "// Oggi non lo facciamo.", color: COMMENT_COLOR }] },
        { tokens: [{ text: "// La domanda è: ha senso iniziare?", color: COMMENT_COLOR }] },
        { tokens: [{ text: "// E se sì, è questo il formato giusto?", color: COMMENT_COLOR }] },
        { tokens: [] },
        { tokens: [{ text: "// Il contesto serve all'AI per generare doc che abbia senso.", color: COMMENT_COLOR }] },
        { tokens: [{ text: "// Senza, produce solo un riassunto della diff.", color: COMMENT_COLOR }] },
        { tokens: [{ text: "// E un riassunto della diff lo sappiamo già leggere da soli.", color: COMMENT_COLOR }] },
        { tokens: [] },
        { tokens: [{ text: "// E quando la modifica è strutturale —", color: COMMENT_COLOR }] },
        { tokens: [{ text: "// cambia pattern, sposta responsabilità tra servizi —", color: COMMENT_COLOR }] },
        { tokens: [{ text: "// una riga basta? O ci serve un ADR dedicato?", color: COMMENT_COLOR }] },
        { tokens: [{ text: "// Chi lo scrive? L'AI genera il draft, il dev lo completa?", color: COMMENT_COLOR }] },
        { tokens: [] },
        { tokens: [{ text: "// Chi è il referente del contesto? Chi si accorge se smette di funzionare?", color: COMMENT_COLOR }] },
      ],
    },
  },
  {
    id: "08_approcci.yml",
    folder: "config",
    title: "Approcci",
    icon: "yml",
    content: {
      type: "code",
      language: "yaml",
      lines: [
        { tokens: [{ text: "# workshop-toolkit.yml", color: COMMENT_COLOR }] },
        { tokens: [{ text: "# L'approccio core è il 2: AI che genera doc dal contesto.", color: COMMENT_COLOR }] },
        { tokens: [{ text: "# Il 1 e il 3 esistono per capire se migliorano il 2.", color: COMMENT_COLOR }] },
        { tokens: [{ text: "# Manifesto #1: non dobbiamo fare tutti tutto. Focus sul core.", color: COMMENT_COLOR }] },
        { tokens: [] },
        { tokens: [{ text: "monorepo", color: LIGHT_BLUE }, { text: ":", color: WHITE }] },
        { tokens: [{ text: "  backend", color: LIGHT_BLUE }, { text: ":  ", color: WHITE }, { text: "API Django (Python)", color: ORANGE }] },
        { tokens: [{ text: "  frontend", color: LIGHT_BLUE }, { text: ": ", color: WHITE }, { text: "App Astro/Nuxt (JS/TS)", color: ORANGE }] },
        { tokens: [{ text: "  docs", color: LIGHT_BLUE }, { text: ":     ", color: WHITE }, { text: "./docs/*.md", color: ORANGE }] },
        { tokens: [] },
        { tokens: [{ text: "core", color: CYAN }, { text: ":", color: WHITE }, { text: "  # Contesto & Intelligenza — AI Shadow", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  - ", color: WHITE }, { text: "CodiumAI / CodeRabbit", color: ORANGE }, { text: " ", color: WHITE }, { text: "# MR template + auto-summary", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  - ", color: WHITE }, { text: "CodeWiki.ai", color: ORANGE }, { text: "         ", color: WHITE }, { text: "# codebase interrogabile", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  - ", color: WHITE }, { text: "LLM custom scripts", color: ORANGE }, { text: "   ", color: WHITE }, { text: "# genera AGENTS.md", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  note", color: LIGHT_BLUE }, { text: ": ", color: WHITE }, { text: '"questo è il flusso. il resto è a supporto."', color: ORANGE }] },
        { tokens: [] },
        { tokens: [{ text: "supporto_a", color: CYAN }, { text: ":", color: WHITE }, { text: "  # Estrazione Passiva — migliora l'input al core?", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  - ", color: WHITE }, { text: "pydoc-markdown", color: ORANGE }, { text: "    ", color: WHITE }, { text: "# Django docstrings → .md", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  - ", color: WHITE }, { text: "TypeDoc", color: ORANGE }, { text: "           ", color: WHITE }, { text: "# TS interfaces → docs", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  domanda", color: LIGHT_BLUE }, { text: ": ", color: WHITE }, { text: '"se diamo all AI anche i metadati statici, genera doc migliore?"', color: ORANGE }] },
        { tokens: [] },
        { tokens: [{ text: "supporto_b", color: CYAN }, { text: ":", color: WHITE }, { text: "  # Governance — protegge l'output del core?", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  - ", color: WHITE }, { text: "Lefthook", color: ORANGE }, { text: "            ", color: WHITE }, { text: "# pre-push hooks", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  - ", color: WHITE }, { text: "Danger (GitLab)", color: ORANGE }, { text: "     ", color: WHITE }, { text: "# commenta MR automaticamente", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  - ", color: WHITE }, { text: "Vale", color: ORANGE }, { text: "                ", color: WHITE }, { text: "# prose linter per .md", color: COMMENT_COLOR }] },
        { tokens: [{ text: "  domanda", color: LIGHT_BLUE }, { text: ": ", color: WHITE }, { text: '"senza governance la doc generata degrada? quanto velocemente?"', color: ORANGE }] },
        { tokens: [] },
        { tokens: [{ text: "# Manifesto #5: il fine guida, non i mezzi. Ma sperimentare ci piace.", color: COMMENT_COLOR }] },
        { tokens: [{ text: "# I tool sono candidati. Nessuno è confermato.", color: COMMENT_COLOR }] },
        { tokens: [{ text: "#", color: COMMENT_COLOR }] },
        { tokens: [{ text: "# deliverable:", color: COMMENT_COLOR }] },
        { tokens: [{ text: "#   pipeline AI-driven, indipendente dallo stack", color: COMMENT_COLOR }] },
        { tokens: [{ text: "#   + capire se static analysis e governance la rendono migliore", color: COMMENT_COLOR }] },
        { tokens: [{ text: "#   o se sono overhead che non vale la pena mantenere", color: COMMENT_COLOR }] },
      ],
    },
  },
  {
    id: "09_obiettivo.md",
    folder: "config",
    title: "Obiettivo",
    icon: "md",
    content: {
      type: "markdown",
      lines: [
        { type: "heading1", text: "# L'Obiettivo" },
        { type: "blank", text: "" },
        { type: "heading2", text: "## Il deliverable:" },
        { type: "bullet", text: "- Una **pipeline AI-driven** che si integri al di là dello stack" },
        { type: "bullet", text: "- Un **insieme di pratiche** per mantenerla viva nel tempo" },
        { type: "bullet", text: "- Una **demo concreta**, condivisibile con il resto dell'agenzia" },
        { type: "blank", text: "" },
        { type: "comment", text: "<!-- Manifesto #6: ci deve essere un output, e non dobbiamo tenercelo per noi. -->" },
        { type: "comment", text: "<!-- Manifesto #3: quello che iniziamo deve essere concluso in un tempo prestabilito. -->" },
        { type: "blank", text: "" },
        { type: "heading2", text: "## Il flusso core:" },
        { type: "blank", text: "" },
        { type: "text", text: "```" },
        { type: "text", text: "Intento umano (MR template)" },
        { type: "text", text: "    → Agente AI legge diff + contesto" },
        { type: "text", text: "        → Documentazione aggiornata" },
        { type: "text", text: "            → AGENTS.md / ADR se necessario" },
        { type: "text", text: "```" },
        { type: "blank", text: "" },
        { type: "text", text: "Che sia Python, TypeScript o PHP:" },
        { type: "bold", text: "**il processo non cambia. È replicabile.**" },
        { type: "blank", text: "" },
        { type: "line", text: "---" },
        { type: "blank", text: "" },
        { type: "heading2", text: "## Le domande aperte:" },
        { type: "bullet", text: "- I parser statici **migliorano** l'input che diamo all'AI?" },
        { type: "bullet", text: "- La governance **protegge** la qualità o aggiunge solo frizione?" },
        { type: "bullet", text: "- Senza nessuno dei due, la pipeline AI **regge da sola**?" },
        { type: "blank", text: "" },
        { type: "comment", text: "<!-- La pipeline funziona su uno stack che non abbiamo testato? -->" },
        { type: "comment", text: "<!-- Come misuriamo se sta funzionando? -->" },
        { type: "comment", text: "<!-- L'obiettivo non è la doc. È non perdere più tempo a cercare quello che sapevamo già. -->" },
      ],
    },
  },
  {
    id: "10_risorse.md",
    folder: "config",
    title: "Risorse",
    icon: "md",
    content: {
      type: "markdown",
      lines: [
        { type: "heading1", text: "# Approfondimenti" },
        { type: "blank", text: "" },
        { type: "heading3", text: "### 📖 Materiale per andare a fondo:" },
        { type: "blank", text: "" },
        { type: "bullet", text: '- **Nygard (2011)**: "Documenting Architecture Decisions"' },
        { type: "text", text: "  Il blog post che ha reso popolare gli ADR. Perché documentare il 'perché'." },
        { type: "blank", text: "" },
        { type: "bullet", text: "- **Write the Docs**: Docs as Code" },
        { type: "text", text: "  Stessi workflow del team dev applicati alla documentazione. Riferimento principale." },
        { type: "blank", text: "" },
        { type: "bullet", text: "- **AWS**: Master Architecture Decision Records" },
        { type: "text", text: "  Best practices da 200+ ADR su progetti reali. Decision-making efficace." },
        { type: "blank", text: "" },
        { type: "bullet", text: '- **IBM (2026)**: "AI Code Documentation — Benefits and Top Tips"' },
        { type: "text", text: "  Dati concreti sui limiti reali dell'automazione oggi. Lo stato dell'arte." },
        { type: "blank", text: "" },
        { type: "bullet", text: "- **Google**: Documentation Best Practices" },
        { type: "text", text: "  Framework interno: API doc vs commenti inline vs design doc. Cosa documentare e dove." },
      ],
    },
  },
];

const fileIcons = {
  md: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="2" fill="#519aba" opacity="0.15" />
      <text x="8" y="12" textAnchor="middle" fill="#519aba" fontSize="9" fontWeight="bold" fontFamily="monospace">M</text>
    </svg>
  ),
  py: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="2" fill="#3572A5" opacity="0.15" />
      <text x="8" y="12" textAnchor="middle" fill="#3572A5" fontSize="9" fontWeight="bold" fontFamily="monospace">Py</text>
    </svg>
  ),
  ts: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="2" fill="#3178C6" opacity="0.15" />
      <text x="8" y="12" textAnchor="middle" fill="#3178C6" fontSize="9" fontWeight="bold" fontFamily="monospace">TS</text>
    </svg>
  ),
  yml: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="2" fill="#cb171e" opacity="0.15" />
      <text x="8" y="12" textAnchor="middle" fill="#cb171e" fontSize="8" fontWeight="bold" fontFamily="monospace">YML</text>
    </svg>
  ),
};

const ChevronIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={TEXT_MUTED} style={{ transition: "transform 0.2s ease", transform: open ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }}>
    <path d="M6 4l4 4-4 4" stroke={TEXT_MUTED} strokeWidth="1.5" fill="none" />
  </svg>
);

const FolderIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    {open ? (
      <path d="M1.5 3.5h4l1.5 1.5h7v8h-13z" fill="#dcb67a" opacity="0.8" />
    ) : (
      <path d="M1.5 2.5h4l1.5 1.5h7v9h-13z" fill="#dcb67a" opacity="0.6" />
    )}
  </svg>
);

function renderMarkdownLine(line) {
  const t = line.text || "";
  switch (line.type) {
    case "heading1":
      return <span><span style={{ color: BLUE }}>{"# "}</span><span style={{ color: WHITE, fontWeight: 700, fontSize: "1.1em" }}>{t.replace(/^#\s*/, "")}</span></span>;
    case "heading2":
      return <span><span style={{ color: BLUE }}>{"## "}</span><span style={{ color: "#9CDCFE", fontWeight: 600 }}>{t.replace(/^##\s*/, "")}</span></span>;
    case "heading3":
      return <span><span style={{ color: BLUE }}>{"### "}</span><span style={{ color: "#9CDCFE" }}>{t.replace(/^###\s*/, "")}</span></span>;
    case "quote":
      return <span><span style={{ color: GREEN }}>{"> "}</span><span style={{ color: "#98C379", fontStyle: "italic" }}>{t.replace(/^>\s*/, "")}</span></span>;
    case "bullet": {
      const inner = t.replace(/^-\s*/, "");
      const parts = inner.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span>
          <span style={{ color: ORANGE }}>{"- "}</span>
          {parts.map((p, i) =>
            p.startsWith("**") ? (
              <span key={i} style={{ color: WHITE, fontWeight: 600 }}>{p.replace(/\*\*/g, "")}</span>
            ) : (
              <span key={i} style={{ color: TEXT_PRIMARY }}>{p}</span>
            )
          )}
        </span>
      );
    }
    case "bold": {
      const parts = t.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span>
          {parts.map((p, i) =>
            p.startsWith("**") ? (
              <span key={i} style={{ color: WHITE, fontWeight: 700 }}>{p.replace(/\*\*/g, "")}</span>
            ) : (
              <span key={i} style={{ color: TEXT_PRIMARY }}>{p}</span>
            )
          )}
        </span>
      );
    }
    case "italic":
      return <span style={{ color: "#98C379", fontStyle: "italic" }}>{t.replace(/_/g, "")}</span>;
    case "comment":
      return <span style={{ color: COMMENT_COLOR }}>{t}</span>;
    case "line":
      return <span style={{ color: TEXT_MUTED }}>{"─".repeat(50)}</span>;
    case "blank":
      return <span>{" "}</span>;
    default:
      return <span style={{ color: TEXT_PRIMARY }}>{t}</span>;
  }
}

function renderCodeTokens(tokens) {
  if (!tokens || tokens.length === 0) return <span>{" "}</span>;
  return (
    <span>
      {tokens.map((tok, i) => (
        <span key={i} style={{ color: tok.color }}>{tok.text}</span>
      ))}
    </span>
  );
}

const terminalMessages = [
  { type: "cmd", text: "$ git push origin feat/doc-pipeline" },
  { type: "out", text: "⠋ Running Lefthook pre-push hooks..." },
  { type: "out", text: "✓ pydoc-markdown: 47 docstrings extracted" },
  { type: "out", text: "✓ typedoc: 23 interfaces documented" },
  { type: "out", text: "✓ vale: prose linting passed (0 errors)" },
  { type: "warn", text: "⚠ danger: MR description campo 'perché' troppo generico" },
  { type: "out", text: "✓ AI agent: AGENTS.md aggiornato" },
  { type: "success", text: "✓ Pipeline completata. Documentazione sincronizzata." },
];

const workshopQuestions = [
  { id: 1, question: "Per chi documentiamo? (Agenti AI, Colleghi, PM)" },
  { id: 2, question: "Quanto cambiamo il codice per l'automazione?" },
  { id: 3, question: "Per chi commentiamo? (Umani vs Parser)" },
  { id: 4, question: "Dove vive la verità? (Repo vs esterno)" },
  { id: 5, question: "Quante call avete fatto nell'ultimo mese che si potevano evitare con un file aggiornato?" },
  { id: 6, question: "Quanto minimo è 'minimo intervento'?" },
  { id: 7, question: "Ci fidiamo di quello che genera?" },
  { id: 8, question: "Quanto ci costa mantenerlo rispetto a scrivere la doc a mano?" },
  { id: 9, question: "Stiamo risolvendo il problema o stiamo creando un nuovo debito?" },
  { id: 10, question: "Quanti token di contesto sprechiamo perché l'agente non sa come lavoriamo?" },
  { id: 11, question: "Quante ore e salute costa un onboarding oggi su un nostro progetto?" },
  { id: 12, question: "Quante call servono a un PM per capire cosa può promettere al cliente?" },
  { id: 13, question: "Dobbiamo cambiare il modo in cui scriviamo codice, o basta cambiare cosa succede dopo?" },
  { id: 14, question: "Type Hinting rigoroso su tutto: investimento o spreco?" },
  { id: 15, question: "Quanto tempo in più costa scrivere bene ora vs quanto ne perdiamo dopo?" },
  { id: 16, question: "Chi decide lo standard, e su quale progetto? È l'occasione per definirlo?" },
  { id: 17, question: "Ha senso avere un flusso, o stiamo risolvendo un problema che non tutti sentono?" },
  { id: 18, question: "Per chi commentiamo davvero?" },
  { id: 19, question: "Chi se ne accorge quando doc e codice divergono?" },
  { id: 20, question: "Dentro la repo o fuori?" },
  { id: 21, question: "Se diamo all'AI anche i metadati dei parser statici, genera doc migliore?" },
  { id: 22, question: "La pipeline AI regge da sola senza gli altri due approcci?" },
  { id: 23, question: "La pipeline funziona su uno stack che non abbiamo testato?" },
  { id: 24, question: "Come misuriamo se sta funzionando?" },
];

export default function WorkshopPresentation() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFolders, setOpenFolders] = useState({ workshop: true, domande: true, problemi: true, config: true });
  const [visibleLines, setVisibleLines] = useState(0);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [terminalLines, setTerminalLines] = useState(0);
  const [showMinimap, setShowMinimap] = useState(true);
  const [ctrlHeld, setCtrlHeld] = useState(false);
  const [hoveredLine, setHoveredLine] = useState(null);
  const editorRef = useRef(null);
  
  // Copilot panel states
  const [copilotVisible, setCopilotVisible] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(workshopQuestions[0].id);
  const [userName, setUserName] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Question creation states
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [questionAuthor, setQuestionAuthor] = useState("");
  const [addingQuestion, setAddingQuestion] = useState(false);
  
  // Firebase hooks
  const { responses, loading, error, addResponse } = useWorkshopResponses(selectedQuestion);
  const { customQuestions, loading: questionsLoading, addQuestion } = useWorkshopQuestions();
  
  // Combine predefined and custom questions
  const allQuestions = [
    ...workshopQuestions,
    ...customQuestions.map(q => ({
      id: q.id,
      question: q.question,
      author: q.author,
      isCustom: true
    }))
  ];

  const currentSlide = slides[activeSlide];
  const totalLines = currentSlide.content.lines?.length ?? 0;

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !userAnswer.trim() || submitting) return;
    
    setSubmitting(true);
    
    try {
      const question = allQuestions.find(q => q.id === selectedQuestion)?.question;
      await addResponse(selectedQuestion, question, userName, userAnswer);
      
      // Clear only answer, keep name for convenience
      setUserAnswer("");
    } catch (err) {
      console.error('Failed to submit answer:', err);
      alert('Errore nell\'invio della risposta. Riprova.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !questionAuthor.trim() || addingQuestion) return;
    
    setAddingQuestion(true);
    
    try {
      const newQuestionId = await addQuestion(newQuestionText, questionAuthor);
      
      // Clear form
      setNewQuestionText("");
      setQuestionAuthor("");
      
      // Switch to answer mode and select the new question
      setShowAddQuestion(false);
      setSelectedQuestion(newQuestionId);
    } catch (err) {
      console.error('Failed to add question:', err);
      alert(`Errore nell'aggiunta della domanda:\n\n${err.message}\n\nVerifica che le Security Rules siano pubblicate in Firebase Console.`);
    } finally {
      setAddingQuestion(false);
    }
  };

  useEffect(() => {
    setVisibleLines(0);
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= totalLines) {
          clearInterval(timer);
          return totalLines;
        }
        return prev + 1;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [activeSlide, totalLines]);

  useEffect(() => {
    if (terminalVisible) {
      setTerminalLines(0);
      const timer = setInterval(() => {
        setTerminalLines((prev) => {
          if (prev >= terminalMessages.length) {
            clearInterval(timer);
            return terminalMessages.length;
          }
          return prev + 1;
        });
      }, 400);
      return () => clearInterval(timer);
    }
  }, [terminalVisible]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Control" || e.key === "Meta") { setCtrlHeld(true); return; }
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSlide((p) => Math.min(p + 1, slides.length - 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSlide((p) => Math.max(p - 1, 0));
    } else if (e.key === "`") {
      setTerminalVisible((p) => !p);
    } else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
      if (e.shiftKey) { // Ctrl+Shift+C per toggle Copilot
        e.preventDefault();
        setCopilotVisible((p) => !p);
      }
    }
  }, []);

  const handleKeyUp = useCallback((e) => {
    if (e.key === "Control" || e.key === "Meta") setCtrlHeld(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const toggleFolder = (folder) => {
    setOpenFolders((p) => ({ ...p, [folder]: !p[folder] }));
  };

  const folders = {};
  slides.forEach((s, i) => {
    if (!folders[s.folder]) folders[s.folder] = [];
    folders[s.folder].push({ ...s, index: i });
  });

  const folderOrder = ["workshop", "domande", "problemi", "config"];

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: BG_DARK, fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace", color: TEXT_PRIMARY, overflow: "hidden", fontSize: "13px", userSelect: "none" }} tabIndex={0}>

      {/* TITLE BAR */}
      <div style={{ height: 30, background: BG_TITLEBAR, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${BORDER_COLOR}`, flexShrink: 0, gap: 8 }}>
        <div style={{ position: "absolute", left: 12, display: "flex", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }} />
        </div>
        <span style={{ fontSize: 12, color: TEXT_MUTED }}>{currentSlide.id} — workshop-doc-as-code</span>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ACTIVITY BAR */}
        <div style={{ width: 48, background: BG_SIDEBAR, borderRight: `1px solid ${BORDER_COLOR}`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 8, gap: 4, flexShrink: 0 }}>
          {[
            <svg key="f" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 7h4l2-2h8l2 2h2v12H3z" stroke={activeSlide >= 0 ? "#fff" : TEXT_MUTED} strokeWidth="1.5" /></svg>,
            <svg key="s" width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke={TEXT_MUTED} strokeWidth="1.5" /><path d="M16 16l4 4" stroke={TEXT_MUTED} strokeWidth="1.5" /></svg>,
            <svg key="g" width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="6" r="3" stroke={TEXT_MUTED} strokeWidth="1.5" /><path d="M12 9v6m-4 4h8" stroke={TEXT_MUTED} strokeWidth="1.5" /></svg>,
          ].map((icon, i) => (
            <div key={i} style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: i === 0 ? `2px solid ${ACCENT}` : "2px solid transparent", cursor: "pointer", opacity: i === 0 ? 1 : 0.5 }}>
              {icon}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div
            style={{ 
              width: 48, 
              height: 48, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              cursor: "pointer", 
              opacity: copilotVisible ? 1 : 0.5,
              borderLeft: copilotVisible ? `2px solid ${ACCENT}` : "2px solid transparent"
            }}
            onClick={() => setCopilotVisible((p) => !p)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={copilotVisible ? ACCENT : TEXT_MUTED} strokeWidth="1.5" />
              <path d="M12 8v8M8 12h8" stroke={copilotVisible ? ACCENT : TEXT_MUTED} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div
            style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.5 }}
            onClick={() => setTerminalVisible((p) => !p)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 17l6-5-6-5" stroke={TEXT_MUTED} strokeWidth="1.5" />
              <path d="M12 19h8" stroke={TEXT_MUTED} strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ width: 220, background: BG_SIDEBAR, borderRight: `1px solid ${BORDER_COLOR}`, overflowY: "auto", flexShrink: 0 }}>
          <div style={{ padding: "10px 16px 6px", fontSize: 11, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
            Explorer
          </div>
          <div style={{ padding: "0 0 8px" }}>
            <div style={{ padding: "4px 12px", fontSize: 11, fontWeight: 700, color: TEXT_SIDEBAR, textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 4 }}>
              <ChevronIcon open={true} />
              workshop-doc-as-code
            </div>

            {folderOrder.map((folderName) => {
              const isOpen = openFolders[folderName];
              const folderSlides = folders[folderName] || [];
              return (
                <div key={folderName}>
                  <div
                    style={{ padding: "3px 12px 3px 24px", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 13, color: TEXT_SIDEBAR }}
                    onClick={() => toggleFolder(folderName)}
                  >
                    <ChevronIcon open={isOpen} />
                    <FolderIcon open={isOpen} />
                    <span>{folderName}/</span>
                  </div>
                  <div style={{ overflow: "hidden", maxHeight: isOpen ? 500 : 0, transition: "max-height 0.3s ease" }}>
                    {folderSlides.map((s) => (
                      <div
                        key={s.index}
                        onClick={() => setActiveSlide(s.index)}
                        style={{
                          padding: "3px 12px 3px 52px",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          cursor: "pointer",
                          fontSize: 13,
                          color: activeSlide === s.index ? WHITE : TEXT_SIDEBAR,
                          background: activeSlide === s.index ? `${ACCENT}33` : "transparent",
                          borderLeft: activeSlide === s.index ? `2px solid ${ACCENT}` : "2px solid transparent",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => { if (activeSlide !== s.index) e.currentTarget.style.background = "#2A2D2E"; }}
                        onMouseLeave={(e) => { if (activeSlide !== s.index) e.currentTarget.style.background = "transparent"; }}
                      >
                        {fileIcons[s.icon]}
                        <span>{s.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN EDITOR AREA */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* TABS */}
          <div style={{ height: 35, background: BG_TAB_INACTIVE, display: "flex", alignItems: "flex-end", borderBottom: `1px solid ${BORDER_COLOR}`, overflowX: "auto", flexShrink: 0 }}>
            {slides.map((s, i) => (
              <div
                key={i}
                onClick={() => setActiveSlide(i)}
                style={{
                  height: 35,
                  padding: "0 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  fontSize: 12,
                  color: activeSlide === i ? WHITE : TEXT_MUTED,
                  background: activeSlide === i ? BG_TAB_ACTIVE : BG_TAB_INACTIVE,
                  borderRight: `1px solid ${BORDER_COLOR}`,
                  borderTop: activeSlide === i ? `1px solid ${ACCENT}` : "1px solid transparent",
                  borderBottom: activeSlide === i ? `1px solid ${BG_TAB_ACTIVE}` : "none",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  flexShrink: 0,
                }}
              >
                {fileIcons[s.icon]}
                <span>{s.id}</span>
              </div>
            ))}
          </div>

          {/* BREADCRUMB */}
          <div style={{ height: 22, background: BG_EDITOR, display: "flex", alignItems: "center", padding: "0 16px", fontSize: 11, color: TEXT_MUTED, borderBottom: `1px solid ${BORDER_COLOR}`, flexShrink: 0, gap: 4 }}>
            <span>workshop-doc-as-code</span>
            <span style={{ color: "#555" }}>{">"}</span>
            <span>{currentSlide.folder}</span>
            <span style={{ color: "#555" }}>{">"}</span>
            <span style={{ color: TEXT_SIDEBAR }}>{currentSlide.id}</span>
          </div>

          {/* EDITOR + MINIMAP + COPILOT PANEL */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* EDITOR CONTAINER */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {currentSlide.content.type === "welcome" ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: BG_EDITOR, gap: 36, padding: "0 40px" }}>
                {/* Animated pipeline logo */}
                <svg width="340" height="110" viewBox="0 0 340 110">
                  <rect x="10" y="18" width="74" height="74" rx="8" fill="#569CD622" stroke={BLUE} strokeWidth="1.5" />
                  <text x="47" y="42" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="600" fontFamily="monospace">{"</>"}</text>
                  <line x1="22" y1="56" x2="72" y2="56" stroke={BLUE} strokeWidth="1.5" opacity="0.55" />
                  <line x1="22" y1="65" x2="64" y2="65" stroke={BLUE} strokeWidth="1.5" opacity="0.38" />
                  <line x1="22" y1="74" x2="68" y2="74" stroke={BLUE} strokeWidth="1.5" opacity="0.25" />
                  <text x="47" y="106" textAnchor="middle" fill={TEXT_MUTED} fontSize="9">code</text>

                  <line x1="88" y1="55" x2="116" y2="55" stroke={ACCENT} strokeWidth="2" strokeDasharray="6 3" style={{ animation: "flowDash 1s linear infinite" }} />
                  <path d="M116,49 L125,55 L116,61" fill="none" stroke={ACCENT} strokeWidth="2" />

                  <circle cx="158" cy="55" r="28" fill="#007ACC16" stroke={ACCENT} strokeWidth="2" style={{ animation: "pulseLogo 2.5s ease-in-out infinite" }} />
                  <text x="158" y="51" textAnchor="middle" fill={ACCENT} fontSize="12" fontWeight="700">AI</text>
                  <text x="158" y="65" textAnchor="middle" fill={ACCENT} fontSize="8" opacity="0.8">agent</text>
                  <text x="158" y="97" textAnchor="middle" fill={TEXT_MUTED} fontSize="9">intent</text>

                  <line x1="190" y1="55" x2="218" y2="55" stroke={GREEN} strokeWidth="2" strokeDasharray="6 3" style={{ animation: "flowDash 1s linear infinite 0.5s" }} />
                  <path d="M218,49 L227,55 L218,61" fill="none" stroke={GREEN} strokeWidth="2" />

                  <rect x="231" y="18" width="74" height="74" rx="8" fill="#6A995522" stroke={GREEN} strokeWidth="1.5" />
                  <text x="268" y="42" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600" fontFamily="monospace">.md</text>
                  <line x1="243" y1="56" x2="293" y2="56" stroke={GREEN} strokeWidth="1.5" opacity="0.55" />
                  <line x1="243" y1="65" x2="285" y2="65" stroke={GREEN} strokeWidth="1.5" opacity="0.38" />
                  <line x1="243" y1="74" x2="289" y2="74" stroke={GREEN} strokeWidth="1.5" opacity="0.25" />
                  <text x="268" y="106" textAnchor="middle" fill={TEXT_MUTED} fontSize="9">docs</text>
                </svg>

                {/* Title block */}
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: WHITE, letterSpacing: "-0.5px" }}>
                    Workshop: Documentation-as-Code
                  </div>
                  <div style={{ fontSize: 18, color: LIGHT_BLUE }}>
                    & AI Context Engineering
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_MUTED, fontStyle: "italic", marginTop: 4 }}>
                    Dallo scripting manuale alla documentazione self-aware
                  </div>
                </div>

                {/* Navigation hints */}
                <div style={{ display: "flex", gap: 28, fontSize: 11, color: TEXT_MUTED }}>
                  <span>← → per navigare</span>
                  <span>` terminale</span>
                  <span>⌃⇧C copilot</span>
                  <span style={{ color: `${ACCENT}CC` }}>⌃ + click per i link</span>
                </div>
              </div>
            ) : (
              <>
                <div ref={editorRef} style={{ flex: 1, overflowY: "auto", background: BG_EDITOR, padding: "8px 0" }}>
                  {currentSlide.content.lines.map((line, i) => {
                    const visible = i < visibleLines;
                    const isHovered = hoveredLine === i;
                    const hasUrl = !!line.url;
                    return (
                      <div
                        key={`${activeSlide}-${i}`}
                        style={{
                          display: "flex",
                          minHeight: 22,
                          lineHeight: "22px",
                          opacity: visible ? 1 : 0,
                          transform: visible ? "translateX(0)" : "translateX(-8px)",
                          transition: `opacity 0.25s ease ${i * 0.03}s, transform 0.25s ease ${i * 0.03}s`,
                          background: "transparent",
                          cursor: isHovered && hasUrl ? "pointer" : "default",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = line.url ? `${ACCENT}22` : LINE_HIGHLIGHT; setHoveredLine(i); }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; setHoveredLine(null); }}
                        onClick={(e) => { if ((e.ctrlKey || e.metaKey) && line.url) window.open(line.url, "_blank"); }}
                      >
                        <div style={{ width: 60, textAlign: "right", paddingRight: 16, color: isHovered && hasUrl ? ACCENT : TEXT_MUTED, fontSize: 12, flexShrink: 0, fontVariantNumeric: "tabular-nums", transition: "color 0.1s ease" }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1, paddingRight: 20, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                          {currentSlide.content.type === "markdown"
                            ? renderMarkdownLine(line)
                            : renderCodeTokens(line.tokens)
                          }
                        </div>
                        {isHovered && hasUrl && (
                          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 7px 0 5px", marginRight: 4, background: ctrlHeld ? ACCENT : `${ACCENT}3A`, borderRadius: 4, flexShrink: 0, transition: "background 0.15s ease" }}>
                            <span style={{ color: ctrlHeld ? "#fff" : ACCENT, fontSize: 12 }}>↗</span>
                            {!ctrlHeld && <span style={{ color: ACCENT, fontSize: 9, opacity: 0.75, letterSpacing: "0.5px" }}>⌃</span>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div style={{ height: 200 }} />
                </div>

                {/* MINIMAP */}
                {showMinimap && (
                  <div style={{ width: 60, background: BG_EDITOR, borderLeft: `1px solid ${BORDER_COLOR}`, padding: "8px 4px", flexShrink: 0, opacity: 0.5 }}>
                    {currentSlide.content.lines.map((_, i) => (
                      <div key={i} style={{ height: 3, margin: "1px 4px", background: i < visibleLines ? (i % 3 === 0 ? ACCENT : "#444") : "transparent", borderRadius: 1, transition: `background 0.2s ease ${i * 0.02}s` }} />
                    ))}
                  </div>
                )}
              </>
            )}
            </div>

            {/* COPILOT PANEL */}
            {copilotVisible && (
              <div style={{ 
                width: 380, 
                background: BG_SIDEBAR, 
                borderLeft: `1px solid ${BORDER_COLOR}`, 
                display: "flex", 
                flexDirection: "column",
                flexShrink: 0 
              }}>
                {/* Copilot Header */}
                <div style={{ 
                  height: 40, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  padding: "0 16px", 
                  borderBottom: `1px solid ${BORDER_COLOR}`,
                  background: BG_TITLEBAR
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="8" fill={ACCENT} opacity="0.2" />
                      <path d="M10 6v8M6 10h8" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontSize: 13, fontWeight: 600, color: WHITE }}>Lotrek Copilot</span>
                  </div>
                  <span 
                    style={{ color: TEXT_MUTED, cursor: "pointer", fontSize: 18 }} 
                    onClick={() => setCopilotVisible(false)}
                  >×</span>
                </div>

                {/* Mode Toggle */}
                <div style={{ 
                  padding: 12,
                  borderBottom: `1px solid ${BORDER_COLOR}`,
                  display: "flex",
                  gap: 8
                }}>
                  <button
                    onClick={() => setShowAddQuestion(false)}
                    style={{
                      flex: 1,
                      padding: "6px 12px",
                      background: !showAddQuestion ? ACCENT : BG_EDITOR,
                      color: !showAddQuestion ? "#fff" : TEXT_PRIMARY,
                      border: `1px solid ${BORDER_COLOR}`,
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "inherit"
                    }}
                  >
                    💬 Rispondi
                  </button>
                  <button
                    onClick={() => setShowAddQuestion(true)}
                    style={{
                      flex: 1,
                      padding: "6px 12px",
                      background: showAddQuestion ? ACCENT : BG_EDITOR,
                      color: showAddQuestion ? "#fff" : TEXT_PRIMARY,
                      border: `1px solid ${BORDER_COLOR}`,
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "inherit"
                    }}
                  >
                    ➕ Aggiungi Domanda
                  </button>
                </div>

                {!showAddQuestion ? (
                  <>
                    {/* Question Selector */}
                    <div style={{ padding: 16, borderBottom: `1px solid ${BORDER_COLOR}` }}>
                      <label style={{ fontSize: 11, color: TEXT_MUTED, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Seleziona Domanda Workshop
                      </label>
                      <select 
                        value={selectedQuestion} 
                        onChange={(e) => setSelectedQuestion(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: BG_EDITOR,
                          border: `1px solid ${BORDER_COLOR}`,
                          borderRadius: 4,
                          color: TEXT_PRIMARY,
                          fontSize: 12,
                          fontFamily: "inherit",
                          cursor: "pointer",
                          outline: "none"
                        }}
                      >
                        {allQuestions.map(q => (
                          <option key={q.id} value={q.id}>
                            {q.isCustom ? `🆕 ${q.question}` : q.question}
                          </option>
                        ))}
                      </select>
                      {selectedQuestion && allQuestions.find(q => q.id === selectedQuestion)?.author && (
                        <div style={{ fontSize: 10, color: TEXT_MUTED, marginTop: 6, fontStyle: "italic" }}>
                          Domanda by {allQuestions.find(q => q.id === selectedQuestion)?.author}
                        </div>
                      )}
                    </div>

                    {/* Responses List */}
                    <div style={{ 
                      flex: 1, 
                      overflowY: "auto", 
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12
                    }}>
                      <div style={{ fontSize: 11, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                        Risposte ({responses.length})
                      </div>
                      
                      {loading && (
                        <div style={{ 
                          fontSize: 12, 
                          color: TEXT_MUTED, 
                          fontStyle: "italic",
                          textAlign: "center",
                          padding: "20px 0"
                        }}>
                          Caricamento risposte...
                        </div>
                      )}
                      
                      {error && (
                        <div style={{ 
                          fontSize: 12, 
                          color: "#E06C75", 
                          background: "#E06C7522",
                          padding: 12,
                          borderRadius: 6,
                          border: "1px solid #E06C7544"
                        }}>
                          ⚠️ Firebase non configurato. Le risposte sono salvate solo localmente.
                        </div>
                      )}
                      
                      {!loading && responses.length > 0 && responses.map(response => (
                        <div 
                          key={response.id} 
                          style={{
                            background: BG_EDITOR,
                            border: `1px solid ${BORDER_COLOR}`,
                            borderRadius: 6,
                            padding: 12,
                            animation: "fadeIn 0.3s ease"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>{response.name}</span>
                            <span style={{ fontSize: 10, color: TEXT_MUTED }}>
                              {response.timestampISO 
                                ? new Date(response.timestampISO).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
                                : response.timestamp?.toDate 
                                  ? response.timestamp.toDate().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
                                  : 'ora'
                              }
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: TEXT_PRIMARY, lineHeight: 1.6, margin: 0 }}>
                            {response.answer}
                          </p>
                        </div>
                      ))}
                      
                      {!loading && responses.length === 0 && !error && (
                        <div style={{ 
                          fontSize: 12, 
                          color: TEXT_MUTED, 
                          fontStyle: "italic",
                          textAlign: "center",
                          padding: "20px 0"
                        }}>
                          Nessuna risposta ancora. Sii il primo!
                        </div>
                      )}
                    </div>

                    {/* Answer Form */}
                    <form onSubmit={handleSubmitAnswer} style={{
                      borderTop: `1px solid ${BORDER_COLOR}`,
                      padding: 16,
                      background: BG_TITLEBAR,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10
                    }}>
                      <input
                        type="text"
                        placeholder="Il tuo nome"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: BG_EDITOR,
                          border: `1px solid ${BORDER_COLOR}`,
                          borderRadius: 4,
                          color: TEXT_PRIMARY,
                          fontSize: 12,
                          fontFamily: "inherit",
                          outline: "none"
                        }}
                      />
                      <textarea
                        placeholder="La tua risposta..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: BG_EDITOR,
                          border: `1px solid ${BORDER_COLOR}`,
                          borderRadius: 4,
                          color: TEXT_PRIMARY,
                          fontSize: 12,
                          fontFamily: "inherit",
                          resize: "vertical",
                          outline: "none"
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!userName.trim() || !userAnswer.trim() || submitting}
                        style={{
                          padding: "8px 16px",
                          background: userName.trim() && userAnswer.trim() && !submitting ? ACCENT : "#555",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: userName.trim() && userAnswer.trim() && !submitting ? "pointer" : "not-allowed",
                          opacity: userName.trim() && userAnswer.trim() && !submitting ? 1 : 0.5,
                          transition: "all 0.2s ease"
                        }}
                      >
                        {submitting ? "Invio..." : "Invia Risposta"}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    {/* Add Question Form */}
                    <div style={{ 
                      flex: 1, 
                      overflowY: "auto", 
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12
                    }}>
                      <div style={{ 
                        fontSize: 13, 
                        color: TEXT_PRIMARY, 
                        lineHeight: 1.6,
                        background: BG_EDITOR,
                        padding: 16,
                        borderRadius: 6,
                        border: `1px solid ${BORDER_COLOR}`
                      }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: ACCENT }}>
                          ➕ Aggiungi una Nuova Domanda
                        </div>
                        <p style={{ fontSize: 12, color: TEXT_MUTED, margin: 0 }}>
                          Proponi una nuova domanda per il workshop. Sarà visibile a tutti i partecipanti in tempo reale.
                        </p>
                      </div>

                      {questionsLoading && (
                        <div style={{ 
                          fontSize: 12, 
                          color: TEXT_MUTED, 
                          fontStyle: "italic",
                          textAlign: "center",
                          padding: "20px 0"
                        }}>
                          Caricamento domande...
                        </div>
                      )}
                      
                      {!questionsLoading && customQuestions.length === 0 && (
                        <div style={{ 
                          fontSize: 12, 
                          color: TEXT_MUTED, 
                          background: BG_EDITOR,
                          padding: 16,
                          borderRadius: 6,
                          border: `1px solid ${BORDER_COLOR}`,
                          textAlign: "center"
                        }}>
                          <div style={{ marginBottom: 8 }}>💡 Nessuna domanda custom ancora</div>
                          <div style={{ fontSize: 10, fontStyle: "italic", color: "#808080" }}>
                            Sii il primo a proporne una!
                          </div>
                        </div>
                      )}

                      {customQuestions.length > 0 && (
                        <>
                          <div style={{ fontSize: 11, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 12 }}>
                            Domande Recenti ({customQuestions.length})
                          </div>
                          {customQuestions.slice(-5).reverse().map(q => (
                            <div 
                              key={q.id}
                              style={{
                                background: BG_EDITOR,
                                border: `1px solid ${BORDER_COLOR}`,
                                borderRadius: 6,
                                padding: 12,
                                animation: "fadeIn 0.3s ease"
                              }}
                            >
                              <div style={{ fontSize: 12, color: TEXT_PRIMARY, marginBottom: 4 }}>
                                {q.question}
                              </div>
                              <div style={{ fontSize: 10, color: TEXT_MUTED, fontStyle: "italic" }}>
                                by {q.author}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>

                    {/* New Question Form */}
                    <form onSubmit={handleSubmitQuestion} style={{
                      borderTop: `1px solid ${BORDER_COLOR}`,
                      padding: 16,
                      background: BG_TITLEBAR,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10
                    }}>
                      <input
                        type="text"
                        placeholder="Il tuo nome"
                        value={questionAuthor}
                        onChange={(e) => setQuestionAuthor(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: BG_EDITOR,
                          border: `1px solid ${BORDER_COLOR}`,
                          borderRadius: 4,
                          color: TEXT_PRIMARY,
                          fontSize: 12,
                          fontFamily: "inherit",
                          outline: "none"
                        }}
                      />
                      <textarea
                        placeholder="La tua domanda..."
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: BG_EDITOR,
                          border: `1px solid ${BORDER_COLOR}`,
                          borderRadius: 4,
                          color: TEXT_PRIMARY,
                          fontSize: 12,
                          fontFamily: "inherit",
                          resize: "vertical",
                          outline: "none"
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!questionAuthor.trim() || !newQuestionText.trim() || addingQuestion}
                        style={{
                          padding: "8px 16px",
                          background: questionAuthor.trim() && newQuestionText.trim() && !addingQuestion ? GREEN : "#555",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: questionAuthor.trim() && newQuestionText.trim() && !addingQuestion ? "pointer" : "not-allowed",
                          opacity: questionAuthor.trim() && newQuestionText.trim() && !addingQuestion ? 1 : 0.5,
                          transition: "all 0.2s ease"
                        }}
                      >
                        {addingQuestion ? "Invio..." : "➕ Aggiungi Domanda"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>

          {/* TERMINAL */}
          {terminalVisible && (
            <div style={{
              height: 180,
              background: BG_TERMINAL,
              borderTop: `1px solid ${ACCENT}`,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              animation: "slideUp 0.3s ease",
            }}>
              <div style={{ height: 30, display: "flex", alignItems: "center", padding: "0 12px", borderBottom: `1px solid ${BORDER_COLOR}`, gap: 16, fontSize: 11 }}>
                <span style={{ color: WHITE, borderBottom: `1px solid ${ACCENT}`, paddingBottom: 4 }}>TERMINAL</span>
                <span style={{ color: TEXT_MUTED }}>PROBLEMS</span>
                <span style={{ color: TEXT_MUTED }}>OUTPUT</span>
                <div style={{ flex: 1 }} />
                <span style={{ color: TEXT_MUTED, cursor: "pointer", fontSize: 16 }} onClick={() => setTerminalVisible(false)}>×</span>
              </div>
              <div style={{ flex: 1, padding: "8px 12px", overflowY: "auto", fontSize: 12 }}>
                {terminalMessages.slice(0, terminalLines).map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      lineHeight: "20px",
                      color: msg.type === "cmd" ? CYAN : msg.type === "warn" ? "#E5C07B" : msg.type === "success" ? "#98C379" : TEXT_PRIMARY,
                      fontWeight: msg.type === "cmd" || msg.type === "success" ? 600 : 400,
                      opacity: 1,
                      animation: `fadeIn 0.3s ease`,
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
                {terminalLines < terminalMessages.length && (
                  <span style={{ color: CYAN, animation: "blink 1s infinite" }}>▋</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STATUS BAR */}
      <div style={{ height: 22, background: BG_STATUSBAR, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", fontSize: 11, color: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="3" stroke="#fff" strokeWidth="1.5" /><path d="M7 1v2m0 8v2M1 7h2m8 0h2" stroke="#fff" strokeWidth="1" /></svg>
            main
          </span>
          <span>Slide {activeSlide + 1}/{slides.length}</span>
          {copilotVisible && <span style={{ color: "#FFBD2E" }}>✓ Copilot</span>}
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span>Ln {totalLines}, Col 1</span>
          <span>{currentSlide.content.type === "welcome" ? "Welcome" : currentSlide.content.type === "markdown" ? "Markdown" : currentSlide.content.language === "python" ? "Python" : currentSlide.content.language === "typescript" ? "TypeScript" : "YAML"}</span>
          <span>UTF-8</span>
          {ctrlHeld && <span style={{ color: "#FFBD2E", fontWeight: 600 }}>⌃ link attivi</span>}
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            ← → naviga
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", opacity: 0.8 }} onClick={() => setCopilotVisible((p) => !p)}>
            ⌃⇧C copilot
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", opacity: 0.8 }} onClick={() => setTerminalVisible((p) => !p)}>
            ` terminale
          </span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: ${BG_EDITOR}; }
        ::-webkit-scrollbar-thumb { background: #424242; border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
        ::-webkit-scrollbar-corner { background: ${BG_EDITOR}; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes flowDash {
          to { stroke-dashoffset: -18; }
        }

        @keyframes pulseLogo {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; filter: drop-shadow(0 0 8px #007ACC88); }
        }
      `}</style>
    </div>
  );
}
