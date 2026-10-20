const ROSETTA_ITEMS = [
  {
    category: "Language & Memory",
    concept: "Data Models",
    android: "data class User(val id: String)",
    ios: "struct User: Equatable, Codable { let id: String }",
    shift: "Kotlin data classes are heap reference types. Swift structs are true value types copied on assignment."
  },
  {
    category: "Language & Memory",
    concept: "Memory Management",
    android: "JVM / ART Tracing Garbage Collector",
    ios: "ARC (Automatic Reference Counting)",
    shift: "ARC frees class instances deterministically at refCount == 0. Break cycles with `weak` or `unowned`."
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
    category: "UI Framework",
    concept: "Declarative View Definition",
    android: "@Composable fun ProfileCard()",
    ios: "struct ProfileCard: View { var body: some View }",
    shift: "Compose uses functions; SwiftUI uses lightweight `View` structs whose `body` property returns an opaque type."
  },
  {
    category: "UI Framework",
    concept: "Row / Column / Box Layouts",
    android: "Row / Column / Box",
    ios: "HStack / VStack / ZStack",
    shift: "Both use a 3-step layout pass (parent proposes size -> child chooses size -> parent places child)."
  },
  {
    category: "State & Architecture",
    concept: "Local Ephemeral UI State",
    android: "var count by remember { mutableIntStateOf(0) }",
    ios: "@State private var count = 0",
    shift: "`@State` stores value outside the struct so SwiftUI can recreate the View struct without losing state."
  },
  {
    category: "State & Architecture",
    concept: "Two-Way Child State Hoisting",
    android: "value: String, onValueChange: (String) -> Unit",
    ios: "@Binding var text: String ($text)",
    shift: "SwiftUI passes a two-way `@Binding` projection (`$text`) or explicit closure callbacks."
  },
  {
    category: "State & Architecture",
    concept: "ViewModel & Observation",
    android: "class Vm : ViewModel() + StateFlow",
    ios: "@Observable @MainActor final class Vm",
    shift: "Swift 5.9+ `@Observable` tracks exactly which properties a View reads—no manual `collectAsStateWithLifecycle()` needed."
  },
  {
    category: "Concurrency",
    concept: "Async Functions & Dispatchers",
    android: "suspend fun fetch() + Dispatchers.Main",
    ios: "func fetch() async throws + @MainActor",
    shift: "Swift 6 checks thread/actor isolation at compile time via `@MainActor`, `actor`, and `Sendable`."
  },
  {
    category: "Data & Networking",
    concept: "HTTP & JSON Serialization",
    android: "Retrofit + OkHttp + Kotlinx Serialization",
    ios: "URLSession.shared.data(from:) + Codable",
    shift: "First-party `URLSession` + compiler-synthesized `Codable` handles 95% of REST networking without third-party libs."
  },
  {
    category: "Data & Networking",
    concept: "Local Database & Preferences",
    android: "Room (@Entity, @Dao) & DataStore",
    ios: "SwiftData (@Model, @Query) & UserDefaults / Keychain",
    shift: "SwiftData integrates directly into SwiftUI views via `@Query`. Store tokens in Keychain, never UserDefaults."
  }
];

const WEEKS_DATA = [
  {
    week: 1,
    dates: "Oct 20 – Oct 26",
    title: "Swift Fundamentals & Memory Model",
    subtitle: "Why 'Writing Kotlin in Swift Syntax' Will Bite You: Value Types (`struct`), ARC vs. JVM GC, `guard let`, and Enums.",
    androidAnchor: "Kotlin `data class`, JVM Garbage Collector, Elvis `?:`, `sealed interface`",
    iosAnchor: "Swift `struct` (Copy-on-Write), ARC (`weak`/`unowned`), `guard let`, `enum` with Associated Values",
    hasArcSimulator: true,
    concepts: [
      {
        heading: "1. Value Types (`struct`) vs Reference Types (`class`)",
        shift: "In Kotlin, `data class` is a heap-allocated reference type. In Swift, `struct` is a true VALUE type copied on assignment—and `let` freezes the entire struct deeply!",
        kotlinCode: `// Kotlin: Heap Reference Type
data class UserProfile(var followerCount: Int)

val profile = UserProfile(followerCount = 100)
val copy = profile // Copies the pointer!
copy.followerCount = 101

println(profile.followerCount) // 101 (Mutated!)
profile.followerCount = 102    // Legal in Kotlin!`,
        swiftCode: `// Swift: Stack/Inline Value Type
struct UserProfile {
    var followerCount: Int
}

let profile = UserProfile(followerCount: 100)
var copy = profile // Creates an independent VALUE copy!
copy.followerCount = 101

print(profile.followerCount) // 100 (Untouched!)
// profile.followerCount = 102 // ❌ Compile Error: 'profile' is a 'let' constant`
      },
      {
        heading: "2. Memory Management: ARC vs. Tracing Garbage Collection",
        shift: "Android's ART uses tracing GC that collects isolated reference cycles automatically. iOS uses compile-time Automatic Reference Counting (ARC): objects deallocate deterministically at refCount == 0, so strong cycles (`A <-> B`) leak forever unless broken with `weak`.",
        kotlinCode: `// Kotlin: GC collects unreachable cycles
class Playlist { var song: Song? = null }
class Song { var playlist: Playlist? = null }

fun play() {
    val p = Playlist()
    val s = Song()
    p.song = s
    s.playlist = p
} // Eligible for GC once play() exits`,
        swiftCode: `// Swift: Use 'weak' on child/back-references!
class Playlist {
    var song: Song?
    deinit { print("Playlist freed!") }
}
class Song {
    weak var playlist: Playlist? // 👈 Does NOT increment refCount!
    deinit { print("Song freed!") }
}`
      },
      {
        heading: "3. Optionals & `guard let` vs `if let`",
        shift: "With `if let`, the unwrapped variable only exists inside the `{}` block. With `guard let`, the compiler forces the `else` block to `return`/`throw`, keeping the unwrapped variable alive for the rest of the function.",
        kotlinCode: `fun parseDeepLink(url: String?): String {
    val rawUrl = url?.takeIf { it.isNotEmpty() }
        ?: return "Invalid link"
    return "Routing to: $rawUrl"
}`,
        swiftCode: `func parseDeepLink(url: String?) -> String {
    guard let rawUrl = url, !rawUrl.isEmpty else {
        return "Invalid link"
    }
    // rawUrl is non-optional String for the rest of the function!
    return "Routing to: \\(rawUrl)"
}`
      },
      {
        heading: "4. Enums with Associated Values (Kotlin `sealed interface`)",
        shift: "Swift `enum`s natively hold dynamic associated values per case without heap-allocating subclasses, and `switch` must be 100% exhaustive.",
        kotlinCode: `sealed interface AuthState {
    data object LoggedOut : AuthState
    data class LoggedIn(val id: String, val vip: Boolean) : AuthState
}`,
        swiftCode: `enum AuthState {
    case loggedOut
    case loggedIn(id: String, vip: Bool)
}

func render(_ state: AuthState) {
    switch state {
    case .loggedOut: print("Login")
    case .loggedIn(let id, true): print("VIP \\(id)")
    case .loggedIn(let id, false): print("User \\(id)")
    }
}`
      }
    ],
    quiz: [
      {
        question: "1. Given `struct Ticket { var seat: String }` and `let t1 = Ticket(seat: \"12A\")`, what happens when you run `var t2 = t1; t2.seat = \"99Z\"`?",
        options: [
          "Compiler error on `var t2 = t1` because `t1` is a `let` constant",
          "`t1.seat` stays \"12A\" and `t2.seat` becomes \"99Z\" because `struct` copies the value",
          "Both `t1.seat` and `t2.seat` become \"99Z\" because they share the same reference",
          "Runtime crash due to mutating an immutable reference"
        ],
        correctIndex: 1,
        explanation: "Correct! Because `Ticket` is a `struct` (value type), `var t2 = t1` creates a brand-new mutable copy. `t1` remains frozen at \"12A\" while `t2.seat` mutates to \"99Z\"."
      },
      {
        question: "2. Why must a `weak` reference in Swift always be declared as an Optional `var` (e.g., `weak var delegate: MyDelegate?`)?",
        options: [
          "Because Swift does not allow `let` inside classes",
          "Because when the referenced object's retain count hits 0 and it deallocates, ARC automatically mutates the weak property to `nil`",
          "Because weak references are stored on the disk cache",
          "It is optional only in UIKit, not in SwiftUI"
        ],
        correctIndex: 1,
        explanation: "Spot on! Zeroing weak references prevent dangling pointers: the instant the target deallocates, ARC sets the property to `nil`, which requires it to be mutable (`var`) and nullable (`?`)."
      },
      {
        question: "3. Why do senior iOS engineers avoid using `default:` when switching over a custom `enum`?",
        options: [
          "`default:` is deprecated in Swift 6",
          "`default:` causes a retain cycle in closures",
          "Omitting `default:` ensures the compiler flags every `switch` statement if a new enum case is added in the future",
          "`default:` is slower at runtime"
        ],
        correctIndex: 2,
        explanation: "Exactly! Just like exhaustive `when` in Kotlin, handling every enum case explicitly guarantees compile-time safety when new states are added later."
      }
    ],
    codeChallenge: {
      instructions: "Fix the 3 TODOs in the Swift code below so that: (1) `ShoppingCart.addItem` is marked `mutating`, (2) `DownloadTask.manager` breaks the retain cycle with `weak`, and (3) `formatUserBadge` uses `guard let`.",
      starterCode: `struct ShoppingCart {
    var items: [String]
    // TODO 1: Add 'mutating' before func
    func addItem(_ item: String) {
        items.append(item)
    }
}

class DownloadTask {
    // TODO 2: Add 'weak' to break the retain cycle
    var manager: AnyObject?
}

func formatUserBadge(username: String?) -> String {
    // TODO 3: Use 'guard let' to unwrap username
    return "TODO"
}`,
      solutionCode: `struct ShoppingCart {
    var items: [String]
    mutating func addItem(_ item: String) {
        items.append(item)
    }
}

class DownloadTask {
    weak var manager: AnyObject?
}

func formatUserBadge(username: String?) -> String {
    guard let username, !username.isEmpty else {
        return "Anonymous"
    }
    return "@\\(username)"
}`,
      requiredTokens: ["mutating func", "weak var", "guard let"]
    },
    linkedinPost: `I’m an Android developer, and for the next 10 weeks before New Year’s, I’m learning modern iOS development from the ground up—and documenting every architectural difference in public. 📱🚀

When you first look at Kotlin and Swift side-by-side, they look 80% identical. Because of that, it’s dangerously easy for an Android engineer to write "Kotlin with Swift syntax."

In Week 1, I went under the hood of Swift’s type system and memory model. Here are the 4 biggest mental shifts:

1️⃣ struct != Kotlin’s data class (True Value Types & Copy-on-Write)
2️⃣ No Garbage Collector — Welcome to Deterministic ARC & Retain Cycles
3️⃣ Swift Enums = Kotlin sealed interface (as a Value Type!)
4️⃣ The "Golden Path" with compiler-enforced guard let

📖 Full interactive tutorial & runnable Swift labs:
🔗 https://github.com/sudhakar-r08/ios-for-android-devs

#AndroidDev #iOSDev #Kotlin #Swift #MobileEngineering #SwiftUI #JetpackCompose`
  },
  {
    week: 2,
    dates: "Oct 27 – Nov 02",
    title: "Protocols, Generics & Typed Error Handling",
    subtitle: "Protocol-Oriented Programming (`protocol` vs Kotlin `interface`), `associatedtype`, Extensions, and `do / try / catch`.",
    androidAnchor: "Kotlin `interface`, Generics `<T>`, Extension Functions, Unchecked Exceptions / `Result<T>`",
    iosAnchor: "Swift `protocol`, `associatedtype`, `some` (Opaque) vs `any` (Existential), Typed `throws`",
    concepts: [
      {
        heading: "1. Protocols & Retroactive Conformance (`extension`)",
        shift: "In Swift, even built-in value types (`Int`, `String`, `Array`) conform to protocols, and you can make any existing type conform to a new protocol retroactively using an `extension`!",
        kotlinCode: `interface Identifiable {
    val id: String
}
// In Kotlin, you cannot make String implement Identifiable
// outside its declaration.`,
        swiftCode: `protocol Identifiable {
    var id: String { get }
}
// Retroactive modeling in Swift:
extension String: Identifiable {
    var id: String { self }
}`
      },
      {
        heading: "2. Generics in Protocols (`associatedtype` & `some` vs `any`)",
        shift: "Kotlin interfaces use `<T>` (`interface Repository<T>`). Swift protocols use `associatedtype Item`. Use `some Repository` (opaque static dispatch—central to SwiftUI!) over `any Repository` (boxed existential).",
        kotlinCode: `interface Repository<T> {
    suspend fun fetchAll(): List<T>
}`,
        swiftCode: `protocol Repository {
    associatedtype Item
    func fetchAll() async -> [Item]
}
// 'some' gives compile-time static dispatch performance!
func makeRepo() -> some Repository { ... }`
      },
      {
        heading: "3. Checked Error Handling (`throws`, `try`, `try?`)",
        shift: "Kotlin has unchecked exceptions (anyone can throw without declaring it). Swift uses explicit, zero-cost `throws` signatures—if a function can fail, the compiler forces callers to use `try`, `try?`, or `do/catch`.",
        kotlinCode: `// Kotlin: Unchecked exceptions or runCatching
val user = runCatching { api.getUser(id) }.getOrNull()`,
        swiftCode: `enum ApiError: Error { case unauthorized, network }

func getUser(id: String) throws(ApiError) -> User { ... }

// Convert error to Optional nil with 'try?'
let user = try? getUser(id: "42")`
      }
    ],
    quiz: [
      {
        question: "What does `var body: some View` mean in SwiftUI?",
        options: [
          "It returns a nullable View",
          "It returns an Opaque Type: a specific concrete type conforming to `View` known to the compiler, enabling fast static dispatch without exposing the nested generic type signature",
          "It returns a random View at runtime",
          "It allocates the View on the JVM heap"
        ],
        correctIndex: 1,
        explanation: "Exactly! `some View` is an opaque return type introduced so SwiftUI can statically optimize complex nested view trees without forcing you to write `VStack<TupleView<(Text, Button<Text>)>>`."
      }
    ],
    codeChallenge: {
      instructions: "Define a `Cacheable` protocol with a read-only `cacheKey: String` property and mark `loadFromDisk` with `throws`.",
      starterCode: `// TODO: Declare protocol Cacheable with 'var cacheKey: String { get }'
protocol Cacheable {
    
}

// TODO: Mark this function with 'throws' before '-> String'
func loadFromDisk(key: String) -> String {
    return "data"
}`,
      solutionCode: `protocol Cacheable {
    var cacheKey: String { get }
}

func loadFromDisk(key: String) throws -> String {
    return "data"
}`,
      requiredTokens: ["var cacheKey: String { get }", "throws ->"]
    },
    linkedinPost: `Week 2 of Android -> iOS Before New Year! 🚀
This week I tackled Protocol-Oriented Programming, Opaque Types (some vs any), and Swift's Explicit Error Handling (throws / try?).

Why does every SwiftUI view say 'var body: some View'? And why doesn't Swift use try/catch stack unwinding like Java/Kotlin?
Read the full breakdown & code lab: https://github.com/sudhakar-r08/ios-for-android-devs`
  },
  {
    week: 3,
    dates: "Nov 03 – Nov 09",
    title: "SwiftUI Foundations & Layout Engine",
    subtitle: "Mapping Jetpack Compose `@Composable` & `Modifier` to SwiftUI `View` Structs & ViewModifiers.",
    androidAnchor: "`@Composable`, `Column`/`Row`/`Box`, `Modifier.padding().background()`",
    iosAnchor: "`View` protocol, `VStack`/`HStack`/`ZStack`, ViewModifier order & 3-Step Layout negotiation",
    concepts: [
      {
        heading: "1. `@Composable` Functions vs `View` Structs",
        shift: "In Jetpack Compose, UI components are `@Composable` functions returning `Unit`. In SwiftUI, views are ultra-lightweight value-type `struct`s conforming to `View`.",
        kotlinCode: `@Composable
fun GreetingBanner(name: String) {
    Column(
        modifier = Modifier
            .padding(16.dp)
            .background(Color.Blue)
    ) {
        Text("Hello, $name")
    }
}`,
        swiftCode: `struct GreetingBanner: View {
    let name: String

    var body: some View {
        VStack {
            Text("Hello, \\(name)")
        }
        .padding(16)
        .background(.blue)
    }
}`
      },
      {
        heading: "2. Why Modifier Order Matters in Both Compose & SwiftUI",
        shift: "Every SwiftUI modifier wraps the previous view in a new modified View struct! Applying `.padding().background(.blue)` pads first and paints the whole padded box blue; reversing them paints only the text bounds.",
        kotlinCode: `// Compose: Sequential modifier chain
Modifier
    .padding(16.dp)
    .background(Color.Blue)`,
        swiftCode: `// SwiftUI: Each modifier wraps the view before it!
Text("Pro Badge")
    .padding(12)
    .background(.blue)
    .clipShape(Capsule())`
      }
    ],
    quiz: [
      {
        question: "In SwiftUI, what happens when you chain `.background(.red).padding(20)` on a `Text` view?",
        options: [
          "The red background includes the 20pt padding area",
          "The red background wraps tightly around the Text, and 20pt of transparent padding is added outside the red background",
          "Modifiers in SwiftUI are order-independent like CSS properties",
          "It throws a layout exception"
        ],
        correctIndex: 1,
        explanation: "Correct! Each SwiftUI modifier wraps the view returned by the previous modifier. To include the padding inside the red background, put `.padding(20)` BEFORE `.background(.red)`."
      }
    ],
    codeChallenge: {
      instructions: "Complete the SwiftUI `ProfileHeader` struct so it conforms to `View` and arranges two `Text` views vertically inside a `VStack`.",
      starterCode: `// TODO: Conform ProfileHeader to View and use a VStack inside var body: some View
struct ProfileHeader {
    let username: String
}`,
      solutionCode: `struct ProfileHeader: View {
    let username: String
    var body: some View {
        VStack {
            Text(username)
        }
    }
}`,
      requiredTokens: [": View", "var body: some View", "VStack"]
    },
    linkedinPost: `Week 3: Jetpack Compose vs SwiftUI Layout Engine! 🎨
If you know Compose Modifiers, you already understand 80% of SwiftUI's layout system—because both use a 3-step layout negotiation pass and order-sensitive modifier wrapping.
Full comparison: https://github.com/sudhakar-r08/ios-for-android-devs`
  },
  {
    week: 4,
    dates: "Nov 10 – Nov 16",
    title: "State Management & Observation (`@Observable`)",
    subtitle: "From `remember`, `StateFlow`, and `ViewModel` to `@State`, `@Binding`, and the `@Observable` Macro.",
    androidAnchor: "`remember { mutableStateOf() }`, `StateFlow`, `collectAsStateWithLifecycle()`",
    iosAnchor: "`@State`, `@Binding` (`$`), `@Observable`, `@Bindable`, `@Environment`",
    concepts: [
      {
        heading: "1. Local State (`@State`) & Two-Way Binding (`@Binding`)",
        shift: "In Compose, state hoisting passes `(value, onValueChange)`. In SwiftUI, `@State` owns local value state, and prefixing `$` passes a two-way `@Binding` reference to child components.",
        kotlinCode: `@Composable
fun CounterScreen() {
    var count by remember { mutableIntStateOf(0) }
    Button(onClick = { count++ }) {
        Text("Count: $count")
    }
}`,
        swiftCode: `struct CounterScreen: View {
    @State private var count = 0

    var body: some View {
        Button("Count: \\(count)") {
            count += 1
        }
    }
}`
      },
      {
        heading: "2. Modern MVVM with `@Observable` (iOS 17+ / Swift 6)",
        shift: "Forget old `ObservableObject` and `@Published`! Swift's `@Observable` macro automatically tracks field access inside `body`, recomputing only views that read a changed property.",
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
      }
    ],
    quiz: [
      {
        question: "What does the `$` prefix (e.g., `TextField(\"Name\", text: $username)`) do on a `@State` property in SwiftUI?",
        options: [
          "String interpolation like Kotlin",
          "Projects a two-way `Binding<Value>` so the child control can both read and write the parent's `@State`",
          "Forces garbage collection",
          "Marks the variable as static"
        ],
        correctIndex: 1,
        explanation: "Exactly! `$username` accesses the `projectedValue` of the `@State` property wrapper, yielding a `Binding<String>` for two-way synchronization."
      }
    ],
    codeChallenge: {
      instructions: "Annotate `CounterViewModel` with `@Observable` and declare a private `@State` property in `CounterView`.",
      starterCode: `// TODO: Add @Observable macro and @State property wrapper
class CounterViewModel {
    var count = 0
}
struct CounterView: View {
    var vm = CounterViewModel()
    var body: some View { Text("\\(vm.count)") }
}`,
      solutionCode: `@Observable
class CounterViewModel {
    var count = 0
}
struct CounterView: View {
    @State private var vm = CounterViewModel()
    var body: some View { Text("\\(vm.count)") }
}`,
      requiredTokens: ["@Observable", "@State"]
    },
    linkedinPost: `Week 4: State Management in SwiftUI vs Jetpack Compose! ⚡
How @State, @Binding ($), and Swift's @Observable macro compare to remember, StateFlow, and collectAsStateWithLifecycle().
Deep dive: https://github.com/sudhakar-r08/ios-for-android-devs`
  },
  {
    week: 5,
    dates: "Nov 17 – Nov 23",
    title: "Swift Concurrency, Actors & Sendable",
    subtitle: "Kotlin Coroutines & Dispatchers vs. Swift 6 `async`/`await`, `@MainActor`, and Compile-Time Race Safety.",
    androidAnchor: "`suspend fun`, `viewModelScope.launch`, `Dispatchers.IO`/`Main`, `Mutex`",
    iosAnchor: "`async`/`await`, `Task {}`, `@MainActor`, `actor`, `Sendable`, `.task {}` modifier",
    concepts: [
      {
        heading: "1. Coroutines vs `async / await` & `.task` Modifier",
        shift: "In Kotlin, calling a `suspend` function happens silently once inside a coroutine. In Swift, every suspension point must be marked with `await`. And SwiftUI's `.task {}` modifier automatically launches on appear and cancels on disappear!",
        kotlinCode: `LaunchedEffect(Unit) {
    val profile = api.fetchProfile() // suspend call
    state = profile
}`,
        swiftCode: `.task {
    // Automatically cancelled when the View disappears!
    state = try? await api.fetchProfile()
}`
      },
      {
        heading: "2. `actor` vs Kotlin `Mutex` & `@MainActor`",
        shift: "Swift `actor` is a first-class reference type that serializes access to its mutable state at compile time, eliminating data races without manual locks.",
        kotlinCode: `class TokenCache {
    private val mutex = Mutex()
    private var token: String? = null
    suspend fun update(t: String) = mutex.withLock { token = t }
}`,
        swiftCode: `actor TokenCache {
    private var token: String?
    func update(_ t: String) { token = t } // Thread-safe by compiler guarantee!
}`
      }
    ],
    quiz: [
      {
        question: "What happens to an async network call running inside SwiftUI's `.task { ... }` modifier if the user navigates back before it finishes?",
        options: [
          "It leaks the View and crashes",
          "SwiftUI automatically cancels the cooperative `Task` when the view disappears",
          "It blocks the main thread",
          "It restarts from the beginning"
        ],
        correctIndex: 1,
        explanation: "Correct! `.task` ties the lifetime of the async `Task` directly to the SwiftUI view's lifecycle, cancelling it automatically on disappear."
      }
    ],
    codeChallenge: {
      instructions: "Define an `actor` named `ScoreTracker` and mark `fetchScore` as `async`.",
      starterCode: `// TODO: Change class to actor and mark fetchScore() as async
class ScoreTracker {
    var score = 0
    func fetchScore() -> Int { score }
}`,
      solutionCode: `actor ScoreTracker {
    var score = 0
    func fetchScore() async -> Int { score }
}`,
      requiredTokens: ["actor ScoreTracker", "async"]
    },
    linkedinPost: `Week 5: Kotlin Coroutines vs Swift 6 Concurrency & Actors! 🧵
Why Swift 6 rejects data races at compile time using @MainActor, actor, and Sendable.
Code labs: https://github.com/sudhakar-r08/ios-for-android-devs`
  },
  {
    week: 6,
    dates: "Nov 24 – Nov 30",
    title: "Navigation, Lists & App Lifecycle",
    subtitle: "`LazyColumn` & `NavHost` vs. `List`, `NavigationStack`, and `ScenePhase`.",
    androidAnchor: "`LazyColumn`, `NavHost` Type-Safe Routes, `Activity` / `LifecycleEventObserver`",
    iosAnchor: "`List` / `LazyVStack`, `NavigationStack` + `.navigationDestination(for:)`, `@Environment(\\.scenePhase)`",
    concepts: [
      {
        heading: "1. Type-Safe Navigation (`NavigationStack` vs `NavHost`)",
        shift: "Just like Navigation Compose 2.8+ uses `@Serializable` route objects, SwiftUI's `NavigationStack` binds to a `NavigationPath` or typed `Hashable` route enum via `.navigationDestination(for:)`.",
        kotlinCode: `@Serializable data class DetailRoute(val itemId: Int)
navController.navigate(DetailRoute(itemId = 42))`,
        swiftCode: `enum Route: Hashable { case detail(itemId: Int) }

NavigationStack(path: $path) {
    List(items) { item in
        NavigationLink(value: Route.detail(itemId: item.id)) {
            Text(item.title)
        }
    }
    .navigationDestination(for: Route.self) { route in
        DetailScreen(route: route)
    }
}`
      }
    ],
    quiz: [
      {
        question: "How do you observe whether an iOS SwiftUI app moves to the background or foreground (similar to `ON_START` / `ON_STOP` in Android)?",
        options: [
          "Override `onPause()` inside every View struct",
          "Read `@Environment(\\.scenePhase)` and use `.onChange(of: scenePhase)`",
          "Register a BroadcastReceiver in AndroidManifest.xml",
          "Poll a timer every 100ms"
        ],
        correctIndex: 1,
        explanation: "Spot on! `@Environment(\\.scenePhase)` emits `.active`, `.inactive`, and `.background` transitions cleanly in SwiftUI."
      }
    ],
    codeChallenge: {
      instructions: "Create a `NavigationStack` containing a `List`.",
      starterCode: `// TODO: Wrap List inside NavigationStack
struct HomeView: View {
    var body: some View {
        List { Text("Row 1") }
    }
}`,
      solutionCode: `struct HomeView: View {
    var body: some View {
        NavigationStack {
            List { Text("Row 1") }
        }
    }
}`,
      requiredTokens: ["NavigationStack", "List"]
    },
    linkedinPost: `Week 6: NavigationStack, Lists & App Lifecycle in SwiftUI vs Compose! 🧭
Comparing NavHost, LazyColumn, and Activity Lifecycle with SwiftUI's value-driven NavigationStack and ScenePhase.
Repo: https://github.com/sudhakar-r08/ios-for-android-devs`
  },
  {
    week: 7,
    dates: "Dec 01 – Dec 07",
    title: "Networking (`URLSession`), `Codable` & Dependency Injection",
    subtitle: "Replacing Retrofit, OkHttp, Moshi, and Hilt with First-Party Swift APIs.",
    androidAnchor: "Retrofit + OkHttp + Kotlinx Serialization + Hilt `@Inject`",
    iosAnchor: "`URLSession.shared.data(from:)`, `Codable` (`CodingKeys`), Protocol + Initializer DI",
    concepts: [
      {
        heading: "1. `URLSession` + `Codable` vs Retrofit + Serialization",
        shift: "On iOS, you rarely need a third-party HTTP library. `URLSession` natively supports `async/await`, and conforming a `struct` to `Codable` auto-generates JSON parsing at compile time!",
        kotlinCode: `@Serializable
data class RepoDto(@SerialName("full_name") val fullName: String)

interface GitHubApi {
    @GET("users/{u}/repos")
    suspend fun listRepos(@Path("u") user: String): List<RepoDto>
}`,
        swiftCode: `struct RepoDto: Codable {
    let fullName: String
    enum CodingKeys: String, CodingKey {
        case fullName = "full_name"
    }
}

func listRepos(user: String) async throws -> [RepoDto] {
    let url = URL(string: "https://api.github.com/users/\\(user)/repos")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode([RepoDto].self, from: data)
}`
      }
    ],
    quiz: [
      {
        question: "Why do most modern iOS codebases use constructor/protocol injection + `@Environment` instead of annotation-processing DI frameworks like Dagger/Hilt?",
        options: [
          "Swift doesn't support protocols",
          "In SwiftUI, you instantiate your own Views and ViewModels directly (no system-instantiated Activity requiring field injection)",
          "Apple bans Dependency Injection on the App Store",
          "Classes cannot have initializers in Swift"
        ],
        correctIndex: 1,
        explanation: "Exactly! On Android, the OS instantiates `Activity` via reflection, forcing complex DI containers. In SwiftUI, you control the full initialization graph from `@main App` down."
      }
    ],
    codeChallenge: {
      instructions: "Conform `UserResponse` to `Codable` and decode it with `JSONDecoder()`.",
      starterCode: `// TODO: Conform UserResponse to Codable and use JSONDecoder
struct UserResponse {
    let id: Int
}`,
      solutionCode: `struct UserResponse: Codable {
    let id: Int
}
let decoder = JSONDecoder()`,
      requiredTokens: ["Codable", "JSONDecoder"]
    },
    linkedinPost: `Week 7: Why iOS Developers Don't Need Retrofit or Hilt! 🌐
How URLSession + Codable + Protocol DI replace 4 major third-party libraries from our Android stack.
Read more: https://github.com/sudhakar-r08/ios-for-android-devs`
  },
  {
    week: 8,
    dates: "Dec 08 – Dec 14",
    title: "Local Persistence (`SwiftData`) & Keychain Security",
    subtitle: "Mapping Room Database, DataStore, and EncryptedStorage to `@Model`, `@Query`, `@AppStorage`, and Keychain.",
    androidAnchor: "Room (`@Entity`, `@Dao`), Preferences DataStore, Keystore",
    iosAnchor: "SwiftData (`@Model`, `@Query`, `ModelContext`), `@AppStorage`, Keychain Services",
    concepts: [
      {
        heading: "1. Room `@Entity` vs SwiftData `@Model` & `@Query`",
        shift: "SwiftData eliminates separate DAO boilerplate for common queries: `@Model` turns a Swift class into a persisted schema, and `@Query` reactive-streams results directly into a SwiftUI View!",
        kotlinCode: `@Entity
data class Note(@PrimaryKey val id: String, val title: String)

@Dao
interface NoteDao {
    @Query("SELECT * FROM Note ORDER BY title")
    fun observeNotes(): Flow<List<Note>>
}`,
        swiftCode: `import SwiftData

@Model
final class Note {
    @Attribute(.unique) var id: String
    var title: String
    init(id: String, title: String) { self.id = id; self.title = title }
}

// Inside a SwiftUI View:
@Query(sort: \\Note.title) private var notes: [Note]`
      }
    ],
    quiz: [
      {
        question: "Where should OAuth access tokens and refresh tokens be stored on iOS?",
        options: [
          "`UserDefaults.standard` / `@AppStorage`",
          "iOS Keychain Services (hardware-backed encrypted storage)",
          "Plaintext JSON file in `Documents`",
          "Inside `Info.plist`"
        ],
        correctIndex: 1,
        explanation: "Correct! `UserDefaults` is an unencrypted plist file (like standard `SharedPreferences`). Sensitive credentials must always go into the iOS Keychain."
      }
    ],
    codeChallenge: {
      instructions: "Mark the `TaskItem` class with `@Model` for SwiftData persistence.",
      starterCode: `// TODO: Add @Model macro above TaskItem
final class TaskItem {
    var title: String
    init(title: String) { self.title = title }
}`,
      solutionCode: `@Model
final class TaskItem {
    var title: String
    init(title: String) { self.title = title }
}`,
      requiredTokens: ["@Model"]
    },
    linkedinPost: `Week 8: Room & DataStore vs SwiftData & Keychain! 💾🔐
How SwiftData's @Model and @Query macros streamline local persistence—and why tokens belong in the Keychain.
Full guide: https://github.com/sudhakar-r08/ios-for-android-devs`
  },
  {
    week: 9,
    dates: "Dec 15 – Dec 21",
    title: "Swift Testing (`@Test`), UIKit Interop & Instruments",
    subtitle: "Modern Swift Testing macros, bridging UIKit (`UIViewRepresentable`), and profiling with Xcode Instruments.",
    androidAnchor: "JUnit 5 + MockK, `AndroidView` (View Interop), Android Studio Profiler",
    iosAnchor: "Swift Testing (`@Test`, `#expect`), `UIViewRepresentable`, Xcode Instruments (Leaks / Time Profiler)",
    concepts: [
      {
        heading: "1. JUnit vs Swift Testing (`@Test` & `#expect`)",
        shift: "Swift's modern `Testing` framework replaces verbose `XCTAssertEqual` calls with clean `@Test` functions and a single `#expect(...)` macro that prints full expression trees on failure.",
        kotlinCode: `@Test
fun \`adding item increases cart count\`() = runTest {
    val cart = ShoppingCart(items = listOf("MacBook"))
    assertEquals(1, cart.items.size)
}`,
        swiftCode: `import Testing

@Test("Adding item increases cart count")
func addItemIncrementsCount() async throws {
    var cart = ShoppingCart(items: ["MacBook"])
    cart.addItem("AirPods")
    #expect(cart.items.count == 2)
}`
      }
    ],
    quiz: [
      {
        question: "Which protocol wraps an existing `UIView` (like `MKMapView` or `WKWebView`) so it can be embedded inside a SwiftUI view hierarchy (just like `AndroidView` in Jetpack Compose)?",
        options: [
          "`UIViewRepresentable`",
          "`ComposableViewAdapter`",
          "`FragmentHost`",
          "`SwiftUIBridge`"
        ],
        correctIndex: 0,
        explanation: "Spot on! `UIViewRepresentable` (and `UIViewControllerRepresentable` for ViewControllers) provides `makeUIView(context:)` and `updateUIView(_:context:)`, mirroring Compose's `AndroidView(factory = ..., update = ...)`."
      }
    ],
    codeChallenge: {
      instructions: "Write a Swift Testing unit test using `@Test` and `#expect`.",
      starterCode: `// TODO: Annotate with @Test and assert using #expect(2 + 2 == 4)
func mathWorks() {
    
}`,
      solutionCode: `@Test
func mathWorks() {
    #expect(2 + 2 == 4)
}`,
      requiredTokens: ["@Test", "#expect"]
    },
    linkedinPost: `Week 9: Swift Testing (@Test & #expect), UIKit Interop & Instruments! 🧪🔍
Comparing JUnit/MockK and Compose's AndroidView with Swift Testing and UIViewRepresentable.
Repo: https://github.com/sudhakar-r08/ios-for-android-devs`
  },
  {
    week: 10,
    dates: "Dec 22 – Dec 31",
    title: "Capstone Production App & App Store Readiness",
    subtitle: "Putting It All Together Before New Year: Clean Architecture, Code Signing, TestFlight & Year-End Retrospective.",
    androidAnchor: "Keystore / Play App Signing, Gradle Flavors, Google Play Internal Track",
    iosAnchor: "Certificates & Provisioning Profiles, Xcode Schemes/XCConfig, App Store Connect & TestFlight",
    concepts: [
      {
        heading: "1. Gradle Build Variants vs Xcode Schemes & `.xcconfig`",
        shift: "Where Android uses `buildTypes` and `productFlavors` in `build.gradle.kts`, iOS combines Build Configurations (`Debug`/`Release`), `.xcconfig` files, and Xcode Schemes.",
        kotlinCode: `// build.gradle.kts
productFlavors {
    create("staging") {
        applicationIdSuffix = ".staging"
    }
}`,
        swiftCode: `// Staging.xcconfig
PRODUCT_BUNDLE_IDENTIFIER = com.sudhakar.app.staging
API_BASE_URL = api-staging.example.com`
      }
    ],
    quiz: [
      {
        question: "What is Apple's official beta distribution platform integrated into App Store Connect (equivalent to Google Play Console's Internal/Closed Testing tracks)?",
        options: [
          "TestFlight",
          "Xcode Cloud",
          "CocoaPods",
          "Swift Playgrounds"
        ],
        correctIndex: 0,
        explanation: "Correct! TestFlight lets you distribute signed builds to internal team members and up to 10,000 external beta testers."
      }
    ],
    codeChallenge: {
      instructions: "Create the `@main` entry point `App` struct for a SwiftUI application.",
      starterCode: `// TODO: Mark with @main and conform to App with a WindowGroup Scene
struct CapstoneApp {
    
}`,
      solutionCode: `@main
struct CapstoneApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}`,
      requiredTokens: ["@main", ": App", "WindowGroup"]
    },
    linkedinPost: `Week 10: We made it before New Year! 🎉📱
From an Android Developer to shipping a full Swift 6 + SwiftUI + SwiftData Capstone App on iOS.
Here is the complete 10-week open-source curriculum, Rosetta Stone, and interactive tutorial website for any Android engineer who wants to learn iOS next:
🔗 https://github.com/sudhakar-r08/ios-for-android-devs`
  }
];

// State Management
let currentWeekNum = 1;
let currentTab = "learn"; // "learn" | "practice" | "linkedin" | "rosetta"
let completedWeeks = JSON.parse(localStorage.getItem("ios_completed_weeks") || "[]");
let arcUseWeak = false;
let arcScopeExited = false;

function saveCompletedWeeks() {
  localStorage.setItem("ios_completed_weeks", JSON.stringify(completedWeeks));
  updateProgressUI();
  renderSidebar();
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
  const pct = Math.round((completedWeeks.length / WEEKS_DATA.length) * 100);
  const textEl = document.getElementById("progress-text");
  const fillEl = document.getElementById("progress-fill");
  if (textEl) textEl.textContent = `${completedWeeks.length}/10 Weeks (${pct}%)`;
  if (fillEl) fillEl.style.width = `${Math.max(pct, 6)}%`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderSidebar() {
  const listEl = document.getElementById("week-nav-list");
  if (!listEl) return;
  listEl.innerHTML = WEEKS_DATA.map(w => {
    const isActive = currentTab !== "rosetta" && w.week === currentWeekNum;
    const isDone = completedWeeks.includes(w.week);
    return `
      <li>
        <button class="week-nav-btn ${isActive ? "active" : ""} ${isDone ? "completed" : ""}" onclick="selectWeek(${w.week})">
          <div class="week-nav-meta">
            <span class="week-num">Week ${w.week} · ${w.dates}</span>
            <span class="week-title">${w.title}</span>
          </div>
          <span class="week-check" title="${isDone ? "Completed" : "In progress"}">${isDone ? "✓" : ""}</span>
        </button>
      </li>
    `;
  }).join("");
}

window.selectWeek = function(weekNum) {
  currentWeekNum = weekNum;
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

window.toggleArcWeak = function(useWeak) {
  arcUseWeak = useWeak;
  renderMainContent();
};

window.toggleArcScope = function(exited) {
  arcScopeExited = exited;
  renderMainContent();
};

window.answerQuiz = function(qIdx, optIdx, correctIdx) {
  const container = document.getElementById(`quiz-q-${qIdx}`);
  if (!container) return;
  const buttons = container.querySelectorAll(".quiz-option");
  buttons.forEach((b, i) => {
    b.classList.remove("correct", "wrong");
    if (i === correctIdx) b.classList.add("correct");
    else if (i === optIdx) b.classList.add("wrong");
  });
  const fb = document.getElementById(`quiz-fb-${qIdx}`);
  if (fb) fb.classList.add("visible");
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
    feedbackEl.innerHTML = `<strong>🎉 All Compiler Checks Passed!</strong> Great job applying <code>${weekObj.codeChallenge.requiredTokens.join("</code>, <code>")}</code>.`;
    if (!completedWeeks.includes(weekNum)) {
      toggleWeekComplete(weekNum);
    }
  } else {
    feedbackEl.style.background = "var(--accent-danger-soft)";
    feedbackEl.style.border = "1px solid var(--accent-danger)";
    feedbackEl.innerHTML = `<strong>⚠️ Almost there!</strong> Make sure your solution includes: <code>${missing.join("</code>, <code>")}</code>.`;
  }
};

window.showChallengeSolution = function(weekNum) {
  const weekObj = WEEKS_DATA.find(w => w.week === weekNum);
  const editor = document.getElementById("challenge-editor");
  if (editor && weekObj) {
    editor.value = weekObj.codeChallenge.solutionCode;
  }
};

function renderArcSimulator() {
  const playlistRc = arcScopeExited
    ? (arcUseWeak ? 0 : 1)
    : (arcUseWeak ? 1 : 2);
  const songRc = arcScopeExited
    ? (arcUseWeak ? 0 : 1)
    : 2;
  const isLeaked = arcScopeExited && !arcUseWeak;
  const isFreed = arcScopeExited && arcUseWeak;

  return `
    <div class="arc-simulator">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
        <div>
          <strong>🔬 Interactive ARC Retain Cycle Simulator</strong>
          <p style="font-size:0.86rem;color:var(--text-secondary);">Toggle between <code>strong</code> and <code>weak var playlist</code> and exit <code>playMusic()</code> to watch ARC reference counts in real time.</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button class="btn ${!arcUseWeak ? "btn-primary" : ""}" onclick="toggleArcWeak(false)">Strong Back-Ref (Default)</button>
          <button class="btn ${arcUseWeak ? "btn-primary" : ""}" onclick="toggleArcWeak(true)"><code>weak var playlist</code></button>
          <button class="btn" onclick="toggleArcScope(${!arcScopeExited})">
            ${arcScopeExited ? "🔄 Reset Inside playMusic()" : "⏭️ Finish playMusic() Scope"}
          </button>
        </div>
      </div>

      <div class="arc-nodes">
        <div class="arc-node ${isLeaked ? "leaked" : ""} ${isFreed ? "freed" : ""}">
          <div style="font-weight:700;">Playlist Instance</div>
          <div style="font-size:0.8rem;color:var(--text-secondary);">var song: Song? (strong)</div>
          <span class="rc-badge">retainCount = ${playlistRc}</span>
          <div style="margin-top:0.4rem;font-size:0.8rem;font-weight:600;color:${isLeaked ? "var(--accent-danger)" : isFreed ? "var(--accent-green)" : "var(--accent-blue)"};">
            ${isLeaked ? "❌ LEAKED IN HEAP!" : isFreed ? "✅ deinit called! Freed" : "Active in memory"}
          </div>
        </div>

        <div style="text-align:center;font-family:var(--font-mono);font-size:0.82rem;">
          <div>Playlist.song ───strong───▶ Song</div>
          <div style="margin-top:0.4rem;color:${arcUseWeak ? "var(--accent-green)" : "var(--accent-danger)"};">
            Playlist ◀──${arcUseWeak ? "weak (rc+0)" : "strong (rc+1)"}── Song.playlist
          </div>
        </div>

        <div class="arc-node ${isLeaked ? "leaked" : ""} ${isFreed ? "freed" : ""}">
          <div style="font-weight:700;">Song Instance</div>
          <div style="font-size:0.8rem;color:var(--text-secondary);">${arcUseWeak ? "weak " : ""}var playlist: Playlist?</div>
          <span class="rc-badge">retainCount = ${songRc}</span>
          <div style="margin-top:0.4rem;font-size:0.8rem;font-weight:600;color:${isLeaked ? "var(--accent-danger)" : isFreed ? "var(--accent-green)" : "var(--accent-blue)"};">
            ${isLeaked ? "❌ LEAKED IN HEAP!" : isFreed ? "✅ deinit called! Freed" : "Active in memory"}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRosettaView() {
  return `
    <div class="section-card">
      <h2>🗺️ The Complete Android ↔ iOS Rosetta Stone</h2>
      <p style="color:var(--text-secondary);margin-bottom:1rem;">
        Filter any Android concept (Kotlin, Compose, Coroutines, Hilt, Room, Retrofit) to immediately see its modern iOS equivalent and architectural mental shift.
      </p>
      <input
        type="search"
        id="rosetta-search-input"
        class="rosetta-search"
        placeholder="Search e.g. 'StateFlow', 'data class', 'Room', 'Retrofit', 'guard', 'ARC'..."
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

function renderMainContent() {
  const container = document.getElementById("main-content");
  if (!container) return;

  const weekObj = WEEKS_DATA.find(w => w.week === currentWeekNum) || WEEKS_DATA[0];
  const isCompleted = completedWeeks.includes(weekObj.week);

  const tabsHtml = `
    <div class="view-tabs">
      <button class="tab-btn ${currentTab === "learn" ? "active" : ""}" onclick="selectTab('learn')">
        📖 1. Concept Deep-Dive
      </button>
      <button class="tab-btn ${currentTab === "practice" ? "active" : ""}" onclick="selectTab('practice')">
        🛠️ 2. Hands-On Lab & Quiz
      </button>
      <button class="tab-btn ${currentTab === "linkedin" ? "active" : ""}" onclick="selectTab('linkedin')">
        ✍️ 3. LinkedIn Article Kit
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
          <h1 style="margin-top:0.55rem;">${weekObj.title}</h1>
          <p>${weekObj.subtitle}</p>
        </div>
        <button class="btn ${isCompleted ? "" : "btn-primary"}" onclick="toggleWeekComplete(${weekObj.week})">
          ${isCompleted ? "✅ Completed (Click to Undo)" : "Mark Week " + weekObj.week + " Complete"}
        </button>
      </div>
      <div class="hero-meta-row">
        <span class="pill pill-kotlin">Android: ${weekObj.androidAnchor}</span>
        <span class="pill pill-swift">iOS: ${weekObj.iosAnchor}</span>
      </div>
    </div>
  `;

  let bodyHtml = "";

  if (currentTab === "learn") {
    bodyHtml = weekObj.concepts.map(c => `
      <div class="section-card">
        <h2>${c.heading}</h2>
        <div class="mental-shift-banner">
          <strong>💡 Key Mental Shift:</strong> ${c.shift}
        </div>
        <div class="code-comparison">
          <div class="code-pane">
            <div class="code-header code-header-kotlin">
              <span>🤖 ANDROID (KOTLIN)</span>
              <button class="copy-btn" onclick="copyText(this, '${encodeURIComponent(c.kotlinCode)}')">Copy</button>
            </div>
            <pre class="code-block"><code>${escapeHtml(c.kotlinCode)}</code></pre>
          </div>
          <div class="code-pane">
            <div class="code-header code-header-swift">
              <span>🍎 iOS (SWIFT 6)</span>
              <button class="copy-btn" onclick="copyText(this, '${encodeURIComponent(c.swiftCode)}')">Copy</button>
            </div>
            <pre class="code-block"><code>${escapeHtml(c.swiftCode)}</code></pre>
          </div>
        </div>
      </div>
    `).join("");

    if (weekObj.hasArcSimulator) {
      bodyHtml += renderArcSimulator();
    }

    bodyHtml += `
      <div style="display:flex;justify-content:space-between;margin-top:1.5rem;">
        <span></span>
        <button class="btn btn-primary" onclick="selectTab('practice')">
          Next: Take Week ${weekObj.week} Interactive Lab & Quiz →
        </button>
      </div>
    `;
  } else if (currentTab === "practice") {
    const quizHtml = weekObj.quiz.map((q, qIdx) => `
      <div id="quiz-q-${qIdx}" style="margin-bottom:1.5rem;">
        <p style="font-weight:600;margin-bottom:0.65rem;">${q.question}</p>
        ${q.options.map((opt, oIdx) => `
          <button class="quiz-option" onclick="answerQuiz(${qIdx}, ${oIdx}, ${q.correctIndex})">
            ${opt}
          </button>
        `).join("")}
        <div id="quiz-fb-${qIdx}" class="feedback-box" style="background:var(--bg-surface-elevated);border-left:4px solid var(--accent-green);">
          ${q.explanation}
        </div>
      </div>
    `).join("");

    bodyHtml = `
      <div class="section-card">
        <h2>🧠 Part 1: Concept Mastery Quiz (Week ${weekObj.week})</h2>
        <p style="color:var(--text-secondary);margin-bottom:1.25rem;">Test your mental model before publishing your weekly LinkedIn article.</p>
        ${quizHtml}
      </div>

      <div class="section-card">
        <h2>💻 Part 2: Interactive Swift Coding Lab</h2>
        <p style="color:var(--text-secondary);margin-bottom:1rem;">${weekObj.codeChallenge.instructions}</p>
        <textarea id="challenge-editor" class="code-editor-input" spellcheck="false">${weekObj.codeChallenge.starterCode}</textarea>
        <div style="display:flex;gap:0.75rem;margin-top:0.85rem;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="verifyCodeChallenge(${weekObj.week})">▶️ Verify Swift Solution</button>
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
            <h2>✍️ Week ${weekObj.week} LinkedIn Post & Article Kit</h2>
            <p style="color:var(--text-secondary);font-size:0.9rem;">Ready to copy and publish to educate fellow Android & mobile developers.</p>
          </div>
          <button class="btn btn-primary" onclick="copyText(this, '${encodeURIComponent(weekObj.linkedinPost)}')">
            📋 Copy LinkedIn Post
          </button>
        </div>
        <div class="linkedin-box">${escapeHtml(weekObj.linkedinPost)}</div>
      </div>
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
