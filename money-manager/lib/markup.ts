// Static app shell; behaviour lives in public/app.js
import { logoSvg } from "./logo";

export const markup = `
<div class="field" aria-hidden="true"><i></i><i></i><i></i><i></i></div>

<div class="wrap">
  <div class="top">
    ${logoSvg({ className: "app-icon", label: "Money Manager Logo" })}
    <div class="glass pill" id="syncPill"><span class="dot"></span><span id="sync">Lädt …</span></div>
    <button class="glass icon-btn" id="eye" aria-label="Kontostand verbergen"></button>
  </div>

  <div>
    <h1 class="large-title" id="pageTitle">Übersicht</h1>
    <p class="subtitle">Money Manager</p>
  </div>

  <!-- HOME -->
  <div class="view" id="view-home">
    <section class="glass hero" aria-label="Kontostand">
      <div class="label">Verfügbar</div>
      <div class="big num" id="balance">0,00 €</div>
      <div class="stats">
        <div class="stat in"><span>Rein · Monat</span><b id="mIn">0,00 €</b></div>
        <div class="stat out"><span>Raus · Monat</span><b id="mOut">0,00 €</b></div>
        <div class="stat sv"><span>Gespart</span><b id="mSaved">0,00 €</b></div>
      </div>
      <p class="insight" id="insight" hidden></p>
    </section>

    <div class="sh"><span>Verlauf</span><span id="countLabel"></span></div>
    <section class="glass card">
      <label class="search"><span id="searchIco"></span><input id="q" type="search" placeholder="Suchen, z. B. Oma oder Döner" autocomplete="off" aria-label="Verlauf durchsuchen"></label>
      <div class="chips" id="filterChips" style="margin-bottom:6px"></div>
      <div id="history"></div>
    </section>
  </div>

  <!-- STATS -->
  <div class="view" id="view-stats" hidden>
    <div class="sh"><span>Letzte 6 Monate</span></div>
    <section class="glass card">
      <div id="chart"></div>
      <div class="legend"><span><i style="background:var(--green)"></i>Bekommen</span><span><i style="background:var(--red)"></i>Ausgegeben</span></div>
    </section>
    <div class="sh"><span>Ausgaben</span><span id="outMonthLabel"></span></div>
    <section class="glass card"><div class="bars" id="catOut"></div></section>
    <div class="sh"><span>Woher dein Geld kommt</span><span>insgesamt</span></div>
    <section class="glass card"><div class="bars" id="catIn"></div></section>
  </div>

  <!-- GOALS -->
  <div class="view" id="view-goals" hidden>
    <div class="sh"><span>Neues Sparziel</span></div>
    <form class="glass card stack" id="goalForm">
      <div class="group">
        <label><span>Name</span><input id="goalName" placeholder="z. B. Neue Sneaker" autocomplete="off"></label>
        <label><span>Ziel</span><input id="goalTarget" inputmode="decimal" placeholder="120,00 €"></label>
        <label><span>Bis wann? <small style="color:var(--muted);font-weight:400">optional</small></span><input id="goalDeadline" type="date"></label>
      </div>
      <p class="msg" id="goalMsg"></p>
      <button class="btn" type="submit">Hinzufügen</button>
    </form>
    <div class="sh"><span>Meine Ziele</span></div>
    <div id="goalList" class="stack"></div>
  </div>

  <!-- SETTINGS -->
  <div class="view" id="view-settings" hidden>
    <div class="sh"><span>Monatliches Taschengeld</span></div>
    <section class="glass card stack">
      <div class="group">
        <div class="gr"><span>Automatisch eintragen</span><button class="toggle" id="alEnabled" role="switch" aria-checked="false" aria-label="Taschengeld automatisch eintragen"></button></div>
        <label><span>Betrag</span><input id="alAmount" inputmode="decimal" placeholder="20,00 €"></label>
        <label><span>Tag im Monat</span><select id="alDay"></select></label>
      </div>
      <p class="hint" id="alHint"></p>
    </section>

    <div class="sh"><span>Privatsphäre</span></div>
    <section class="glass card">
      <div class="group">
        <div class="gr"><span>Kontostand verbergen</span><button class="toggle" id="hideToggle" role="switch" aria-checked="false" aria-label="Kontostand verbergen"></button></div>
      </div>
    </section>

    <div class="sh"><span>Backup</span></div>
    <section class="glass card stack">
      <div class="group">
        <button class="gr btnrow" id="expJson" type="button"><span>Backup speichern (.json)</span></button>
        <button class="gr btnrow" id="expCsv" type="button"><span>Als Tabelle speichern (.csv)</span></button>
        <button class="gr btnrow" id="copyJson" type="button" hidden><span>Backup in die Zwischenablage kopieren</span></button>
        <label class="gr btnrow" for="impFile" style="cursor:pointer"><span>Backup laden …</span><input id="impFile" type="file" accept="application/json,.json" hidden></label>
      </div>
      <p class="hint">Mit einem Backup kannst du deine Daten sichern oder auf ein anderes Gerät übertragen.</p>
    </section>

    <div class="sh"><span>Daten</span></div>
    <section class="glass card">
      <div class="group" id="resetGroup">
        <button class="gr btnrow danger" id="reset" type="button"><span>Alle Daten löschen</span></button>
      </div>
    </section>
  </div>

  <footer id="footnote">Deine Einträge werden in diesem Browser gespeichert.</footer>
</div>

<div class="dock">
  <nav class="glass tabbar" role="tablist" aria-label="Bereiche">
    <button role="tab" data-tab="home" data-title="Übersicht" aria-selected="true"></button>
    <button role="tab" data-tab="stats" data-title="Statistik" aria-selected="false"></button>
    <button role="tab" data-tab="goals" data-title="Sparziele" aria-selected="false"></button>
    <button role="tab" data-tab="settings" data-title="Einstellungen" aria-selected="false"></button>
  </nav>
  <button class="glass fab" id="fab" aria-label="Neuer Eintrag"></button>
</div>

<div class="toast glass" id="toast" role="status" hidden><span id="toastText"></span><button id="toastUndo" type="button">Rückgängig</button></div>

<div class="sheet-wrap" id="sheet" hidden>
  <div class="scrim" data-close></div>
  <form class="glass sheet" id="sheetForm" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
    <div class="grabber" aria-hidden="true"></div>
    <div class="sheet-head">
      <button type="button" class="txtbtn" data-close>Abbrechen</button>
      <h2 id="sheetTitle">Neuer Eintrag</h2>
      <span></span>
    </div>
    <div class="seg" role="group" aria-label="Art">
      <button type="button" id="sIn" class="in" aria-pressed="true">Bekommen</button>
      <button type="button" id="sOut" class="out" aria-pressed="false">Ausgegeben</button>
    </div>
    <label class="amount"><input id="sAmount" inputmode="decimal" placeholder="0" autocomplete="off" aria-label="Betrag in Euro"><span>€</span></label>
    <div class="quick" id="sQuick"></div>
    <div class="catgrid" id="sCats"></div>
    <div class="group">
      <label><span>Datum</span><input id="sDate" type="date"></label>
      <label><span>Notiz</span><input id="sNote" placeholder="z. B. von Oma" autocomplete="off" maxlength="80"></label>
    </div>
    <p class="msg" id="sMsg"></p>
    <button class="btn" type="submit" id="sSave">Speichern</button>
    <button class="btn danger" type="button" id="sDelete" hidden>Eintrag löschen</button>
  </form>
</div>
`;
