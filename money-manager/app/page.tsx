"use client";

import { useEffect, useMemo, useState } from "react";

type TxType = "in" | "out";

type Transaction = {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO yyyy-mm-dd
};

type Allowance = {
  enabled: boolean;
  amount: number;
  day: number; // 1-28
  lastApplied: string | null; // yyyy-mm
};

type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
};

type Data = {
  transactions: Transaction[];
  allowance: Allowance;
  goals: Goal[];
};

const STORAGE_KEY = "money-manager-v1";

const IN_CATEGORIES = [
  { name: "Taschengeld", emoji: "💶" },
  { name: "Bayram", emoji: "🌙" },
  { name: "Geburtstag", emoji: "🎂" },
  { name: "Geschenk", emoji: "🎁" },
  { name: "Job / Hilfe", emoji: "🧹" },
  { name: "Sonstiges", emoji: "✨" },
];

const OUT_CATEGORIES = [
  { name: "Essen & Trinken", emoji: "🍔" },
  { name: "Spiele", emoji: "🎮" },
  { name: "Kleidung", emoji: "👕" },
  { name: "Freizeit", emoji: "🎟️" },
  { name: "Schule", emoji: "📚" },
  { name: "Sonstiges", emoji: "🛒" },
];

const DEFAULT_DATA: Data = {
  transactions: [],
  allowance: { enabled: false, amount: 20, day: 1, lastApplied: null },
  goals: [],
};

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const fmt = (n: number) => euro.format(n);
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const today = () => new Date().toISOString().slice(0, 10);
const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

function emojiFor(tx: Transaction) {
  if (tx.category === "Sparziel") return "🐷";
  const list = tx.type === "in" ? IN_CATEGORIES : OUT_CATEGORIES;
  return list.find((c) => c.name === tx.category)?.emoji ?? "💰";
}

/** Adds the monthly allowance for every month that has passed since it was last paid. */
function applyAllowance(data: Data): Data {
  const a = data.allowance;
  if (!a.enabled || a.amount <= 0) return data;
  const now = new Date();
  const newTx: Transaction[] = [];
  let cursor: Date;
  if (a.lastApplied) {
    const [y, m] = a.lastApplied.split("-").map(Number);
    cursor = new Date(y, m, 1); // the month after lastApplied
  } else {
    cursor = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  let last = a.lastApplied;
  while (true) {
    const payDate = new Date(cursor.getFullYear(), cursor.getMonth(), a.day);
    if (payDate > now) break;
    newTx.push({
      id: uid(),
      type: "in",
      amount: a.amount,
      category: "Taschengeld",
      note: "Monatliches Taschengeld (automatisch)",
      date: `${monthKey(payDate)}-${String(a.day).padStart(2, "0")}`,
    });
    last = monthKey(payDate);
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  if (newTx.length === 0) return data;
  return {
    ...data,
    transactions: [...newTx, ...data.transactions],
    allowance: { ...a, lastApplied: last },
  };
}

export default function Home() {
  const [data, setData] = useState<Data>(DEFAULT_DATA);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"overview" | "allowance" | "goals">("overview");

  // load
  useEffect(() => {
    let d = DEFAULT_DATA;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) d = { ...DEFAULT_DATA, ...JSON.parse(raw) };
    } catch {}
    setData(applyAllowance(d));
    setLoaded(true);
  }, []);

  // save
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data, loaded]);

  const balance = useMemo(
    () => data.transactions.reduce((s, t) => s + (t.type === "in" ? t.amount : -t.amount), 0),
    [data.transactions]
  );
  const totalSaved = data.goals.reduce((s, g) => s + g.saved, 0);

  const thisMonth = monthKey(new Date());
  const monthIn = data.transactions
    .filter((t) => t.type === "in" && t.date.startsWith(thisMonth))
    .reduce((s, t) => s + t.amount, 0);
  const monthOut = data.transactions
    .filter((t) => t.type === "out" && t.category !== "Sparziel" && t.date.startsWith(thisMonth))
    .reduce((s, t) => s + t.amount, 0);

  const addTx = (tx: Omit<Transaction, "id">) =>
    setData((d) => ({ ...d, transactions: [{ ...tx, id: uid() }, ...d.transactions] }));

  const deleteTx = (id: string) =>
    setData((d) => ({ ...d, transactions: d.transactions.filter((t) => t.id !== id) }));

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500 text-xl font-bold text-white shadow-md">
            M
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Money Manager</h1>
            <p className="text-sm text-slate-500">Dein Geld. Alles an einem Ort.</p>
          </div>
        </div>
      </header>

      {/* Balance card */}
      <section className="mb-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg">
        <p className="text-sm/6 opacity-90">Verfügbares Geld</p>
        <p className="mt-1 text-4xl font-bold tabular-nums sm:text-5xl">{fmt(balance)}</p>
        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
          <Stat label="Rein (Monat)" value={fmt(monthIn)} />
          <Stat label="Raus (Monat)" value={fmt(monthOut)} />
          <Stat label="Gespart 🐷" value={fmt(totalSaved)} />
        </div>
      </section>

      {/* Tabs */}
      <nav className="mb-6 grid grid-cols-3 gap-1 rounded-2xl bg-white p-1 shadow-sm">
        {(
          [
            ["overview", "Übersicht"],
            ["allowance", "Taschengeld"],
            ["goals", "Sparziele"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
              tab === key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <>
          <AddTransaction onAdd={addTx} />
          <TransactionList transactions={data.transactions} onDelete={deleteTx} />
        </>
      )}

      {tab === "allowance" && (
        <AllowanceSettings
          allowance={data.allowance}
          onSave={(a) => setData((d) => applyAllowance({ ...d, allowance: a }))}
        />
      )}

      {tab === "goals" && (
        <Goals
          goals={data.goals}
          balance={balance}
          onChange={(goals) => setData((d) => ({ ...d, goals }))}
          onTx={addTx}
        />
      )}

      <footer className="mt-10 text-center text-xs text-slate-400">
        Deine Daten werden nur in diesem Browser gespeichert.
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 px-3 py-2">
      <p className="text-xs opacity-85">{label}</p>
      <p className="font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
      {children}
    </section>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white";

function AddTransaction({ onAdd }: { onAdd: (tx: Omit<Transaction, "id">) => void }) {
  const [type, setType] = useState<TxType>("in");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(IN_CATEGORIES[0].name);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(today());

  const cats = type === "in" ? IN_CATEGORIES : OUT_CATEGORIES;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount.replace(",", "."));
    if (!value || value <= 0) return;
    onAdd({ type, amount: Math.round(value * 100) / 100, category, note: note.trim(), date });
    setAmount("");
    setNote("");
  };

  return (
    <Card title="Geld eintragen">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setType("in");
              setCategory(IN_CATEGORIES[0].name);
            }}
            className={`rounded-xl py-2.5 text-sm font-semibold transition ${
              type === "in" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            + Bekommen
          </button>
          <button
            type="button"
            onClick={() => {
              setType("out");
              setCategory(OUT_CATEGORIES[0].name);
            }}
            className={`rounded-xl py-2.5 text-sm font-semibold transition ${
              type === "out" ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            − Ausgegeben
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              type="button"
              key={c.name}
              onClick={() => setCategory(c.name)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                category === c.name
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Betrag (€)</span>
            <input
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputCls}
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Datum</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Notiz</span>
            <input
              placeholder="z. B. von Oma"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputCls}
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Speichern
        </button>
      </form>
    </Card>
  );
}

function TransactionList({
  transactions,
  onDelete,
}: {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}) {
  const [filter, setFilter] = useState<string>("Alle");
  const filters = ["Alle", "Taschengeld", "Bayram", "Geburtstag", "Ausgaben"];

  const list = [...transactions]
    .filter((t) => {
      if (filter === "Alle") return true;
      if (filter === "Ausgaben") return t.type === "out";
      return t.category === filter;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Card title="Verlauf">
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === f ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">Noch keine Einträge. Trag oben dein erstes Geld ein!</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {list.map((t) => (
            <li key={t.id} className="group flex items-center gap-3 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-lg">
                {emojiFor(t)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.category}</p>
                <p className="truncate text-xs text-slate-500">
                  {new Date(t.date).toLocaleDateString("de-DE")}
                  {t.note && ` · ${t.note}`}
                </p>
              </div>
              <span
                className={`text-sm font-semibold tabular-nums ${
                  t.type === "in" ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {t.type === "in" ? "+" : "−"}
                {fmt(t.amount)}
              </span>
              <button
                onClick={() => onDelete(t.id)}
                aria-label="Löschen"
                className="rounded-lg px-2 py-1 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function AllowanceSettings({
  allowance,
  onSave,
}: {
  allowance: Allowance;
  onSave: (a: Allowance) => void;
}) {
  const [enabled, setEnabled] = useState(allowance.enabled);
  const [amount, setAmount] = useState(String(allowance.amount).replace(".", ","));
  const [day, setDay] = useState(allowance.day);
  const [saved, setSaved] = useState(false);

  const save = () => {
    const value = parseFloat(amount.replace(",", ".")) || 0;
    // When turning it on for the first time, start fresh this month.
    const lastApplied =
      enabled && !allowance.enabled
        ? (() => {
            const now = new Date();
            const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return monthKey(prev);
          })()
        : allowance.lastApplied;
    onSave({ enabled, amount: value, day, lastApplied });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card title="Monatliches Taschengeld">
      <p className="mb-5 text-sm text-slate-500">
        Stell ein, wie viel Taschengeld du jeden Monat bekommst. Es wird dann automatisch zu deinem Geld
        hinzugefügt.
      </p>

      <label className="mb-5 flex cursor-pointer items-center justify-between rounded-2xl bg-slate-50 p-4">
        <span className="font-medium">Automatisch eintragen</span>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled(!enabled)}
          className={`relative h-7 w-12 rounded-full transition ${enabled ? "bg-emerald-500" : "bg-slate-300"}`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
              enabled ? "left-6" : "left-1"
            }`}
          />
        </button>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">Betrag pro Monat (€)</span>
          <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">Am wievielten Tag?</span>
          <select value={day} onChange={(e) => setDay(Number(e.target.value))} className={inputCls}>
            {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}. des Monats
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        onClick={save}
        className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        {saved ? "Gespeichert ✓" : "Speichern"}
      </button>

      {allowance.enabled && allowance.lastApplied && (
        <p className="mt-4 text-center text-xs text-slate-400">
          Zuletzt eingetragen für: {allowance.lastApplied.split("-").reverse().join("/")}
        </p>
      )}
    </Card>
  );
}

function Goals({
  goals,
  balance,
  onChange,
  onTx,
}: {
  goals: Goal[];
  balance: number;
  onChange: (g: Goal[]) => void;
  onTx: (tx: Omit<Transaction, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deposit, setDeposit] = useState<Record<string, string>>({});

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const t = parseFloat(target.replace(",", "."));
    if (!name.trim() || !t || t <= 0) return;
    onChange([...goals, { id: uid(), name: name.trim(), target: t, saved: 0 }]);
    setName("");
    setTarget("");
  };

  const move = (g: Goal, dir: 1 | -1) => {
    const v = parseFloat((deposit[g.id] || "").replace(",", "."));
    if (!v || v <= 0) return;
    if (dir === 1 && v > balance) return alert("Du hast nicht genug Geld dafür.");
    if (dir === -1 && v > g.saved) return alert("So viel ist in diesem Sparziel nicht drin.");
    onChange(goals.map((x) => (x.id === g.id ? { ...x, saved: x.saved + dir * v } : x)));
    onTx({
      type: dir === 1 ? "out" : "in",
      amount: v,
      category: "Sparziel",
      note: dir === 1 ? `Gespart für ${g.name}` : `Aus ${g.name} genommen`,
      date: today(),
    });
    setDeposit((d) => ({ ...d, [g.id]: "" }));
  };

  const remove = (g: Goal) => {
    if (!confirm(`Sparziel „${g.name}" löschen? Das gesparte Geld geht zurück auf dein Konto.`)) return;
    if (g.saved > 0)
      onTx({ type: "in", amount: g.saved, category: "Sparziel", note: `${g.name} aufgelöst`, date: today() });
    onChange(goals.filter((x) => x.id !== g.id));
  };

  return (
    <>
      <Card title="Neues Sparziel">
        <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_140px_auto]">
          <input placeholder="z. B. Neue Sneaker" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          <input inputMode="decimal" placeholder="Ziel (€)" value={target} onChange={(e) => setTarget(e.target.value)} className={inputCls} />
          <button className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
            Hinzufügen
          </button>
        </form>
      </Card>

      {goals.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">Noch keine Sparziele. Worauf sparst du?</p>
      ) : (
        goals.map((g) => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
          return (
            <Card key={g.id}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">🐷 {g.name}</p>
                  <p className="text-sm text-slate-500 tabular-nums">
                    {fmt(g.saved)} von {fmt(g.target)}
                  </p>
                </div>
                <button onClick={() => remove(g)} className="text-xs text-slate-400 hover:text-rose-500">
                  Löschen
                </button>
              </div>
              <div className="mb-1 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="mb-4 text-right text-xs font-medium text-slate-500">
                {pct >= 100 ? "Geschafft! 🎉" : `${pct} %`}
              </p>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  placeholder="Betrag"
                  value={deposit[g.id] || ""}
                  onChange={(e) => setDeposit((d) => ({ ...d, [g.id]: e.target.value }))}
                  className={inputCls}
                />
                <button
                  onClick={() => move(g, 1)}
                  className="shrink-0 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                  Sparen
                </button>
                <button
                  onClick={() => move(g, -1)}
                  className="shrink-0 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Nehmen
                </button>
              </div>
            </Card>
          );
        })
      )}
    </>
  );
}
