const apiBase = window.location.origin.replace(/:\d+$/, ':5000');

const settingsKey = 'tca.settings';
const defaultSettings = {
  strict: true,
  websocketEnabled: false,
  rules: {
    'no-var': true,
    'prefer-const': true,
    'no-console': true,
    'no-non-null-assertion': true,
  },
};

const loadSettings = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(settingsKey));
    return { ...defaultSettings, ...stored };
  } catch (error) {
    return defaultSettings;
  }
};

const saveSettings = (settings) => {
  localStorage.setItem(settingsKey, JSON.stringify(settings));
};

const request = async (path, options = {}) => {
  const response = await fetch(`${apiBase}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
};

const renderHome = () => {
  return `
    <section class="section">
      <h2>Production-ready TypeScript analysis in one workspace.</h2>
      <p>Analyze, refactor, and manage TypeScript snippets with deterministic rules and quick fixes.</p>
      <div class="grid">
        <div class="card">
          <h3>Analysis Engine</h3>
          <p>Rule-based diagnostics with clear explanations.</p>
        </div>
        <div class="card">
          <h3>Quick Fixes</h3>
          <p>Apply targeted refactors safely.</p>
        </div>
        <div class="card">
          <h3>Snippet Library</h3>
          <p>Save and revisit analysis runs.</p>
        </div>
      </div>
    </section>
  `;
};

const renderEditor = async () => {
  const container = document.getElementById('app');
  const settings = loadSettings();
  const params = new URLSearchParams(window.location.search);
  const autoAnalyze = params.get('auto') === '1' || params.get('quickFix') === '1';
  const autoQuickFix = params.get('quickFix') === '1';
  let diagnostics = [];
  let preview = '';
  let selectedFix = null;

  container.innerHTML = `
    <section class="section">
      <div style="display:flex; gap:12px; align-items:center;">
        <button class="button button--primary" id="analyze">Analyze</button>
        <button class="button button--secondary" id="format">Format</button>
      </div>
      <div class="editor-layout" style="margin-top:16px;">
        <div class="editor-pane">
          <textarea class="code-textarea" id="code">import { useState } from 'react';\n\nvar count = 0;\n\nconsole.log(count);\n</textarea>
        </div>
        <div class="editor-sidebar">
          <div class="panel" id="summary"></div>
          <div class="panel" id="diagnostics"></div>
        </div>
      </div>
    </section>
    <section class="panel">
      <h3>Quick Fix Preview</h3>
      <div id="preview"></div>
    </section>
  `;

  const codeEl = document.getElementById('code');
  const diagnosticsEl = document.getElementById('diagnostics');
  const summaryEl = document.getElementById('summary');
  const previewEl = document.getElementById('preview');

  const renderDiagnostics = () => {
    summaryEl.innerHTML = `
      <h3>Analysis Summary</h3>
      <p>Errors: ${diagnostics.filter((d) => d.severity === 'error').length}</p>
      <p>Warnings: ${diagnostics.filter((d) => d.severity === 'warning').length}</p>
      <p>Info: ${diagnostics.filter((d) => d.severity === 'info').length}</p>
    `;
    diagnosticsEl.innerHTML = diagnostics.length
      ? diagnostics
          .map((diag, index) => {
            const fixes = diag.quickFixes
              .map(
                (fix) =>
                  `<button class="button button--secondary" data-fix="${index}:${fix.id}">${fix.title}</button>`,
              )
              .join('');
            return `
              <div class="diagnostic diagnostic--${diag.severity}">
                <div><strong>${diag.ruleId}</strong> (${diag.severity})</div>
                <p>${diag.message}</p>
                <p>${diag.explanation}</p>
                <div>${fixes}</div>
              </div>
            `;
          })
          .join('')
      : '<p>No diagnostics found.</p>';
  };

  const renderPreview = () => {
    if (!selectedFix) {
      previewEl.innerHTML = '<p>Select a quick fix to preview changes.</p>';
      return;
    }
    previewEl.innerHTML = `
      <p><strong>${selectedFix.title}</strong></p>
      <div class="diff-grid">
        <div><h4>Before</h4><pre>${codeEl.value}</pre></div>
        <div><h4>After</h4><pre>${preview}</pre></div>
      </div>
      <button class="button button--primary" id="apply">Apply Quick Fix</button>
    `;
    document.getElementById('apply').addEventListener('click', () => {
      codeEl.value = preview;
      selectedFix = null;
      preview = '';
      renderPreview();
    });
  };

  const analyze = async () => {
    const data = await request('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        code: codeEl.value,
        fileName: 'editor.tsx',
        strict: settings.strict,
        rules: settings.rules,
      }),
    });
    diagnostics = data.diagnostics;
    renderDiagnostics();
    if (autoQuickFix && diagnostics.length > 0) {
      const fix = diagnostics[0].quickFixes[0];
      if (fix) {
        await selectFix(fix);
      }
    }
  };

  const selectFix = async (fix) => {
    selectedFix = fix;
    const data = await request('/api/refactor', {
      method: 'POST',
      body: JSON.stringify({
        code: codeEl.value,
        quickFixId: fix.id,
        fileName: 'editor.tsx',
      }),
    });
    preview = data.updatedCode;
    renderPreview();
  };

  diagnosticsEl.addEventListener('click', (event) => {
    const target = event.target;
    if (target.dataset && target.dataset.fix) {
      const [index, fixId] = target.dataset.fix.split(':');
      const fix = diagnostics[Number(index)].quickFixes.find((item) => item.id === fixId);
      if (fix) {
        selectFix(fix);
      }
    }
  });

  document.getElementById('analyze').addEventListener('click', analyze);
  document.getElementById('format').addEventListener('click', async () => {
    const data = await request('/api/format', {
      method: 'POST',
      body: JSON.stringify({ code: codeEl.value }),
    });
    codeEl.value = data.formatted;
  });

  renderDiagnostics();
  renderPreview();

  if (autoAnalyze) {
    analyze();
  }
};

const renderSnippets = async () => {
  const container = document.getElementById('app');
  container.innerHTML = `
    <section class="section">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h2>Snippets Library</h2>
        <button class="button button--secondary" id="new">New Snippet</button>
      </div>
      <div id="snippet-list"></div>
    </section>
    <section class="section">
      <h2 id="editor-title">Create Snippet</h2>
      <input type="text" id="snippet-title" placeholder="Title" />
      <div class="editor-pane" style="margin-top:12px;">
        <textarea class="code-textarea" id="snippet-code"></textarea>
      </div>
      <div style="margin-top:12px;">
        <button class="button button--primary" id="save">Save</button>
      </div>
    </section>
  `;

  let activeSnippet = null;

  const listEl = document.getElementById('snippet-list');
  const titleEl = document.getElementById('snippet-title');
  const codeEl = document.getElementById('snippet-code');
  const editorTitle = document.getElementById('editor-title');

  const refresh = async () => {
    const snippets = await request('/api/snippets');
    listEl.innerHTML = snippets
      .map(
        (snippet) => `
          <div class="list-card">
            <div>
              <h3>${snippet.title}</h3>
              <small>Updated ${new Date(snippet.updatedAt).toLocaleString()}</small>
            </div>
            <div>
              <button class="button button--secondary" data-open="${snippet.id}">Open</button>
              <button class="button button--ghost" data-delete="${snippet.id}">Delete</button>
            </div>
          </div>
        `,
      )
      .join('');
  };

  listEl.addEventListener('click', async (event) => {
    const target = event.target;
    if (target.dataset.open) {
      const snippet = await request(`/api/snippets/${target.dataset.open}`);
      activeSnippet = snippet;
      titleEl.value = snippet.title;
      codeEl.value = snippet.code;
      editorTitle.textContent = 'Edit Snippet';
    }
    if (target.dataset.delete) {
      await request(`/api/snippets/${target.dataset.delete}`, { method: 'DELETE' });
      if (activeSnippet && activeSnippet.id === target.dataset.delete) {
        activeSnippet = null;
        titleEl.value = '';
        codeEl.value = '';
        editorTitle.textContent = 'Create Snippet';
      }
      refresh();
    }
  });

  document.getElementById('save').addEventListener('click', async () => {
    const payload = { title: titleEl.value || 'Untitled', code: codeEl.value };
    if (activeSnippet) {
      activeSnippet = await request(`/api/snippets/${activeSnippet.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } else {
      activeSnippet = await request('/api/snippets', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }
    editorTitle.textContent = 'Edit Snippet';
    refresh();
  });

  document.getElementById('new').addEventListener('click', () => {
    activeSnippet = null;
    titleEl.value = '';
    codeEl.value = '';
    editorTitle.textContent = 'Create Snippet';
  });

  await refresh();
};

const renderRuns = async () => {
  const container = document.getElementById('app');
  const runs = await request('/api/runs');
  container.innerHTML = `
    <section class="section">
      <h2>Analysis History</h2>
      ${
        runs.length
          ? runs
              .map(
                (run) => `
            <div class="list-card">
              <div>
                <h3>${run.fileName || 'Untitled run'}</h3>
                <small>${new Date(run.createdAt).toLocaleString()}</small>
              </div>
              <div>
                <span>Errors: ${run.summary.errorCount}</span>
                <span>Warnings: ${run.summary.warningCount}</span>
                <span>Info: ${run.summary.infoCount}</span>
              </div>
            </div>
          `,
              )
              .join('')
          : '<p>No runs yet.</p>'
      }
    </section>
  `;
};

const renderSettings = () => {
  const container = document.getElementById('app');
  const settings = loadSettings();
  container.innerHTML = `
    <section class="section">
      <h2>Settings</h2>
      <label><input type="checkbox" id="strict" ${settings.strict ? 'checked' : ''} /> Strict mode</label>
      <h3>Rules</h3>
      ${Object.entries(settings.rules)
        .map(
          ([rule, enabled]) => `
          <label><input type="checkbox" data-rule="${rule}" ${enabled ? 'checked' : ''} /> ${rule}</label>
        `,
        )
        .join('')}
    </section>
  `;

  document.getElementById('strict').addEventListener('change', (event) => {
    settings.strict = event.target.checked;
    saveSettings(settings);
  });

  container.querySelectorAll('[data-rule]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      settings.rules[event.target.dataset.rule] = event.target.checked;
      saveSettings(settings);
    });
  });
};

const router = async () => {
  const path = window.location.pathname;
  if (path === '/editor') {
    await renderEditor();
    return;
  }
  if (path === '/snippets') {
    await renderSnippets();
    return;
  }
  if (path === '/runs') {
    await renderRuns();
    return;
  }
  if (path === '/settings') {
    renderSettings();
    return;
  }
  document.getElementById('app').innerHTML = renderHome();
};

router();
