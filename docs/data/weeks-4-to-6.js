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
    dailySteps: [
      {
        day: 1,
        title: "Local State with @State (remember ➔ @State)",
        time: "15 mins",
        goal: "Understand why and how SwiftUI uses @State for local view variables.",
        shift: "`var count by remember { mutableIntStateOf(0) }` ➔ `@State private var count = 0`.",
        details: [
          "Always declare `@State` properties as `private` because they belong to the view that created them.",
          "Modifying a `@State` variable causes SwiftUI to automatically re-render the view's `body`."
        ],
        kotlinCode: `@Composable
fun Counter() {
    var count by remember { mutableIntStateOf(0) }
    Button(onClick = { count++ }) { Text("Count: $count") }
}`,
        swiftCode: `struct Counter: View {
    @State private var count = 0
    var body: some View {
        Button("Count: \\(count)") { count += 1 }
    }
}`
      },
      {
        day: 2,
        title: "Two-Way Binding with $ and @Binding",
        time: "15 mins",
        goal: "Pass two-way mutable state to child components like TextField and Toggle.",
        shift: "Compose passes `(value, onValueChange)`. SwiftUI passes `$text` (a `Binding<String>`).",
        details: [
          "The `$` prefix accesses the `projectedValue` of `@State`, creating a two-way connection.",
          "Child views receive this with the `@Binding` property wrapper."
        ],
        kotlinCode: `TextField(value = text, onValueChange = { text = it })`,
        swiftCode: `TextField("Enter name", text: $text)`
      },
      {
        day: 3,
        title: "Modern ViewModels with the @Observable Macro",
        time: "15 mins",
        goal: "Build clean, reactive ViewModels without StateFlow or LiveData boilerplate.",
        shift: "Compose `ViewModel` + `StateFlow` ➔ Swift `@Observable class MyViewModel`.",
        details: [
          "Swift 5.9+ `@Observable` tracks which properties each view actually reads.",
          "No manual `collectAsState()` required; simply read `viewModel.property` in `body`."
        ],
        kotlinCode: `class UserViewModel : ViewModel() {
    val name = MutableStateFlow("Sudhakar")
}`,
        swiftCode: `@Observable
@MainActor
final class UserViewModel {
    var name = "Sudhakar"
}`
      },
      {
        day: 4,
        title: "Tree-Scoped State with @Environment",
        time: "15 mins",
        goal: "Pass dependencies down the view hierarchy without drilling props through every child.",
        shift: "Compose `CompositionLocalProvider` ➔ SwiftUI `.environment(...)` and `@Environment`.",
        details: [
          "Inject an object into the root view with `.environment(myObject)`.",
          "Read it anywhere in the descendant tree with `@Environment(MyObject.self)`."
        ],
        kotlinCode: `val LocalUser = compositionLocalOf<User> { error("No user") }`,
        swiftCode: `@Environment(UserSession.self) private var session`
      },
      {
        day: 5,
        title: "Week 4 Todo App Project, Quiz & LinkedIn Post",
        time: "20 mins",
        goal: "Build an interactive Todo list connected to an @Observable ViewModel.",
        shift: "Experience how cleanly modern SwiftUI separates UI and ViewModel state.",
        details: [
          "Build a working interactive screen, complete the quiz, and share your takeaways on LinkedIn."
        ],
        kotlinCode: `// Combine ViewModel, State, and List in Compose`,
        swiftCode: `// Combine @Observable, @State, and List in SwiftUI`
      }
    ],
    concepts: [
      {
        heading: "1. Ephemeral View State (`@State`) & Two-Way Hoisting (`@Binding`)",
        shift: "In Jetpack Compose, `remember { mutableStateOf(...) }` persists state across recompositions. In SwiftUI, `@State` stores state in SwiftUI's attribute graph, and `$property` passes a two-way `Binding<Value>`!",
        details: [
          "<strong>Always mark `@State` as `private`:</strong> `@State` is owned by the specific view that declares it.",
          "<strong>How `$` Works:</strong> Writing `count` reads the value; writing `$count` passes a `Binding<Int>`."
        ],
        kotlinCode: `var query by remember { mutableStateOf("") }
SearchBar(query = query, onQueryChange = { query = it })`,
        swiftCode: `@State private var query = ""
SearchBar(query: $query)`
      },
      {
        heading: "2. Modern ViewModels with `@Observable` (Goodbye `ObservableObject`!)",
        shift: "Swift 5.9+ uses the `@Observable` macro for automatic, fine-grained property tracking—eliminating `StateFlow` and `@Published` boilerplate.",
        details: [
          "<strong>Zero `StateFlow` Boilerplate:</strong> The macro rewrites stored properties into tracked getters/setters.",
          "<strong>Use `@Bindable`:</strong> If you need two-way `$` bindings to an `@Observable` model's properties."
        ],
        kotlinCode: `class FeedViewModel : ViewModel() {
    private val _items = MutableStateFlow<List<String>>(emptyList())
    val items: StateFlow<List<String>> = _items
}`,
        swiftCode: `@Observable
@MainActor
final class FeedViewModel {
    var items: [String] = []
    var isLoading = false
}`
      },
      {
        heading: "3. View Identity (`id`) & Tree Scoping (`@Environment`)",
        shift: "Just like `key()` and `CompositionLocal` in Compose, SwiftUI tracks view lifetime by identity and injects dependencies via `.environment(...)`.",
        details: [
          "<strong>Resetting State with `.id()`:</strong> Changing `.id(itemId)` destroys old state and initializes a fresh view."
        ],
        kotlinCode: `CompositionLocalProvider(LocalTheme provides Theme.Light) { ChildScreen() }`,
        swiftCode: `ContentView().environment(sessionManager)`
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
        question: "2. What is the biggest advantage of the modern `@Observable` macro (iOS 17+) over legacy `ObservableObject`?",
        options: [
          "`@Observable` uses less disk space",
          "`@Observable` tracks exactly which properties a View reads, so mutating an unread property never triggers unnecessary view re-renders",
          "`@Observable` converts classes into structs",
          "`@Observable` disables ARC"
        ],
        correctIndex: 1,
        explanation: "Fine-grained observation ensures that views only re-render when a property they actually read in their `body` changes."
      },
      {
        question: "3. What does the `$` prefix (e.g. `$name`) produce when applied to a `@State` variable?",
        options: [
          "String interpolation like in Kotlin",
          "A two-way `Binding<T>` projection allowing child controls to read and mutate the parent state",
          "A background thread task",
          "A constant value"
        ],
        correctIndex: 1,
        explanation: "`$name` accesses the projected value of the property wrapper, producing a `Binding<String>` for two-way synchronization."
      },
      {
        question: "4. Which SwiftUI mechanism is the direct equivalent of Compose's `CompositionLocalProvider`?",
        options: [
          "`@Environment` and `.environment(...)`",
          "`@Binding`",
          "`@State`",
          "`UserDefaults`"
        ],
        correctIndex: 0,
        explanation: "`.environment(...)` passes dependencies down the view hierarchy, accessible anywhere below via `@Environment`."
      },
      {
        question: "5. When a SwiftUI View owns an `@Observable` ViewModel, how should you declare it in the view?",
        options: [
          "`@State private var vm = MyViewModel()`",
          "`let vm = MyViewModel()`",
          "`@Binding var vm = MyViewModel()`",
          "`weak var vm = MyViewModel()`"
        ],
        correctIndex: 0,
        explanation: "`@State private var vm = MyViewModel()` keeps the single ViewModel instance alive across View struct recreations."
      },
      {
        question: "6. What is the role of the `@Bindable` property wrapper when working with `@Observable` objects?",
        options: [
          "It forces the class to conform to Codable",
          "It creates two-way bindings (`$model.property`) to properties of an `@Observable` object passed into a child view",
          "It binds a View to a background GCD queue",
          "It replaces CoreData relationships"
        ],
        correctIndex: 1,
        explanation: "`@Bindable` allows you to create direct two-way bindings (like `$user.username`) to properties of an `@Observable` model object."
      },
      {
        question: "7. Why should `@State` variables almost always be marked `private`?",
        options: [
          "Because Swift 6 compiler throws an error if they are public",
          "Because `@State` is private internal view state owned exclusively by that view; external parents should pass parameters or bindings",
          "Because private variables use less RAM",
          "Because it prevents background threads from accessing them"
        ],
        correctIndex: 1,
        explanation: "Marking `@State` as `private` enforces proper encapsulation and single source of truth: only the view that owns the state should mutate it directly."
      },
      {
        question: "8. What does `@ObservationIgnored` do when placed on a property inside an `@Observable` class?",
        options: [
          "It excludes the property from JSON encoding",
          "It tells SwiftUI not to track reads or writes of this property, preventing view invalidations when it changes",
          "It makes the property private",
          "It deletes the property from memory"
        ],
        correctIndex: 1,
        explanation: "`@ObservationIgnored` opts a property out of SwiftUI observation tracking—ideal for caches, timers, or internal counters."
      },
      {
        question: "9. In Jetpack Compose, state is retained across recompositions using `remember { mutableStateOf(...) }`. What is the SwiftUI equivalent?",
        options: [
          "`@State private var ...`",
          "`var state = ...`",
          "`@AppStorage var ...`",
          "`@Transient var ...`"
        ],
        correctIndex: 0,
        explanation: "`@State` is the SwiftUI equivalent of Compose's `remember { mutableStateOf(...) }`, persisting state through view renders."
      },
      {
        question: "10. In a unidirectional data flow (UDF) architecture, how should a child view update a parent's state without direct mutation?",
        options: [
          "By accessing the parent's private variables via reflection",
          "By accepting a `@Binding` or passing an action closure (e.g. `onDelete: () -> Void`) up to the parent",
          "By sending a global broadcast notification",
          "By creating a static singleton variable"
        ],
        correctIndex: 1,
        explanation: "State hoisting via `@Binding` or action closures keeps child views stateless and reusable, matching Compose's event hoisting pattern."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 4 State Lab: (1) Mark `ProfileViewModel` with `@Observable`, (2) Hold it with `@State private var vm` in `ProfileScreen`, and (3) Bind the `TextField` to `$vm.bio`.",
      starterCode: `final class ProfileViewModel {
    var bio: String = ""
}

struct ProfileScreen: View {
    var vm = ProfileViewModel()

    var body: some View {
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
    linkedinPost: `Week 4 of Android -> iOS Before New Year: State Management in SwiftUI vs Compose! ⚡🧠

How does state management on iOS compare to Jetpack Compose?

1️⃣ remember { mutableStateOf() } -> @State
Because SwiftUI views are immutable structs that get recreated constantly, @State stores your state in SwiftUI's persistent attribute graph outside the struct.

2️⃣ (value, onValueChange) -> @Binding ($var)
Instead of passing value + callback lambda pairs to child TextFields, prefixing '$' projects a two-way Binding<T>.

3️⃣ Goodbye StateFlow, Hello @Observable!
In Swift 6 / iOS 17+, the @Observable macro tracks exact property reads inside body—so mutating an unread property never triggers wasted re-renders!

🔗 Follow my daily steps on GitHub: https://github.com/sudhakar-r08/ios-for-android-devs
🌐 Tutorial Site: https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #SwiftUI #JetpackCompose #MVVM #MobileEngineering`,
    linkedinArticle: `# Week 4: From \`remember\` & \`StateFlow\` to \`@State\`, \`@Binding\`, and Swift's \`@Observable\` Macro

State management is the heart of declarative mobile development. In Week 4, I explored how SwiftUI handles state updates, two-way bindings, and ViewModels...`
  },

  // ==========================================================================
  // WEEK 5: SWIFT CONCURRENCY, ACTORS & SENDABLE
  // ==========================================================================
  {
    week: 5,
    dates: "Nov 17 – Nov 23",
    title: "Swift Concurrency, Actors & Sendable",
    subtitle: "Kotlin Coroutines & Dispatchers vs. Swift 6 `async`/`await`, Structured Concurrency (`async let`), `actor`, `@MainActor`, and compile-time data race safety.",
    androidAnchor: "`suspend fun`, `viewModelScope.launch`, `Dispatchers.Main`/`Default`, `coroutineScope`, `Mutex`",
    iosAnchor: "`async`/`await`, `Task {}`, `.task {}`, `async let`, `actor`, `@MainActor`, `Sendable`",
    simulatorType: "actor-visualizer",
    flashcards: [
      { front: "Difference between calling a Kotlin `suspend` function and a Swift `async` function?", back: "In Kotlin, calling a `suspend` function looks like a normal synchronous call. In Swift, every suspension point MUST be explicitly marked with the `await` keyword." },
      { front: "What does SwiftUI's `.task { ... }` modifier do?", back: "It launches an asynchronous Task when the view appears and automatically cancels it when the view disappears (just like `LaunchedEffect` in Compose)." },
      { front: "What is an `actor` in Swift?", back: "A reference type that protects its internal mutable state by serializing all external access through an asynchronous mailbox—preventing data races at compile time." },
      { front: "What does `@MainActor` do?", back: "It guarantees that a ViewModel, class, or function will only ever execute on the main UI thread, enforced by the compiler." }
    ],
    dailySteps: [
      {
        day: 1,
        title: "Swift async/await vs. Kotlin Coroutines",
        time: "15 mins",
        goal: "Write asynchronous functions and handle suspension points explicitly with await.",
        shift: "`suspend fun` ➔ `func doWork() async throws`. Every suspension point requires `await`.",
        details: [
          "In Kotlin, calling a `suspend` function has no marker at the call site. In Swift, `await` is required so you know where threads can yield.",
          "Use `Task { ... }` to kick off async work from synchronous code."
        ],
        kotlinCode: `suspend fun fetchUser(): User {
    delay(1000)
    return User("Sudhakar")
}`,
        swiftCode: `func fetchUser() async throws -> User {
    try await Task.sleep(nanoseconds: 1_000_000_000)
    return User(name: "Sudhakar")
}`
      },
      {
        day: 2,
        title: "View Lifecycle Async with .task",
        time: "15 mins",
        goal: "Fetch data when a view appears and auto-cancel when it disappears.",
        shift: "Compose `LaunchedEffect(key)` ➔ SwiftUI `.task(id: key) { ... }`.",
        details: [
          "SwiftUI's `.task` modifier automatically hooks into cooperative task cancellation when navigating away."
        ],
        kotlinCode: `LaunchedEffect(userId) {
    viewModel.load(userId)
}`,
        swiftCode: `.task(id: userId) {
    await viewModel.load(userId)
}`
      },
      {
        day: 3,
        title: "Parallel Execution with async let",
        time: "15 mins",
        goal: "Run two or more asynchronous tasks simultaneously and wait for both.",
        shift: "Kotlin `coroutineScope { async { }; async { } }` ➔ Swift `async let a = ...; async let b = ...`.",
        details: [
          "Super concise structured concurrency: `async let user = fetchUser(); async let posts = fetchPosts(); let (u, p) = try await (user, posts)`."
        ],
        kotlinCode: `coroutineScope {
    val user = async { api.getUser() }
    val feed = async { api.getFeed() }
    Dashboard(user.await(), feed.await())
}`,
        swiftCode: `async let user = api.getUser()
async let feed = api.getFeed()
let dashboard = try await Dashboard(user: user, feed: feed)`
      },
      {
        day: 4,
        title: "@MainActor and Swift 6 Actors",
        time: "15 mins",
        goal: "Keep UI state on the main thread and protect shared state with actors without manual locks.",
        shift: "`Dispatchers.Main` ➔ `@MainActor`; `Mutex` ➔ `actor`.",
        details: [
          "Mark ViewModels with `@MainActor` to guarantee UI updates stay on the main thread.",
          "Use `actor` for shared in-memory caches to eliminate data races at compile time."
        ],
        kotlinCode: `class Cache {
    private val mutex = Mutex()
    suspend fun save(t: String) = mutex.withLock { token = t }
}`,
        swiftCode: `actor TokenCache {
    private var token: String?
    func save(_ t: String) { token = t }
}`
      },
      {
        day: 5,
        title: "Week 5 Concurrency Lab, Quiz & LinkedIn Post",
        time: "20 mins",
        goal: "Build an async dashboard screen, complete the quiz, and share your concurrency insights.",
        shift: "Appreciate how Swift 6 turns concurrency data races into compile-time errors.",
        details: [
          "Practice parallel requests with `async let` and test thread safety with actors."
        ],
        kotlinCode: `// Android Coroutines practice`,
        swiftCode: `// Swift Concurrency practice`
      }
    ],
    concepts: [
      {
        heading: "1. Coroutines vs. `async / await` & The `.task` Modifier",
        shift: "In Swift, every suspension point requires an explicit `await` keyword, and SwiftUI's `.task {}` modifier automatically manages cooperative task cancellation.",
        details: [
          "<strong>Explicit Suspension:</strong> Writing `await` reminds you that the current thread may yield to other tasks.",
          "<strong>Cooperative Cancellation:</strong> Check `Task.isCancelled` during long loops to cancel promptly."
        ],
        kotlinCode: `suspend fun load() = coroutineScope { ... }`,
        swiftCode: `func load() async throws { ... }`
      },
      {
        heading: "2. `actor` & `@MainActor` vs. `Dispatchers.Main` & `Mutex`",
        shift: "Swift 6 uses `@MainActor` and `actor` to enforce thread isolation at compile time instead of relying on runtime discipline.",
        details: [
          "<strong>`@MainActor`:</strong> Compile-time guarantee that functions execute on the main thread.",
          "<strong>`actor`:</strong> Protects its state via a serial mailbox."
        ],
        kotlinCode: `withContext(Dispatchers.Main) { state = newState }`,
        swiftCode: `@MainActor func updateState() { state = newState }`
      }
    ],
    quiz: [
      {
        question: "1. What does SwiftUI's `.task` modifier do when a view disappears while an async operation is still downloading?",
        options: [
          "It crashes the application",
          "It automatically cancels the running cooperative Task",
          "It blocks the main thread until the download finishes",
          "It restarts the download in the background"
        ],
        correctIndex: 1,
        explanation: "`.task` ties the lifecycle of the async task to the view, automatically cancelling it if the user navigates away."
      },
      {
        question: "2. How do you run two independent async calls (`fetchA()` and `fetchB()`) concurrently in Swift and await both results?",
        options: [
          "Call `await fetchA()` followed by `await fetchB()`",
          "Use `async let a = fetchA()` and `async let b = fetchB()`, then `await (a, b)`",
          "Use a `while` loop",
          "Mark the function `@Concurrent`"
        ],
        correctIndex: 1,
        explanation: "`async let` starts child tasks immediately in parallel, awaiting both at the point where their values are combined."
      },
      {
        question: "3. What is the primary purpose of an `actor` in Swift?",
        options: [
          "To animate SwiftUI views",
          "To protect mutable state from data races by serializing access through an asynchronous queue at compile time",
          "To replace structs",
          "To run database migrations"
        ],
        correctIndex: 1,
        explanation: "An `actor` is a reference type that eliminates data races by isolating its state and serializing method calls."
      },
      {
        question: "4. What does the `@MainActor` attribute guarantee?",
        options: [
          "The code executes in the background",
          "The annotated class, method, or property will only ever be accessed on the main UI thread",
          "The code compiles faster",
          "It disables animations"
        ],
        correctIndex: 1,
        explanation: "`@MainActor` binds execution to the main dispatch queue at compile time, preventing background UI mutation bugs."
      },
      {
        question: "5. What is `Sendable` in Swift 6?",
        options: [
          "A protocol for JSON serialization",
          "A compile-time marker protocol indicating that a type is safe to pass across concurrency boundaries without data races",
          "A networking library",
          "A push notification service"
        ],
        correctIndex: 1,
        explanation: "`Sendable` ensures that values passed between concurrent tasks or actors cannot introduce shared-state data races."
      },
      {
        question: "6. What is the key difference between `Task` and `Task.detached`?",
        options: [
          "`Task` runs in background; `Task.detached` runs on the main thread",
          "`Task` inherits the calling context's actor isolation and priority; `Task.detached` starts a brand-new unisolated background task",
          "`Task.detached` is only for SwiftUI previews",
          "There is no difference; they are aliases"
        ],
        correctIndex: 1,
        explanation: "Standard `Task { }` inherits actor context (e.g. `@MainActor`) and priority. `Task.detached` creates an unconstrained task that does not inherit caller attributes."
      },
      {
        question: "7. How do you implement cooperative cancellation checks in a long-running Swift `Task` (equivalent to Kotlin's `ensureActive()`)?",
        options: [
          "Call `Thread.kill()`",
          "Check `Task.isCancelled` or call `try Task.checkCancellation()`",
          "Throw an uncaught runtime exception",
          "Call `exit(0)`"
        ],
        correctIndex: 1,
        explanation: "`try Task.checkCancellation()` throws `CancellationError` immediately if the enclosing task has been cancelled, halting further execution cleanly."
      },
      {
        question: "8. What happens in Swift 6 Complete Concurrency Checking if you pass an unisolated, mutable class across actor boundaries?",
        options: [
          "It compiles silently but crashes in production",
          "The compiler emits a hard error: 'Sending value of non-Sendable type risks causing data races'",
          "It automatically clones the class on the heap",
          "It forces the class to run on GCD"
        ],
        correctIndex: 1,
        explanation: "Swift 6's primary breakthrough is compile-time data race elimination; passing non-Sendable mutable reference types across isolation boundaries triggers a compiler error."
      },
      {
        question: "9. How do you iterate over an asynchronous stream of values in Swift (equivalent to Kotlin's `Flow.collect { }`)?",
        options: [
          "`for await item in stream { ... }`",
          "`stream.subscribe { item in ... }`",
          "`while (stream.hasNext()) { ... }`",
          "`stream.forEachSync { ... }`"
        ],
        correctIndex: 0,
        explanation: "`for await item in stream` consumes types conforming to `AsyncSequence`, suspending cleanly as each element is emitted."
      },
      {
        question: "10. If an actor method needs to access non-isolated logic or does not touch actor-isolated state, how can you mark it to avoid requiring `await` from outside?",
        options: [
          "`@MainActor`",
          "`nonisolated`",
          "`@concurrent`",
          "`@unbound`"
        ],
        correctIndex: 1,
        explanation: "Marking a method as `nonisolated` opts it out of actor isolation, allowing callers to execute it synchronously if it does not touch mutable actor state."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 5 Concurrency Lab: (1) Declare `TokenStore` as an `actor`, (2) Mark `loadDashboard` as `async throws`, and (3) Use `async let` to fetch `user` in parallel.",
      starterCode: `class TokenStore {
    private var token: String?
    func save(_ newToken: String) { token = newToken }
}

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

As an Android developer who uses Coroutines daily, learning Swift Concurrency was fascinating:

1️⃣ Explicit await
In Kotlin, suspend calls look like normal functions. In Swift, you MUST write 'await' at every suspension point so you know exactly where execution yields.

2️⃣ LaunchedEffect -> .task { }
SwiftUI's .task modifier automatically starts on appear and cancels on disappear.

3️⃣ Dispatchers.Main -> @MainActor
Marking a ViewModel with @MainActor guarantees all mutations happen on the UI thread—enforced at compile time!

4️⃣ Mutex -> actor
Swift's 'actor' keyword gives you compile-time thread-safe state without manual lock boilerplate.

🔗 GitHub: https://github.com/sudhakar-r08/ios-for-android-devs
🌐 Tutorial Site: https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #Kotlin #Swift6 #Coroutines #Concurrency`,
    linkedinArticle: `# Week 5: Kotlin Coroutines vs. Swift 6 Concurrency — \`async/await\`, \`actor\`, and Compile-Time Safety

If you write Kotlin Coroutines with \`suspend\` and \`Dispatchers\`, Swift's \`async/await\` will feel immediately familiar...`
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
      { front: "Difference between `List` and `LazyVStack` in SwiftUI?", back: "`List` provides platform-native styling, separators, swipe actions, and pull-to-refresh out of the box. `LazyVStack` inside a `ScrollView` is an unstyled, custom canvas." },
      { front: "Why must models in `List(items)` conform to `Identifiable`?", back: "So SwiftUI's diffing engine has a stable ID to animate insertions/deletions and preserve row state (like `key = { it.id }` in Compose)." },
      { front: "How do you pop all screens back to the root in `NavigationStack(path: $path)`?", back: "Call `path.removeAll()`. The entire backstack is simply a state array of routes!" },
      { front: "What are the 3 states of `@Environment(\\.scenePhase)`?", back: "`.active` (foreground & focused), `.inactive` (visible but paused, like app switcher open), and `.background` (off-screen)." }
    ],
    dailySteps: [
      {
        day: 1,
        title: "Lazy Lists with List and Identifiable",
        time: "15 mins",
        goal: "Render high-performance scrolling feeds with native pull-to-refresh and swipe actions.",
        shift: "`LazyColumn` ➔ `List(items)`. Models conform to `Identifiable`.",
        details: [
          "Conforming your model to `Identifiable` gives it a stable `id` for diffing.",
          "Add `.refreshable { await load() }` and `.swipeActions` in 1 line."
        ],
        kotlinCode: `LazyColumn { items(tasks, key = { it.id }) { TaskRow(it) } }`,
        swiftCode: `List(tasks) { task in
    TaskRow(task: task)
        .swipeActions { Button("Delete", role: .destructive) { delete(task) } }
}
.refreshable { await reload() }`
      },
      {
        day: 2,
        title: "NavigationStack & The State Backstack",
        time: "15 mins",
        goal: "Navigate between screens using type-safe route values.",
        shift: "`NavHost` ➔ `NavigationStack(path: $path)`. The backstack is literally an array!",
        details: [
          "Push a screen: `path.append(.detail(id: 42))`.",
          "Pop to root: `path.removeAll()`."
        ],
        kotlinCode: `navController.navigate(DetailRoute(id = 42))`,
        swiftCode: `NavigationStack(path: $path) {
    HomeScreen()
        .navigationDestination(for: Route.self) { route in
            DetailScreen(route: route)
        }
}`
      },
      {
        day: 3,
        title: "Bottom Sheets and Modals with .sheet",
        time: "15 mins",
        goal: "Present sheets and configure snap detents like Android bottom sheets.",
        shift: "`ModalBottomSheet` ➔ `.sheet(item: $selected) { ... }`.",
        details: [
          "Use `.presentationDetents([.medium, .large])` to create half-screen draggable bottom sheets."
        ],
        kotlinCode: `ModalBottomSheet(onDismissRequest = { ... }) { ... }`,
        swiftCode: `.sheet(item: $selectedTask) { task in
    TaskDetailView(task: task)
        .presentationDetents([.medium, .large])
}`
      },
      {
        day: 4,
        title: "App Entry Point (@main) & ScenePhase",
        time: "15 mins",
        goal: "Detect when the app moves to background or returns to foreground.",
        shift: "`Activity` Lifecycle ➔ `@Environment(\\.scenePhase)` in `@main struct MyApp: App`.",
        details: [
          "Observe `.active`, `.inactive`, and `.background` transitions cleanly across the entire app."
        ],
        kotlinCode: `LifecycleEventEffect(Lifecycle.Event.ON_STOP) { flush() }`,
        swiftCode: `.onChange(of: scenePhase) { _, newPhase in
    if newPhase == .background { flushAnalytics() }
}`
      },
      {
        day: 5,
        title: "Week 6 Multi-Screen Project, Quiz & LinkedIn Post",
        time: "20 mins",
        goal: "Build a complete 3-screen navigation flow with sheets, test your skills, and share your week.",
        shift: "Appreciate how state-driven navigation makes deep linking and popping to root effortless.",
        details: [
          "Connect a list screen to detail pages and settings modals."
        ],
        kotlinCode: `// Android Navigation Compose flow`,
        swiftCode: `// SwiftUI NavigationStack flow`
      }
    ],
    concepts: [
      {
        heading: "1. `List` & `ForEach` vs. Jetpack Compose `LazyColumn`",
        shift: "SwiftUI's `List` provides built-in system styling, swipe actions, and pull-to-refresh out of the box.",
        details: [
          "Models must conform to `Identifiable` for stable row diffing."
        ],
        kotlinCode: `LazyColumn { items(tasks) { Text(it.name) } }`,
        swiftCode: `List(tasks) { task in Text(task.name) }`
      },
      {
        heading: "2. Value-Driven Navigation with `NavigationStack`",
        shift: "The entire backstack is a mutable array of `Hashable` routes—pop to root is simply `path.removeAll()`.",
        details: [
          "Register destination builders with `.navigationDestination(for:)`."
        ],
        kotlinCode: `navController.popBackStack(Home, inclusive = false)`,
        swiftCode: `path.removeAll()`
      }
    ],
    quiz: [
      {
        question: "1. How do you pop all screens in a `NavigationStack(path: $path)` back to the root?",
        options: [
          "Call `path.removeAll()`",
          "Call `finish()`",
          "Restart the app",
          "Pop each screen with a loop"
        ],
        correctIndex: 0,
        explanation: "Because `path` is an array of routes, calling `path.removeAll()` empties the backstack and returns to the root."
      },
      {
        question: "2. What protocol must your models conform to when displayed in a `List(items)` without specifying an explicit `id:` parameter?",
        options: ["`Identifiable`", "`Hashable`", "`Codable`", "`Equatable`"],
        correctIndex: 0,
        explanation: "Conforming to `Identifiable` provides a stable `id` property that SwiftUI uses to track rows."
      },
      {
        question: "3. How do you configure a SwiftUI `.sheet` to snap to half height like an Android bottom sheet?",
        options: [
          "Attach `.presentationDetents([.medium, .large])` inside the sheet content",
          "Set `.frame(height: 300)`",
          "Use a `ZStack`",
          "Use `fullScreenCover`"
        ],
        correctIndex: 0,
        explanation: "`.presentationDetents([.medium, .large])` enables half-screen and full-screen snap points."
      },
      {
        question: "4. What modifier adds native pull-to-refresh to a SwiftUI `List`?",
        options: [
          "`.refreshable { await reload() }`",
          "`.pullToRefresh()`",
          "`.swipeDown()`",
          "`.onRefresh()`"
        ],
        correctIndex: 0,
        explanation: "`.refreshable` automatically shows a native iOS refresh spinner and awaits your async closure."
      },
      {
        question: "5. What does the `ScenePhase.background` state signify in a SwiftUI app?",
        options: [
          "The app is not visible on screen (similar to `ON_STOP` in Android)",
          "The app is playing background audio",
          "The background color is active",
          "The app crashed"
        ],
        correctIndex: 0,
        explanation: "`.background` indicates the app is no longer visible to the user."
      },
      {
        question: "6. How does SwiftUI's `ForEach` achieve item identity when items do not conform to `Identifiable`?",
        options: [
          "It refuses to compile",
          "By specifying an explicit keypath to a unique property, such as `ForEach(items, id: \\.self)` or `id: \\.uuid`",
          "By assigning random UUIDs on every render",
          "By wrapping items in an NSArray"
        ],
        correctIndex: 1,
        explanation: "If a type does not conform to `Identifiable`, you can pass a keypath using `id: \\.propertyName` where the property conforms to `Hashable`."
      },
      {
        question: "7. What is the modern approach to navigating to a new screen when a list item is tapped in SwiftUI?",
        options: [
          "Calling `startActivity(Intent(...))`",
          "Wrapping the row content in `NavigationLink(value: item)` and attaching `.navigationDestination(for: ItemType.self)`",
          "Using storyboards and segues",
          "Presenting a modal alert"
        ],
        correctIndex: 1,
        explanation: "Value-based navigation decouples the triggering UI (`NavigationLink(value:)`) from destination view construction (`.navigationDestination(for:)`)."
      },
      {
        question: "8. How do you implement swipe-to-delete or custom row actions on a SwiftUI `List`?",
        options: [
          "Implement `ItemTouchHelper.SimpleCallback`",
          "Use the `.swipeActions` modifier on the row view or `.onDelete(perform:)` on the `ForEach`",
          "Add a pan gesture recognizer manually",
          "Override `tableView(_:commit:forRowAt:)`"
        ],
        correctIndex: 1,
        explanation: "SwiftUI provides declarative swipe actions via `.swipeActions(edge: .trailing)` or `.onDelete(perform:)` on collections."
      },
      {
        question: "9. How do you present a full-screen modal in SwiftUI (similar to opening a full Activity on Android without backstack push)?",
        options: [
          "`.sheet(isPresented:)`",
          "`.fullScreenCover(isPresented:)`",
          "`.modalOverlay()`",
          "`.window()`"
        ],
        correctIndex: 1,
        explanation: "`.fullScreenCover(isPresented:)` presents a modal covering the entire screen, including navigation bars and tab bars."
      },
      {
        question: "10. In MVVM architecture with SwiftUI, how should user actions (like tapping a delete button) be communicated?",
        options: [
          "The View calls a method on the ViewModel (e.g., `viewModel.deleteItem(id)`), which mutates its observable state",
          "The View directly modifies the database table",
          "The ViewModel imports `SwiftUI` and manipulates the view hierarchy",
          "The View sends an IPC message to the operating system"
        ],
        correctIndex: 0,
        explanation: "In clean unidirectional MVVM, Views observe state and invoke intent methods on the ViewModel, which handles business logic and updates its state."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 6 Navigation Lab: (1) Conform `Route` to `Hashable`, (2) Bind `NavigationStack(path: $path)`, and (3) Register `.navigationDestination(for: Route.self)`.",
      starterCode: `enum Route {
    case detail(Int)
}

struct MainRouter: View {
    @State private var path: [Route] = []

    var body: some View {
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
    linkedinPost: `Week 6 of Android -> iOS Before New Year: Navigation, Lazy Lists & App Lifecycle! 🧭📱

How do LazyColumn, NavHost, and Activity Lifecycle map to SwiftUI?

1️⃣ LazyColumn -> List & Identifiable
SwiftUI's List handles row recycling, separators, and swipe-to-delete (.swipeActions) in just a few lines.

2️⃣ NavHost -> NavigationStack(path: $path)
The entire navigation backstack is just an array of route enums! Want to pop to root? Call 'path.removeAll()'.

3️⃣ ModalBottomSheet -> .sheet + .presentationDetents([.medium, .large])
Declarative bottom sheets with native iOS gesture physics.

🔗 GitHub: https://github.com/sudhakar-r08/ios-for-android-devs
🌐 Tutorial: https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #SwiftUI #JetpackCompose #MobileArchitecture`,
    linkedinArticle: `# Week 6: NavigationStack, Lazy Lists, and Lifecycle in SwiftUI

In Week 6, I tackled multi-screen navigation and list performance in SwiftUI...`
  }
];
