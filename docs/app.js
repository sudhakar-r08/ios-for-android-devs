// ============================================================================
// ANDROID TO iOS ACADEMY — INTERACTIVE APPLICATION ENGINE
// ============================================================================

const ROSETTA_ITEMS = [
  {
    category: "Language & Memory",
    concept: "Data Models",
    android: "data class User(val id: String)",
    ios: "struct User: Equatable, Codable, Sendable { let id: String }",
    shift: "Kotlin data classes are heap reference types. Swift structs are true value types copied on assignment."
  },
  {
    category: "Language & Memory",
    concept: "Memory Management",
    android: "JVM / ART Tracing Garbage Collector",
    ios: "ARC (Automatic Reference Counting)",
    shift: "ARC frees class instances deterministically at retainCount == 0. Break strong cycles with `weak` or `unowned`."
  },
  {
    category: "Language & Memory",
    concept: "Null / Nil Safety & Early Exit",
    android: "val u = user ?: return",
    ios: "guard let u = user else { return }",
    shift: "`guard let` is compiler-enforced to exit the scope on nil and keeps `u` unwrapped for the rest of the function."
  },
  {
    category: "Language & Memory",
    concept: "Algebraic State / Sum Types",
    android: "sealed interface UiState",
    ios: "enum UiState { case loading, success(Data) }",
    shift: "Swift enums natively hold associated values per case while remaining lightweight value types."
  },
  {
    category: "Language & Memory",
    concept: "Interfaces & Generics",
    android: "interface Repo<T>",
    ios: "protocol Repo<Item> { associatedtype Item }",
    shift: "Use `some Repo` (opaque compile-time type) for static dispatch performance; use `any Repo` for heterogeneous boxes."
  },
  {
    category: "UI Framework",
    concept: "Declarative View Definition",
    android: "@Composable fun ProfileCard()",
    ios: "struct ProfileCard: View { var body: some View }",
    shift: "Compose uses functions; SwiftUI uses lightweight `View` structs whose `body` returns an opaque `some View`."
  },
  {
    category: "UI Framework",
    concept: "Row / Column / Box Layouts",
    android: "Row / Column / Box",
    ios: "HStack / VStack / ZStack",
    shift: "Both use a 3-step layout pass (parent proposes size -> child chooses size -> parent places child)."
  },
  {
    category: "UI Framework",
    concept: "Lazy Lists & Diffing Keys",
    android: "LazyColumn { items(list, key = { it.id }) }",
    ios: "List(list) { item in ... } (requires Identifiable)",
    shift: "SwiftUI enforces stable identity at compile time via the `Identifiable` protocol."
  },
  {
    category: "State & Architecture",
    concept: "Local Ephemeral UI State",
    android: "var count by remember { mutableIntStateOf(0) }",
    ios: "@State private var count = 0",
    shift: "`@State` stores value in SwiftUI's persistent attribute graph so recreating the View struct never loses state."
  },
  {
    category: "State & Architecture",
    concept: "Two-Way Child State Hoisting",
    android: "value: String, onValueChange: (String) -> Unit",
    ios: "@Binding var text: String ($text)",
    shift: "Prefixing `$` projects a two-way `Binding<Value>` reference to child controls."
  },
  {
    category: "State & Architecture",
    concept: "ViewModel & Fine-Grained Observation",
    android: "class Vm : ViewModel() + StateFlow",
    ios: "@Observable @MainActor final class Vm",
    shift: "Swift's `@Observable` macro tracks exact property reads inside `body`—no manual `collectAsStateWithLifecycle()` needed."
  },
  {
    category: "Concurrency",
    concept: "Async Functions & Main Thread Safety",
    android: "suspend fun fetch() + Dispatchers.Main",
    ios: "func fetch() async throws + @MainActor",
    shift: "Swift 6 enforces thread and actor isolation at compile time via `@MainActor`, `actor`, and `Sendable`."
  },
  {
    category: "Data & Networking",
    concept: "HTTP & JSON Serialization",
    android: "Retrofit + OkHttp + Kotlinx Serialization",
    ios: "URLSession.shared.data(for:) + Codable",
    shift: "First-party `URLSession` + compiler-synthesized `Codable` handles REST networking without third-party libraries."
  },
  {
    category: "Data & Networking",
    concept: "Local Database & Secure Storage",
    android: "Room (@Entity, @Dao), DataStore & Keystore",
    ios: "SwiftData (@Model, @Query), @AppStorage & Keychain",
    shift: "SwiftData queries bind directly to Views via `@Query`. Store tokens in Keychain, never UserDefaults."
  },
  {
    category: "Testing & Modularization",
    concept: "Unit Testing & Modules",
    android: "JUnit 5 + Multi-Module Gradle",
    ios: "Swift Testing (@Test, #expect) + Swift Package Manager",
    shift: "Swift Testing runs on isolated `struct` suites; Local SPM packages (`Package.swift`) eliminate `.xcodeproj` conflicts."
  }
];

const WEEKS_DATA = [
  ...(window.WEEKS_1_TO_3 || []),
  ...(window.WEEKS_4_TO_6 || []),
  ...(window.WEEKS_7_TO_10 || [])
];

// Persistent App State
let currentWeekNum = 1;
let currentTab = "learn"; // "learn" | "practice" | "linkedin" | "rosetta"
let completedWeeks = JSON.parse(localStorage.getItem("ios_completed_weeks") || "[]");
let quizAnswers = JSON.parse(localStorage.getItem("ios_quiz_answers_v2") || "{}");

// Interactive Simulator States
let arcUseWeak = false;
let arcScopeExited = false;
let cowMutated = false;
let flashcardIdx = 0;
let flashcardFlipped = false;
let modifierPaddingFirst = true;
let observableLastMutated = "none";
let navStackPath = ["Home"];
let dispatchChoice = "some";

function saveCompletedWeeks() {
  localStorage.setItem("ios_completed_weeks", JSON.stringify(completedWeeks));
  updateProgressUI();
  renderSidebar();
}

function saveQuizAnswers() {
  localStorage.setItem("ios_quiz_answers_v2", JSON.stringify(quizAnswers));
}

function toggleWeekComplete(weekNum) {
  if (completedWeeks.includes(weekNum)) {
    completedWeeks = completedWeeks.filter(w => w !== weekNum);
  } else {
    completedWeeks.push(weekNum);
  }
  saveCompletedWeeks();
  renderMainContent();
}

function updateProgressUI() {
  const totalWeeks = WEEKS_DATA.length || 10;
  const pct = Math.round((completedWeeks.length / totalWeeks) * 100);
  const textEl = document.getElementById("progress-text");
  const fillEl = document.getElementById("progress-fill");
  if (textEl) textEl.textContent = `${completedWeeks.length}/${totalWeeks} Weeks (${pct}%)`;
  if (fillEl) fillEl.style.width = `${Math.max(pct, 6)}%`;
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatInlineCode(str) {
  return String(str || "").replace(/`([^`]+)`/g, "<code>$1</code>");
}

function getWeekQuizScore(weekNum) {
  const weekObj = WEEKS_DATA.find(w => w.week === weekNum);
  if (!weekObj) return { correct: 0, answered: 0, total: 0 };
  const answers = quizAnswers[weekNum] || {};
  let correct = 0;
  let answered = 0;
  weekObj.quiz.forEach((q, idx) => {
    if (answers[idx] !== undefined) {
      answered++;
      if (answers[idx] === q.correctIndex) correct++;
    }
  });
  return { correct, answered, total: weekObj.quiz.length };
}

function renderSidebar() {
  const listEl = document.getElementById("week-nav-list");
  if (!listEl) return;
  listEl.innerHTML = WEEKS_DATA.map(w => {
    const isActive = currentTab !== "rosetta" && w.week === currentWeekNum;
    const isDone = completedWeeks.includes(w.week);
    const score = getWeekQuizScore(w.week);
    return `
      <li>
        <button class="week-nav-btn ${isActive ? "active" : ""} ${isDone ? "completed" : ""}" onclick="selectWeek(${w.week})">
          <div class="week-nav-meta">
            <span class="week-num">Week ${w.week} · ${w.dates}</span>
            <span class="week-title">${w.title}</span>
            <span style="font-size:0.72rem;color:var(--text-muted);margin-top:0.1rem;">
              Quiz: ${score.correct}/${score.total}
            </span>
          </div>
          <span class="week-check" title="${isDone ? "Completed" : "In progress"}">${isDone ? "✓" : ""}</span>
        </button>
      </li>
    `;
  }).join("");
}

window.selectWeek = function(weekNum) {
  currentWeekNum = weekNum;
  flashcardIdx = 0;
  flashcardFlipped = false;
  if (currentTab === "rosetta") {
    currentTab = "learn";
  }
  renderSidebar();
  renderMainContent();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.selectTab = function(tab) {
  currentTab = tab;
  renderSidebar();
  renderMainContent();
};

window.copyText = function(btn, encodedText) {
  const text = decodeURIComponent(encodedText);
  navigator.clipboard.writeText(text);
  const orig = btn.textContent;
  btn.textContent = "Copied ✓";
  setTimeout(() => { btn.textContent = orig; }, 1600);
};

// ============================================================================
// INTERACTIVE FLASHCARDS ENGINE
// ============================================================================
window.flipFlashcard = function() {
  flashcardFlipped = !flashcardFlipped;
  renderMainContent();
};

window.nextFlashcard = function(delta, total) {
  flashcardIdx = (flashcardIdx + delta + total) % total;
  flashcardFlipped = false;
  renderMainContent();
};

function renderFlashcardsSection(weekObj) {
  const cards = weekObj.flashcards || [];
  if (cards.length === 0) return "";
  const idx = Math.min(flashcardIdx, cards.length - 1);
  const card = cards[idx];

  return `
    <div class="section-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.85rem;flex-wrap:wrap;gap:0.5rem;">
        <div>
          <h2>🃏 Active-Recall Flashcards (Week ${weekObj.week})</h2>
          <p style="font-size:0.86rem;color:var(--text-secondary);">Click the card to flip between the question and the architectural explanation.</p>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <button class="btn" onclick="nextFlashcard(-1, ${cards.length})">← Prev</button>
          <span style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);">${idx + 1} / ${cards.length}</span>
          <button class="btn" onclick="nextFlashcard(1, ${cards.length})">Next →</button>
        </div>
      </div>

      <div class="flashcard-container" onclick="flipFlashcard()" role="button" tabindex="0">
        <div>
          <div class="flashcard-badge">${flashcardFlipped ? "💡 Answer (Click to flip back)" : "❓ Question (Click card to reveal answer)"}</div>
          <div class="flashcard-text">${formatInlineCode(flashcardFlipped ? card.back : card.front)}</div>
        </div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:1rem;">
          Tap anywhere on this card to flip
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// INTERACTIVE SIMULATORS PER WEEK
// ============================================================================
window.toggleArcWeak = function(useWeak) { arcUseWeak = useWeak; renderMainContent(); };
window.toggleArcScope = function(exited) { arcScopeExited = exited; renderMainContent(); };
window.toggleCowMutation = function(mutated) { cowMutated = mutated; renderMainContent(); };
window.toggleModifierOrder = function(paddingFirst) { modifierPaddingFirst = paddingFirst; renderMainContent(); };
window.triggerObservableMutation = function(prop) { observableLastMutated = prop; renderMainContent(); };
window.mutateNavStack = function(action) {
  if (action === "detail") navStackPath.push("Detail(id: 42)");
  else if (action === "settings") navStackPath.push("Settings");
  else if (action === "deeplink") navStackPath = ["Home", "Orders", "Order(99)", "TrackPackage"];
  else if (action === "pop") { if (navStackPath.length > 1) navStackPath.pop(); }
  else if (action === "root") navStackPath = ["Home"];
  renderMainContent();
};
window.setDispatchChoice = function(choice) { dispatchChoice = choice; renderMainContent(); };

function renderInteractiveSimulator(weekObj) {
  if (weekObj.week === 1) {
    const playlistRc = arcScopeExited ? (arcUseWeak ? 0 : 1) : (arcUseWeak ? 1 : 2);
    const songRc = arcScopeExited ? (arcUseWeak ? 0 : 1) : 2;
    const isLeaked = arcScopeExited && !arcUseWeak;
    const isFreed = arcScopeExited && arcUseWeak;

    return `
      <div class="interactive-widget">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h2>🔬 Interactive Lab 1A: ARC Retain Cycle Simulator</h2>
            <p style="font-size:0.88rem;color:var(--text-secondary);">Toggle between <code>strong</code> and <code>weak var playlist</code> and exit <code>playMusic()</code> to watch ARC reference counts live.</p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn ${!arcUseWeak ? "btn-primary" : ""}" onclick="toggleArcWeak(false)">Strong Back-Ref (Leak)</button>
            <button class="btn ${arcUseWeak ? "btn-primary" : ""}" onclick="toggleArcWeak(true)"><code>weak var playlist</code> (Safe)</button>
            <button class="btn" onclick="toggleArcScope(${!arcScopeExited})">
              ${arcScopeExited ? "🔄 Reset Inside playMusic()" : "⏭️ Exit playMusic() Scope"}
            </button>
          </div>
        </div>

        <div class="arc-nodes">
          <div class="arc-node ${isLeaked ? "leaked" : ""} ${isFreed ? "freed" : ""}">
            <div style="font-weight:700;">Playlist (Class)</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);">var song: Song? (strong)</div>
            <span class="rc-badge">retainCount = ${playlistRc}</span>
            <div style="margin-top:0.4rem;font-size:0.8rem;font-weight:600;color:${isLeaked ? "var(--accent-danger)" : isFreed ? "var(--accent-green)" : "var(--accent-primary-text)"};">
              ${isLeaked ? "❌ MEMORY LEAK (rc=1)" : isFreed ? "✅ deinit called! Freed" : "Alive in scope"}
            </div>
          </div>

          <div style="text-align:center;font-family:var(--font-mono);font-size:0.82rem;">
            <div>Playlist.song ───strong (rc+1)───▶ Song</div>
            <div style="margin-top:0.45rem;color:${arcUseWeak ? "var(--accent-green)" : "var(--accent-danger)"};">
              Playlist ◀──${arcUseWeak ? "weak (rc+0)" : "strong (rc+1)"}── Song.playlist
            </div>
          </div>

          <div class="arc-node ${isLeaked ? "leaked" : ""} ${isFreed ? "freed" : ""}">
            <div style="font-weight:700;">Song (Class)</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);">${arcUseWeak ? "weak " : ""}var playlist: Playlist?</div>
            <span class="rc-badge">retainCount = ${songRc}</span>
            <div style="margin-top:0.4rem;font-size:0.8rem;font-weight:600;color:${isLeaked ? "var(--accent-danger)" : isFreed ? "var(--accent-green)" : "var(--accent-primary-text)"};">
              ${isLeaked ? "❌ MEMORY LEAK (rc=1)" : isFreed ? "✅ deinit called! Freed" : "Alive in scope"}
            </div>
          </div>
        </div>

        <hr style="border:none;border-top:1px solid var(--border-color);margin:1.5rem 0;" />

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h2>🔬 Interactive Lab 1B: Copy-on-Write (CoW) Buffer Visualizer</h2>
            <p style="font-size:0.88rem;color:var(--text-secondary);">See what happens in memory when you assign <code>var listB = listA</code> vs. when you mutate <code>listB.append(4)</code>.</p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn ${!cowMutated ? "btn-primary" : ""}" onclick="toggleCowMutation(false)">Step 1: <code>var listB = listA</code> (Read-Only)</button>
            <button class="btn ${cowMutated ? "btn-primary" : ""}" onclick="toggleCowMutation(true)">Step 2: <code>listB.append(4)</code> (Mutate)</button>
          </div>
        </div>

        <div class="widget-stage">
          ${!cowMutated ? `
            <p style="font-family:var(--font-mono);font-size:0.85rem;">
              <strong>listA (Stack Struct)</strong> ──┐<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──▶ <strong>Shared Buffer @ 0x7ffee1 [1, 2, 3]</strong> (Buffer retainCount = 2 · Zero copy cost!)<br/>
              <strong>listB (Stack Struct)</strong> ──┘
            </p>
          ` : `
            <p style="font-family:var(--font-mono);font-size:0.85rem;">
              <strong>listA (Stack Struct)</strong> ──────▶ <strong>Original Buffer @ 0x7ffee1 [1, 2, 3]</strong> (Untouched! retainCount = 1)<br/><br/>
              <strong>listB (Stack Struct)</strong> ──────▶ <strong style="color:var(--accent-green);">New Forked Buffer @ 0x9a44b0 [1, 2, 3, 4]</strong> (Copied on mutation!)
            </p>
          `}
        </div>
      </div>
    `;
  }

  if (weekObj.week === 2) {
    return `
      <div class="interactive-widget">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h2>🔬 Interactive Lab: <code>some View</code> (Opaque) vs <code>any View</code> (Existential Box)</h2>
            <p style="font-size:0.88rem;color:var(--text-secondary);">Compare how the Swift compiler lays out memory and dispatches methods for <code>some</code> vs <code>any</code>.</p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn ${dispatchChoice === "some" ? "btn-primary" : ""}" onclick="setDispatchChoice('some')"><code>func make() -> some View</code></button>
            <button class="btn ${dispatchChoice === "any" ? "btn-primary" : ""}" onclick="setDispatchChoice('any')"><code>func make() -> any View</code></button>
          </div>
        </div>
        <div class="widget-stage" style="font-family:var(--font-mono);font-size:0.85rem;">
          ${dispatchChoice === "some" ? `
            <div style="color:var(--accent-green);font-weight:700;margin-bottom:0.4rem;">✅ Opaque Return Type (some View) — Static Dispatch</div>
            <div>• Concrete Type Fixed at Compile Time: Yes (Compiler knows exact size on stack)</div>
            <div>• Heap Boxing Overhead: 0 bytes (Allocated directly inline on stack)</div>
            <div>• Method Call Mechanism: Direct Static Address / Inlined by LLVM</div>
          ` : `
            <div style="color:var(--accent-danger);font-weight:700;margin-bottom:0.4rem;">⚠️ Existential Container (any View) — Dynamic Dispatch</div>
            <div>• Concrete Type Fixed at Compile Time: No (Can swap between Text, Button, VStack at runtime)</div>
            <div>• Memory Layout: 5-word Existential Container (3 words value buffer + Metadata pointer + Protocol Witness Table pointer; heap-allocates if > 24 bytes)</div>
            <div>• Method Call Mechanism: Indirect lookup via Protocol Witness Table (vtable)</div>
          `}
        </div>
      </div>
    `;
  }

  if (weekObj.week === 3) {
    return `
      <div class="interactive-widget">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h2>🎨 Interactive SwiftUI Modifier Order Sandbox</h2>
            <p style="font-size:0.88rem;color:var(--text-secondary);">Click to swap the order of <code>.padding(20)</code> and <code>.background(.blue)</code> and see how wrapper views change the rendered box!</p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn ${modifierPaddingFirst ? "btn-primary" : ""}" onclick="toggleModifierOrder(true)">
              Order A: <code>.padding(20).background(.blue)</code>
            </button>
            <button class="btn ${!modifierPaddingFirst ? "btn-primary" : ""}" onclick="toggleModifierOrder(false)">
              Order B: <code>.background(.blue).padding(20)</code>
            </button>
          </div>
        </div>

        <div class="widget-stage" style="display:flex;align-items:center;justify-content:space-around;flex-wrap:wrap;gap:1.5rem;">
          <pre class="code-block" style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:8px;"><code>Text("Upgrade to Pro")
${modifierPaddingFirst
  ? "    .padding(20)       // 1. Expands bounds by 20pt\n    .background(.blue) // 2. Paints full padded box blue"
  : "    .background(.blue) // 1. Paints tight text bounds blue\n    .padding(20)       // 2. Adds 20pt transparent outer margin"}
    .border(.red)      // Outer layout frame</code></pre>

          <div style="text-align:center;">
            <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.4rem;">LIVE RENDERED PREVIEW (Red = Outer Frame)</div>
            <div style="border:2px dashed #e11d48;display:inline-block;padding:${modifierPaddingFirst ? "0px" : "20px"};">
              <div style="background:#2563eb;color:#fff;font-weight:700;border-radius:6px;padding:${modifierPaddingFirst ? "20px 28px" : "2px 6px"};">
                Upgrade to Pro
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (weekObj.week === 4) {
    return `
      <div class="interactive-widget">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h2>⚡ Interactive <code>@Observable</code> Fine-Grained Re-render Tracker</h2>
            <p style="font-size:0.88rem;color:var(--text-secondary);">Mutate a property on <code>CheckoutViewModel</code> and watch which child SwiftUI View re-evaluates its <code>body</code>!</p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn ${observableLastMutated === "user" ? "btn-primary" : ""}" onclick="triggerObservableMutation('user')">Mutate <code>vm.username</code></button>
            <button class="btn ${observableLastMutated === "cart" ? "btn-primary" : ""}" onclick="triggerObservableMutation('cart')">Mutate <code>vm.cartTotal</code></button>
            <button class="btn ${observableLastMutated === "ignored" ? "btn-primary" : ""}" onclick="triggerObservableMutation('ignored')">Mutate <code>@ObservationIgnored cache</code></button>
          </div>
        </div>

        <div class="widget-stage" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;">
          <div style="padding:1rem;border-radius:8px;border:2px solid ${observableLastMutated === "user" ? "var(--accent-green)" : "var(--border-color)"};background:${observableLastMutated === "user" ? "var(--accent-green-soft)" : "var(--bg-surface)"};">
            <strong>HeaderView</strong>
            <div style="font-size:0.8rem;color:var(--text-secondary);">Reads: <code>vm.username</code></div>
            <div style="margin-top:0.5rem;font-weight:700;font-size:0.82rem;">
              ${observableLastMutated === "user" ? "🔄 body Re-evaluated!" : "⏸️ Skipped (0 work)"}
            </div>
          </div>
          <div style="padding:1rem;border-radius:8px;border:2px solid ${observableLastMutated === "cart" ? "var(--accent-green)" : "var(--border-color)"};background:${observableLastMutated === "cart" ? "var(--accent-green-soft)" : "var(--bg-surface)"};">
            <strong>CartBadgeView</strong>
            <div style="font-size:0.8rem;color:var(--text-secondary);">Reads: <code>vm.cartTotal</code></div>
            <div style="margin-top:0.5rem;font-weight:700;font-size:0.82rem;">
              ${observableLastMutated === "cart" ? "🔄 body Re-evaluated!" : "⏸️ Skipped (0 work)"}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (weekObj.week === 5) {
    return `
      <div class="interactive-widget">
        <div>
          <h2>🧵 Interactive Swift 6 Concurrency & Actor Isolation Visualizer</h2>
          <p style="font-size:0.88rem;color:var(--text-secondary);">Compare how Swift 6 handles concurrent calls to an <code>actor</code> vs a <code>@MainActor</code> ViewModel.</p>
        </div>
        <div class="widget-stage" style="font-family:var(--font-mono);font-size:0.83rem;line-height:1.7;">
          <div><strong>[Task 1 - Background]</strong> calls <code>await tokenCache.save("jwt_1")</code> ──▶ Enters <strong>actor TokenCache Serial Mailbox</strong> (Safe!)</div>
          <div><strong>[Task 2 - Background]</strong> calls <code>await tokenCache.save("jwt_2")</code> ──▶ Suspends at <code>await</code> until Task 1 finishes (Zero Data Race!)</div>
          <div style="color:var(--accent-primary-text);margin-top:0.35rem;"><strong>[Main Thread]</strong> <code>@MainActor ViewModel</code> updates <code>self.isLoggedIn = true</code> ──▶ Guaranteed on UI Thread at Compile Time!</div>
        </div>
      </div>
    `;
  }

  if (weekObj.week === 6) {
    return `
      <div class="interactive-widget">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h2>🧭 Interactive <code>NavigationStack(path: $path)</code> Simulator</h2>
            <p style="font-size:0.88rem;color:var(--text-secondary);">Manipulate the <code>path: [Route]</code> state array and watch the iOS navigation backstack respond.</p>
          </div>
          <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="mutateNavStack('detail')"><code>path.append(.detail(42))</code></button>
            <button class="btn btn-primary" onclick="mutateNavStack('settings')"><code>path.append(.settings)</code></button>
            <button class="btn" onclick="mutateNavStack('deeplink')">🔗 Simulate Deep Link</button>
            <button class="btn" onclick="mutateNavStack('pop')">⬅️ Pop Last</button>
            <button class="btn" onclick="mutateNavStack('root')">🏠 <code>path.removeAll()</code> (Root)</button>
          </div>
        </div>

        <div class="widget-stage">
          <div style="font-family:var(--font-mono);font-size:0.84rem;margin-bottom:0.65rem;">
            <strong>@State private var path: [Route] = </strong> [${navStackPath.slice(1).map(s => `.${s}`).join(", ")}]
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
            ${navStackPath.map((screen, idx) => `
              <span class="pill ${idx === navStackPath.length - 1 ? "pill-swift" : "pill-kotlin"}" style="font-size:0.82rem;padding:0.35rem 0.8rem;">
                ${idx + 1}. ${screen}
              </span>
              ${idx < navStackPath.length - 1 ? "<span>→</span>" : ""}
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  return "";
}

// ============================================================================
// QUIZ & CODE CHALLENGE ENGINE
// ============================================================================
window.answerQuiz = function(weekNum, qIdx, optIdx) {
  if (!quizAnswers[weekNum]) quizAnswers[weekNum] = {};
  quizAnswers[weekNum][qIdx] = optIdx;
  saveQuizAnswers();

  const score = getWeekQuizScore(weekNum);
  if (score.correct >= 8 && !completedWeeks.includes(weekNum)) {
    completedWeeks.push(weekNum);
    saveCompletedWeeks();
  } else {
    renderSidebar();
  }
  renderMainContent();
};

window.resetWeekQuiz = function(weekNum) {
  delete quizAnswers[weekNum];
  saveQuizAnswers();
  renderSidebar();
  renderMainContent();
};

window.verifyCodeChallenge = function(weekNum) {
  const weekObj = WEEKS_DATA.find(w => w.week === weekNum);
  const input = document.getElementById("challenge-editor").value;
  const feedbackEl = document.getElementById("challenge-feedback");
  const missing = weekObj.codeChallenge.requiredTokens.filter(t => !input.includes(t));
  feedbackEl.classList.add("visible");
  if (missing.length === 0) {
    feedbackEl.style.background = "var(--accent-green-soft)";
    feedbackEl.style.border = "1px solid var(--accent-green)";
    feedbackEl.innerHTML = `
      <div><strong>🎉 All Swift Compiler Checks Passed!</strong> Great job applying <code>${weekObj.codeChallenge.requiredTokens.join("</code>, <code>")}</code>.</div>
      ${weekObj.codeChallenge.simulatedOutput ? `<div class="console-output">${escapeHtml(weekObj.codeChallenge.simulatedOutput)}</div>` : ""}
    `;
    if (!completedWeeks.includes(weekNum)) {
      toggleWeekComplete(weekNum);
    }
  } else {
    feedbackEl.style.background = "var(--accent-danger-soft)";
    feedbackEl.style.border = "1px solid var(--accent-danger)";
    feedbackEl.innerHTML = `<strong>⚠️ Missing Required Swift Constructs:</strong> Make sure your code includes: <code>${missing.join("</code>, <code>")}</code>.`;
  }
};

window.showChallengeSolution = function(weekNum) {
  const weekObj = WEEKS_DATA.find(w => w.week === weekNum);
  const editor = document.getElementById("challenge-editor");
  if (editor && weekObj) {
    editor.value = weekObj.codeChallenge.solutionCode;
    window.verifyCodeChallenge(weekNum);
  }
};

// ============================================================================
// ROSETTA STONE VIEW
// ============================================================================
function renderRosettaView() {
  return `
    <div class="section-card">
      <h2>🗺️ The Complete Android ↔ iOS Rosetta Stone</h2>
      <p style="color:var(--text-secondary);margin-bottom:1rem;">
        Filter any Android concept (Kotlin, Compose, Coroutines, Hilt, Room, Retrofit, JUnit, Gradle) to immediately see its modern iOS equivalent and architectural mental shift.
      </p>
      <input
        type="search"
        id="rosetta-search-input"
        class="rosetta-search"
        placeholder="Search e.g. 'StateFlow', 'data class', 'Room', 'Retrofit', 'guard', 'ARC', 'JUnit'..."
        oninput="filterRosettaTable(this.value)"
      />
      <div style="overflow-x:auto;">
        <table class="rosetta-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Concept</th>
              <th>Android (Kotlin / Compose)</th>
              <th>iOS (Swift 6 / SwiftUI)</th>
              <th>Key Mental Shift</th>
            </tr>
          </thead>
          <tbody id="rosetta-tbody">
            ${ROSETTA_ITEMS.map(item => `
              <tr>
                <td><span class="pill pill-kotlin">${item.category}</span></td>
                <td><strong>${item.concept}</strong></td>
                <td><code>${escapeHtml(item.android)}</code></td>
                <td><code>${escapeHtml(item.ios)}</code></td>
                <td>${item.shift}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.filterRosettaTable = function(query) {
  const q = query.toLowerCase().trim();
  const tbody = document.getElementById("rosetta-tbody");
  if (!tbody) return;
  const filtered = ROSETTA_ITEMS.filter(item =>
    item.category.toLowerCase().includes(q) ||
    item.concept.toLowerCase().includes(q) ||
    item.android.toLowerCase().includes(q) ||
    item.ios.toLowerCase().includes(q) ||
    item.shift.toLowerCase().includes(q)
  );
  tbody.innerHTML = filtered.map(item => `
    <tr>
      <td><span class="pill pill-kotlin">${item.category}</span></td>
      <td><strong>${item.concept}</strong></td>
      <td><code>${escapeHtml(item.android)}</code></td>
      <td><code>${escapeHtml(item.ios)}</code></td>
      <td>${item.shift}</td>
    </tr>
  `).join("");
};

// ============================================================================
// MAIN CONTENT RENDERER
// ============================================================================
function renderMainContent() {
  const container = document.getElementById("main-content");
  if (!container) return;

  const weekObj = WEEKS_DATA.find(w => w.week === currentWeekNum) || WEEKS_DATA[0];
  const isCompleted = completedWeeks.includes(weekObj.week);
  const quizScore = getWeekQuizScore(weekObj.week);

  const tabsHtml = `
    <div class="view-tabs">
      <button class="tab-btn ${currentTab === "learn" ? "active" : ""}" onclick="selectTab('learn')">
        📖 1. Deep-Dive Tutorial & Simulators
      </button>
      <button class="tab-btn ${currentTab === "practice" ? "active" : ""}" onclick="selectTab('practice')">
        🛠️ 2. 10-Question Quiz & Code Lab (${quizScore.correct}/${quizScore.total})
      </button>
      <button class="tab-btn ${currentTab === "linkedin" ? "active" : ""}" onclick="selectTab('linkedin')">
        ✍️ 3. LinkedIn Post & Article Kit
      </button>
      <button class="tab-btn ${currentTab === "rosetta" ? "active" : ""}" onclick="selectTab('rosetta')">
        🗺️ Android ↔ iOS Rosetta Stone
      </button>
    </div>
  `;

  if (currentTab === "rosetta") {
    container.innerHTML = tabsHtml + renderRosettaView();
    return;
  }

  const headerHtml = `
    <div class="hero-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap;">
        <div>
          <span class="pill pill-swift">Week ${weekObj.week} of 10 · ${weekObj.dates}</span>
          <h1 style="margin-top:0.55rem;">${formatInlineCode(weekObj.title)}</h1>
          <p>${formatInlineCode(weekObj.subtitle)}</p>
        </div>
        <button class="btn ${isCompleted ? "" : "btn-primary"}" onclick="toggleWeekComplete(${weekObj.week})">
          ${isCompleted ? "✅ Completed (Click to Undo)" : "Mark Week " + weekObj.week + " Complete"}
        </button>
      </div>
      <div class="hero-meta-row">
        <span class="pill pill-kotlin">Android: ${formatInlineCode(weekObj.androidAnchor)}</span>
        <span class="pill pill-swift">iOS: ${formatInlineCode(weekObj.iosAnchor)}</span>
      </div>
    </div>
  `;

  let bodyHtml = "";

  if (currentTab === "learn") {
    bodyHtml += renderInteractiveSimulator(weekObj);

    bodyHtml += weekObj.concepts.map(c => `
      <div class="section-card">
        <h2>${formatInlineCode(c.heading)}</h2>
        <div class="mental-shift-banner">
          <strong>💡 Key Mental Shift:</strong> ${formatInlineCode(c.shift)}
        </div>
        ${c.details && c.details.length ? `
          <ul class="concept-details-list">
            ${c.details.map(d => `<li>${formatInlineCode(d)}</li>`).join("")}
          </ul>
        ` : ""}
        <div class="code-comparison">
          <div class="code-pane">
            <div class="code-header code-header-kotlin">
              <span>🤖 ANDROID (KOTLIN / COMPOSE)</span>
              <button class="copy-btn" onclick="copyText(this, '${encodeURIComponent(c.kotlinCode)}')">Copy</button>
            </div>
            <pre class="code-block"><code>${escapeHtml(c.kotlinCode)}</code></pre>
          </div>
          <div class="code-pane">
            <div class="code-header code-header-swift">
              <span>🍎 iOS (SWIFT 6 / SWIFTUI)</span>
              <button class="copy-btn" onclick="copyText(this, '${encodeURIComponent(c.swiftCode)}')">Copy</button>
            </div>
            <pre class="code-block"><code>${escapeHtml(c.swiftCode)}</code></pre>
          </div>
        </div>
      </div>
    `).join("");

    bodyHtml += renderFlashcardsSection(weekObj);

    bodyHtml += `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.5rem;">
        <span></span>
        <button class="btn btn-primary" onclick="selectTab('practice')">
          Next: Take the 10-Question Week ${weekObj.week} Quiz & Code Lab →
        </button>
      </div>
    `;
  } else if (currentTab === "practice") {
    const savedForWeek = quizAnswers[weekObj.week] || {};

    const quizHtml = weekObj.quiz.map((q, qIdx) => {
      const selectedIdx = savedForWeek[qIdx];
      const hasAnswered = selectedIdx !== undefined;
      return `
        <div id="quiz-q-${qIdx}" style="margin-bottom:1.6rem;padding-bottom:1.25rem;border-bottom:1px solid var(--border-subtle);">
          <p style="font-weight:600;margin-bottom:0.65rem;">${formatInlineCode(q.question)}</p>
          ${q.options.map((opt, oIdx) => {
            let cls = "quiz-option";
            if (hasAnswered) {
              if (oIdx === q.correctIndex) cls += " correct";
              else if (oIdx === selectedIdx) cls += " wrong";
            }
            return `
              <button class="${cls}" onclick="answerQuiz(${weekObj.week}, ${qIdx}, ${oIdx})">
                ${formatInlineCode(opt)}
              </button>
            `;
          }).join("")}
          <div id="quiz-fb-${qIdx}" class="feedback-box ${hasAnswered ? "visible" : ""}" style="background:var(--bg-surface-elevated);border-left:4px solid ${selectedIdx === q.correctIndex ? "var(--accent-green)" : "var(--accent-danger)"};">
            <strong>${selectedIdx === q.correctIndex ? "✅ Correct!" : "❌ Explanation:"}</strong> ${formatInlineCode(q.explanation)}
          </div>
        </div>
      `;
    }).join("");

    bodyHtml = `
      <div class="section-card">
        <div class="quiz-scoreboard">
          <div>
            <div class="quiz-score-pill">🏆 Week ${weekObj.week} Quiz Score: ${quizScore.correct} / ${quizScore.total} Correct (${quizScore.answered} Answered)</div>
            <div style="font-size:0.82rem;color:var(--text-secondary);">Score 8/10 or higher to automatically mark Week ${weekObj.week} complete!</div>
          </div>
          <button class="btn" onclick="resetWeekQuiz(${weekObj.week})">🔄 Reset Quiz</button>
        </div>
        ${quizHtml}
      </div>

      <div class="section-card">
        <h2>💻 Part 2: Interactive Swift Coding Lab (Week ${weekObj.week})</h2>
        <p style="color:var(--text-secondary);margin-bottom:1rem;">${weekObj.codeChallenge.instructions}</p>
        <textarea id="challenge-editor" class="code-editor-input" spellcheck="false">${weekObj.codeChallenge.starterCode}</textarea>
        <div style="display:flex;gap:0.75rem;margin-top:0.85rem;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="verifyCodeChallenge(${weekObj.week})">▶️ Compile & Verify Solution</button>
          <button class="btn" onclick="showChallengeSolution(${weekObj.week})">👀 Reveal & Run Solution</button>
        </div>
        <div id="challenge-feedback" class="feedback-box"></div>
      </div>
    `;
  } else if (currentTab === "linkedin") {
    bodyHtml = `
      <div class="section-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
          <div>
            <h2>📣 Format 1: LinkedIn Short-Form Feed Post (Week ${weekObj.week})</h2>
            <p style="color:var(--text-secondary);font-size:0.9rem;">High-engagement feed post with hook, numbered takeaways, and your live tutorial link.</p>
          </div>
          <button class="btn btn-primary" onclick="copyText(this, '${encodeURIComponent(weekObj.linkedinPost)}')">
            📋 Copy Feed Post
          </button>
        </div>
        <div class="linkedin-box">${escapeHtml(weekObj.linkedinPost)}</div>
      </div>

      ${weekObj.linkedinArticle ? `
        <div class="section-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
            <div>
              <h2>📰 Format 2: Full Long-Form LinkedIn Article (Week ${weekObj.week})</h2>
              <p style="color:var(--text-secondary);font-size:0.9rem;">Deep technical markdown article for LinkedIn Articles / Medium / Dev.to.</p>
            </div>
            <button class="btn btn-primary" onclick="copyText(this, '${encodeURIComponent(weekObj.linkedinArticle)}')">
              📋 Copy Full Article
            </button>
          </div>
          <div class="linkedin-box">${escapeHtml(weekObj.linkedinArticle)}</div>
        </div>
      ` : ""}
    `;
  }

  container.innerHTML = tabsHtml + headerHtml + bodyHtml;
}

// Theme Switcher
window.setTheme = function(themeName) {
  document.documentElement.setAttribute("data-theme", themeName);
  localStorage.setItem("ios_tutorial_theme_v2", themeName);
  const sel = document.getElementById("theme-selector");
  if (sel && sel.value !== themeName) sel.value = themeName;
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("ios_tutorial_theme_v2") || "light";
  window.setTheme(savedTheme);
  updateProgressUI();
  renderSidebar();
  renderMainContent();
});
