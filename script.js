/* Akash C — portfolio: pipeline, themes, interactions */
(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (hasFinePointer) document.body.classList.add('has-fine-pointer');

  window.PortfolioApp = window.PortfolioApp || {};

    // --- PIPELINE DATA ---
    const PIPELINE = {
        nodes: [
            {
                id: 'sources',
                title: 'Sources',
                sub: 'SF · D365 · Oracle',
                sub2: 'SQL · SAP',
                project: 'DataSyncher',
                details: 'Enterprise connectors pull metadata-driven extracts from Salesforce, Dynamics 365, Oracle, SQL Server, and SAP HANA into the integration layer.',
                techs: ['Salesforce APIs', 'Dynamics 365', 'Connectors'],
                keywords: ['Salesforce', 'Dynamics', 'Oracle', 'SAP HANA', 'SQL Server'],
            },
            {
                id: 'ingest',
                title: 'Ingest',
                sub: 'GKE Celery',
                project: 'DataSyncher',
                details: 'Kubernetes workers enqueue batch and incremental jobs via Celery with Redis-backed queues, KEDA autoscaling, and isolated pods per pipeline.',
                techs: ['GKE', 'Celery', 'Redis', 'KEDA'],
                keywords: ['Celery', 'KEDA', 'GKE', 'Kubernetes'],
            },
            {
                id: 'land',
                title: 'Land zone',
                sub: 'GCS / ADLS',
                project: 'DataSyncher',
                details: 'Dynamics CSV exports and bulk files land in GCS or Azure ADLS before Spark processing — parallel reads for 60M+ row tables.',
                techs: ['GCS', 'ADLS', 'Azure'],
                keywords: ['GCS', 'ADLS'],
            },
            {
                id: 'spark',
                title: 'PySpark',
                sub: 'Databricks',
                project: 'DataSyncher',
                details: 'Bulk MERGE pipelines normalize schemas, dedupe by primary key, handle soft deletes, and apply AQE + skew-join tuning at scale.',
                techs: ['PySpark', 'Databricks', 'AQE', 'Delta MERGE'],
                keywords: ['PySpark', 'Databricks', 'MERGE', 'AQE', 'MERGE'],
            },
            {
                id: 'delta',
                title: 'Delta Lake',
                sub: 'Unity Catalog',
                project: 'DataSyncher',
                details: 'Curated tables in Delta Lake with Unity Catalog governance, external locations, and MERGE-based upserts from bulk loads.',
                techs: ['Delta Lake', 'Unity Catalog'],
                keywords: ['Delta', 'Delta Lake'],
            },
            {
                id: 'copy',
                title: 'COPY INTO',
                sub: 'bulk → Snowflake',
                lane: 'warehouse',
                project: 'DataSyncher',
                details: 'Bulk push into Snowflake using COPY INTO from GCS/ADLS external stages and staged file sets — parallel loads across SF, D365, Oracle, SQL Server, SAP HANA, and Snowflake-native pipelines with row-level validation before commit.',
                techs: ['COPY INTO', 'External Stage', 'Snowflake SQL', 'Bulk Load'],
                keywords: ['COPY', 'Snowflake', 'Bulk', 'GCS', 'ADLS'],
            },
            {
                id: 'snowflake',
                title: 'Snowflake',
                sub: 'warehouse tables',
                lane: 'warehouse',
                project: 'DataSyncher',
                details: 'Enterprise warehouse for analytics and downstream sync: bulk COPY loads, incremental upserts, and reconciled tables serving DataSyncher ETL/ELT across every integrated source.',
                techs: ['Snowflake', 'SQL', 'Warehouse', 'Bulk Push'],
                keywords: ['Snowflake', 'COPY', 'SQL'],
            },
            {
                id: 'retl',
                title: 'Reverse ETL',
                sub: 'sync layer',
                project: 'DataSyncher',
                details: 'Curated warehouse metrics and entities flow back through DataSyncher sync jobs — closing the loop from lake to apps.',
                techs: ['ETL/ELT', 'Incremental Sync'],
                keywords: ['Incremental', 'ETL', 'ELT'],
            },
            {
                id: 'activation',
                title: 'Activation',
                sub: 'SF / D365',
                project: 'DataSyncher',
                details: 'Operational activation back into Salesforce and Dynamics 365 with validation and reconciliation before publish.',
                techs: ['Salesforce', 'Dynamics 365', 'Reconciliation'],
                keywords: ['Salesforce', 'Dynamics'],
            },
            {
                id: 'quality',
                title: 'Data quality',
                sub: 'validate · reconcile',
                project: 'DataSyncher',
                details: 'Validation, retries, error handling, and source-to-target reconciliation — including MigCockpit migration integrity checks.',
                techs: ['Validation', 'Reconciliation', 'Monitoring'],
                keywords: ['Validation', 'Reconciliation'],
            },
            {
                id: 'orchestration',
                title: 'Orchestration',
                sub: 'control plane',
                project: 'DataSyncher',
                details: 'GKE orchestrator, Databricks Jobs API, job-status tracking, and automated recovery across bulk and incremental modes.',
                techs: ['GKE', 'Databricks Jobs API', 'CI/CD'],
                keywords: ['Docker', 'CI/CD', 'Monitoring'],
            },
            {
                id: 'incremental',
                title: 'SQL warehouse',
                sub: 'incremental path',
                project: 'DataSyncher',
                details: 'Hybrid engine routes ongoing Dynamics 365 incremental syncs to SQL warehouse — avoiding multi-day bulk staging bottlenecks.',
                techs: ['SQL', 'Incremental Sync', 'PostgreSQL'],
                keywords: ['Incremental', 'PostgreSQL', 'SQL'],
            },
        ],
        edges: [
            { from: 'sources', to: 'ingest', bulk: true },
            { from: 'ingest', to: 'land', bulk: true },
            { from: 'land', to: 'spark', bulk: true },
            { from: 'spark', to: 'delta', bulk: true },
            { from: 'land', to: 'copy', bulk: true },
            { from: 'delta', to: 'copy', bulk: true },
            { from: 'copy', to: 'snowflake', bulk: true },
            { from: 'snowflake', to: 'retl', bulk: true },
            { from: 'retl', to: 'activation', bulk: true },
            { from: 'spark', to: 'quality', bulk: true, dash: false },
            { from: 'quality', to: 'snowflake', bulk: true, dash: true },
            { from: 'orchestration', to: 'ingest', dash: true, bulk: true },
            { from: 'orchestration', to: 'spark', dash: true, bulk: true },
            { from: 'sources', to: 'incremental', incremental: true },
            { from: 'incremental', to: 'copy', incremental: true },
            { from: 'copy', to: 'snowflake', incremental: true },
            { from: 'incremental', to: 'retl', incremental: true, dash: true },
        ],
        runSequenceBulk: ['sources', 'ingest', 'land', 'spark', 'delta', 'copy', 'snowflake', 'retl', 'activation'],
        runSequenceIncremental: ['sources', 'incremental', 'copy', 'snowflake', 'retl', 'activation'],
        runLogs: {
            sources: '[sources] 6 systems registered · SF · D365 · Oracle · SQL · SAP · Snowflake',
            ingest: '[ingest] 60M rows queued · Celery workers scaled (KEDA)',
            land: '[land] CSV landed GCS/ADLS · staged for COPY + Spark',
            spark: '[spark] PySpark MERGE into Delta · AQE on',
            delta: '[delta] Unity Catalog commit ok · exports ready for warehouse',
            copy: '[copy] COPY INTO @ext_stage · bulk push → Snowflake · 60M+ rows',
            snowflake: '[snowflake] tables committed · warehouse serve · all targets OK',
            retl: '[retl] reverse sync jobs scheduled',
            activation: '[activation] SF / D365 endpoints updated',
            quality: '[quality] reconciliation passed',
            orchestration: '[orch] run_id logged · monitoring green',
            incremental: '[incremental] SQL warehouse sync · no bulk staging',
        },
    };

    let pipelineMode = 'bulk';
    let selectedNodeId = null;
    let particleAnim = null;
    let activePaths = [];

    // --- Theme manager ---
    const THEMES = ['pipeline', 'spark', 'delta', 'aurora'];

    function applyTheme(name) {
        if (!THEMES.includes(name)) return;
        document.documentElement.setAttribute('data-theme', name);
        localStorage.setItem('portfolio-theme', name);
        document.querySelectorAll('[data-theme-pick]').forEach((btn) => {
            btn.classList.toggle('is-active', btn.getAttribute('data-theme-pick') === name);
        });
    }

    function setTheme(name) {
        applyTheme(name);
        if (typeof renderPipelineGraph === 'function') {
            renderPipelineGraph();
        }
    }

    document.querySelectorAll('[data-theme-pick]').forEach((btn) => {
        btn.addEventListener('click', () => {
            setTheme(btn.getAttribute('data-theme-pick'));
            showNotification(`Theme: ${btn.textContent}`, 'success');
        });
    });

    const themeDockToggle = document.getElementById('themeDockToggle');
    const themeDockMenu = document.getElementById('themeDockMenu');
    if (themeDockToggle && themeDockMenu) {
        themeDockToggle.addEventListener('click', () => {
            const open = themeDockMenu.classList.toggle('hidden');
            themeDockToggle.setAttribute('aria-expanded', String(!open));
        });
    }

    applyTheme(document.documentElement.getAttribute('data-theme') || 'pipeline');

    // --- Mobile nav ---
    const hamburger = document.querySelector('.hamburger');
    const navOverlay = document.getElementById('navOverlay');
    const overlayLinks = navOverlay ? navOverlay.querySelectorAll('.nav-link') : [];
    const desktopNavLinks = document.querySelectorAll('.nav-menu .nav-link');

    function setNavOpen(open) {
        if (!hamburger || !navOverlay) return;
        hamburger.classList.toggle('active', open);
        navOverlay.classList.toggle('is-open', open);
        hamburger.setAttribute('aria-expanded', String(open));
        navOverlay.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('nav-open', open);
    }

    if (hamburger && navOverlay) {
        hamburger.addEventListener('click', () => setNavOpen(!navOverlay.classList.contains('is-open')));
        [...overlayLinks, ...desktopNavLinks].forEach((link) => {
            link.addEventListener('click', () => setNavOpen(false));
        });
    }

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        });
    });

    const allNavLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('main section[id]').forEach((section) => {
            if (window.scrollY >= section.offsetTop - 160) current = section.getAttribute('id');
        });
        allNavLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });

        const sp = document.getElementById('scrollProgress');
        if (sp) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            sp.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : '0%';
        }
    }, { passive: true });

    // --- Spotlight ---
    document.querySelectorAll('[data-spotlight]').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        });
    });

    // --- Cursor glow ---
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && hasFinePointer && !prefersReducedMotion) {
        window.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
            cursorGlow.classList.add('is-on');
        }, { passive: true });
    }

    // --- Magnetic buttons ---
    if (!prefersReducedMotion && hasFinePointer) {
        document.querySelectorAll('.magnetic-btn, .btn-primary').forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) * 0.12;
                const y = (e.clientY - r.top - r.height / 2) * 0.12;
                btn.style.transform = `translate(${x}px, ${y}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        });
    }

    // --- Tilt cards ---
    if (!prefersReducedMotion && hasFinePointer) {
        document.querySelectorAll('[data-tilt], .bento-card, .skill-tile').forEach((card) => {
            card.classList.add('tilt-card');
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
                const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
                card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }

    // --- Role rotator ---
    const roleEl = document.getElementById('roleRotate');
    const roles = ['Data Engineer', 'PySpark Engineer', 'ETL/ELT Specialist', 'Python Developer'];
    let roleIndex = 0;
    if (roleEl && !prefersReducedMotion) {
        roleEl.style.transition = 'opacity 0.25s ease';
        setInterval(() => {
            roleIndex = (roleIndex + 1) % roles.length;
            roleEl.style.opacity = '0';
            setTimeout(() => {
                roleEl.textContent = roles[roleIndex];
                roleEl.style.opacity = '1';
            }, 220);
        }, 3200);
    }

    // --- About terminal ---
    const aboutTerminal = document.getElementById('aboutTerminal');
    const aboutLines = [
        { level: 'INFO', text: 'Location: Kochi, Kerala — open to relocate' },
        { level: 'INFO', text: 'Enterprise ETL/ELT across SF, D365, Oracle, SQL Server, SAP HANA, Snowflake' },
        { level: 'INFO', text: 'Hybrid bulk + incremental ingestion at 60M+ row scale' },
        { level: 'OK', text: 'Databricks PySpark MERGE → Delta Lake (Unity Catalog)' },
        { level: 'OK', text: 'COPY INTO bulk push → Snowflake (GCS/ADLS stages)' },
        { level: 'OK', text: 'All connectors · reverse ETL · GKE · Celery · KEDA' },
    ];

    async function typeAboutTerminal() {
        if (!aboutTerminal || aboutTerminal.dataset.done) return;
        aboutTerminal.dataset.done = '1';
        aboutTerminal.innerHTML = '';
        const delay = (ms) => new Promise((r) => setTimeout(r, ms));
        for (const line of aboutLines) {
            const p = document.createElement('p');
            p.className = 'term-line';
            p.innerHTML = `<span class="term-prompt">${line.level}</span> `;
            aboutTerminal.appendChild(p);
            const span = document.createElement('span');
            p.appendChild(span);
            if (prefersReducedMotion) span.textContent = line.text;
            else {
                for (let i = 0; i < line.text.length; i++) {
                    span.textContent += line.text[i];
                    await delay(10);
                }
                await delay(280);
            }
        }
    }

    // --- Pipeline layout (swimlanes for clarity) ---
    const LANE_LABELS = [
        { y: 28, text: '① Ingest & lakehouse (GCS/ADLS → PySpark → Delta)' },
        { y: 138, text: '② Warehouse (COPY INTO → Snowflake → reverse ETL)' },
        { y: 248, text: '③ Ops (orchestration · incremental · quality)' },
    ];

    function getLayoutPositions(horizontal) {
        const positions = {};
        const w = 100;
        const h = 58;
        const gap = 24;

        if (horizontal) {
            let x = 48;
            ['sources', 'ingest', 'land', 'spark', 'delta'].forEach((id) => {
                positions[id] = { x, y: 48, w, h };
                x += w + gap;
            });
            x = 88;
            ['copy', 'snowflake', 'retl', 'activation'].forEach((id) => {
                positions[id] = { x, y: 158, w, h };
                x += w + gap;
            });
            positions.orchestration = { x: 48, y: 268, w, h: 52 };
            positions.incremental = { x: 48 + w + gap, y: 268, w, h: 52 };
            positions.quality = { x: 48 + (w + gap) * 2, y: 268, w, h: 52 };
            return { positions, width: 680, height: 340, swimlanes: true };
        }

        return getLayoutPositions(true);
    }

    function buildEdgePath(from, to, horizontal) {
        const c1 = nodeCenter(from);
        const c2 = nodeCenter(to);
        if (!horizontal) {
            return `M ${c1.x} ${from.y + from.h} L ${c2.x} ${to.y}`;
        }
        if (Math.abs(from.y - to.y) < 8) {
            return `M ${from.x + from.w} ${c1.y} L ${to.x} ${c2.y}`;
        }
        const exitY = from.y + from.h;
        const enterY = to.y;
        const midY = (exitY + enterY) / 2;
        const x1 = from.x + from.w / 2;
        const x2 = to.x + to.w / 2;
        return `M ${x1} ${exitY} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${enterY}`;
    }

    function getAccentColors() {
        const s = getComputedStyle(document.documentElement);
        return {
            a: s.getPropertyValue('--accent').trim() || '#22d3ee',
            b: s.getPropertyValue('--accent-2').trim() || '#a78bfa',
        };
    }

    function nodeCenter(pos) {
        return { x: pos.x + pos.w / 2, y: pos.y + pos.h / 2 };
    }

    function renderPipelineGraph() {
        const svg = document.getElementById('pipelineSvg');
        if (!svg) return;

        const layout = getLayoutPositions(true);
        const { positions, width, height, swimlanes } = layout;
        const horizontal = true;
        const colors = getAccentColors();

        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.innerHTML = '';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.setAttribute('id', 'pipelineEdgeGrad');
        grad.setAttribute('x1', '0%');
        grad.setAttribute('y1', '0%');
        grad.setAttribute('x2', '100%');
        grad.setAttribute('y2', '0%');
        grad.innerHTML = `<stop offset="0%" stop-color="${colors.a}"/><stop offset="100%" stop-color="${colors.b}"/>`;
        defs.appendChild(grad);
        svg.appendChild(defs);

        const lanesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        lanesG.setAttribute('class', 'pipeline-lanes');
        if (swimlanes) {
            LANE_LABELS.forEach((lane) => {
                const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                t.setAttribute('x', 12);
                t.setAttribute('y', lane.y);
                t.setAttribute('class', 'pipeline-lane-label');
                t.textContent = lane.text;
                lanesG.appendChild(t);
            });
            svg.appendChild(lanesG);
        }

        const edgesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const particlesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        particlesG.setAttribute('class', 'pipeline-particles-layer');
        const nodesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        activePaths = [];

        PIPELINE.edges.forEach((edge) => {
            const from = positions[edge.from];
            const to = positions[edge.to];
            if (!from || !to) return;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const d = buildEdgePath(from, to, horizontal);
            path.setAttribute('d', d);
            path.setAttribute('class', 'pipeline-edge');
            path.dataset.from = edge.from;
            path.dataset.to = edge.to;
            if (edge.dash) path.classList.add('is-dashed');
            if (edge.incremental) path.classList.add('is-incremental-only');
            if (edge.bulk && !edge.incremental) path.classList.add('is-bulk-only');
            edgesG.appendChild(path);
            activePaths.push({ el: path, d, edge });
        });

        svg.appendChild(edgesG);
        svg.appendChild(particlesG);

        PIPELINE.nodes.forEach((node) => {
            const pos = positions[node.id];
            if (!pos) return;
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', 'pipeline-node');
            g.setAttribute('tabindex', '0');
            g.setAttribute('role', 'button');
            g.setAttribute('aria-label', node.title);
            g.dataset.nodeId = node.id;

            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', pos.x);
            rect.setAttribute('y', pos.y);
            rect.setAttribute('width', pos.w);
            rect.setAttribute('height', pos.h);
            rect.setAttribute('rx', '8');
            rect.setAttribute('class', ['spark', 'delta', 'copy', 'snowflake'].includes(node.id) ? 'node-accent' : 'node-bg');

            const t1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            t1.setAttribute('class', 'node-title');
            t1.setAttribute('x', pos.x + pos.w / 2);
            t1.setAttribute('y', pos.y + (node.sub2 && !swimlanes ? 24 : 26));
            t1.textContent = node.title;

            const t2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            t2.setAttribute('class', 'node-sub');
            t2.setAttribute('x', pos.x + pos.w / 2);
            t2.setAttribute('y', pos.y + (node.sub2 && !swimlanes ? 40 : 42));
            t2.textContent = node.sub;

            g.appendChild(rect);
            g.appendChild(t1);
            g.appendChild(t2);
            if (node.sub2 && !swimlanes) {
                const t3 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                t3.setAttribute('class', 'node-sub');
                t3.setAttribute('x', pos.x + pos.w / 2);
                t3.setAttribute('y', pos.y + 52);
                t3.textContent = node.sub2;
                g.appendChild(t3);
            }

            g.addEventListener('click', () => selectPipelineNode(node.id));
            g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPipelineNode(node.id); } });
            g.addEventListener('mouseenter', () => highlightGraph(node.id));
            g.addEventListener('mouseleave', () => { if (!selectedNodeId) clearGraphHighlight(); else highlightGraph(selectedNodeId); });
            g.addEventListener('focus', () => highlightGraph(node.id));

            nodesG.appendChild(g);
        });

        svg.appendChild(nodesG);
        startPipelineParticles(particlesG);
        applyPipelineModeClass();
    }

    function applyPipelineModeClass() {
        document.body.classList.toggle('pipeline-mode-incremental', pipelineMode === 'incremental');
        const modeEl = document.getElementById('heroRunMode');
        if (modeEl) modeEl.textContent = pipelineMode;
    }

    function highlightGraph(focusId) {
        const related = new Set([focusId]);
        PIPELINE.edges.forEach((e) => {
            if (e.from === focusId) related.add(e.to);
            if (e.to === focusId) related.add(e.from);
        });

        document.querySelectorAll('.pipeline-node').forEach((n) => {
            const id = n.dataset.nodeId;
            n.classList.toggle('is-dimmed', !related.has(id));
            n.classList.toggle('is-active', id === focusId);
        });

        document.querySelectorAll('.pipeline-edge').forEach((p) => {
            const hit = p.dataset.from === focusId || p.dataset.to === focusId;
            p.classList.toggle('is-highlight', hit);
            p.classList.toggle('is-dimmed', !hit);
        });
    }

    function clearGraphHighlight() {
        document.querySelectorAll('.pipeline-node, .pipeline-edge').forEach((el) => {
            el.classList.remove('is-dimmed', 'is-active', 'is-highlight');
        });
    }

    function selectPipelineNode(id) {
        selectedNodeId = id;
        highlightGraph(id);
        const node = PIPELINE.nodes.find((n) => n.id === id);
        const panel = document.getElementById('pipelineDetail');
        if (!node || !panel) return;
        panel.classList.remove('hidden');
        panel.innerHTML = `
            <h3>${node.title}</h3>
            <p class="pipeline-detail-meta mono">${node.project} · ${node.sub}</p>
            <p class="text-muted">${node.details}</p>
            <div class="pipeline-detail-tags">${node.techs.map((t) => `<span class="tech-tag">${t}</span>`).join('')}</div>
        `;
    }

    function startPipelineParticles(container) {
        if (prefersReducedMotion || !container) return;
        if (particleAnim) cancelAnimationFrame(particleAnim);
        const dots = [];
        activePaths.forEach((pathInfo, idx) => {
            if (pipelineMode === 'incremental' && pathInfo.edge.bulk && !pathInfo.edge.incremental) return;
            if (pipelineMode === 'bulk' && pathInfo.edge.incremental && !pathInfo.edge.bulk) return;
            for (let i = 0; i < 2; i++) {
                const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                c.setAttribute('r', '3');
                c.setAttribute('fill', getAccentColors().a);
                container.appendChild(c);
                const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathEl.setAttribute('d', pathInfo.d);
                dots.push({ el: c, path: pathEl, t: Math.random(), speed: 0.003 + Math.random() * 0.002 });
            }
        });

        const tick = () => {
            dots.forEach((d) => {
                d.t = (d.t + d.speed) % 1;
                const len = d.path.getTotalLength();
                const pt = d.path.getPointAtLength(d.t * len);
                d.el.setAttribute('cx', pt.x);
                d.el.setAttribute('cy', pt.y);
            });
            particleAnim = requestAnimationFrame(tick);
        };
        tick();
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(renderPipelineGraph, 200);
    });

    document.querySelectorAll('[data-pipeline-mode]').forEach((btn) => {
        btn.addEventListener('click', () => {
            pipelineMode = btn.getAttribute('data-pipeline-mode');
            document.querySelectorAll('.mode-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
            applyPipelineModeClass();
            renderPipelineGraph();
            appendConsole(`$ mode switched → ${pipelineMode}`);
        });
    });

    const consoleEl = document.getElementById('pipelineConsole');
    function appendConsole(line) {
        if (!consoleEl) return;
        consoleEl.textContent += (consoleEl.textContent ? '\n' : '') + line;
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    async function runPipelineSimulation() {
        const btn = document.getElementById('runPipelineBtn');
        const stateEl = document.getElementById('heroRunState');
        const rowsEl = document.getElementById('heroRowsMerged');
        if (btn) btn.disabled = true;
        if (stateEl) stateEl.textContent = 'running';
        if (consoleEl) consoleEl.textContent = '$ pipeline run started…';

        const seq = pipelineMode === 'incremental' ? PIPELINE.runSequenceIncremental : PIPELINE.runSequenceBulk;
        const delay = (ms) => new Promise((r) => setTimeout(r, ms));

        for (const id of seq) {
            selectPipelineNode(id);
            appendConsole(PIPELINE.runLogs[id] || `[${id}] ok`);
            await delay(prefersReducedMotion ? 50 : 650);
        }
        appendConsole('[orch] status: OK · job complete');
        if (stateEl) stateEl.textContent = 'ok';
        if (rowsEl) rowsEl.textContent = '60M+';
        if (btn) btn.disabled = false;
    }

    const runBtn = document.getElementById('runPipelineBtn');
    if (runBtn) runBtn.addEventListener('click', runPipelineSimulation);
    window.PortfolioApp.runPipeline = runPipelineSimulation;

    renderPipelineGraph();

    // --- Skill cross-link ---
    document.querySelectorAll('.skill-tag').forEach((tag) => {
        const key = tag.textContent.trim();
        tag.classList.add('is-linkable');
        tag.dataset.skillKey = key;
        tag.addEventListener('click', () => highlightSkill(key));
    });

    function highlightSkill(key) {
        const norm = key.toLowerCase();
        document.querySelectorAll('.skill-tag').forEach((t) => {
            t.classList.toggle('is-highlight', t.textContent.trim().toLowerCase().includes(norm) || norm.includes(t.textContent.trim().toLowerCase()));
        });
        document.querySelectorAll('.timeline-body li, .timeline-body mark').forEach((el) => {
            el.classList.toggle('is-skill-highlight', el.textContent.toLowerCase().includes(norm));
        });
        PIPELINE.nodes.forEach((n) => {
            const match = (n.keywords || []).some((k) => k.toLowerCase().includes(norm) || norm.includes(k.toLowerCase()));
            const g = document.querySelector(`.pipeline-node[data-node-id="${n.id}"]`);
            if (g) g.classList.toggle('is-skill-highlight', match);
        });
        showNotification(`Highlighted: ${key}`, 'success');
    }

    // --- Command palette ---
    const palette = document.getElementById('cmdPalette');
    const paletteInput = document.getElementById('cmdPaletteInput');
    const paletteList = document.getElementById('cmdPaletteList');
    let paletteIndex = 0;
    let filteredCommands = [];

    const COMMANDS = [
        { label: 'Go to Home', action: () => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: 'Go to Pipeline', action: () => document.getElementById('pipeline')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: 'Go to Experience', action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: 'Go to Contact', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: 'Run pipeline simulation', action: () => runPipelineSimulation() },
        { label: 'Theme: Pipeline', action: () => setTheme('pipeline') },
        { label: 'Theme: Spark', action: () => setTheme('spark') },
        { label: 'Theme: Delta', action: () => setTheme('delta') },
        { label: 'Theme: Aurora', action: () => setTheme('aurora') },
        { label: 'Copy email', action: () => navigator.clipboard?.writeText('akashaku32@gmail.com').then(() => showNotification('Email copied', 'success')) },
        { label: 'Open LinkedIn', action: () => window.open('https://www.linkedin.com/in/akash-c-99a120201', '_blank') },
        { label: 'Download resume', action: () => { const a = document.createElement('a'); a.href = 'assets/akash-resume.pdf'; a.download = ''; a.click(); } },
    ];

    function renderPaletteList(items) {
        if (!paletteList) return;
        paletteList.innerHTML = '';
        items.forEach((cmd, i) => {
            const li = document.createElement('li');
            li.className = `cmd-palette-item${i === paletteIndex ? ' is-selected' : ''}`;
            li.setAttribute('role', 'option');
            li.innerHTML = `<span>${cmd.label}</span>`;
            li.addEventListener('click', () => { closePalette(); cmd.action(); });
            paletteList.appendChild(li);
        });
    }

    function openPalette() {
        if (!palette) return;
        palette.classList.add('is-open');
        palette.setAttribute('aria-hidden', 'false');
        filteredCommands = [...COMMANDS];
        paletteIndex = 0;
        renderPaletteList(filteredCommands);
        paletteInput.value = '';
        paletteInput.focus();
    }

    function closePalette() {
        if (!palette) return;
        palette.classList.remove('is-open');
        palette.setAttribute('aria-hidden', 'true');
    }

    function filterPalette(q) {
        const qq = q.toLowerCase();
        filteredCommands = COMMANDS.filter((c) => c.label.toLowerCase().includes(qq));
        paletteIndex = 0;
        renderPaletteList(filteredCommands);
    }

    if (paletteInput) {
        paletteInput.addEventListener('input', () => filterPalette(paletteInput.value));
        paletteInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); paletteIndex = Math.min(paletteIndex + 1, filteredCommands.length - 1); renderPaletteList(filteredCommands); }
            if (e.key === 'ArrowUp') { e.preventDefault(); paletteIndex = Math.max(paletteIndex - 1, 0); renderPaletteList(filteredCommands); }
            if (e.key === 'Enter' && filteredCommands[paletteIndex]) { closePalette(); filteredCommands[paletteIndex].action(); }
            if (e.key === 'Escape') closePalette();
        });
    }

    document.querySelectorAll('[data-close-palette]').forEach((el) => el.addEventListener('click', closePalette));
    document.getElementById('openPaletteBtn')?.addEventListener('click', openPalette);

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
        if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
            e.preventDefault();
            openPalette();
        }
    });

    // --- Copy / form ---
    document.querySelectorAll('[data-copy]').forEach((btn) => {
        btn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(btn.getAttribute('data-copy'));
                showNotification('Copied to clipboard', 'success');
            } catch {
                showNotification('Could not copy', 'error');
            }
        });
    });

    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = this.querySelector('#name')?.value?.trim();
            const email = this.querySelector('#email')?.value?.trim();
            const subject = this.querySelector('#subject')?.value?.trim();
            const message = this.querySelector('#message')?.value?.trim();
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showNotification('Please enter a valid email', 'error');
                return;
            }
            const submitBtn = this.querySelector('button[type="submit"]');
            const original = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
            submitBtn.disabled = true;
            setTimeout(() => {
                showNotification("Thanks — I'll get back to you soon.", 'success');
                this.reset();
                submitBtn.innerHTML = original;
                submitBtn.disabled = false;
            }, 1600);
        });
    }

    function showNotification(message, type = 'success') {
        document.querySelectorAll('.notification').forEach((n) => n.remove());
        const el = document.createElement('div');
        el.className = `notification notification-${type}`;
        el.innerHTML = `<div class="notification-content"><i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${message}</span></div>`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4500);
    }

    // --- GSAP ---
    function initGsap() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            document.querySelectorAll('.reveal-item').forEach((el) => { el.style.opacity = '1'; });
            typeAboutTerminal();
            animateKpisInstant();
            return;
        }
        gsap.registerPlugin(ScrollTrigger);
        if (prefersReducedMotion) {
            typeAboutTerminal();
            animateKpisInstant();
            return;
        }

        const revealEls = gsap.utils.toArray('.reveal-item');
        const heroReveals = revealEls.filter((el) => el.closest('.hero'));
        const sectionReveals = revealEls.filter((el) => !el.closest('.hero'));

        if (heroReveals.length) {
            gsap.fromTo(heroReveals, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.08, ease: 'power2.out', delay: 0.15 });
        }
        sectionReveals.forEach((el) => {
            gsap.fromTo(el, { y: 36, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.75, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            });
        });

        document.querySelectorAll('.kpi-value[data-counter]').forEach((el) => {
            if (el.dataset.animated === '1') return;
            el.dataset.animated = '1';
            const target = parseFloat(el.getAttribute('data-counter'));
            const suffix = el.getAttribute('data-suffix') || '';
            const obj = { val: 0 };
            gsap.to(obj, { val: target, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = `${Math.round(obj.val)}${suffix}`; } });
        });

        const progress = document.getElementById('timelineProgress');
        const timeline = document.getElementById('experienceTimeline');
        if (progress && timeline) {
            gsap.fromTo(progress, { height: '0%' }, {
                height: '100%', ease: 'none',
                scrollTrigger: { trigger: timeline, start: 'top 70%', end: 'bottom 50%', scrub: 0.4 },
            });
        }

        ScrollTrigger.create({ trigger: '#about', start: 'top 75%', once: true, onEnter: typeAboutTerminal });

        ScrollTrigger.create({
            trigger: '#pipeline',
            start: 'top 92%',
            once: true,
            onEnter: () => {
                gsap.utils.toArray('#pipeline .reveal-item').forEach((el) => {
                    gsap.to(el, { opacity: 1, y: 0, duration: 0.5, overwrite: true });
                });
            },
        });

        const pipelineGraph = document.getElementById('interactivePipelineWrap');
        if (pipelineGraph) {
            gsap.set(pipelineGraph, { opacity: 1, y: 0, clearProps: 'transform' });
        }

        ScrollTrigger.refresh();
    }

    function animateKpisInstant() {
        document.querySelectorAll('.kpi-value[data-counter]').forEach((el) => {
            el.textContent = `${el.getAttribute('data-counter')}${el.getAttribute('data-suffix') || ''}`;
        });
    }

    window.addEventListener('load', () => {
        initGsap();
        renderPipelineGraph();
        requestAnimationFrame(() => renderPipelineGraph());
    });

    if (document.readyState === 'complete') {
        renderPipelineGraph();
    } else {
        document.addEventListener('DOMContentLoaded', renderPipelineGraph);
    }
})();
