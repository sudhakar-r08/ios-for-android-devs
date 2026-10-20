// ============================================================================
// WEEKS 4 TO 6: State Management (@Observable), Concurrency (Actors) & Navigation
// ============================================================================

window.WEEKS_4_TO_6 = [
  // ==========================================================================
  // WEEK 4: STATE MANAGEMENT & OBSERVATION (@Observable)
  // ==========================================================================
  {
    week: 4,
    dates: "Nov 10 – Nov 16",
    title: "State Management & Observation (`@Observable`)",
    subtitle: "From `remember`, `StateFlow`, and `ViewModel` to `@State`, `@Binding` (`$`), `@Observable`, `@Bindable`, and `@Environment`.",
    androidAnchor: "`remember { mutableStateOf() }`, `StateFlow`, `collectAsStateWithLifecycle()`, `CompositionLocal`",
    iosAnchor: "`@State`, `@Binding` (`$`), `@Observable` Macro, `@Bindable`, `@Environment`",
    simulatorType: "observable-tracker",
    flashcards: [
      { front: "Why do we need `@State` inside a SwiftUI `View` struct?", back: "Because a SwiftUI `View` is an immutable value-type `struct` that gets recreated frequently. `@State` allocates persistent storage managed by SwiftUI outside the struct and ties it to the view's identity in the view hierarchy." },
      { front: "What does the `$` prefix (Projected Value) do on `@State` or `@Bindable`?", back: "It yields a two-way `Binding<T>` reference so a child view (like `TextField` or `Toggle`) can read and mutate the parent's state directly." },
      { front: "How does Swift 5.9+ `@Observable` improve over legacy `ObservableObject` + `@Published`?", back: "`ObservableObject` invalidated every observing view whenever ANY `@Published` property changed. `@Observable` tracks property access at the individual field level—only views that actually read a mutated property re-evaluate their `body`!" },
      { front: "What is the SwiftUI equivalent of Jetpack Compose's `CompositionLocalProvider`?", back: "`@Environment` and the `.environment(...)` view modifier." }
    ],
    concepts: [
      {
        heading: "1. Ephemeral View State (`@State`) & Two-Way Hoisting (`@Binding`)",
        shift: "In Jetpack Compose, `remember { mutableStateOf(...) }` persists state across recompositions, and state hoisting passes `(value, onValueChange)`. In SwiftUI, `@State` stores state in SwiftUI's attribute graph, and `$property` passes a two-way `Binding<Value>`!",
        details: [
          "<strong>Always mark `@State` as `private`:</strong> `@State` is owned by the specific view that declares it. Child views should receive either a plain value (read-only) or a `@Binding` (read-write).",
          "<strong>How `$` Works:</strong> `@State` is a Property Wrapper. Writing `count` accesses `wrappedValue` (`Int`), while writing `$count` accesses `projectedValue` (`Binding<Int>`)."
        ],
        kotlinCode: `@Composable
fun SearchScreen() {
    var query by remember { mutableStateOf("") }
    SearchBar(
        query = query,
        onQueryChange = { query = it }
    )
}`,
        swiftCode: `struct SearchScreen: View {
    @State private var query = ""

    var body: some View {
        // '$query' passes a two-way Binding<String>
        SearchBar(query: $query)
    }
}

struct SearchBar: View {
    @Binding var query: String
    var body: some View {
        TextField("Search...", text: $query)
    }
}`
      },
      {
        heading: "2. Modern ViewModels with `@Observable` (Goodbye `ObservableObject`!)",
        shift: "In legacy SwiftUI (iOS 13–16), ViewModels used `ObservableObject`, `@Published`, `@StateObject`, and `@ObservedObject`—and changing ONE property re-rendered every view observing that ViewModel! Modern Swift (iOS 17+ / Swift 6) uses the `@Observable` macro for automatic, fine-grained property tracking.",
        details: [
          "<strong>Zero `StateFlow` Boilerplate:</strong> You don't need private `_uiState` and public `uiState: StateFlow` backing fields. The `@Observable` macro rewrites stored properties into tracked getters/setters at compile time.",
          "<strong>When to use `@Bindable`:</strong> If a view receives an `@Observable` object (via parameter or `@Environment`) and needs a `$` binding to one of its properties for a `TextField` or `Toggle`, mark the reference `@Bindable var vm: MyViewModel`."
        ],
        kotlinCode: `class CheckoutViewModel : ViewModel() {
    var couponCode by mutableStateOf("")
    var total by mutableDoubleStateOf(99.0)
    var isLoading by mutableStateOf(false)
}`,
        swiftCode: `import Observation

@Observable
@MainActor
final class CheckoutViewModel {
    var couponCode = ""
    var total = 99.0
    var isLoading = false
}

struct CheckoutView: View {
    @State private var vm = CheckoutViewModel()

    var body: some View {
        @Bindable var vm = vm
        VStack {
            TextField("Coupon", text: $vm.couponCode)
            Text("Total: $\\(vm.total)")
        }
    }
}`
      },
      {
        heading: "3. View Identity (`id`) & Tree Scoping (`@Environment`)",
        shift: "Just like `key()` and `CompositionLocal` in Compose, SwiftUI tracks view lifetime by structural position or explicit `.id(...)`, and injects dependencies down the tree via `.environment(...)`.",
        details: [
          "<strong>Resetting `@State` with `.id()`:</strong> Changing a view's `.id(userId)` destroys its existing `@State` storage and initializes a fresh instance—critical when switching accounts or detail items!"
        ],
        kotlinCode: `val LocalTheme = compositionLocalOf { Theme.Dark }

CompositionLocalProvider(LocalTheme provides Theme.Light) {
    ChildScreen()
}`,
        swiftCode: `// Injecting an @Observable object into the SwiftUI Environment:
ContentView()
    .environment(sessionManager)

// Reading it inside any descendant View:
struct ChildScreen: View {
    @Environment(SessionManager.self) private var session
    var body: some View { Text(session.currentUser) }
}`
      }
    ],
    quiz: [
      {
        question: "1. Why must local mutable state inside a SwiftUI `View` be annotated with `@State` instead of a plain `var`?",
        options: [
          "Because Swift does not allow `var` inside structs",
          "Because `View` structs are immutable during `body` evaluation and frequently recreated; `@State` moves storage out into SwiftUI's persistent attribute graph",
          "Because `@State` saves the variable to `UserDefaults` automatically",
          "Because `@State` runs on a background thread"
        ],
        correctIndex: 1,
        explanation: "SwiftUI `View` structs are ephemeral value blueprints. `@State` allocates external heap storage tied to the view's identity so the value survives struct recreation."
      },
      {
        question: "2. What is the biggest performance advantage of the `@Observable` macro (iOS 17+) over the older `ObservableObject` + `@Published` protocol?",
        options: [
          "`@Observable` uses less disk space",
          "`@Observable` tracks exactly which properties a View's `body` reads, so mutating an unread property does NOT trigger unnecessary view re-renders",
          "`@Observable` converts classes into structs",
          "`@Observable` disables ARC"
        ],
        correctIndex: 1,
        explanation: "With `ObservableObject`, changing *any* `@Published` property fired `objectWillChange`, invalidating every view observing that object. `@Observable` provides fine-grained per-property tracking."
      },
      {
        question: "3. In a child view that receives a two-way reference to a parent's `@State private var isOn = false`, what property wrapper should the child use?",
        options: [
          "`@State var isOn: Bool`",
          "`@Binding var isOn: Bool`",
          "`@Environment var isOn: Bool`",
          "`@Query var isOn: Bool`"
        ],
        correctIndex: 1,
        explanation: "`@Binding` creates a two-way read/write connection to state owned by a parent view (passed via `$isOn`)."
      },
      {
        question: "4. When your view owns the lifecycle of an `@Observable` ViewModel class (similar to `viewModel()` in Compose), how should you declare it in the owning View?",
        options: [
          "`@State private var viewModel = MyViewModel()`",
          "`@Binding var viewModel = MyViewModel()`",
          "`weak var viewModel = MyViewModel()`",
          "`let viewModel = MyViewModel()`"
        ],
        correctIndex: 0,
        explanation: "With the modern `@Observable` macro, `@State private var viewModel = MyViewModel()` replaces the older `@StateObject`, ensuring SwiftUI keeps a single instance alive across view updates."
      },
      {
        question: "5. When do you use the `@Bindable` property wrapper in SwiftUI?",
        options: [
          "When saving data to Core Data",
          "When you have an `@Observable` object and need to create `$` two-way bindings (e.g., `$vm.searchText`) to its properties for controls like `TextField` or `Toggle`",
          "When bridging Objective-C code",
          "When declaring a constant `let`"
        ],
        correctIndex: 1,
        explanation: "`@Bindable` wraps an `@Observable` object reference so you can use `$object.property` syntax to produce `Binding<Property>` values."
      },
      {
        question: "6. What happens to a SwiftUI view's `@State` properties if you attach `.id(selectedItemId)` to the view and `selectedItemId` changes?",
        options: [
          "Nothing changes",
          "SwiftUI treats the view as a brand-new identity, destroying its old `@State` storage and resetting all `@State` properties to their initial values",
          "The app crashes",
          "Only `@Environment` resets"
        ],
        correctIndex: 1,
        explanation: "Explicit identity via `.id(_:)` controls the lifetime of a view's state in the attribute graph. Changing the ID tears down the old view state and mounts a fresh one."
      },
      {
        question: "7. How do you prevent a specific property inside an `@Observable` class from triggering SwiftUI view updates when it changes (e.g., an internal analytics cache)?",
        options: [
          "Mark the property with `@ObservationIgnored`",
          "Mark the property as `public`",
          "Use `unowned`",
          "Name the property with an underscore"
        ],
        correctIndex: 0,
        explanation: "`@ObservationIgnored` tells the `@Observable` macro not to synthesize observation tracking for that property."
      },
      {
        question: "8. Which SwiftUI mechanism is the direct counterpart to Jetpack Compose's `CompositionLocalProvider` for passing app-wide dependencies (like Theme or AuthSession) down the tree?",
        options: [
          "`@Environment` and `.environment(_:)`",
          "`@Binding`",
          "`NotificationCenter`",
          "`UserDefaults`"
        ],
        correctIndex: 0,
        explanation: "`.environment(object)` injects an observable object or environment value into a subtree, and any descendant reads it via `@Environment`."
      },
      {
        question: "9. Why is creating an `@Observable` ViewModel as a plain `let vm = MyViewModel()` inside a SwiftUI `View` struct a critical bug?",
        options: [
          "`let` is not allowed in SwiftUI views",
          "Every time the parent view re-renders, the `View` struct is re-initialized, creating a brand-new `MyViewModel()` and wiping out all state unless wrapped in `@State`",
          "It causes an ARC retain cycle",
          "It blocks the main thread"
        ],
        correctIndex: 1,
        explanation: "Without `@State`, `let vm = MyViewModel()` runs on every struct re-instantiation, resetting your ViewModel every time a parent view updates!"
      },
      {
        question: "10. In SwiftUI, why should avoided `if/else` branches be replaced by ternary expressions (e.g., `.opacity(isVisible ? 1 : 0)`) when animating a view's property?",
        options: [
          "`if/else` is not valid inside `@ViewBuilder`",
          "`if/else` creates two distinct structural view identities (`_ConditionalContent`), destroying and recreating the view instead of smoothly interpolating the same view's attribute",
          "Ternary operators run on the GPU",
          "`if/else` leaks memory"
        ],
        correctIndex: 1,
        explanation: "In SwiftUI, `if/else` branches have separate structural identities (insertion/removal transitions), whereas modifying an attribute on a single view preserves its identity and animates smoothly."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 4 State Lab: (1) Mark `ProfileViewModel` with `@Observable`, (2) Hold it with `@State private var vm` in `ProfileScreen`, and (3) Bind the `TextField` to `$vm.bio`.",
      starterCode: `// TODO 1: Annotate ProfileViewModel with @Observable
final class ProfileViewModel {
    var bio: String = ""
}

struct ProfileScreen: View {
    // TODO 2: Use @State private var vm = ProfileViewModel()
    var vm = ProfileViewModel()

    var body: some View {
        // TODO 3: Pass $vm.bio to TextField
        TextField("Bio", text: vm.bio)
    }
}`,
      solutionCode: `@Observable
final class ProfileViewModel {
    var bio: String = ""
}

struct ProfileScreen: View {
    @State private var vm = ProfileViewModel()

    var body: some View {
        TextField("Bio", text: $vm.bio)
    }
}`,
      simulatedOutput: `✓ @Observable macro synthesized fine-grained access tracking for 'bio'
✓ @State private var vm persists ProfileViewModel across View struct updates
✓ $vm.bio projected Binding<String> connected to TextField!`,
      requiredTokens: ["@Observable", "@State", "$vm.bio"]
    },
    linkedinPost: `Week 4 of Android -> iOS Before New Year: State Management & @Observable! ⚡🧠

How does SwiftUI state management compare to Jetpack Compose's remember, StateFlow, and ViewModel?

1️⃣ remember { mutableStateOf() } -> @State
Because a SwiftUI View is a value-type struct that gets recreated constantly, @State stores your mutable state in SwiftUI's persistent attribute graph outside the struct.

2️⃣ (value, onValueChange) -> @Binding ($var)
Instead of passing a value + callback lambda to every child TextField or Toggle, prefixing '$' projects a two-way Binding<T>.

3️⃣ Goodbye ObservableObject, Hello @Observable!
In iOS 17+ / Swift 6, the @Observable macro tracks exact property reads inside body—so mutating an unread property on your ViewModel never triggers wasted recompositions!

🎮 Try the interactive @Observable Re-render Visualizer + 10-question quiz:
🔗 https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #SwiftUI #JetpackCompose #MVVM #MobileEngineering`,
    linkedinArticle: `# Week 4: From \`remember\` & \`StateFlow\` to \`@State\`, \`@Binding\`, and Swift's \`@Observable\` Macro

State management is where declarative UI frameworks shine—or fall apart if you misunderstand view identity. In Week 4, I mapped Jetpack Compose's state primitives directly to modern SwiftUI.

---

## 1. Why \`@State\` Exists: Ephemeral Structs, Persistent Graph

A SwiftUI \`View\` is a stack-allocated \`struct\`. Every time a parent view updates, SwiftUI instantiates a fresh copy of your \`View\` struct. Marking a property with \`@State\` tells SwiftUI: *"Store this value in the persistent Attribute Graph tied to this view's position in the hierarchy."*

---

## 2. How the \`@Observable\` Macro Changed iOS Architecture

Before Swift 5.9 (iOS 17), iOS ViewModels conformed to \`ObservableObject\` and marked fields with \`@Published\`. The problem? Changing *any* \`@Published\` property fired a single \`objectWillChange\` publisher that invalidated **every** view observing that ViewModel!

With the **\`@Observable\` macro**, Swift tracks exactly which properties are read inside each view's \`body\`. If \`HeaderView\` only reads \`vm.username\` and \`FooterView\` only reads \`vm.cartCount\`, updating \`cartCount\` will **never** re-evaluate \`HeaderView\`!`
  },

  // ==========================================================================
  // WEEK 5: SWIFT CONCURRENCY, ACTORS & SENDABLE
  // ==========================================================================
  {
    week: 5,
    dates: "Nov 17 – Nov 23",
    title: "Swift Concurrency, Actors & Sendable",
    subtitle: "Kotlin Coroutines & Dispatchers vs. Swift 6 `async`/`await`, Structured Concurrency (`TaskGroup`), `actor`, `@MainActor`, and `Sendable`.",
    androidAnchor: "`suspend fun`, `viewModelScope.launch`, `Dispatchers.Main`/`Default`, `coroutineScope`, `Mutex`",
    iosAnchor: "`async`/`await`, `Task {}`, `.task {}`, `withThrowingTaskGroup`, `actor`, `@MainActor`, `Sendable`",
    simulatorType: "actor-visualizer",
    flashcards: [
      { front: "Difference between Kotlin `suspend` calls and Swift `async` calls at the call site?", back: "In Kotlin, calling a `suspend` function looks identical to a normal function call. In Swift, every potential suspension point MUST be explicitly marked with the `await` keyword." },
      { front: "What happens at an `await` suspension point in Swift?", back: "The current function pauses execution and yields its thread so other tasks can run. When `await` resumes, state in your program may have changed (Actor Reentrancy)!" },
      { front: "What is an `actor` in Swift?", back: "A reference type (like a `class`) that automatically protects its mutable state by serializing all external access through an asynchronous mailbox—eliminating data races at compile time." },
      { front: "What is `Sendable` in Swift 6?", back: "A marker protocol enforced at compile time indicating that a type is safe to pass across concurrency domains (e.g., value-type structs with Sendable fields, immutable classes, or actors)." }
    ],
    concepts: [
      {
        heading: "1. Coroutines vs. `async / await` & SwiftUI's `.task` Lifecycle",
        shift: "In Kotlin, `suspend` functions are called implicitly inside a coroutine, and we use `viewModelScope.launch` or `LaunchedEffect`. In Swift, every suspension point requires an explicit `await` keyword, and SwiftUI's `.task {}` modifier automatically starts on appear and cancels on disappear!",
        details: [
          "<strong>Cooperative Cancellation:</strong> Just like Kotlin Coroutines (`ensureActive()`), Swift `Task` cancellation is cooperative. Use `try Task.checkCancellation()` or check `Task.isCancelled` in long loops; `URLSession` checks cancellation automatically.",
          "<strong>Parallel Execution with `async let`:</strong> Where Kotlin uses `coroutineScope { val a = async { ... }; val b = async { ... }; a.await() + b.await() }`, Swift has super-concise structured concurrency: `async let a = fetchA(); async let b = fetchB(); let result = try await (a, b)`!"
        ],
        kotlinCode: `// Kotlin: Coroutine parallel decomposition
suspend fun loadDashboard(): Dashboard = coroutineScope {
    val userDeferred = async { api.fetchUser() }
    val feedDeferred = async { api.fetchFeed() }
    Dashboard(userDeferred.await(), feedDeferred.await())
}`,
        swiftCode: `// Swift: Structured concurrency with 'async let'
func loadDashboard() async throws -> Dashboard {
    async let user = api.fetchUser()
    async let feed = api.fetchFeed()
    // Both run in parallel; cancels sibling if either throws!
    return try await Dashboard(user: user, feed: feed)
}`
      },
      {
        heading: "2. `actor` & `@MainActor` vs. `Dispatchers.Main` & `Mutex`",
        shift: "In Kotlin, forgetting `withContext(Dispatchers.Main)` or forgetting a `Mutex` lock is a runtime bug. In Swift 6, `@MainActor` and `actor` enforce thread/isolation safety at COMPILE TIME!",
        details: [
          "<strong>`@MainActor` = `Dispatchers.Main` Checked at Compile Time:</strong> Annotating a ViewModel or function with `@MainActor` guarantees its properties and methods only ever execute on the main UI thread.",
          "<strong>Actor Reentrancy Gotcha:</strong> Inside an `actor`, no two tasks can execute synchronously at the same time. However, whenever an actor method hits an `await`, it suspends—allowing another task to enter the actor before the `await` finishes! Always re-validate actor state after an `await`."
        ],
        kotlinCode: `// Kotlin: Manual Mutex required to protect shared mutable state
class ImageDiskCache {
    private val mutex = Mutex()
    private val cache = mutableMapOf<String, ByteArray>()

    suspend fun put(key: String, bytes: ByteArray) = mutex.withLock {
        cache[key] = bytes
    }
}`,
        swiftCode: `// Swift: 'actor' serializes access at compile time without locks!
actor ImageDiskCache {
    private var cache: [String: Data] = [:]

    func put(key: String, data: Data) {
        cache[key] = data
    }

    func get(key: String) -> Data? {
        cache[key]
    }
}`
      },
      {
        heading: "3. `Sendable` & Swift 6 Strict Concurrency Checking",
        shift: "Why does Swift love value types (`struct`) so much? Because passing a value-type `struct` between two concurrent `Task`s or `actor`s is inherently safe against shared-memory data races! Swift formalizes this with the `Sendable` protocol.",
        details: [
          "<strong>What is `Sendable`?</strong> Value types (`struct`, `enum`) composed of `Sendable` properties are implicitly `Sendable`. Mutable `class` instances are NOT `Sendable` unless isolated to an actor (`@MainActor`)."
        ],
        kotlinCode: `// Kotlin does not prevent passing a mutable class reference
// across Dispatchers.Default and Dispatchers.Main at compile time.`,
        swiftCode: `// Swift 6: Compiler verifies types crossing actor boundaries conform to Sendable
struct UserEvent: Sendable {
    let id: String
    let timestamp: Date
}`
      }
    ],
    quiz: [
      {
        question: "1. How do you run two independent `async` functions (`fetchProfile()` and `fetchPosts()`) concurrently in Swift and wait for both to finish (similar to two `async {}` blocks inside `coroutineScope` in Kotlin)?",
        options: [
          "Call `try await fetchProfile()` on line 1 and `try await fetchPosts()` on line 2",
          "Use `async let profile = fetchProfile()` and `async let posts = fetchPosts()`, then `try await (profile, posts)`",
          "Use `Thread.sleep(1000)`",
          "Mark the function with `@Concurrent`"
        ],
        correctIndex: 1,
        explanation: "Writing `try await fetchProfile()` followed by `try await fetchPosts()` runs them sequentially! Using `async let` starts both child tasks immediately in parallel and awaits them together."
      },
      {
        question: "2. What happens to the sibling task created with `async let` if the other sibling throws an error?",
        options: [
          "It continues running forever in the background (leaked coroutine)",
          "Structured Concurrency automatically cancels the remaining `async let` child task and awaits its cleanup before exiting the function",
          "The app terminates immediately",
          "It retries the failed task"
        ],
        correctIndex: 1,
        explanation: "Just like Kotlin's `coroutineScope`, Swift's Structured Concurrency (`async let` and `TaskGroup`) guarantees no child task outlives its parent scope—automatically cancelling siblings when an error is thrown."
      },
      {
        question: "3. Why do callers outside a Swift `actor` have to use `await` when reading a property or calling a method on that actor?",
        options: [
          "Because actors are stored on a remote server",
          "Because the actor serializes access to its isolated state; if the actor is currently busy processing another message, the caller must suspend until its turn",
          "Because actors use reflection",
          "Only `private` methods require `await`"
        ],
        correctIndex: 1,
        explanation: "An `actor` protects its internal state via a serial mailbox. Crossing into the actor's isolation domain from outside is a potential suspension point, requiring `await`."
      },
      {
        question: "4. What is 'Actor Reentrancy' in Swift Concurrency, and why must you be careful with it?",
        options: [
          "When an actor calls itself recursively and causes a stack overflow",
          "When an actor method suspends at an `await` point, other tasks can execute on the same actor before the `await` resumes—meaning actor properties may have changed across the `await`!",
          "When two threads mutate an actor variable simultaneously",
          "When an actor is deallocated twice"
        ],
        correctIndex: 1,
        explanation: "To prevent deadlocks, Swift actors are reentrant across `await` suspension points. Never assume an actor property checked *before* an `await` still has the same value *after* the `await`!"
      },
      {
        question: "5. What is the Swift equivalent of Kotlin's `withContext(Dispatchers.Main)` for ensuring UI state updates happen on the main thread?",
        options: [
          "Annotating the ViewModel/function with `@MainActor` (or calling `await MainActor.run { ... }`)",
          "`DispatchQueue.global().sync`",
          "`@BackgroundThread`",
          "`Thread.current.isMain`"
        ],
        correctIndex: 0,
        explanation: "`@MainActor` is a global actor bound to the main UI thread. The Swift compiler statically guarantees that `@MainActor`-isolated properties are only mutated on the main thread."
      },
      {
        question: "6. What does SwiftUI's `.task(id: selectedUserId) { ... }` modifier do when `selectedUserId` changes?",
        options: [
          "Nothing; `.task` only runs once when the app launches",
          "It automatically cancels the previous in-flight `Task` and launches a new `Task` for the new `selectedUserId` (just like `LaunchedEffect(selectedUserId)` in Compose!)",
          "It pauses the main thread",
          "It clears `UserDefaults`"
        ],
        correctIndex: 1,
        explanation: "`.task(id:)` mirrors Jetpack Compose's `LaunchedEffect(key)`: it cancels the running task when the view disappears OR whenever the `id` value changes, then restarts with the new value."
      },
      {
        question: "7. What does the `Sendable` protocol enforce in Swift 6?",
        options: [
          "That a type can be serialized to JSON over HTTP",
          "That a value of that type can be safely passed across concurrency domains (between actors/tasks) without introducing shared-mutable-state data races",
          "That a type can be sent via AirDrop",
          "That a struct is smaller than 64 bytes"
        ],
        correctIndex: 1,
        explanation: "`Sendable` is Swift's compile-time marker protocol for thread-safe transfer across actor and task boundaries."
      },
      {
        question: "8. Why is a Swift `struct` whose properties are `Int`, `String`, and `[Double]` automatically `Sendable`, whereas a `class` with `var count: Int` is NOT?",
        options: [
          "Because structs are value types (each task gets an isolated copy), whereas passing a mutable class shares the same heap instance across concurrent tasks",
          "Because classes cannot conform to protocols",
          "Because `Int` and `String` are classes",
          "Because structs run on the GPU"
        ],
        correctIndex: 0,
        explanation: "Value types (`struct`, `enum`) with `Sendable` fields copy their value when passed across tasks, making concurrent mutation impossible."
      },
      {
        question: "9. How do you bridge an old callback/delegate-based iOS API into an `async/await` function (equivalent to Kotlin's `suspendCancellableCoroutine`)?",
        options: [
          "Use `withCheckedContinuation` or `withCheckedThrowingContinuation`",
          "Use a `while(true)` loop",
          "Use `DispatchQueue.main.asyncAfter`",
          "Use `@Observable`"
        ],
        correctIndex: 0,
        explanation: "`withCheckedContinuation` (and `withCheckedThrowingContinuation`) wraps callback APIs into `async` functions and verifies at runtime that `continuation.resume(...)` is called exactly once!"
      },
      {
        question: "10. When you need to launch a dynamic number of concurrent child tasks (e.g., downloading 15 images in parallel) and collect their results, which Swift API do you use?",
        options: [
          "`withTaskGroup` or `withThrowingTaskGroup`",
          "`async let` inside a `for` loop",
          "`Timer.scheduledTimer`",
          "`NSThread`"
        ],
        correctIndex: 0,
        explanation: "`async let` is for a fixed, statically known number of tasks; `withTaskGroup` / `withThrowingTaskGroup` dynamically spawns child tasks in a `for` loop while preserving structured concurrency."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 5 Concurrency Lab: (1) Declare `TokenStore` as an `actor`, (2) Mark `loadDashboard` as `async throws`, and (3) Use `async let` to fetch `user` in parallel.",
      starterCode: `// TODO 1: Change 'class' to 'actor' for compile-time thread safety
class TokenStore {
    private var token: String?
    func save(_ newToken: String) { token = newToken }
}

// TODO 2: Mark loadDashboard() as 'async throws -> String'
// and use 'async let name = fetchName()' inside
func fetchName() async throws -> String { "Sudhakar" }

func loadDashboard() -> String {
    return "TODO"
}`,
      solutionCode: `actor TokenStore {
    private var token: String?
    func save(_ newToken: String) { token = newToken }
}

func fetchName() async throws -> String { "Sudhakar" }

func loadDashboard() async throws -> String {
    async let name = fetchName()
    return try await name
}`,
      simulatedOutput: `✓ actor TokenStore isolated mutable state 'token' at compile time
✓ loadDashboard() structured concurrency verified with 'async let' & 'try await'`,
      requiredTokens: ["actor TokenStore", "async throws", "async let"]
    },
    linkedinPost: `Week 5 of Android -> iOS Before New Year: Kotlin Coroutines vs Swift 6 Concurrency & Actors! 🧵⚡

As an Android developer, I love Kotlin Coroutines. But Swift 6 takes concurrency one giant step further: it turns data races into COMPILE-TIME errors!

Here is how Kotlin Coroutines map to Swift Concurrency:
1️⃣ suspend fun -> async / await (Every suspension point in Swift is explicitly marked with 'await'!)
2️⃣ LaunchedEffect(key) -> .task(id: key) { } (Auto-starts on appear and auto-cancels on disappear or key change)
3️⃣ coroutineScope { async { } } -> async let & TaskGroup (Structured Concurrency)
4️⃣ Mutex + Dispatchers.Main -> actor & @MainActor (Compiler-enforced isolation + Sendable checking!)

🔬 Try the interactive Actor Concurrency Visualizer + 10-question quiz on my site:
🔗 https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #Kotlin #Swift6 #Coroutines #Concurrency #MobileEngineering`,
    linkedinArticle: `# Week 5: Kotlin Coroutines vs. Swift 6 Concurrency — \`async/await\`, \`actor\`, and Compile-Time Race Safety

If you have written Kotlin Coroutines with \`suspend\`, \`viewModelScope\`, and \`Dispatchers\`, Swift's \`async/await\` will feel immediately natural. However, Swift 6 introduces a capability we don't have on the JVM: **compile-time data-race safety** via Actors and \`Sendable\`.

---

## 1. Explicit \`await\` and Actor Reentrancy

In Kotlin, calling a \`suspend\` function looks identical to a normal synchronous call. In Swift, you must write \`await\` at every potential suspension point. Why? Because at an \`await\`, your function yields the thread—alerting you that shared state could change before execution resumes!

---

## 2. \`actor\` vs. Kotlin \`Mutex\`

In Kotlin, protecting an in-memory cache from concurrent coroutine mutations requires manually wrapping reads and writes in \`mutex.withLock { ... }\`. If a teammate forgets \`withLock\` in one method, it compiles fine and causes a race condition in production.

In Swift, you simply declare \`actor ImageCache { ... }\`. The compiler guarantees no external caller can touch its properties without asynchronously queuing through the actor's serial executor.`
  },

  // ==========================================================================
  // WEEK 6: NAVIGATION, LISTS & APP LIFECYCLE
  // ==========================================================================
  {
    week: 6,
    dates: "Nov 24 – Nov 30",
    title: "Navigation, Lists & App Lifecycle",
    subtitle: "Mapping `LazyColumn`, Type-Safe `NavHost`, and `Activity` Lifecycle to `List`, `NavigationStack`, `.sheet`, and `ScenePhase`.",
    androidAnchor: "`LazyColumn`, `NavHost` + `@Serializable` Routes, `ModalBottomSheet`, `LifecycleEventObserver`",
    iosAnchor: "`List` / `LazyVStack`, `NavigationStack` + `NavigationPath`, `.sheet(item:)`, `@Environment(\\.scenePhase)`",
    simulatorType: "navigation-visualizer",
    flashcards: [
      { front: "Difference between `List` and `LazyVStack` inside a `ScrollView` in SwiftUI?", back: "Both lazily instantiate rows. `List` provides native iOS system styling, swipe actions (`.swipeActions`), pull-to-refresh, and edit/reorder support out of the box. `LazyVStack` inside `ScrollView` is an unstyled canvas for custom layouts." },
      { front: "Why must models iterated in `List(items)` or `ForEach(items)` conform to `Identifiable`?", back: "Just like `key = { it.id }` in Compose's `LazyColumn`, SwiftUI needs a stable `id` per item to track row insertions, moves, deletions, and state without glitches." },
      { front: "How does `NavigationStack` handle programmatic deep links or 'Pop to Root'?", back: "By binding `NavigationStack(path: $router.path)` to a `@State` array `[Route]` or `NavigationPath`. Calling `path.removeAll()` immediately pops all screens back to the root!" },
      { front: "What are the 3 states of `@Environment(\\.scenePhase)` in a SwiftUI App?", back: "`.active` (in foreground and receiving events), `.inactive` (visible but paused, e.g., system notification shade or app switcher open), and `.background` (off-screen)." }
    ],
    concepts: [
      {
        heading: "1. `List` & `ForEach` vs. Jetpack Compose `LazyColumn`",
        shift: "In Compose, forgetting `key = { it.id }` inside `LazyColumn { items(list) }` is a common performance trap. In SwiftUI, `List(items)` and `ForEach(items)` require elements to conform to the `Identifiable` protocol at compile time!",
        details: [
          "<strong>Built-in Swipe Actions & Search:</strong> Adding swipe-to-delete or custom swipe buttons on iOS takes 3 lines of code with `.swipeActions { ... }`, and adding a native system search bar takes `.searchable(text: $query)`."
        ],
        kotlinCode: `LazyColumn {
    items(items = tasks, key = { it.id }) { task ->
        TaskRow(task)
    }
}`,
        swiftCode: `struct TaskItem: Identifiable {
    let id: UUID
    let title: String
}

List(tasks) { task in
    TaskRow(task: task)
        .swipeActions(edge: .trailing) {
            Button("Delete", role: .destructive) { delete(task) }
        }
}
.searchable(text: $searchQuery)
.refreshable { await viewModel.reload() }`
      },
      {
        heading: "2. Value-Driven Navigation (`NavigationStack` & `NavigationPath`)",
        shift: "Where Android's Navigation Compose uses `NavHost` + `navController.navigate(Route)`, SwiftUI's `NavigationStack(path: $path)` treats the entire navigation backstack as a simple mutable Array of `Hashable` route values!",
        details: [
          "<strong>Pop to Root in 1 Line:</strong> Because the backstack is just `@State private var path: [AppRoute] = []`, popping 4 screens back to the home screen is literally `path.removeAll()`!",
          "<strong>Modals & Bottom Sheets (`.sheet` & `.fullScreenCover`):</strong> Present modals declaratively by binding `.sheet(item: $selectedItem) { item in ... }`, and customize bottom-sheet snap heights with `.presentationDetents([.medium, .large])`."
        ],
        kotlinCode: `@Serializable sealed interface Route {
    @Serializable data class Detail(val id: String) : Route
}
// Pop to root:
navController.popBackStack(HomeRoute, inclusive = false)`,
        swiftCode: `enum AppRoute: Hashable {
    case detail(id: String)
    case settings
}

struct RootNavigator: View {
    @State private var path: [AppRoute] = []

    var body: some View {
        NavigationStack(path: $path) {
            HomeScreen(onOpenDetail: { id in path.append(.detail(id: id)) })
                .navigationDestination(for: AppRoute.self) { route in
                    switch route {
                    case .detail(let id): DetailScreen(id: id)
                    case .settings: SettingsScreen(onPopToRoot: { path.removeAll() })
                    }
                }
        }
    }
}`
      },
      {
        heading: "3. App Entry Point (`@main App`) & `ScenePhase` Lifecycle",
        shift: "Instead of `Application` + `MainActivity` + `AndroidManifest.xml`, a SwiftUI app starts at `@main struct MyApp: App` containing a `WindowGroup` scene, and observes foreground/background lifecycle via `@Environment(\\.scenePhase)`.",
        details: [
          "<strong>Handling Deep Links:</strong> Attach `.onOpenURL { url in ... }` to your root view inside `WindowGroup` to parse incoming custom URL schemes or Universal Links and push routes onto `path`."
        ],
        kotlinCode: `// Android: LifecycleEventObserver on ProcessLifecycleOwner or Activity
LifecycleEventEffect(Lifecycle.Event.ON_STOP) {
    viewModel.flushAnalytics()
}`,
        swiftCode: `@main
struct MyLearningApp: App {
    @Environment(\\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            RootNavigator()
        }
        .onChange(of: scenePhase) { _, newPhase in
            if newPhase == .background {
                flushAnalytics()
            }
        }
    }
}`
      }
    ],
    quiz: [
      {
        question: "1. Why does SwiftUI's `List(items)` require the element type to conform to `Identifiable` (or require an explicit `id:` key path)?",
        options: [
          "To save items to SQLite automatically",
          "So SwiftUI's diffing engine has a stable identity per row to animate insertions/deletions and preserve row state accurately (just like `key = { it.id }` in Compose's `LazyColumn`)",
          "Because structs don't have memory addresses",
          "To sort the list alphabetically"
        ],
        correctIndex: 1,
        explanation: "Stable identity via `Identifiable` allows SwiftUI to track each item across state mutations without recycling the wrong row state."
      },
      {
        question: "2. If you bind `NavigationStack(path: $path)` where `path` is `@State private var path: [Route] = [.profile, .editProfile, .security]`, how do you pop all the way back to the root screen?",
        options: [
          "Call `finishAffinity()`",
          "Call `path.removeAll()`",
          "Create a new `UIWindow`",
          "Throw an exception"
        ],
        correctIndex: 1,
        explanation: "Because `NavigationStack` is purely state-driven, mutating the `path` array to `[]` (`path.removeAll()`) smoothly pops back to the root view!"
      },
      {
        question: "3. What protocol MUST your route enum (`enum AppRoute`) conform to so it can be used with `NavigationLink(value:)` and `.navigationDestination(for:)`?",
        options: [
          "`Hashable`",
          "`Comparable`",
          "`Error`",
          "`ViewModifier`"
        ],
        correctIndex: 0,
        explanation: "SwiftUI's value-based navigation requires route values to conform to `Hashable` so it can compare and store destinations in the navigation stack."
      },
      {
        question: "4. How do you configure a SwiftUI `.sheet` modal to behave like an Android Bottom Sheet that stops halfway up the screen and can be dragged to full height?",
        options: [
          "Attach `.presentationDetents([.medium, .large])` to the content view inside the `.sheet`",
          "Use `.frame(height: 300)`",
          "Use `ZStack` with a gesture",
          "Use `fullScreenCover`"
        ],
        correctIndex: 0,
        explanation: "`.presentationDetents([.medium, .large])` (or custom `.fraction(0.4)` / `.height(250)`) gives you native iOS bottom sheet snapping behavior."
      },
      {
        question: "5. What is the difference between `.sheet(isPresented:)` and `.sheet(item:)` in SwiftUI?",
        options: [
          "`.sheet(item:)` only works on iPad",
          "`.sheet(item: $selectedUser)` binds to an Optional `Identifiable` model and passes the unwrapped non-optional `user` directly into the sheet closure, preventing empty/nil state bugs",
          "`.sheet(isPresented:)` is deprecated",
          "They are identical"
        ],
        correctIndex: 1,
        explanation: "Using `.sheet(item: $selectedItem)` avoids having a separate boolean `showSheet` and optional `selectedItem` that could get out of sync!"
      },
      {
        question: "6. How do you add native pull-to-refresh to a `List` in SwiftUI?",
        options: [
          "Wrap the `List` in `SwipeRefreshLayout`",
          "Attach `.refreshable { await viewModel.refresh() }` to the `List`",
          "Add a `DragGesture` to every row",
          "Use `UIViewRepresentable`"
        ],
        correctIndex: 1,
        explanation: "The `.refreshable { ... }` modifier automatically adds a native iOS pull-to-refresh spinner to any `List` or `ScrollView` and awaits your async closure."
      },
      {
        question: "7. Which `ScenePhase` value indicates that your iOS app is still visible on screen (for example, while the user pulls down Control Center or the notification shade) but is not currently receiving touch input?",
        options: [
          "`.active`",
          "`.inactive`",
          "`.background`",
          "`.suspended`"
        ],
        correctIndex: 1,
        explanation: "`.inactive` corresponds to Android's `ON_PAUSE` (visible but not focused), whereas `.background` corresponds to `ON_STOP` (no longer visible)."
      },
      {
        question: "8. When should you choose `ScrollView { LazyVStack { ... } }` instead of `List { ... }` in SwiftUI?",
        options: [
          "When you want native swipe-to-delete actions",
          "When you need a completely custom card/grid feed layout without iOS system list separators, insets, or cell backgrounds",
          "When your list has fewer than 5 items",
          "Never; `LazyVStack` is not lazy"
        ],
        correctIndex: 1,
        explanation: "`List` applies platform-specific table styling and provides swipe/reorder features; `ScrollView` + `LazyVStack` gives you raw lazy composition with zero system chrome."
      },
      {
        question: "9. Why should you NEVER wrap a `LazyVStack` without a parent `ScrollView`?",
        options: [
          "It fails to compile",
          "Without a `ScrollView`, `LazyVStack` proposes the entire height at once and instantiates all child views immediately—defeating lazy loading!",
          "It crashes on iOS 18",
          "It disables touch events"
        ],
        correctIndex: 1,
        explanation: "`LazyVStack` relies on an enclosing `ScrollView` viewport to know which subviews are currently visible on screen."
      },
      {
        question: "10. What type lets you push heterogeneous route types (e.g., `UserRoute`, `ProductRoute`, `OrderRoute` from different feature modules) onto a single `NavigationStack`?",
        options: [
          "`NavigationPath`",
          "`[String]`",
          "`AnyObject`",
          "`Bundle`"
        ],
        correctIndex: 0,
        explanation: "`NavigationPath` is a type-erased collection of `Hashable` route values designed for multi-module navigation where different modules define their own route enums."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 6 Navigation Lab: (1) Conform `Route` to `Hashable`, (2) Bind `NavigationStack(path: $path)`, and (3) Register `.navigationDestination(for: Route.self)`.",
      starterCode: `// TODO 1: Conform Route to Hashable
enum Route {
    case detail(Int)
}

struct MainRouter: View {
    @State private var path: [Route] = []

    var body: some View {
        // TODO 2: Bind path: $path and add .navigationDestination(for: Route.self)
        NavigationStack {
            Text("Home")
        }
    }
}`,
      solutionCode: `enum Route: Hashable {
    case detail(Int)
}

struct MainRouter: View {
    @State private var path: [Route] = []

    var body: some View {
        NavigationStack(path: $path) {
            Text("Home")
                .navigationDestination(for: Route.self) { route in
                    Text("Detail")
                }
        }
    }
}`,
      simulatedOutput: `✓ enum Route: Hashable verified
✓ NavigationStack(path: $path) bound to [Route] state
✓ .navigationDestination(for: Route.self) registered!`,
      requiredTokens: ["Hashable", "NavigationStack(path: $path)", ".navigationDestination(for: Route.self)"]
    },
    linkedinPost: `Week 6 of Android -> iOS Before New Year: NavigationStack, Lazy Lists & App Lifecycle! 🧭📱

How do LazyColumn, NavHost, and Activity Lifecycle translate to SwiftUI?

1️⃣ LazyColumn(key = { it.id }) -> List & Identifiable
In Compose, forgetting the 'key' lambda in LazyColumn is a common bug. In SwiftUI, List requires your model to conform to the Identifiable protocol at compile time! Plus, pull-to-refresh (.refreshable) and swipe actions (.swipeActions) take 1 modifier each.

2️⃣ NavHost -> NavigationStack(path: $path)
In SwiftUI, the entire navigation backstack is just a mutable @State Array of Hashable enums! Want to pop 5 screens back to Root? Just call 'path.removeAll()'.

3️⃣ Bottom Sheets -> .sheet + .presentationDetents([.medium, .large])
Declarative half/full bottom sheets in one line of code.

🧭 Try the interactive NavigationStack Visualizer + 10-question quiz:
🔗 https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #SwiftUI #JetpackCompose #MobileArchitecture`,
    linkedinArticle: `# Week 6: Value-Driven Navigation (\`NavigationStack\`), \`List\` vs \`LazyColumn\`, and \`ScenePhase\`

In Week 6, I compared how Android and iOS handle multi-screen navigation, lazy scrolling feeds, and app lifecycle transitions.

---

## 1. The Backstack Is Just an Array: \`NavigationStack(path: $path)\`

In Jetpack Compose, we interact with a \`NavHostController\` imperatively (\`navController.navigate(...)\`, \`navController.popBackStack(...)\`).
In SwiftUI, \`NavigationStack(path: $path)\` binds directly to a value-type array \`@State private var path: [AppRoute] = []\`.
- Push a screen: \`path.append(.detail(id: 42))\`
- Pop one screen: \`path.removeLast()\`
- Pop to root from anywhere: \`path.removeAll()\`
- Deep link into a 3-screen flow: \`path = [.orders, .orderDetail(99), .trackPackage(99)]\``
  }
];
