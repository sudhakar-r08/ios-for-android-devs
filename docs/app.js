// ============================================================================
// ANDROID TO iOS ACADEMY — INTERACTIVE EDUCATIONAL ENGINE
// ============================================================================

const COURSE_MODULES = [
  {
    id: 1,
    title: "Module 1: The Swift Core & Protocol Paradigm",
    subtitle: "Weeks 1 & 2 · Swift Basics, Syntax Quirks, Protocols & Error Handling",
    badge: "Core Foundations",
    weeks: [1, 2]
  },
  {
    id: 2,
    title: "Module 2: Declarative UI & Reactive State",
    subtitle: "Weeks 3 & 4 · Jetpack Compose to SwiftUI & Observation (@Observable)",
    badge: "UI & State",
    weeks: [3, 4]
  },
  {
    id: 3,
    title: "Module 3: Concurrency, Actors & Navigation",
    subtitle: "Weeks 5 & 6 · Swift Concurrency, Sendable & Value-Driven NavigationStack",
    badge: "Concurrency & Flow",
    weeks: [5, 6]
  },
  {
    id: 4,
    title: "Module 4: Enterprise Data, Networking & Security",
    subtitle: "Weeks 7 & 8 · URLSession & Codable (No Retrofit!), SwiftData & Keychain",
    badge: "Data & Security",
    weeks: [7, 8]
  },
  {
    id: 5,
    title: "Module 5: Systems Internals, Testing & Shipping",
    subtitle: "Weeks 9 & 10 · ARC Memory Internals, Swift Testing & TestFlight Release",
    badge: "Production Ready",
    weeks: [9, 10]
  }
];

const ROSETTA_ITEMS = [
  {
    category: "Language & Syntax",
    concept: "Immutable Constants",
    android: "val name = \"Alex\"",
    ios: "let name = \"Alex\"",
    shift: "Swift uses `let` for immutable bindings and `var` for mutable variables. Kotlin uses `val` and `var`."
  },
  {
    category: "Language & Syntax",
    concept: "String Interpolation",
    android: "\"Hello $name (${age + 1})\"",
    ios: "\"Hello \\(name) (\\(age + 1))\"",
    shift: "Swift uses backslash and parentheses `\\(expr)` for string templates."
  },
  {
    category: "Language & Syntax",
    concept: "Function Argument Labels",
    android: "fun send(to: String, msg: String)",
    ios: "func send(to recipient: String, message msg: String)",
    shift: "Swift functions have external labels so call sites read like English sentences: `send(to: user, message: text)`."
  },
  {
    category: "Language & Syntax",
    concept: "Nullability & Default Values",
    android: "val title = rawTitle ?: \"Untitled\"",
    ios: "let title = rawTitle ?? \"Untitled\"",
    shift: "Kotlin uses Elvis `?:`; Swift uses nil-coalescing `??`. Both use `?` for Optionals."
  },
  {
    category: "Language & Syntax",
    concept: "Early Exit & Preconditions",
    android: "val id = orderId ?: return",
    ios: "guard let id = orderId else { return }",
    shift: "`guard let` forces an early exit if nil and keeps `id` unwrapped for the rest of the function (the Golden Path)."
  },
  {
    category: "Data Models",
    concept: "Data Models & Value Semantics",
    android: "data class User(val id: String)",
    ios: "struct User: Equatable, Codable, Sendable { let id: String }",
    shift: "Kotlin data classes are heap reference types. Swift structs are true value types with automatic memberwise initializers."
  },
  {
    category: "Language & Memory",
    concept: "Sum Types / Algebraic State",
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
    category: "Memory & Testing",
    concept: "Memory Management & Unit Testing",
    android: "ART Tracing GC & JUnit 5",
    ios: "ARC (weak/unowned, [weak self]) & Swift Testing (@Test, #expect)",
    shift: "ARC frees memory deterministically at retainCount == 0 (Week 9). Swift Testing runs on isolated struct test suites."
  }
];

const WEEKS_DATA = [
  ...(window.WEEKS_1_TO_3 || []),
  ...(window.WEEKS_4_TO_6 || []),
  ...(window.WEEKS_7_TO_10 || [])
];

// Persistent App State
let currentWeekNum = 1;
let currentDay = 1; // 1..5 for daily steps; 0 for "All Days"
let currentTab = "roadmap"; // "roadmap" | "learn" | "practice" | "linkedin" | "rosetta"
let completedWeeks = JSON.parse(localStorage.getItem("ios_completed_weeks") || "[]");
let completedDays = JSON.parse(localStorage.getItem("ios_completed_days_v2") || "{}");
let masteredFlashcards = JSON.parse(localStorage.getItem("ios_mastered_cards_v2") || "{}");
let quizAnswers = JSON.parse(localStorage.getItem("ios_quiz_answers_v2") || "{}");
let checkpointAnswers = JSON.parse(localStorage.getItem("ios_checkpoint_answers_v2") || "{}");
let codeViewMode = localStorage.getItem("ios_code_view_mode") || "split"; // "split" | "tabbed"
let activeCodeTabs = {}; // stepKey -> "kotlin" | "swift"

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
let syntaxSelectedDemo = "labels"; // "labels" | "strings" | "guard"

// Daily Checkpoint Questions (Instant Feedback)
const DAILY_CHECKPOINTS = {
  "1_1": {
    question: "Quick Check: Which keyword defines an immutable constant in Swift (equivalent to Kotlin's `val`)?",
    options: ["`let`", "`val`"],
    correctIndex: 0,
    explanation: "Swift uses `let` for immutable constants. If you use `var` and never mutate it, Xcode suggests switching to `let`."
  },
  "1_2": {
    question: "Quick Check: What is the purpose of Swift's external argument labels?",
    options: ["Call sites read like readable, natural English sentences", "To make compilation faster"],
    correctIndex: 0,
    explanation: "External argument labels like `transfer(amount: 50, from: checking, to: savings)` make call sites self-documenting prose."
  },
  "1_3": {
    question: "Quick Check: How does `guard let` differ from standard `if let`?",
    options: ["The compiler forces `guard let` to exit the scope early, keeping the unwrapped variable in scope for the rest of the function", "guard let runs on a background thread"],
    correctIndex: 0,
    explanation: "`guard let` enforces early exit (the Golden Path) and avoids pyramid-of-doom indentation."
  },
  "1_4": {
    question: "Quick Check: What happens when you declare a Swift `struct` with `let`?",
    options: ["The entire struct and all its properties are deeply frozen—even `var` properties cannot be modified", "Only the reference pointer is frozen; properties can still mutate"],
    correctIndex: 0,
    explanation: "Unlike Kotlin reference classes, `let` on a value type freezes the entire memory footprint deeply."
  },
  "1_5": {
    question: "Quick Check: In Swift, what must you include in a `switch` statement if not all cases are explicitly handled?",
    options: ["An explicit `default:` fallback case", "A `break` statement at the top"],
    correctIndex: 0,
    explanation: "Swift `switch` statements must be exhaustive. If not all enum cases or values are handled, a `default:` case is required."
  }
};

function getCheckpointForDay(weekNum, dayNum, step) {
  const key = `${weekNum}_${dayNum}`;
  if (DAILY_CHECKPOINTS[key]) return DAILY_CHECKPOINTS[key];
  return {
    question: `Quick Check: What is the primary mental shift for Day ${dayNum}?`,
    options: [step.shift, "No shift needed; works identical to Java"],
    correctIndex: 0,
    explanation: step.shift
  };
}

// ============================================================================
// SENIOR ENGINEER HINTS & PRO-TIPS BY WEEK & DAY
// ============================================================================
const TOPIC_HINTS = {
  // Week 1: Swift Basics
  "1_1": "Xcode Shortcut: Press Cmd+Shift+O to quickly open any file or symbol by name (like Double-Shift in Android Studio). Also, type \\() inside any string to instantly trigger interpolation autocomplete.",
  "1_2": "Design Rule: If your function name already includes a preposition (e.g. `insert(_:at:)`), use an underscore `_` for the first parameter to avoid stuttering like `insert(item: item, at: index)`.",
  "1_3": "Swift 5.7+ Shorthand: Instead of writing `if let user = user`, you can simply write `if let user { ... }` or `guard let user else { return }`. The Swift compiler infers the unwrap target automatically.",
  "1_4": "Initializer Tip: Swift `struct` types automatically synthesize a memberwise initializer for free. If you define a custom `init` inside an `extension` (instead of the main body), you preserve the free memberwise initializer!",
  "1_5": "Exhaustive Switch: In Swift, `switch` on enums does not require a `break` keyword at the end of each case. It does not fall through unless you explicitly write `fallthrough`.",

  // Week 2: Protocols & Extensions
  "2_1": "Default Implementations: Unlike Java interfaces, Swift protocols can have default method implementations written in a separate `extension MyProtocol { ... }` without modifying the original protocol definition.",
  "2_2": "Code Organization: In iOS, senior developers use extensions to group protocol conformances: `extension UserProfileView: Equatable { ... }` keeping the main definition lean and readable.",
  "2_3": "Performance Tip: Use `some View` (opaque return type) in SwiftUI instead of `any View` (existential box). `some` allows the compiler to resolve concrete types statically without heap allocation overhead.",
  "2_4": "Error Handling: Use `try?` to convert a throwing expression into an optional (`nil` if thrown). It is perfect for one-liners like `let cachedData = try? Data(contentsOf: url)`.",
  "2_5": "Typealias Composition: You can compose multiple protocols together cleanly using `typealias`: `typealias JSONModel = Codable & Identifiable & Sendable`.",

  // Week 3: SwiftUI Foundations
  "3_1": "Canvas Shortcut: Press Option+Cmd+Enter in Xcode to instantly toggle the interactive Canvas Preview pane. Press Option+Cmd+P to force a preview refresh when it pauses.",
  "3_2": "Stack Spacing: Stacks have default spacing on iOS (usually 8pt). Always write `VStack(alignment: .leading, spacing: 16)` if you want predictable, pixel-perfect spacing between elements.",
  "3_3": "Modifier Wrapping Rule: In SwiftUI, modifiers wrap views like an onion from inside out. `.padding().background(Color.blue)` colors the padded view, whereas `.background(Color.blue).padding()` colors only the tight text boundaries!",
  "3_4": "Flexible Push: Use `Spacer(minLength: 0)` inside stacks to push items to opposite edges. Combine with `.frame(maxWidth: .infinity, alignment: .leading)` to build full-width cards.",
  "3_5": "SF Symbols: Apple includes over 5,000 native vector icons via `Image(systemName: \"star.fill\")`. They scale automatically with Dynamic Type and support hierarchical color rendering.",

  // Week 4: State Management
  "4_1": "State Encapsulation: Always mark `@State` properties as `private`. State belongs strictly to the view that created it; child views should receive values or `@Binding` projections.",
  "4_2": "Two-Way Binding: The `$` prefix accesses the projected `Binding<T>`. Passing `$text` into a `TextField` allows the child component to mutate the parent state without callback boilerplate.",
  "4_3": "Observation Granularity: With iOS 17's `@Observable` macro, SwiftUI only invalidates and redraws views that actually read the specific mutated property—no more unnecessary parent redraws!",
  "4_4": "Environment Access: Inject dependencies at the root with `.environment(appState)` and retrieve them in any descendant with `@Environment(AppState.self) private var appState`.",
  "4_5": "State Architecture: Keep business logic out of SwiftUI view bodies. Mutate `@Observable` ViewModel state only inside user-triggered actions (buttons, toggles) or `.task` lifecycle modifiers.",

  // Week 5: Concurrency & Actors
  "5_1": "Cooperative Pool: Swift Concurrency runs on a fixed cooperative thread pool sized to your device's CPU cores. It never spawns unbounded threads like Android's legacy `Dispatchers.IO`.",
  "5_2": "Automatic Cancellation: SwiftUI's `.task` modifier automatically launches an async task when the view appears and cancels it cooperatively when the view is removed from the hierarchy.",
  "5_3": "Concurrent Fan-Out: Use `async let (user, posts) = (fetchUser(), fetchPosts())` to run multiple network calls in parallel before awaiting them together.",
  "5_4": "Main Thread Guarantee: Annotate your ViewModel classes with `@MainActor`. The compiler will ensure all published property changes and UI updates happen on the main thread automatically.",
  "5_5": "Swift 6 Data Races: In Swift 6, data races are compile-time errors. Ensure any model sent across concurrency boundaries conforms to `Sendable` (value types do this automatically).",

  // Week 6: Navigation & Lifecycle
  "6_1": "Identifiable Protocol: Conforming your data model to `Identifiable` (with `id = UUID()`) eliminates the need for `id: \\.id` when using `List` or `ForEach`.",
  "6_2": "Type-Safe Navigation: Use `NavigationStack(path: $path)` bound to an array of enum destinations. This allows programmatic pop-to-root (`path.removeAll()`) and deep-linking.",
  "6_3": "Data-Driven Sheets: Always prefer `.sheet(item: $selectedUser)` over `.sheet(isPresented: $showSheet)`. It guarantees non-nil data is passed to the destination modal.",
  "6_4": "Scene Phase: Observe `@Environment(\\.scenePhase) private var scenePhase` to detect when your app moves to `.active`, `.inactive`, or `.background`.",
  "6_5": "Component Previews: Keep child views decoupled from global navigation routers so they can be previewed independently in Xcode Previews with mock data.",

  // Week 7: Networking & Clean DI
  "7_1": "URLSession async: `let (data, response) = try await URLSession.shared.data(from: url)` replaces entire OkHttp/Retrofit call stacks in standard iOS apps.",
  "7_2": "Snake Case Decoding: Set `decoder.keyDecodingStrategy = .convertFromSnakeCase` on `JSONDecoder` to automatically map backend `user_name` to Swift `userName` without custom CodingKeys.",
  "7_3": "HTTP Status Check: Always cast the URLResponse: `guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else { throw APIError.badStatus }`.",
  "7_4": "Dependency Injection: In iOS, protocol initializer injection (`init(api: APIClient = LiveAPIClient())`) provides clean testability without requiring Hilt or Dagger reflection.",
  "7_5": "Mock Fixtures: Load mock JSON files from your test bundle with `Bundle(for: Self.self).url(forResource: \"user\", withExtension: \"json\")` for deterministic offline testing.",

  // Week 8: SwiftData & Security
  "8_1": "AppStorage Simplicity: `@AppStorage(\"hasOnboarded\") var hasOnboarded = false` automatically stores values in `UserDefaults` and updates the view when changed.",
  "8_2": "SwiftData @Model: The `@Model` macro in SwiftData replaces Room entity annotations, SQLite queries, and DAOs with a single, clean class declaration.",
  "8_3": "Live Queries: The `@Query(sort: \\Item.date, order: .reverse) private var items: [Item]` macro automatically keeps SwiftUI views in sync with database insertions and deletions.",
  "8_4": "Keychain Security: Never store auth tokens, API secrets, or passwords in `UserDefaults` or unencrypted SQLite files; always store them in the iOS Keychain.",
  "8_5": "In-Memory Previews: Configure an in-memory `ModelContainer` for SwiftUI Previews so test data resets on every canvas re-render without touching disk.",

  // Week 9: Memory & Testing
  "9_1": "ARC vs GC: ARC is deterministic: when retain count drops to 0, `deinit` executes immediately. There is no garbage collector thread and no UI frame stutter.",
  "9_2": "Retain Cycle Fix: In escaping closures that capture `self` (such as async handlers or completion callbacks), write `[weak self]` in the capture list to prevent leaks.",
  "9_3": "Copy-on-Write: Swift value types (Array, Dictionary, String) share memory until you mutate one of them. Passing large collections around is practically zero-cost.",
  "9_4": "Swift Testing: Use `@Test` and `#expect(user.isValid)` from Apple's modern `Testing` framework instead of legacy `XCTAssertEqual` from `XCTest`.",
  "9_5": "Memory Graph: Click the Debug Memory Graph button in Xcode's debug bar to see an interactive 3D visual graph of all allocated objects and leaked retain cycles.",

  // Week 10: Capstone & Shipping
  "10_1": "Local SPM Packages: Modularize your app into local Swift packages using File > Add Package Dependencies > Add Local... to speed up incremental builds.",
  "10_2": "Build Configuration: Use `.xcconfig` files to separate debug vs. production API endpoints, bundle identifiers, and app names without editing project pbxproj files.",
  "10_3": "Signing & Provisioning: Enable 'Automatically manage signing' in Xcode target settings. Xcode will handle provisioning profiles and certificate requests automatically.",
  "10_4": "TestFlight Distribute: In Xcode, select Product > Archive, then open the Organizer window and click 'Distribute App' to ship builds to TestFlight in one click.",
  "10_5": "App Icon Asset: iOS 17+ requires only a single 1024x1024 PNG in `Assets.xcassets/AppIcon`. Xcode automatically generates all necessary device sizes on compilation."
};

// ============================================================================
// BEST PRACTICES: DO'S AND DON'TS BY WEEK & DAY
// ============================================================================
const TOPIC_DOS_DONTS = {
  // Week 1
  "1_1": {
    dos: [
      "Use `let` by default for all variables; switch to `var` only when the compiler complains of mutation.",
      "Use string interpolation `\"\\(variable)\"` for clean, readable text formatting.",
      "Use bracket literals `[1, 2, 3]` for arrays and `[\"key\": \"value\"]` for dictionaries."
    ],
    donts: [
      "Don't use Kotlin `$var` syntax in Swift strings; it will not compile.",
      "Don't use `var` for constants that are never reassigned.",
      "Don't use legacy `NSMutableArray` or `NSDictionary` from Objective-C."
    ]
  },
  "1_2": {
    dos: [
      "Design argument labels so call sites read like natural English sentences (`greet(to: \"Alex\")`).",
      "Use an underscore `_` to suppress parameter labels only when the function name already makes the argument obvious.",
      "Provide default values for parameters instead of writing redundant overloaded methods."
    ],
    donts: [
      "Don't suppress all argument labels with `_` out of Android habit—you lose call-site clarity.",
      "Don't name parameters `arg1`, `val`, or `param`; make them expressive and domain-driven.",
      "Don't repeat the parameter type in the label (e.g. `sendString(string:)`)."
    ]
  },
  "1_3": {
    dos: [
      "Use `guard let ... else { return }` for early exits to keep your code indentation flat along the Golden Path.",
      "Use `??` (nil-coalescing) to provide clean fallback values for optionals.",
      "Use Swift 5.7+ shorthand syntax `if let user { ... }` when the variable name matches."
    ],
    donts: [
      "Never use the force unwrap operator `!` in production code; it will crash if nil.",
      "Don't nest multiple levels of `if let` statements (the dreaded pyramid of doom).",
      "Don't write `if (val != nil) { val! }`—always unwrap safely with `if let` or `guard let`."
    ]
  },
  "1_4": {
    dos: [
      "Default to `struct` for all data models, state objects, and DTOs to get thread-safe value semantics.",
      "Use `class` only when you genuinely require reference identity, Objective-C interoperability, or shared mutable lifecycle.",
      "Use `enum` with associated values to represent mutually exclusive state machines."
    ],
    donts: [
      "Don't make everything a `class` out of Java/Kotlin habit.",
      "Don't build deep class inheritance hierarchies for domain data.",
      "Don't mutate struct properties through reference aliases—structs are copied on assignment."
    ]
  },
  "1_5": {
    dos: [
      "Leverage compiler-enforced exhaustiveness in `switch` statements over enums.",
      "Pattern-match associated values with `case .success(let data):`.",
      "Test boundary conditions: empty collections, nil values, and extreme numbers."
    ],
    donts: [
      "Don't add a lazy `default:` case when switching over a finite enum; let the compiler catch missing cases.",
      "Don't ignore compiler warnings in Xcode; treat them as build errors.",
      "Don't copy-paste raw Kotlin logic into Swift without adopting Swift value semantics."
    ]
  },

  // Week 2: Protocols & Extensions
  "2_1": {
    dos: [
      "Compose small, single-purpose protocols (`Identifiable`, `Equatable`, `Sendable`).",
      "Provide default method implementations in protocol extensions to avoid boilerplate in conforming types.",
      "Use protocol conformance to decouple business logic from concrete dependencies."
    ],
    donts: [
      "Don't create giant monolithic god-protocols with 20 methods.",
      "Don't use classes where a protocol with value type implementations is cleaner.",
      "Don't use runtime type casting (`as?`) when polymorphism via protocols handles it naturally."
    ]
  },
  "2_2": {
    dos: [
      "Use extensions to organize code into logical sections with `// MARK: -` headers.",
      "Extend existing standard library types (`String`, `Date`) with domain-specific helpers.",
      "Put protocol conformances into dedicated extension blocks in separate files."
    ],
    donts: [
      "Don't scatter extensions randomly without consistent naming (`String+Formatting.swift`).",
      "Don't attempt to add stored properties in extensions; only computed properties are supported.",
      "Don't pollute global standard library types with overly specific one-off helpers."
    ]
  },
  "2_3": {
    dos: [
      "Use `some View` (opaque return type) for SwiftUI `body` properties to enable static compiler dispatch.",
      "Use generic constraints (`<T: Repository>`) for high-performance static dispatch.",
      "Use `any Protocol` (existential) only when you truly need heterogeneous collections at runtime."
    ],
    donts: [
      "Don't wrap SwiftUI views in `AnyView`—it destroys SwiftUI's view identity and diffing performance.",
      "Don't use `any Protocol` where `some Protocol` works; existential boxes add dynamic dispatch and heap costs.",
      "Don't expose internal concrete view types in public component APIs."
    ]
  },
  "2_4": {
    dos: [
      "Model domain errors with typed Swift enums conforming to `Error`.",
      "Use `do-catch` blocks at clear architectural boundaries (e.g. in ViewModels or UseCases).",
      "Use `try?` when a nil result is a completely acceptable fallback."
    ],
    donts: [
      "Never catch generic errors and silently swallow them with empty `catch {}` blocks.",
      "Don't use exceptions for normal control flow (like loop termination).",
      "Don't use `try!` unless you are writing a unit test that is guaranteed to succeed."
    ]
  },
  "2_5": {
    dos: [
      "Test both success and error paths in your protocol-oriented code.",
      "Use protocol mocking to verify error handling without hitting real networks or databases.",
      "Document custom errors with clear, localized descriptions."
    ],
    donts: [
      "Don't create complex mock classes with hand-rolled state when a simple stub protocol suffices.",
      "Don't skip error mapping between raw network HTTP errors and user-facing domain errors.",
      "Don't leave unfinished error handling TODOs in shipping code."
    ]
  },

  // Week 3: SwiftUI Foundations
  "3_1": {
    dos: [
      "Treat SwiftUI `View` structs as lightweight, immutable blueprints that are recreated frequently.",
      "Break large screens into small, modular subviews with focused single responsibilities.",
      "Provide representative mock data in Xcode Previews to test multiple states (loading, empty, loaded)."
    ],
    donts: [
      "Don't write 400-line monolithic `body` properties—extract subviews or computed properties.",
      "Don't store heavy reference objects directly in `View` properties without `@State` or `@Observable`.",
      "Don't perform network or database operations directly inside the `body` property."
    ]
  },
  "3_2": {
    dos: [
      "Use `VStack`, `HStack`, and `ZStack` as structural layout containers.",
      "Specify explicit alignment and spacing on stacks for consistent layouts across devices.",
      "Nest stacks cleanly to achieve responsive, adaptive UI cards."
    ],
    donts: [
      "Don't manually apply individual `.padding()` modifiers to every element when stack spacing works globally.",
      "Don't use `ZStack` for simple overlays that can be handled with `.overlay()` or `.background()`.",
      "Don't forget to test layouts with accessibility Large Text sizes enabled."
    ]
  },
  "3_3": {
    dos: [
      "Remember that modifier order in SwiftUI is strictly sequential: inner modifiers apply first.",
      "Apply `.padding()` before `.background()` if you want the background to enclose the padded area.",
      "Use `@ViewBuilder` to conditionally include views instead of wrapping everything in `AnyView`."
    ],
    donts: [
      "Don't assume modifiers behave like Android XML layout attributes; order matters fundamentally.",
      "Don't use `AnyView` to resolve differing return types in conditional logic.",
      "Don't chain 15 modifiers in an unorganized sequence; group layout, styling, and interactions."
    ]
  },
  "3_4": {
    dos: [
      "Use `Spacer(minLength: 0)` to push elements to screen edges naturally.",
      "Use `.frame(maxWidth: .infinity, alignment: .leading)` for full-width components.",
      "Let SwiftUI's adaptive layout system size views dynamically rather than hardcoding constants."
    ],
    donts: [
      "Don't hardcode fixed pixel widths like `.frame(width: 375)`—it will break on iPhone SE and iPad.",
      "Don't use negative padding as a hack for alignment issues.",
      "Don't mix conflicting frame constraints that cause layout constraint warnings in the console."
    ]
  },
  "3_5": {
    dos: [
      "Use Apple's SF Symbols for clean, vector-based, accessible icons.",
      "Support Dynamic Type by using system font styles (`.headline`, `.subheadline`, `.caption`).",
      "Test your components in both Light and Dark modes in Xcode Previews."
    ],
    donts: [
      "Don't hardcode fixed font point sizes with `.font(.system(size: 16))` that ignore accessibility settings.",
      "Don't hardcode raw hex colors; use semantic asset catalog colors (`Color(\"PrimaryAccent\")`).",
      "Don't forget to add `.accessibilityLabel()` when icons alone convey critical actions."
    ]
  }
};

function getDefaultHintForStep(weekNum, dayNum, step) {
  const key = `${weekNum}_${dayNum}`;
  if (TOPIC_HINTS[key]) return TOPIC_HINTS[key];
  switch (weekNum) {
    case 4:
      return "State Hint: With iOS 17's `@Observable` macro, avoid legacy `ObservableObject`. Mark your ViewModel with `@Observable` and SwiftUI will automatically track only the specific fields read in the view body.";
    case 5:
      return "Concurrency Hint: Use the `.task` modifier on views for async fetching—it automatically attaches to the view's lifecycle and cancels the task when the view unmounts.";
    case 6:
      return "Navigation Hint: Use `NavigationStack(path: $path)` with an array of type-safe destinations. This enables programmatic deep-linking and easy pop-to-root (`path.removeAll()`).";
    case 7:
      return "Networking Hint: Set `decoder.keyDecodingStrategy = .convertFromSnakeCase` on `JSONDecoder` to automatically convert snake_case JSON keys to Swift camelCase without custom `CodingKeys`.";
    case 8:
      return "Persistence Hint: Use `@AppStorage` for lightweight user preferences and SwiftData's `@Model` for rich entity persistence. Keep sensitive tokens in the iOS Keychain.";
    case 9:
      return "Memory Hint: ARC operates deterministically: when retain count hits zero, `deinit` runs immediately. Use `[weak self]` in escaping closures to prevent retain cycles.";
    case 10:
      return "Shipping Hint: Modularize your codebase into local Swift Packages (SPM) to isolate features and speed up Xcode incremental compilation.";
    default:
      return "Pro-Tip: Keep your functions focused, test your boundary conditions, and verify code behavior directly in Xcode Previews.";
  }
}

function getDefaultDosDontsForStep(weekNum, dayNum, step) {
  const key = `${weekNum}_${dayNum}`;
  if (TOPIC_DOS_DONTS[key]) return TOPIC_DOS_DONTS[key];
  switch (weekNum) {
    case 4:
      return {
        dos: [
          "Use `@State` strictly for view-local value types; use `@Observable` for shared state and ViewModels.",
          "Pass `$` projected bindings to child controls that need two-way data editing.",
          "Keep ViewModel properties simple and mutate state on the main thread."
        ],
        donts: [
          "Don't use `@State` for complex reference models across multiple views.",
          "Don't mutate state during SwiftUI body evaluation.",
          "Don't use legacy `@Published` properties in modern iOS 17+ projects."
        ]
      };
    case 5:
      return {
        dos: [
          "Annotate UI-bound ViewModels with `@MainActor` to guarantee thread safety.",
          "Use `async let` for parallel independent requests.",
          "Conform data models crossing actor boundaries to `Sendable`."
        ],
        donts: [
          "Don't use legacy `DispatchQueue.global().async` in modern Swift 6.",
          "Don't leave unbounded background tasks running after a screen is closed.",
          "Don't use `nonisolated(unsafe)` to silence compiler concurrency warnings without locks."
        ]
      };
    case 6:
      return {
        dos: [
          "Use `navigationDestination(for: Type.self)` for type-safe screen routing.",
          "Conform list item models to `Identifiable` for clean `List` rendering.",
          "Use `.sheet(item: $selected)` to guarantee safe unwrapping in modals."
        ],
        donts: [
          "Don't use deprecated `NavigationView` or legacy `NavigationLink`.",
          "Don't nest multiple `NavigationStack`s inside child views.",
          "Don't hardcode raw string paths for screen navigation."
        ]
      };
    case 7:
      return {
        dos: [
          "Use `URLSession.shared.data(from: url)` with `async/await`.",
          "Validate HTTP status codes with `(200...299).contains(httpResponse.statusCode)`.",
          "Use protocol initializer injection for testable API clients without Hilt."
        ],
        donts: [
          "Don't swallow network errors or return empty lists silently.",
          "Don't manually parse dictionaries with `[String: Any]`.",
          "Don't hit live endpoints in automated unit tests."
        ]
      };
    case 8:
      return {
        dos: [
          "Decorate database entity classes with `@Model`.",
          "Use `@Query` for reactive, auto-updating SwiftUI list queries.",
          "Store authentication tokens and keys in the iOS Keychain."
        ],
        donts: [
          "Don't store sensitive secrets or auth tokens in `UserDefaults`.",
          "Don't mutate SwiftData entities outside of an active `ModelContext`.",
          "Don't load entire tables into memory just to filter them with array methods."
        ]
      };
    case 9:
      return {
        dos: [
          "Capture `[weak self]` in escaping async closures and notification listeners.",
          "Use modern Swift Testing with `@Test` and `#expect`.",
          "Inspect allocations with Xcode's Memory Graph Debugger before releases."
        ],
        donts: [
          "Don't create strong reference cycles between parent and child objects.",
          "Don't blindly add `[weak self]` to non-escaping closures like `.map` or `.filter`.",
          "Don't rely on background garbage collection to clean up memory leaks."
        ]
      };
    case 10:
      return {
        dos: [
          "Use `.xcconfig` files to configure environment variables and bundle IDs cleanly.",
          "Enable 'Automatically manage signing' in Xcode.",
          "Distribute builds to TestFlight for internal and external QA testing."
        ],
        donts: [
          "Don't commit private signing certificates or API keys to git.",
          "Don't submit to App Store review without testing on real physical hardware.",
          "Don't ignore App Store Review Guidelines regarding privacy manifests."
        ]
      };
    default:
      return {
        dos: [
          "Follow Apple Human Interface Guidelines for native iOS feel.",
          "Write clean, modular code with small single-purpose types.",
          "Test edge cases and handle errors explicitly."
        ],
        donts: [
          "Don't copy-paste Android design patterns directly onto iOS.",
          "Don't ignore compiler warnings or static analyzer suggestions.",
          "Don't block the main thread with synchronous operations."
        ]
      };
  }
}

function getStepTutorialContent(weekNum, step) {
  let descriptionHtml = "";
  if (step.description) {
    if (Array.isArray(step.description)) {
      descriptionHtml = step.description.map(p => `<p>${formatInlineCode(p)}</p>`).join("");
    } else {
      descriptionHtml = `<p>${formatInlineCode(step.description)}</p>`;
    }
    if (step.details && step.details.length > 0) {
      descriptionHtml += `<div class="tutorial-subheading">Key Technical Details:</div><ul class="concept-details-list" style="margin-top:0.4rem;">` +
        step.details.map(d => `<li>${formatInlineCode(d)}</li>`).join("") +
        `</ul>`;
    }
  } else if (step.details && step.details.length > 0) {
    descriptionHtml = step.details.map(d => `<p>${formatInlineCode(d)}</p>`).join("");
  } else {
    descriptionHtml = `<p><strong>Core Architectural Shift:</strong> ${formatInlineCode(step.shift)}</p><p>Understanding this concept under the hood ensures you write idiomatic Swift without carrying over Android memory or architectural anti-patterns.</p>`;
  }

  const hintText = step.hint || getDefaultHintForStep(weekNum, step.day, step);

  let dos = (step.dos && step.dos.length > 0) ? step.dos : null;
  let donts = (step.donts && step.donts.length > 0) ? step.donts : null;

  if (!dos || !donts) {
    const defaults = getDefaultDosDontsForStep(weekNum, step.day, step);
    if (!dos) dos = defaults.dos;
    if (!donts) donts = defaults.donts;
  }

  return { descriptionHtml, hintText, dos, donts };
}

function saveCompletedWeeks() {
  localStorage.setItem("ios_completed_weeks", JSON.stringify(completedWeeks));
  updateProgressUI();
  renderSidebar();
}

function saveCompletedDays() {
  localStorage.setItem("ios_completed_days_v2", JSON.stringify(completedDays));
  updateProgressUI();
  renderSidebar();
}

function saveQuizAnswers() {
  localStorage.setItem("ios_quiz_answers_v2", JSON.stringify(quizAnswers));
  updateProgressUI();
}

function saveMasteredFlashcards() {
  localStorage.setItem("ios_mastered_cards_v2", JSON.stringify(masteredFlashcards));
  updateProgressUI();
}

function isDayCompleted(weekNum, dayNum) {
  return completedDays[weekNum] && completedDays[weekNum].includes(dayNum);
}

window.toggleDayCompleted = function(weekNum, dayNum) {
  if (!completedDays[weekNum]) completedDays[weekNum] = [];
  const idx = completedDays[weekNum].indexOf(dayNum);
  if (idx === -1) {
    completedDays[weekNum].push(dayNum);
    launchConfetti();
  } else {
    completedDays[weekNum].splice(idx, 1);
  }
  saveCompletedDays();
  renderMainContent();
};

function isCardMastered(weekNum, cardIdx) {
  return masteredFlashcards[weekNum] && masteredFlashcards[weekNum].includes(cardIdx);
}

window.toggleCardMastered = function(weekNum, cardIdx) {
  if (!masteredFlashcards[weekNum]) masteredFlashcards[weekNum] = [];
  const idx = masteredFlashcards[weekNum].indexOf(cardIdx);
  if (idx === -1) {
    masteredFlashcards[weekNum].push(cardIdx);
  } else {
    masteredFlashcards[weekNum].splice(idx, 1);
  }
  saveMasteredFlashcards();
  renderMainContent();
};

function toggleWeekComplete(weekNum) {
  if (completedWeeks.includes(weekNum)) {
    completedWeeks = completedWeeks.filter(w => w !== weekNum);
  } else {
    completedWeeks.push(weekNum);
    launchConfetti();
  }
  saveCompletedWeeks();
  renderMainContent();
}

function getCompletedMicroStepsCount() {
  let count = 0;
  Object.values(completedDays).forEach(days => {
    if (Array.isArray(days)) count += days.length;
  });
  return count;
}

function calculateTotalXP() {
  let xp = completedWeeks.length * 100;
  WEEKS_DATA.forEach(w => {
    const score = getWeekQuizScore(w.week);
    xp += score.correct * 15;
    if (completedDays[w.week]) {
      xp += completedDays[w.week].length * 20;
    }
    if (masteredFlashcards[w.week]) {
      xp += masteredFlashcards[w.week].length * 10;
    }
  });
  Object.keys(checkpointAnswers).forEach(() => {
    xp += 10;
  });
  return xp;
}

function getStudentRank(xp) {
  if (xp >= 1000) return { title: "🏆 Dual-Platform Master", level: 5 };
  if (xp >= 600)  return { title: "🚀 Concurrency Pro", level: 4 };
  if (xp >= 350)  return { title: "🛡️ SwiftUI Architect", level: 3 };
  if (xp >= 150)  return { title: "⚡ Swift Apprentice", level: 2 };
  return { title: "🌱 Android Scout", level: 1 };
}

function launchConfetti() {
  if (typeof document === "undefined" || !document.body || !document.createElement) return;
  const colors = ["#4f46e5", "#ea580c", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];
  for (let i = 0; i < 32; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.left = Math.random() * 100 + "vw";
    el.style.backgroundColor = colors[i % colors.length];
    el.style.animationDuration = (1.1 + Math.random() * 1.1) + "s";
    el.style.animationDelay = (Math.random() * 0.25) + "s";
    document.body.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 2400);
  }
}

function updateProgressUI() {
  const totalWeeks = WEEKS_DATA.length || 10;
  const pct = Math.round((completedWeeks.length / totalWeeks) * 100);
  const totalXP = calculateTotalXP();
  const rank = getStudentRank(totalXP);
  const stepsDone = getCompletedMicroStepsCount();

  const textEl = document.getElementById("progress-text");
  const fillEl = document.getElementById("progress-fill");
  const xpEl = document.getElementById("xp-count");
  const rankBadgeEl = document.getElementById("student-rank-badge");
  const studentXpEl = document.getElementById("student-xp-display");
  const subtextEl = document.getElementById("student-completed-subtext");

  if (textEl) textEl.textContent = `${completedWeeks.length}/${totalWeeks} Weeks (${pct}%)`;
  if (fillEl) fillEl.style.width = `${Math.max(pct, 6)}%`;
  if (xpEl) xpEl.textContent = totalXP;
  if (rankBadgeEl) rankBadgeEl.textContent = rank.title;
  if (studentXpEl) studentXpEl.textContent = `${totalXP} XP`;
  if (subtextEl) subtextEl.textContent = `${stepsDone} of 50 micro-lessons completed`;
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightCode(raw) {
  const escaped = escapeHtml(raw);
  const tokenRegex = /(\/\/.*$)|(".*?")|(#[A-Za-z_]+|@[A-Za-z_]+)|\b(struct|class|enum|protocol|extension|func|fun|val|var|let|guard|else|return|switch|case|default|where|if|try|throws|async|await|actor|some|any|weak|unowned|mutating|private|public|final|import|init|deinit|data|object|sealed|interface|suspend)\b|\b(String|Int|Double|Bool|UUID|Date|Data|URL|View|Scene|App|Optional|Result|List|VStack|HStack|ZStack|NavigationStack|Text|Button|TextField|Spacer|Codable|Decodable|Encodable|Identifiable|Hashable|Equatable|Sendable)\b/gm;

  return escaped.replace(tokenRegex, (match, cmt, str, attr, kw, type) => {
    if (cmt) return `<span class="tok-cmt">${cmt}</span>`;
    if (str) return `<span class="tok-str">${str}</span>`;
    if (attr) return `<span class="tok-attr">${attr}</span>`;
    if (kw) return `<span class="tok-kw">${kw}</span>`;
    if (type) return `<span class="tok-type">${type}</span>`;
    return match;
  });
}

function formatInlineCode(str) {
  return String(str || "").replace(/`([^`]+)`/g, "<code>$1</code>");
}

function getWeekQuizScore(weekNum) {
  const weekObj = WEEKS_DATA.find(w => w.week === weekNum);
  if (!weekObj || !weekObj.quiz) return { correct: 0, answered: 0, total: 0 };
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

// Mobile Sidebar Toggle
window.toggleSidebar = function() {
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (!sidebar) return;
  sidebar.classList.toggle("mobile-open");
  if (backdrop) backdrop.classList.toggle("active");
};

// Course Search Engine
window.handleCourseSearch = function(query) {
  const container = document.getElementById("search-results-list");
  const clearBtn = document.getElementById("clear-search-btn");
  if (!container) return;
  if (!query || query.trim().length === 0) {
    container.style.display = "none";
    if (clearBtn) clearBtn.style.display = "none";
    return;
  }
  if (clearBtn) clearBtn.style.display = "inline-block";
  const q = query.toLowerCase().trim();
  const results = [];

  WEEKS_DATA.forEach(w => {
    if (w.title.toLowerCase().includes(q) || (w.androidAnchor && w.androidAnchor.toLowerCase().includes(q))) {
      results.push({ week: w.week, day: 1, title: `Week ${w.week}: ${w.title}`, sub: w.androidAnchor });
    }
    if (w.dailySteps) {
      w.dailySteps.forEach(s => {
        if (s.title.toLowerCase().includes(q) || s.goal.toLowerCase().includes(q) || (s.shift && s.shift.toLowerCase().includes(q))) {
          results.push({ week: w.week, day: s.day, title: `Week ${w.week} · Day ${s.day}: ${s.title}`, sub: s.goal });
        }
      });
    }
  });

  if (results.length === 0) {
    container.innerHTML = `<div style="font-size:0.8rem;color:var(--text-muted);padding:0.5rem;">No matching lessons found for "${escapeHtml(query)}"</div>`;
  } else {
    container.innerHTML = results.slice(0, 8).map(r => `
      <div class="search-result-item" onclick="jumpToSearchResult(${r.week}, ${r.day})">
        <span class="search-result-tag">Week ${r.week} · Day ${r.day}</span>
        <span class="search-result-title">${escapeHtml(r.title)}</span>
        <span style="font-size:0.72rem;color:var(--text-muted);">${escapeHtml(r.sub || "")}</span>
      </div>
    `).join("");
  }
  container.style.display = "flex";
};

window.clearCourseSearch = function() {
  const input = document.getElementById("course-search-input");
  if (input) input.value = "";
  handleCourseSearch("");
};

window.jumpToSearchResult = function(weekNum, dayNum) {
  currentWeekNum = weekNum;
  currentDay = dayNum;
  currentTab = "learn";
  clearCourseSearch();
  const sidebar = document.getElementById("sidebar");
  if (sidebar && sidebar.classList.contains("mobile-open")) {
    toggleSidebar();
  }
  renderSidebar();
  renderMainContent();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Render Sidebar Curriculum Tree Grouped by Modules
function renderSidebar() {
  const treeEl = document.getElementById("curriculum-tree") || document.getElementById("week-nav-list");
  if (!treeEl) return;

  let html = `
    <div style="margin-bottom:0.75rem;">
      <button class="week-nav-btn ${currentTab === "roadmap" ? "active" : ""}" onclick="selectTab('roadmap')">
        <div class="week-nav-meta">
          <span class="week-num">ORIENTATION</span>
          <span class="week-title">🧭 10-Week Roadmap & Guide</span>
        </div>
      </button>
    </div>
  `;

  COURSE_MODULES.forEach(mod => {
    html += `
      <div class="module-group">
        <div class="module-badge-header">
          <span>${mod.title.split(":")[0]}</span>
          <span style="color:var(--accent-primary);font-weight:700;">${mod.badge}</span>
        </div>
        <ul class="week-nav-list">
    `;

    mod.weeks.forEach(weekNum => {
      const w = WEEKS_DATA.find(item => item.week === weekNum);
      if (!w) return;
      const isSelectedWeek = w.week === currentWeekNum;
      const isWeekTab = (currentTab === "learn" || currentTab === "practice" || currentTab === "linkedin");
      const isExpanded = isSelectedWeek && isWeekTab;
      const isDone = completedWeeks.includes(w.week);
      const score = getWeekQuizScore(w.week);

      html += `
        <li class="sidebar-week-item">
          <button class="week-nav-btn ${isExpanded ? "active" : ""} ${isDone ? "completed" : ""}" onclick="selectWeek(${w.week})">
            <div class="week-nav-meta">
              <span class="week-num">Week ${w.week} · ${w.dates}</span>
              <span class="week-title">${w.title}</span>
              <span style="font-size:0.72rem;color:var(--text-muted);margin-top:0.1rem;">
                Quiz: ${score.correct}/${score.total}
              </span>
            </div>
            <span class="week-check" title="${isDone ? "Completed" : "In progress"}">${isDone ? "✓" : ""}</span>
          </button>
      `;

      if (isExpanded && w.dailySteps && w.dailySteps.length > 0) {
        html += `
          <ul class="sidebar-days-list">
            ${w.dailySteps.map(step => {
              const isStepActive = (currentTab === "learn" && currentDay === step.day);
              const isStepDone = isDayCompleted(w.week, step.day);
              return `
                <li>
                  <button class="sidebar-day-link ${isStepActive ? "active" : ""}" onclick="selectDayFromSidebar(${step.day})">
                    <span style="display:flex;align-items:center;gap:0.4rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                      <span class="day-status-dot ${isStepDone ? "completed" : ""}">
                        ${isStepDone ? "✓" : step.day}
                      </span>
                      <span>Day ${step.day}: ${escapeHtml(step.title.split(":")[0].replace(/Day \d+ - /i, ""))}</span>
                    </span>
                    <span style="font-size:0.68rem;color:var(--text-muted);flex-shrink:0;">${step.time || "15m"}</span>
                  </button>
                </li>
              `;
            }).join("")}
            <li>
              <button class="sidebar-day-link ${currentTab === "practice" ? "active" : ""}" onclick="selectTab('practice')">
                <span style="display:flex;align-items:center;gap:0.4rem;">
                  <span>🏆</span>
                  <span>10-Question Quiz & Lab</span>
                </span>
                <span style="font-size:0.68rem;color:var(--text-muted);">${score.correct}/${score.total}</span>
              </button>
            </li>
            <li>
              <button class="sidebar-day-link ${currentTab === "linkedin" ? "active" : ""}" onclick="selectTab('linkedin')">
                <span style="display:flex;align-items:center;gap:0.4rem;">
                  <span>📰</span>
                  <span>LinkedIn Article Kit</span>
                </span>
              </button>
            </li>
          </ul>
        `;
      }

      html += `</li>`;
    });

    html += `
        </ul>
      </div>
    `;
  });

  treeEl.innerHTML = html;
  updateProgressUI();
}

window.selectDayFromSidebar = function(dayNum) {
  currentDay = dayNum;
  currentTab = "learn";
  const sidebar = document.getElementById("sidebar");
  if (sidebar && sidebar.classList.contains("mobile-open")) {
    toggleSidebar();
  }
  renderSidebar();
  renderMainContent();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.selectWeek = function(weekNum) {
  currentWeekNum = weekNum;
  currentDay = 1;
  flashcardIdx = 0;
  flashcardFlipped = false;
  currentTab = "learn";
  const sidebar = document.getElementById("sidebar");
  if (sidebar && sidebar.classList.contains("mobile-open")) {
    toggleSidebar();
  }
  renderSidebar();
  renderMainContent();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.selectTab = function(tab) {
  currentTab = tab;
  const sidebar = document.getElementById("sidebar");
  if (sidebar && sidebar.classList.contains("mobile-open")) {
    toggleSidebar();
  }
  renderSidebar();
  renderMainContent();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.selectDay = function(dayNum) {
  currentDay = dayNum;
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

// Flashcards
window.flipFlashcard = function() {
  flashcardFlipped = !flashcardFlipped;
  renderMainContent();
};

window.nextFlashcard = function(delta, total) {
  flashcardIdx = (flashcardIdx + delta + total) % total;
  flashcardFlipped = false;
  renderMainContent();
};

// Code View Switcher
window.toggleCodeViewMode = function() {
  codeViewMode = codeViewMode === "split" ? "tabbed" : "split";
  try { localStorage.setItem("ios_code_view_mode", codeViewMode); } catch (e) {}
  renderMainContent();
};

window.selectCodeTab = function(stepKey, lang) {
  activeCodeTabs[stepKey] = lang;
  renderMainContent();
};

// Inline Checkpoint Answering
window.answerCheckpoint = function(weekNum, dayNum, optionIdx) {
  const key = `${weekNum}_${dayNum}`;
  checkpointAnswers[key] = optionIdx;
  try {
    localStorage.setItem("ios_checkpoint_answers_v2", JSON.stringify(checkpointAnswers));
  } catch (e) {}

  const step = WEEKS_DATA.find(w => w.week === weekNum)?.dailySteps?.find(s => s.day === dayNum);
  const cp = getCheckpointForDay(weekNum, dayNum, step);
  if (optionIdx === cp.correctIndex) {
    launchConfetti();
  }
  updateProgressUI();
  renderMainContent();
};

function renderFlashcardsSection(weekObj) {
  const cards = weekObj.flashcards || [];
  if (cards.length === 0) return "";
  const idx = Math.min(flashcardIdx, cards.length - 1);
  const card = cards[idx];
  const isMastered = isCardMastered(weekObj.week, idx);
  const masteredCount = (masteredFlashcards[weekObj.week] || []).length;

  return `
    <div class="section-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.85rem;flex-wrap:wrap;gap:0.5rem;">
        <div>
          <h2>🃏 Active-Recall Flashcards (Week ${weekObj.week})</h2>
          <p style="font-size:0.86rem;color:var(--text-secondary);">Click the card to flip between the question and the architectural explanation.</p>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <button class="btn" onclick="nextFlashcard(-1, ${cards.length})">← Prev</button>
          <span style="font-size:0.82rem;font-weight:700;color:var(--text-secondary);">${idx + 1} / ${cards.length}</span>
          <button class="btn" onclick="nextFlashcard(1, ${cards.length})">Next →</button>
        </div>
      </div>

      <div class="flashcard-container ${flashcardFlipped ? "flipped" : ""}" onclick="flipFlashcard()" role="button" tabindex="0">
        <div>
          <div class="flashcard-badge">${flashcardFlipped ? "💡 Answer Revealed (Click to flip back)" : "❓ Active-Recall Question (Click card to flip)"}</div>
          <div class="flashcard-text">${formatInlineCode(flashcardFlipped ? card.back : card.front)}</div>
        </div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:1rem;">
          ✨ Tap anywhere on this card to flip
        </div>
      </div>

      <div class="flashcard-mastery-bar">
        <span style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">
          Mastery: ${masteredCount} of ${cards.length} cards mastered
        </span>
        <button class="flashcard-rating-btn ${isMastered ? "mastered" : ""}" onclick="toggleCardMastered(${weekObj.week}, ${idx})">
          ${isMastered ? "🔥 Mastered (+10 XP) ✓" : "Mark as Mastered (+10 XP)"}
        </button>
      </div>
    </div>
  `;
}

// Interactive Simulators
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
window.setSyntaxDemo = function(demo) { syntaxSelectedDemo = demo; renderMainContent(); };

function renderInteractiveSimulator(weekObj) {
  if (weekObj.week === 1) {
    return `
      <div class="interactive-widget">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h2>⚡ Interactive Swift Syntax & Function Labels Playground</h2>
            <p style="font-size:0.88rem;color:var(--text-secondary);">Click each pattern to see how Swift's English-sentence syntax compares directly to Kotlin.</p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn ${syntaxSelectedDemo === "labels" ? "btn-primary" : ""}" onclick="setSyntaxDemo('labels')">Argument Labels</button>
            <button class="btn ${syntaxSelectedDemo === "strings" ? "btn-primary" : ""}" onclick="setSyntaxDemo('strings')">String Templates</button>
            <button class="btn ${syntaxSelectedDemo === "guard" ? "btn-primary" : ""}" onclick="setSyntaxDemo('guard')">guard let Golden Path</button>
          </div>
        </div>

        <div class="widget-stage" style="font-family:var(--font-mono);font-size:0.85rem;line-height:1.65;">
          ${syntaxSelectedDemo === "labels" ? `
            <div style="color:var(--accent-swift);font-weight:700;margin-bottom:0.4rem;">🍎 Swift: External Label + Internal Name</div>
            <pre style="background:var(--bg-surface);padding:0.75rem;border-radius:6px;border:1px solid var(--border-color);margin:0.5rem 0;"><code>func transfer(amount: Double, from source: Account, to destination: Account) {
    source.balance -= amount
    destination.balance += amount
}
// Call site reads like natural English:
transfer(amount: 100, from: checking, to: savings)</code></pre>
            <div style="color:var(--text-secondary);font-size:0.82rem;">Notice how 'from' and 'to' are used at the call site, while 'source' and 'destination' are used inside the function body!</div>
          ` : syntaxSelectedDemo === "strings" ? `
            <div style="color:var(--accent-kotlin);font-weight:700;margin-bottom:0.4rem;">🤖 Kotlin: "$name" vs 🍎 Swift: "\\(name)"</div>
            <pre style="background:var(--bg-surface);padding:0.75rem;border-radius:6px;border:1px solid var(--border-color);margin:0.5rem 0;"><code>let name = "Sudhakar"
let experienceYears = 5
print("Hello \\(name)! Next year you will have \\(experienceYears + 1) years of experience.")
// Output: Hello Sudhakar! Next year you will have 6 years of experience.</code></pre>
          ` : `
            <div style="color:var(--accent-primary-text);font-weight:700;margin-bottom:0.4rem;">🛡️ guard let: Keep your happy path flat and unindented!</div>
            <pre style="background:var(--bg-surface);padding:0.75rem;border-radius:6px;border:1px solid var(--border-color);margin:0.5rem 0;"><code>func openProfile(id: String?) {
    guard let id, !id.isEmpty else {
        print("Missing user ID!")
        return // Compiler forces early exit!
    }
    // 'id' is a non-optional String for the entire rest of the function:
    loadUserData(for: id)
}</code></pre>
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
            <div>• Heap Boxing Overhead: 24+ bytes (Existential Box with Witness Table pointer)</div>
            <div>• Method Call Mechanism: Dynamic Witness Table Lookup</div>
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
            <h2>📐 SwiftUI Modifier Order Simulator (Wrapping vs Mutating)</h2>
            <p style="font-size:0.88rem;color:var(--text-secondary);">In Compose, modifiers mutate sequentially. In SwiftUI, modifiers wrap views from inside out.</p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn ${modifierPaddingFirst ? "btn-primary" : ""}" onclick="toggleModifierOrder(true)">
              <code>.padding().background()</code>
            </button>
            <button class="btn ${!modifierPaddingFirst ? "btn-primary" : ""}" onclick="toggleModifierOrder(false)">
              <code>.background().padding()</code>
            </button>
          </div>
        </div>
        <div class="widget-stage" style="display:flex;align-items:center;justify-content:center;padding:2rem;">
          <div style="border:2px dashed #e11d48;display:inline-block;padding:${modifierPaddingFirst ? "0px" : "20px"};">
            <div style="background:#2563eb;color:#fff;font-weight:700;border-radius:6px;padding:${modifierPaddingFirst ? "20px 28px" : "2px 6px"};">
              ${modifierPaddingFirst ? "Padding Inside ➔ Blue Covers All" : "Tight Blue Background ➔ Red Dashes Show Outer Padding"}
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
            <h2>🔬 <code>@Observable</code> Invalidation Simulator (iOS 17+)</h2>
            <p style="font-size:0.88rem;color:var(--text-secondary);">Click a property to see why fine-grained observation only updates views that read that property!</p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn ${observableLastMutated === "user" ? "btn-primary" : ""}" onclick="triggerObservableMutation('user')">Mutate <code>vm.username</code></button>
            <button class="btn ${observableLastMutated === "cart" ? "btn-primary" : ""}" onclick="triggerObservableMutation('cart')">Mutate <code>vm.cartTotal</code></button>
            <button class="btn ${observableLastMutated === "ignored" ? "btn-primary" : ""}" onclick="triggerObservableMutation('ignored')">Mutate <code>@ObservationIgnored cache</code></button>
          </div>
        </div>
        <div class="widget-stage" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:0.75rem;">
          <div style="padding:1rem;border-radius:8px;border:2px solid ${observableLastMutated === "user" ? "var(--accent-green)" : "var(--border-color)"};background:var(--bg-surface);">
            <strong>HeaderView</strong>: Reads <code>vm.username</code>
            <div style="margin-top:0.4rem;font-size:0.85rem;">Status: ${observableLastMutated === "user" ? "⚡ Re-rendered!" : "Idle (Zero Render Overhead)"}</div>
          </div>
          <div style="padding:1rem;border-radius:8px;border:2px solid ${observableLastMutated === "cart" ? "var(--accent-green)" : "var(--border-color)"};background:var(--bg-surface);">
            <strong>CartFooterView</strong>: Reads <code>vm.cartTotal</code>
            <div style="margin-top:0.4rem;font-size:0.85rem;">Status: ${observableLastMutated === "cart" ? "⚡ Re-rendered!" : "Idle (Zero Render Overhead)"}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (weekObj.week === 6) {
    return `
      <div class="interactive-widget">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h2>🧭 NavigationStack Value Routing Simulator</h2>
            <p style="font-size:0.88rem;color:var(--text-secondary);">Your navigation stack is just an array: <code>[${navStackPath.join(", ")}]</code></p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn" onclick="mutateNavStack('detail')">+ Push Detail</button>
            <button class="btn" onclick="mutateNavStack('settings')">+ Push Settings</button>
            <button class="btn" onclick="mutateNavStack('deeplink')">🔗 Simulate Deep Link (4 deep)</button>
            <button class="btn" onclick="mutateNavStack('pop')">← Pop 1</button>
            <button class="btn btn-primary" onclick="mutateNavStack('root')">🏠 Pop to Root</button>
          </div>
        </div>
        <div class="widget-stage" style="font-family:var(--font-mono);font-size:0.85rem;margin-top:0.75rem;">
          <div>Current Stack Depth: <strong>${navStackPath.length}</strong></div>
          <div style="margin-top:0.5rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
            ${navStackPath.map((item, idx) => `
              <span class="pill pill-swift">${idx}: ${item}</span>
            `).join(" ➔ ")}
          </div>
        </div>
      </div>
    `;
  }

  if (weekObj.week === 9) {
    const isLeaked = !arcUseWeak && arcScopeExited;
    return `
      <div class="interactive-widget">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h2>🔬 Interactive ARC Retain Cycle Simulator (Moved to Week 9)</h2>
            <p style="font-size:0.88rem;color:var(--text-secondary);">Toggle <code>[weak self]</code> and exit scope to see memory allocation in real time.</p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn ${arcUseWeak ? "btn-primary" : ""}" onclick="toggleArcWeak(true)">Use <code>[weak self]</code></button>
            <button class="btn ${!arcUseWeak ? "btn-primary" : ""}" onclick="toggleArcWeak(false)">Strong Reference (Leak!)</button>
            <button class="btn" onclick="toggleArcScope(!arcScopeExited)">
              ${arcScopeExited ? "↺ Re-Enter Scope" : "🚪 Exit Scope (Scope Ends)"}
            </button>
          </div>
        </div>

        <div class="widget-stage" style="margin-top:0.85rem;display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div style="padding:1rem;border-radius:8px;border:2px solid ${isLeaked ? "var(--accent-danger)" : "var(--accent-green)"};background:var(--bg-surface);">
            <div style="font-weight:700;">Object State:</div>
            <div>Retain Count: <strong>${arcScopeExited ? (arcUseWeak ? 0 : 1) : 2}</strong></div>
            <div style="margin-top:0.35rem;font-weight:700;color:${isLeaked ? "var(--accent-danger)" : "var(--accent-green)"};">
              ${arcScopeExited
                ? (arcUseWeak ? "✅ DEINIT CALLED: Memory cleanly deallocated immediately!" : "❌ PERMANENT LEAK: Retain cycle kept memory alive at rc=1!")
                : "Active in Scope (Retain count = 2)"}
            </div>
          </div>
          <div style="padding:1rem;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);font-size:0.85rem;">
            <strong>Memory Model Shift:</strong>
            <p style="color:var(--text-secondary);margin-top:0.25rem;">
              Unlike Android's tracing GC which collects unreachable circular islands, ARC requires retain count to reach 0. Always use <code>[weak self]</code> in escaping closures!
            </p>
          </div>
        </div>
      </div>
    `;
  }

  return "";
}

// Main Content Renderer
function renderMainContent() {
  const container = document.getElementById("main-content");
  if (!container) return;

  const weekObj = WEEKS_DATA.find(w => w.week === currentWeekNum) || WEEKS_DATA[0];
  const isCompleted = completedWeeks.includes(weekObj.week);
  const quizScore = getWeekQuizScore(weekObj.week);

  // Tab Navigation Bar
  const tabsHtml = `
    <div class="view-tabs">
      <button class="tab-btn ${currentTab === "roadmap" ? "active" : ""}" onclick="selectTab('roadmap')">
        🧭 10-Week Roadmap
      </button>
      <button class="tab-btn ${currentTab === "learn" ? "active" : ""}" onclick="selectTab('learn')">
        📖 Daily Lessons (Week ${weekObj.week})
      </button>
      <button class="tab-btn ${currentTab === "practice" ? "active" : ""}" onclick="selectTab('practice')">
        🏆 Quiz & Lab (${quizScore.correct}/${quizScore.total})
      </button>
      <button class="tab-btn ${currentTab === "linkedin" ? "active" : ""}" onclick="selectTab('linkedin')">
        📰 LinkedIn Publication Kit
      </button>
      <button class="tab-btn ${currentTab === "rosetta" ? "active" : ""}" onclick="selectTab('rosetta')">
        🗺️ Rosetta Stone
      </button>
    </div>
  `;

  if (currentTab === "roadmap") {
    container.innerHTML = tabsHtml + renderRoadmapView();
    return;
  }

  if (currentTab === "rosetta") {
    container.innerHTML = tabsHtml + renderRosettaView();
    return;
  }

  // Find module for current week
  const mod = COURSE_MODULES.find(m => m.weeks.includes(weekObj.week)) || COURSE_MODULES[0];

  // Breadcrumbs Bar
  const currentStepObj = weekObj.dailySteps?.find(s => s.day === currentDay);
  const breadcrumbHtml = `
    <div class="lesson-breadcrumb-bar">
      <div class="breadcrumbs">
        <span class="crumb" onclick="selectTab('roadmap')">🎓 Curriculum</span>
        <span class="crumb-separator">/</span>
        <span class="crumb" onclick="selectTab('roadmap')">${mod.title.split(":")[0]}</span>
        <span class="crumb-separator">/</span>
        <span class="crumb" onclick="selectTab('learn')">Week ${weekObj.week}: ${weekObj.title}</span>
        ${currentDay > 0 && currentStepObj ? `
          <span class="crumb-separator">/</span>
          <span class="crumb active">Day ${currentDay}: ${escapeHtml(currentStepObj.title.split(":")[0])}</span>
        ` : ""}
      </div>
      <div class="lesson-meta-badges">
        <span class="meta-badge">⏱️ ~15 mins read</span>
        <span class="meta-badge xp-meta">⚡ +20 XP on completion</span>
      </div>
    </div>
  `;

  // Hero Card
  const headerHtml = `
    <div class="hero-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap;">
        <div>
          <span class="pill pill-swift">${mod.badge} · Week ${weekObj.week} of 10 · ${weekObj.dates}</span>
          <h1 style="margin-top:0.55rem;">${formatInlineCode(weekObj.title)}</h1>
          <p>${formatInlineCode(weekObj.subtitle)}</p>
        </div>
        <button class="btn ${isCompleted ? "" : "btn-primary"}" onclick="toggleWeekComplete(${weekObj.week})">
          ${isCompleted ? "✅ Week Completed (Click to Undo)" : "Mark Week " + weekObj.week + " Complete"}
        </button>
      </div>
      <div class="hero-meta-row">
        <span class="pill pill-kotlin">🤖 Android: ${formatInlineCode(weekObj.androidAnchor)}</span>
        <span class="pill pill-swift">🍎 iOS: ${formatInlineCode(weekObj.iosAnchor)}</span>
      </div>
    </div>
  `;

  let bodyHtml = "";

  if (currentTab === "learn") {
    bodyHtml += renderInteractiveSimulator(weekObj);

    // DAILY MICRO-STEPS SELECTOR RIBBON
    if (weekObj.dailySteps && weekObj.dailySteps.length > 0) {
      bodyHtml += `
        <div class="day-selector-bar">
          <span style="font-size:0.75rem;font-weight:800;color:var(--text-muted);text-transform:uppercase;margin-right:0.35rem;">Daily Steps:</span>
          ${weekObj.dailySteps.map(step => {
            const isStepDone = isDayCompleted(weekObj.week, step.day);
            return `
              <button class="day-btn ${currentDay === step.day ? "active" : ""}" onclick="selectDay(${step.day})">
                ${isStepDone ? "✓ " : ""}Day ${step.day} (${step.time || "15m"})
              </button>
            `;
          }).join("")}
          <button class="day-btn ${currentDay === 0 ? "active" : ""}" onclick="selectDay(0)">
            📚 View All Days
          </button>
        </div>
      `;

      const stepsToRender = currentDay === 0
        ? weekObj.dailySteps
        : weekObj.dailySteps.filter(s => s.day === currentDay);

      bodyHtml += stepsToRender.map(step => {
        const stepKey = `${weekObj.week}_${step.day}`;
        const isStepDone = isDayCompleted(weekObj.week, step.day);
        const checkpoint = getCheckpointForDay(weekObj.week, step.day, step);
        const answeredOption = checkpointAnswers[stepKey];
        const hasAnsweredCheckpoint = answeredOption !== undefined;
        const activeTab = activeCodeTabs[stepKey] || "kotlin";
        const tutorial = getStepTutorialContent(weekObj.week, step);

        return `
          <div class="daily-step-card">
            <div class="daily-step-header">
              <div>
                <span class="pill pill-swift">Day ${step.day} of 5 · ⏱️ ${step.time || "15 mins"}</span>
                <h2 style="margin-top:0.35rem;">${formatInlineCode(step.title)}</h2>
              </div>
              <button class="mark-day-complete-btn ${isStepDone ? "completed" : ""}" onclick="toggleDayCompleted(${weekObj.week}, ${step.day})">
                ${isStepDone ? "✓ Day Completed (+20 XP)" : "Mark Day Complete (+20 XP)"}
              </button>
            </div>

            <!-- Objective Callout -->
            <div class="callout-card callout-action">
              <div class="callout-header">🎯 Today's Learning Objective</div>
              <div class="callout-body">${formatInlineCode(step.goal)}</div>
            </div>

            <!-- Android Mental Model Callout -->
            <div class="callout-card callout-android">
              <div class="callout-header">🤖 The Android (Kotlin) Mental Model</div>
              <div class="callout-body">${formatInlineCode(step.shift)}</div>
            </div>

            <!-- In-Depth Concept Breakdown Card -->
            <div class="tutorial-concept-card">
              <div class="tutorial-concept-header">
                <span>📖 Deep-Dive: Mechanics & Under-the-Hood</span>
              </div>
              <div class="tutorial-prose">
                ${tutorial.descriptionHtml}
              </div>
            </div>

            <!-- macOS Code Window -->
            <div class="mac-code-window">
              <div class="mac-titlebar">
                <div class="mac-dots">
                  <div class="mac-dot red"></div>
                  <div class="mac-dot yellow"></div>
                  <div class="mac-dot green"></div>
                </div>
                <div class="mac-titlebar-label">
                  <span>${codeViewMode === "split" ? "🤖 Android (Kotlin) ⟷ 🍎 iOS (Swift 6)" : (activeTab === "kotlin" ? "🤖 Android (Kotlin)" : "🍎 iOS (Swift 6)")}</span>
                </div>
                <div class="mac-actions">
                  <button class="view-mode-toggle" onclick="toggleCodeViewMode()" title="Toggle Side-by-Side or Tabbed Code View">
                    ${codeViewMode === "split" ? "⊟ Switch to Tabbed" : "⊞ Switch to Split View"}
                  </button>
                </div>
              </div>

              ${codeViewMode === "split" ? `
                <div class="code-comparison" style="margin:0;">
                  <div class="code-pane" style="box-shadow:none;border:none;border-radius:0;">
                    <div class="code-header code-header-kotlin">
                      <span>🤖 KOTLIN / COMPOSE</span>
                      <button class="copy-btn" onclick="copyText(this, '${encodeURIComponent(step.kotlinCode)}')">Copy</button>
                    </div>
                    <pre class="code-block"><code>${highlightCode(step.kotlinCode)}</code></pre>
                  </div>
                  <div class="code-pane" style="box-shadow:none;border:none;border-radius:0;border-left:1px solid rgba(255,255,255,0.08);">
                    <div class="code-header code-header-swift">
                      <span>🍎 SWIFT 6 / SWIFTUI</span>
                      <button class="copy-btn" onclick="copyText(this, '${encodeURIComponent(step.swiftCode)}')">Copy</button>
                    </div>
                    <pre class="code-block"><code>${highlightCode(step.swiftCode)}</code></pre>
                  </div>
                </div>
              ` : `
                <div class="tabbed-code-nav">
                  <button class="tabbed-code-tab ${activeTab === "kotlin" ? "active" : ""}" onclick="selectCodeTab('${stepKey}', 'kotlin')">
                    🤖 Android (Kotlin)
                  </button>
                  <button class="tabbed-code-tab ${activeTab === "swift" ? "active" : ""}" onclick="selectCodeTab('${stepKey}', 'swift')">
                    🍎 iOS (Swift 6)
                  </button>
                </div>
                <div class="code-pane" style="box-shadow:none;border:none;border-radius:0;">
                  <div class="code-header" style="justify-content:flex-end;">
                    <button class="copy-btn" onclick="copyText(this, '${encodeURIComponent(activeTab === "kotlin" ? step.kotlinCode : step.swiftCode)}')">Copy</button>
                  </div>
                  <pre class="code-block"><code>${highlightCode(activeTab === "kotlin" ? step.kotlinCode : step.swiftCode)}</code></pre>
                </div>
              `}
            </div>

            <!-- Senior Engineer Pro-Tip & Xcode Hint -->
            <div class="callout-card callout-hint">
              <div class="callout-header">💡 Senior Engineer Pro-Tip & Xcode Hint</div>
              <div class="callout-body">${formatInlineCode(tutorial.hintText)}</div>
            </div>

            <!-- Best Practices: Do's and Don'ts Matrix -->
            <div class="dos-donts-grid">
              <div class="dos-card">
                <div class="dos-header">✅ DO (Idiomatic Swift 6 / SwiftUI)</div>
                <ul class="dos-list">
                  ${tutorial.dos.map(d => `<li>${formatInlineCode(d)}</li>`).join("")}
                </ul>
              </div>
              <div class="donts-card">
                <div class="donts-header">❌ DON'T (Android Anti-Patterns to Avoid)</div>
                <ul class="donts-list">
                  ${tutorial.donts.map(d => `<li>${formatInlineCode(d)}</li>`).join("")}
                </ul>
              </div>
            </div>

            <!-- Inline Checkpoint (Quick Comprehension Check) -->
            <div class="inline-checkpoint-card">
              <div class="inline-checkpoint-header">
                <span class="inline-checkpoint-badge">⚡ Quick Checkpoint</span>
                <span class="inline-checkpoint-xp">+10 XP</span>
              </div>
              <div class="inline-checkpoint-question">${formatInlineCode(checkpoint.question)}</div>
              <div class="inline-checkpoint-options">
                ${checkpoint.options.map((opt, oIdx) => {
                  let btnCls = "checkpoint-opt-btn";
                  if (hasAnsweredCheckpoint) {
                    if (oIdx === checkpoint.correctIndex) btnCls += " correct";
                    else if (oIdx === answeredOption) btnCls += " wrong";
                  }
                  return `
                    <button class="${btnCls}" onclick="answerCheckpoint(${weekObj.week}, ${step.day}, ${oIdx})">
                      <span style="font-weight:800;color:var(--text-muted);">${String.fromCharCode(65 + oIdx)}.</span>
                      <span>${formatInlineCode(opt)}</span>
                    </button>
                  `;
                }).join("")}
              </div>
              <div class="checkpoint-feedback-box ${hasAnsweredCheckpoint ? "visible" : ""}" style="background:var(--bg-surface-elevated);border-left:4px solid ${answeredOption === checkpoint.correctIndex ? "var(--accent-green)" : "var(--accent-danger)"};">
                <strong>${answeredOption === checkpoint.correctIndex ? "✅ Correct!" : "❌ Explanation:"}</strong> ${formatInlineCode(checkpoint.explanation)}
              </div>
            </div>

            <!-- Step Navigation Footer -->
            <div class="daily-lesson-footer">
              <div>
                ${step.day > 1 ? `
                  <button class="btn" onclick="selectDay(${step.day - 1})">
                    ← Previous: Day ${step.day - 1}
                  </button>
                ` : `
                  <button class="btn" onclick="selectTab('roadmap')">
                    ← Back to Roadmap
                  </button>
                `}
              </div>
              <div>
                ${currentDay > 0 && currentDay < 5 ? `
                  <button class="btn btn-primary" onclick="selectDay(${currentDay + 1})">
                    Next: Day ${currentDay + 1} →
                  </button>
                ` : currentDay === 5 ? `
                  <button class="btn btn-primary" onclick="selectTab('practice')">
                    Day 5 Done! Take the Week ${weekObj.week} Quiz & Lab →
                  </button>
                ` : ""}
              </div>
            </div>
          </div>
        `;
      }).join("");
    }

    bodyHtml += renderFlashcardsSection(weekObj);

    bodyHtml += `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.5rem;">
        <button class="btn" onclick="selectTab('roadmap')">← Back to Roadmap</button>
        <button class="btn btn-primary" onclick="selectTab('practice')">
          Next: Take the Week ${weekObj.week} Quiz & Lab →
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
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.55rem;">
            <span class="pill pill-swift" style="font-size:0.72rem;">Question ${qIdx + 1} of ${weekObj.quiz.length}</span>
            <span style="font-weight:700;font-size:0.96rem;">${formatInlineCode(q.question.replace(/^\d+\.\s*/, ""))}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr;gap:0.45rem;">
            ${q.options.map((opt, oIdx) => {
              let cls = "quiz-option";
              if (hasAnswered) {
                if (oIdx === q.correctIndex) cls += " correct";
                else if (oIdx === selectedIdx) cls += " wrong";
              }
              return `
                <button class="${cls}" onclick="answerQuiz(${weekObj.week}, ${qIdx}, ${oIdx})">
                  <span style="font-weight:800;color:var(--text-muted);margin-right:0.4rem;">${String.fromCharCode(65 + oIdx)}.</span>
                  <span>${formatInlineCode(opt)}</span>
                </button>
              `;
            }).join("")}
          </div>
          <div id="quiz-fb-${qIdx}" class="feedback-box ${hasAnswered ? "visible" : ""}" style="background:var(--bg-surface-elevated);border-left:4px solid ${selectedIdx === q.correctIndex ? "var(--accent-green)" : "var(--accent-danger)"};margin-top:0.65rem;">
            <strong>${selectedIdx === q.correctIndex ? "✅ Correct!" : "❌ Android-to-iOS Explanation:"}</strong> ${formatInlineCode(q.explanation)}
          </div>
        </div>
      `;
    }).join("");

    bodyHtml = `
      <div class="section-card">
        <div class="quiz-scoreboard">
          <div>
            <div class="quiz-score-pill">🏆 Week ${weekObj.week} Score: ${quizScore.correct} / ${quizScore.total} Correct (${quizScore.answered} Answered)</div>
            <div style="font-size:0.82rem;color:var(--text-secondary);margin-top:0.25rem;">Answer correctly to earn +15 XP each!</div>
          </div>
          <button class="btn" onclick="resetWeekQuiz(${weekObj.week})">🔄 Reset Quiz</button>
        </div>

        <!-- Quiz Progress Stepper Dots -->
        <div class="quiz-stepper-header">
          <span style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Quick Navigation:</span>
          <div class="quiz-stepper-dots">
            ${weekObj.quiz.map((q, idx) => {
              const ans = savedForWeek[idx];
              let dotClass = "quiz-dot";
              if (ans !== undefined) {
                dotClass += (ans === q.correctIndex ? " correct" : " wrong");
              }
              return `
                <button class="${dotClass}" onclick="document.getElementById('quiz-q-${idx}')?.scrollIntoView({behavior:'smooth',block:'center'});">
                  ${idx + 1}
                </button>
              `;
            }).join("")}
          </div>
        </div>

        ${quizHtml}
      </div>

      <div class="section-card">
        <h2>💻 Hands-On Coding Lab (Week ${weekObj.week})</h2>
        <p style="color:var(--text-secondary);margin-bottom:1rem;">${weekObj.codeChallenge.instructions}</p>
        <textarea id="challenge-editor" class="code-editor-input" spellcheck="false">${weekObj.codeChallenge.starterCode}</textarea>
        <div style="display:flex;gap:0.75rem;margin-top:0.85rem;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="verifyCodeChallenge(${weekObj.week})">▶️ Compile & Verify Solution</button>
          <button class="btn" onclick="showChallengeSolution(${weekObj.week})">👀 Reveal Solution</button>
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
              <p style="color:var(--text-secondary);font-size:0.9rem;">In-depth technical breakdown comparing Android and iOS architecture.</p>
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

  container.innerHTML = tabsHtml + breadcrumbHtml + headerHtml + bodyHtml;
}

// 10-Week Visual Roadmap View
function renderRoadmapView() {
  const completedCount = completedWeeks.length;
  const totalCount = WEEKS_DATA.length || 10;
  const pct = Math.round((completedCount / totalCount) * 100);

  return `
    <div class="hero-card">
      <span class="pill pill-swift">10-WEEK ACADEMIC SYLLABUS · OCT 20 TO DEC 31</span>
      <h1 style="margin-top:0.6rem;">📱 Android to iOS Before New Year</h1>
      <p style="margin-top:0.35rem;">
        Master modern iOS (Swift 6, SwiftUI, Swift Concurrency, SwiftData) by leveraging your hard-earned Android mental models.
      </p>
      <div class="hero-meta-row">
        <span class="pill pill-kotlin">Progress: ${completedCount} / ${totalCount} Weeks (${pct}%)</span>
        <span class="pill pill-swift">Total Micro-Lessons: 50 Daily Steps</span>
        <span class="pill xp-pill">⚡ ${calculateTotalXP()} XP Earned</span>
      </div>
    </div>

    <!-- 5 PEDAGOGICAL MODULE CARDS -->
    ${COURSE_MODULES.map(mod => {
      return `
        <div class="phase-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
            <span class="phase-badge">${mod.title}</span>
            <span style="font-size:0.78rem;font-weight:700;color:var(--accent-primary);">${mod.badge}</span>
          </div>
          <p style="color:var(--text-secondary);font-size:0.88rem;margin:0.4rem 0 1rem;">${mod.subtitle}</p>
          <div class="phase-weeks-grid">
            ${mod.weeks.map(weekNum => {
              const w = WEEKS_DATA.find(item => item.week === weekNum);
              if (!w) return "";
              const isDone = completedWeeks.includes(w.week);
              const score = getWeekQuizScore(w.week);
              return `
                <div class="phase-week-box ${isDone ? "completed" : ""}" onclick="selectWeek(${w.week});">
                  <div>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <span class="week-num">Week ${w.week} · ${w.dates}</span>
                      <span class="week-check" style="width:18px;height:18px;font-size:0.65rem;">${isDone ? "✓" : ""}</span>
                    </div>
                    <div style="font-weight:700;font-size:1rem;margin:0.35rem 0 0.25rem;">${escapeHtml(w.title)}</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.4;">${escapeHtml(w.subtitle)}</div>
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.85rem;padding-top:0.65rem;border-top:1px solid var(--border-color);">
                    <span style="font-size:0.74rem;color:var(--text-muted);font-weight:600;">Quiz: ${score.correct}/${score.total}</span>
                    <span style="color:var(--accent-primary);font-weight:700;font-size:0.82rem;">Start Week ${w.week} →</span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }).join("")}

    <!-- ANDROID STUDIO TO XCODE SURVIVAL GUIDE -->
    <div class="section-card">
      <h2>🛠️ Android Studio ➔ Xcode Survival Guide</h2>
      <p style="color:var(--text-secondary);margin-bottom:1rem;">Where are all your favorite Android Studio tools inside Apple's Xcode?</p>

      <table class="xcode-guide-table">
        <thead>
          <tr>
            <th>Android Studio (Kotlin / Compose)</th>
            <th>Apple Xcode (Swift / SwiftUI)</th>
            <th>What It Does & Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Logcat</strong></td>
            <td><strong>Debug Console</strong> (<code>Cmd + Shift + Y</code>)</td>
            <td>Shows <code>print()</code> statements, app logs, and crashes in the bottom drawer.</td>
          </tr>
          <tr>
            <td><strong>Device Manager / Emulator</strong></td>
            <td><strong>iOS Simulator</strong> (<code>Cmd + R</code>)</td>
            <td>Launches an ultra-fast native simulator for any iPhone, iPad, or Apple Watch.</td>
          </tr>
          <tr>
            <td><strong>Project Tool Window</strong></td>
            <td><strong>Project Navigator</strong> (<code>Cmd + 1</code>)</td>
            <td>The file tree on the left side showing Swift files, Assets, and Package dependencies.</td>
          </tr>
          <tr>
            <td><strong>Compose Interactive Preview</strong></td>
            <td><strong>Xcode Canvas (<code>#Preview</code>)</strong></td>
            <td>Toggle with <code>Option + Cmd + Enter</code>. Real-time interactive preview of SwiftUI views.</td>
          </tr>
          <tr>
            <td><strong>build.gradle.kts (Dependencies)</strong></td>
            <td><strong>Swift Package Manager (SPM)</strong></td>
            <td>Xcode ➔ File ➔ Add Package Dependencies (or local <code>Package.swift</code>). Zero Gradle daemon lag!</td>
          </tr>
          <tr>
            <td><strong>AndroidManifest.xml</strong></td>
            <td><strong>Target Settings / Info.plist</strong></td>
            <td>Click project root ➔ Targets ➔ Info / Signing & Capabilities for permissions and bundle ID.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- KEYBOARD SHORTCUTS CHEAT SHEET -->
    <div class="section-card">
      <h2>⚡ Top 8 Xcode Keyboard Shortcuts for Android Devs</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;margin-top:0.85rem;">
        <div style="background:var(--bg-surface-elevated);padding:0.9rem;border-radius:8px;">
          <kbd class="shortcut-kbd">Cmd + R</kbd>
          <div style="font-weight:700;margin-top:0.35rem;">Run App</div>
          <div style="font-size:0.8rem;color:var(--text-secondary);">Android: Control + R</div>
        </div>
        <div style="background:var(--bg-surface-elevated);padding:0.9rem;border-radius:8px;">
          <kbd class="shortcut-kbd">Cmd + B</kbd>
          <div style="font-weight:700;margin-top:0.35rem;">Build Project</div>
          <div style="font-size:0.8rem;color:var(--text-secondary);">Android: Cmd + F9</div>
        </div>
        <div style="background:var(--bg-surface-elevated);padding:0.9rem;border-radius:8px;">
          <kbd class="shortcut-kbd">Cmd + Shift + K</kbd>
          <div style="font-weight:700;margin-top:0.35rem;">Clean Build Folder</div>
          <div style="font-size:0.8rem;color:var(--text-secondary);">Android: Clean Project</div>
        </div>
        <div style="background:var(--bg-surface-elevated);padding:0.9rem;border-radius:8px;">
          <kbd class="shortcut-kbd">Option + Cmd + Enter</kbd>
          <div style="font-weight:700;margin-top:0.35rem;">Toggle SwiftUI Canvas</div>
          <div style="font-size:0.8rem;color:var(--text-secondary);">Android: Split / Preview button</div>
        </div>
        <div style="background:var(--bg-surface-elevated);padding:0.9rem;border-radius:8px;">
          <kbd class="shortcut-kbd">Cmd + Shift + O</kbd>
          <div style="font-weight:700;margin-top:0.35rem;">Open Quickly (Find File/Symbol)</div>
          <div style="font-size:0.8rem;color:var(--text-secondary);">Android: Double Shift</div>
        </div>
        <div style="background:var(--bg-surface-elevated);padding:0.9rem;border-radius:8px;">
          <kbd class="shortcut-kbd">Control + I</kbd>
          <div style="font-weight:700;margin-top:0.35rem;">Re-indent Code Selection</div>
          <div style="font-size:0.8rem;color:var(--text-secondary);">Android: Option + Cmd + L</div>
        </div>
        <div style="background:var(--bg-surface-elevated);padding:0.9rem;border-radius:8px;">
          <kbd class="shortcut-kbd">Cmd + Shift + Y</kbd>
          <div style="font-weight:700;margin-top:0.35rem;">Toggle Debug Console</div>
          <div style="font-size:0.8rem;color:var(--text-secondary);">Android: Alt + 6 (Logcat)</div>
        </div>
        <div style="background:var(--bg-surface-elevated);padding:0.9rem;border-radius:8px;">
          <kbd class="shortcut-kbd">Cmd + /</kbd>
          <div style="font-weight:700;margin-top:0.35rem;">Toggle Comment (//)</div>
          <div style="font-size:0.8rem;color:var(--text-secondary);">Identical to Android Studio!</div>
        </div>
      </div>
    </div>
  `;
}

// Rosetta Stone Interactive Matrix
function renderRosettaView() {
  const categories = Array.from(new Set(ROSETTA_ITEMS.map(i => i.category)));

  return `
    <div class="hero-card">
      <span class="pill pill-swift">ARCHITECTURAL MAPPING</span>
      <h1 style="margin-top:0.6rem;">🗺️ The Android ↔ iOS Rosetta Stone</h1>
      <p style="margin-top:0.35rem;">
        Instant side-by-side dictionary mapping modern Android tools (Kotlin 2, Coroutines, Jetpack Compose, Room) directly to modern iOS (Swift 6, Swift Concurrency, SwiftUI, SwiftData).
      </p>
    </div>

    ${categories.map(cat => {
      const items = ROSETTA_ITEMS.filter(i => i.category === cat);
      return `
        <div class="section-card">
          <h2>${cat}</h2>
          <table class="rosetta-table">
            <thead>
              <tr>
                <th style="width:22%;">Concept</th>
                <th style="width:28%;">Android (Modern)</th>
                <th style="width:28%;">iOS (Swift 6 / SwiftUI)</th>
                <th style="width:22%;">Key Mental Shift</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td><strong>${item.concept}</strong></td>
                  <td><code class="code-pill code-pill-android">${escapeHtml(item.android)}</code></td>
                  <td><code class="code-pill code-pill-ios">${escapeHtml(item.ios)}</code></td>
                  <td style="font-size:0.86rem;color:var(--text-secondary);">${formatInlineCode(item.shift)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    }).join("")}
  `;
}

// Quiz Answering Logic
window.answerQuiz = function(weekNum, qIdx, oIdx) {
  if (!quizAnswers[weekNum]) quizAnswers[weekNum] = {};
  quizAnswers[weekNum][qIdx] = oIdx;
  saveQuizAnswers();

  const weekObj = WEEKS_DATA.find(w => w.week === weekNum);
  const q = weekObj.quiz[qIdx];
  if (oIdx === q.correctIndex) {
    launchConfetti();
  }

  const score = getWeekQuizScore(weekNum);
  if (score.correct >= 8 && !completedWeeks.includes(weekNum)) {
    completedWeeks.push(weekNum);
    saveCompletedWeeks();
  }

  renderSidebar();
  renderMainContent();
};

window.resetWeekQuiz = function(weekNum) {
  if (quizAnswers[weekNum]) {
    delete quizAnswers[weekNum];
    saveQuizAnswers();
    renderSidebar();
    renderMainContent();
  }
};

// Coding Lab Verification
window.verifyCodeChallenge = function(weekNum) {
  const weekObj = WEEKS_DATA.find(w => w.week === weekNum);
  const editor = document.getElementById("challenge-editor");
  const fb = document.getElementById("challenge-feedback");
  if (!editor || !fb || !weekObj) return;

  const code = editor.value;
  const missing = [];
  (weekObj.codeChallenge.requiredTokens || []).forEach(token => {
    if (!code.includes(token)) missing.push(token);
  });

  if (missing.length === 0) {
    fb.className = "feedback-box visible";
    fb.style.background = "#d1fae5";
    fb.style.borderLeft = "4px solid #10b981";
    fb.style.color = "#065f46";
    fb.innerHTML = `
      <strong>✅ Challenge Passed! (+25 XP)</strong><br />
      ${escapeHtml(weekObj.codeChallenge.simulatedOutput || "Code compiled cleanly without errors!")}
    `;
    launchConfetti();
    if (!completedWeeks.includes(weekNum)) {
      completedWeeks.push(weekNum);
      saveCompletedWeeks();
      renderSidebar();
    }
  } else {
    fb.className = "feedback-box visible";
    fb.style.background = "#ffe4e6";
    fb.style.borderLeft = "4px solid #f43f5e";
    fb.style.color = "#9f1239";
    fb.innerHTML = `
      <strong>❌ Compilation Error:</strong> Missing required syntax elements:<br />
      ${missing.map(m => `<code>${escapeHtml(m)}</code>`).join(", ")}
    `;
  }
};

window.showChallengeSolution = function(weekNum) {
  const weekObj = WEEKS_DATA.find(w => w.week === weekNum);
  const editor = document.getElementById("challenge-editor");
  if (editor && weekObj) {
    editor.value = weekObj.codeChallenge.solutionCode;
    verifyCodeChallenge(weekNum);
  }
};

// Theme Management
window.setTheme = function(themeName) {
  document.documentElement.setAttribute("data-theme", themeName);
  try { localStorage.setItem("ios_theme", themeName); } catch (e) {}
};

// App Initialization
document.addEventListener("DOMContentLoaded", () => {
  let savedTheme = localStorage.getItem("ios_theme") || "academic";
  if (savedTheme === "aurora") savedTheme = "academic";
  document.documentElement.setAttribute("data-theme", savedTheme);
  const themeSel = document.getElementById("theme-selector");
  if (themeSel) themeSel.value = savedTheme;

  renderSidebar();
  renderMainContent();
  updateProgressUI();
});
