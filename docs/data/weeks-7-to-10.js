// ============================================================================
// WEEKS 7 TO 10: Networking/DI, SwiftData/Keychain, Testing/Interop & Capstone
// ============================================================================

window.WEEKS_7_TO_10 = [
  // ==========================================================================
  // WEEK 7: NETWORKING (URLSession), CODABLE & DEPENDENCY INJECTION
  // ==========================================================================
  {
    week: 7,
    dates: "Dec 01 – Dec 07",
    title: "Networking (`URLSession`), `Codable` & Dependency Injection",
    subtitle: "Why iOS Apps Rarely Need Retrofit, OkHttp, Moshi, or Hilt: Mastering `URLSession`, `Codable`, and Protocol Initializer DI.",
    androidAnchor: "Retrofit + OkHttp Interceptors + Kotlinx Serialization + Dagger/Hilt `@Inject`",
    iosAnchor: "`URLSession.shared.data(for:)`, `Codable` (`CodingKeys`), `URLProtocol`, Protocol + `@Environment` DI",
    simulatorType: "codable-playground",
    flashcards: [
      { front: "Why don't most iOS apps use a third-party library like Retrofit?", back: "Because Apple's built-in `URLSession` natively supports `async/await`, HTTP/2 & HTTP/3, background downloads, caching, and WebSockets—and pairs directly with compiler-synthesized `Codable`." },
      { front: "How do you map `snake_case` JSON keys to `camelCase` Swift properties without writing manual `CodingKeys` for every struct?", back: "Set `decoder.keyDecodingStrategy = .convertFromSnakeCase` on your `JSONDecoder()` instance!" },
      { front: "What is the iOS equivalent of an OkHttp `Interceptor` for mocking network responses in unit tests?", back: "Subclassing `URLProtocol` and registering it on a custom `URLSessionConfiguration.ephemeral` (or injecting a `NetworkClient` protocol)." },
      { front: "Why doesn't iOS need bytecode-weaving DI frameworks like Dagger/Hilt?", back: "On Android, the OS instantiates `Activity` via reflection, forcing field/entry-point injection. In SwiftUI, YOU instantiate the root view and ViewModels directly in `@main App`, so standard constructor/initializer injection works cleanly." }
    ],
    concepts: [
      {
        heading: "1. `URLSession` + `async/await` vs. Retrofit + OkHttp",
        shift: "On Android, every project starts by adding Retrofit, OkHttp, and a ConverterFactory to `build.gradle.kts`. On iOS, `Foundation`'s built-in `URLSession` gives you modern `async/await` networking out of the box.",
        details: [
          "<strong>Checking HTTP Status Codes:</strong> Unlike Retrofit (which throws `HttpException` on 4xx/5xx automatically), `URLSession.shared.data(for:)` only throws on transport errors (like no internet). You cast the `URLResponse` to `HTTPURLResponse` and check `guard (200...299).contains(http.statusCode)`!",
          "<strong>Auth Headers & Retry Wrapper:</strong> Instead of OkHttp `Interceptor` chains, iOS engineers write a clean 20-line `APIClient` struct or `actor` that attaches `Bearer` tokens to `URLRequest` before calling `session.data(for: request)`."
        ],
        kotlinCode: `interface UserApi {
    @GET("v1/users/{id}")
    suspend fun getUser(@Path("id") id: String): UserDto
}`,
        swiftCode: `protocol HTTPClient: Sendable {
    func get<T: Decodable>(_ path: String) async throws -> T
}

struct LiveHTTPClient: HTTPClient {
    let baseURL: URL
    let session: URLSession = .shared

    func get<T: Decodable>(_ path: String) async throws -> T {
        var request = URLRequest(url: baseURL.appending(path: path))
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse,
              (200...299).contains(http.statusCode) else {
            throw URLError(.badServerResponse)
        }
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        return try decoder.decode(T.self, from: data)
    }
}`
      },
      {
        heading: "2. Compiler-Synthesized `Codable` (`Encodable & Decodable`)",
        shift: "In Swift, `typealias Codable = Encodable & Decodable`. It is built into the Swift compiler itself—no Gradle plugin or runtime reflection required!",
        details: [
          "<strong>Automatic Snake Case Mapping:</strong> Use `decoder.keyDecodingStrategy = .convertFromSnakeCase` and `decoder.dateDecodingStrategy = .iso8601` to avoid manual boilerplate.",
          "<strong>Custom `CodingKeys`:</strong> When a backend field has a completely different name (e.g., `\"user_uuid\"` -> `id`), define a nested `enum CodingKeys: String, CodingKey` inside your struct."
        ],
        kotlinCode: `@Serializable
data class GitHubRepo(
    val id: Int,
    @SerialName("stargazers_count") val stars: Int
)`,
        swiftCode: `struct GitHubRepo: Codable, Equatable, Sendable {
    let id: Int
    let stars: Int

    enum CodingKeys: String, CodingKey {
        case id
        case stars = "stargazers_count"
    }
}`
      },
      {
        heading: "3. Clean Dependency Injection Without Hilt/Koin",
        shift: "Because you control initialization from `@main struct MyApp: App`, you pass dependencies via initializer parameters (Protocols) or inject a Composition Root container into SwiftUI's `@Environment`.",
        details: [
          "<strong>Instant SwiftUI Previews:</strong> By injecting a `MockHTTPClient()` into your ViewModel in `#Preview { ... }`, your Xcode Previews render in milliseconds with zero network calls and zero DI rebuild wait times!"
        ],
        kotlinCode: `@HiltViewModel
class RepoViewModel @Inject constructor(
    private val api: UserApi
) : ViewModel()`,
        swiftCode: `@Observable
@MainActor
final class RepoViewModel {
    private let client: any HTTPClient
    var repos: [GitHubRepo] = []

    init(client: any HTTPClient = LiveHTTPClient(baseURL: API.prodURL)) {
        self.client = client
    }
}`
      }
    ],
    quiz: [
      {
        question: "1. What is `Codable` in the Swift Standard Library?",
        options: [
          "A third-party CocoaPod for XML parsing",
          "A built-in typealias combining `Encodable & Decodable` whose implementation is synthesized at compile time by the Swift compiler",
          "A runtime reflection library like Java's `Gson`",
          "A Core Data base class"
        ],
        correctIndex: 1,
        explanation: "`typealias Codable = Decodable & Encodable` is a first-party Swift language feature that generates type-safe serialization code at compile time."
      },
      {
        question: "2. Does `try await URLSession.shared.data(from: url)` automatically throw an error if the server responds with HTTP `404 Not Found` or `500 Internal Server Error`?",
        options: [
          "Yes, it throws `HttpException` automatically like Retrofit",
          "No! `URLSession` only throws on transport-level failures (e.g., DNS/offline). You must inspect `(response as? HTTPURLResponse)?.statusCode` to check for 200..299",
          "It crashes the app on 500 errors",
          "It returns `nil` data"
        ],
        correctIndex: 1,
        explanation: "This is a vital gotcha for Android developers used to Retrofit! `URLSession` treats any valid HTTP response from the server as a completed network transfer; you validate `httpResponse.statusCode` yourself."
      },
      {
        question: "3. How can you decode JSON with `snake_case` keys (like `\"created_at\"` and `\"avatar_url\"`) into a Swift struct with `camelCase` properties (`createdAt`, `avatarUrl`) without writing a `CodingKeys` enum?",
        options: [
          "Set `decoder.keyDecodingStrategy = .convertFromSnakeCase` on `JSONDecoder`",
          "Use `@SerialName` annotations",
          "Swift does this automatically by default",
          "Convert the JSON to XML first"
        ],
        correctIndex: 0,
        explanation: "`JSONDecoder.KeyDecodingStrategy.convertFromSnakeCase` automatically transforms snake_case JSON keys into camelCase property names during decoding."
      },
      {
        question: "4. When you DO define a custom `enum CodingKeys: String, CodingKey` inside a `Codable` struct to rename 1 property out of 5, which cases must you list inside `CodingKeys`?",
        options: [
          "Only the 1 renamed property",
          "All 5 properties that you want encoded/decoded (listing the unchanged ones without a custom raw string value)",
          "None of them",
          "Only `String` properties"
        ],
        correctIndex: 1,
        explanation: "Once you declare a custom `CodingKeys` enum, the compiler uses it as the exhaustive list of properties to decode. Unchanged properties are simply listed as `case id, name` alongside `case stars = \"stargazers_count\"`."
      },
      {
        question: "5. Why do most iOS architectures rely on Protocol Initializer Injection + `@Environment` rather than annotation-processor DI frameworks like Dagger/Hilt?",
        options: [
          "Swift does not support classes",
          "In SwiftUI, developers control the entire object initialization graph starting at `@main App`, unlike Android where the OS instantiates `Activity` via reflection",
          "Apple rejects apps that use Dependency Injection",
          "Protocols cannot be passed into `init()`"
        ],
        correctIndex: 1,
        explanation: "Because SwiftUI apps construct their own Views and ViewModels directly in code, simple constructor injection and `@Environment` cover DI needs without codegen build penalties."
      },
      {
        question: "6. How do you intercept and mock low-level `URLSession` requests in unit tests without hitting the real network (similar to OkHttp's `MockWebServer` / `Interceptor`)?",
        options: [
          "Subclass `URLProtocol` and register it in `URLSessionConfiguration.ephemeral.protocolClasses`",
          "Turn off Wi-Fi on the Mac",
          "Modify `/etc/hosts`",
          "`URLSession` cannot be mocked"
        ],
        correctIndex: 0,
        explanation: "`URLProtocol` is Foundation's built-in hook for intercepting, inspecting, and returning stubbed `HTTPURLResponse` + `Data` for any `URLSession` configured with it."
      },
      {
        question: "7. What happens if a JSON payload is missing a key (or has `null`) for a property declared as non-optional `let bio: String` in your `Codable` struct?",
        options: [
          "`bio` defaults to `\"\"` automatically",
          "`JSONDecoder().decode(...)` throws a `DecodingError.keyNotFound` or `DecodingError.valueNotFound` error",
          "The app crashes with a segfault",
          "It ignores the struct"
        ],
        correctIndex: 1,
        explanation: "Swift's `Decodable` is strictly type-safe: if a field can be missing or `null` in the API response, declare it as an Optional (`let bio: String?`)."
      },
      {
        question: "8. How do you attach an `Authorization: Bearer <token>` header to an outgoing request in `URLSession`?",
        options: [
          "Create a `var request = URLRequest(url: url)` and call `request.setValue(\"Bearer \\(token)\", forHTTPHeaderField: \"Authorization\")`",
          "Pass the token in `JSONDecoder()`",
          "Annotate the struct with `@Header`",
          "Store it in `UserDefaults`"
        ],
        correctIndex: 0,
        explanation: "`URLRequest` is a mutable value-type `struct` where you configure HTTP method (`request.httpMethod = \"POST\"`), headers, timeout, and body (`request.httpBody`)."
      },
      {
        question: "9. What happens to an in-flight `try await URLSession.shared.data(for: request)` call if the enclosing Swift `Task` (or SwiftUI `.task {}`) is cancelled?",
        options: [
          "It keeps downloading until finished",
          "`URLSession` automatically cancels the underlying network socket transfer and immediately throws `URLError(.cancelled)`",
          "It leaks the socket",
          "It retries the request"
        ],
        correctIndex: 1,
        explanation: "`URLSession`'s async methods are integrated with Swift Structured Concurrency and automatically abort the network transfer when the calling `Task` is cancelled."
      },
      {
        question: "10. How do you define a custom `@Environment` key in modern SwiftUI (Xcode 16 / Swift 6) for injecting a service across views?",
        options: [
          "Use the `@Entry` macro inside `extension EnvironmentValues { @Entry var apiClient: any HTTPClient = LiveHTTPClient() }`",
          "Create an XML file in `res/values`",
          "Subclass `UIApplication`",
          "Use global mutable variables"
        ],
        correctIndex: 0,
        explanation: "The `@Entry` macro on `EnvironmentValues` reduces custom environment key boilerplate to a single line of code!"
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 7 Networking Lab: (1) Conform `UserDTO` to `Codable`, (2) Map `fullName` to `\"full_name\"` inside `enum CodingKeys: String, CodingKey`, and (3) Decode using `JSONDecoder()`.",
      starterCode: `// TODO 1: Conform UserDTO to Codable
struct UserDTO {
    let fullName: String

    // TODO 2: Define enum CodingKeys: String, CodingKey mapping fullName = "full_name"
}

func parseUser(data: Data) throws -> UserDTO {
    // TODO 3: Decode UserDTO.self from data using JSONDecoder()
    fatalError("TODO")
}`,
      solutionCode: `struct UserDTO: Codable {
    let fullName: String

    enum CodingKeys: String, CodingKey {
        case fullName = "full_name"
    }
}

func parseUser(data: Data) throws -> UserDTO {
    try JSONDecoder().decode(UserDTO.self, from: data)
}`,
      simulatedOutput: `✓ UserDTO: Codable synthesized at compile time
✓ CodingKeys mapped "full_name" -> fullName
✓ JSONDecoder().decode(UserDTO.self, from: data) verified!`,
      requiredTokens: ["Codable", "CodingKeys", "full_name", "JSONDecoder()"]
    },
    linkedinPost: `Week 7 of Android -> iOS Before New Year: Why iOS Apps Don't Need Retrofit, Moshi, or Hilt! 🌐🔌

On Android, almost every production app starts by adding Retrofit, OkHttp, Kotlinx Serialization/Moshi, and Hilt.
When I started building the networking & DI layer on iOS in Week 7, I realized Apple baked all of these into the language and standard library:

1️⃣ Retrofit + OkHttp -> URLSession (with native async/await & task cancellation)
2️⃣ Moshi / Kotlinx Serialization -> Compiler-synthesized Codable (with 1-line .convertFromSnakeCase)
3️⃣ Dagger / Hilt -> Protocol Initializer Injection + @Environment (@Entry macro)

⚠️ Watch out for the #1 Android-to-iOS networking gotcha: URLSession does NOT throw on HTTP 404/500 by default—you must validate (response as? HTTPURLResponse)?.statusCode!

🧪 Try the interactive Codable JSON Playground + 10-question quiz:
🔗 https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #Swift #Kotlin #MobileArchitecture #CleanArchitecture`,
    linkedinArticle: `# Week 7: Replacing Retrofit, OkHttp, Moshi, and Hilt with First-Party Swift APIs

On Android, our networking and dependency injection stack relies heavily on battle-tested third-party libraries: Retrofit, OkHttp, Kotlinx Serialization (or Moshi), and Hilt.

In Week 7, I built the exact same clean networking and DI architecture on iOS—using **zero external dependencies**.

---

## 1. \`URLSession\` + \`Codable\`

Swift's \`Codable\` protocol (\`Encodable & Decodable\`) is built directly into the Swift compiler, generating type-safe JSON parsers at compile time. Combined with \`URLSession.shared.data(for: request)\`, a complete generic REST client takes less than 25 lines of code.

---

## 2. Why iOS Doesn't Need Bytecode-Weaving DI

Why do we need Hilt on Android? Because the Android OS instantiates \`Activity\` and \`Service\` classes on our behalf, forcing us to inject dependencies after construction. In SwiftUI, we own the \`@main App\` struct and construct every View and ViewModel ourselves—making pure constructor injection effortless.`
  },

  // ==========================================================================
  // WEEK 8: LOCAL PERSISTENCE (SwiftData) & KEYCHAIN SECURITY
  // ==========================================================================
  {
    week: 8,
    dates: "Dec 08 – Dec 14",
    title: "Local Persistence (`SwiftData`) & Keychain Security",
    subtitle: "Mapping Room Database, DataStore, and Android Keystore to SwiftData (`@Model`, `@Query`), `@AppStorage`, and iOS Keychain.",
    androidAnchor: "Room (`@Entity`, `@Dao`, `Flow<List<T>>`), Preferences DataStore, Android Keystore",
    iosAnchor: "SwiftData (`@Model`, `@Query`, `ModelContext`), `@AppStorage` (`UserDefaults`), Keychain Services (`SecItemAdd`)",
    simulatorType: "persistence-selector",
    flashcards: [
      { front: "How does SwiftData's `@Model` macro relate to Room's `@Entity`?", back: "`@Model` transforms a Swift class into a persisted schema managed by `ModelContainer` and `ModelContext` (built on Core Data's proven SQLite engine) and automatically makes it `@Observable`!" },
      { front: "What does `@Query` do inside a SwiftUI `View`?", back: "It fetches `@Model` records from the environment's `ModelContext` and automatically re-renders the SwiftUI View whenever matching records are inserted, updated, or deleted (like a Room `@Dao` returning `Flow<List<T>>` + `collectAsState`)." },
      { front: "Why must you NEVER store OAuth tokens or passwords in `UserDefaults` / `@AppStorage`?", back: "`UserDefaults` is stored as an unencrypted `.plist` file inside the app sandbox that can be read from unencrypted device backups. Sensitive secrets must always be stored in the hardware-backed **iOS Keychain**." },
      { front: "What happens to iOS Keychain items vs `UserDefaults` when the user uninstalls your app?", back: "`UserDefaults` is deleted immediately on app uninstall. Keychain items can persist across app reinstalls unless explicitly cleared on first launch!" }
    ],
    concepts: [
      {
        heading: "1. Room Database vs. SwiftData (`@Model`, `ModelContext`, `@Query`)",
        shift: "In Android Room, you write an `@Entity` data class, a `@Dao` interface with SQL strings, a `RoomDatabase` abstract class, and collect a `Flow` in your ViewModel. In SwiftData, `@Model` defines the schema AND `@Query` streams live results straight into your SwiftUI View!",
        details: [
          "<strong>Relationships Without Foreign Key Boilerplate:</strong> Declaring `@Relationship(deleteRule: .cascade) var tasks: [TaskItem] = []` inside a `Project` `@Model` automatically manages one-to-many SQLite joins and cascading deletes.",
          "<strong>Background Persistence with `@ModelActor`:</strong> For heavy batch imports off the main thread, SwiftData provides the `@ModelActor` macro—creating a dedicated background actor with its own thread-safe `ModelContext`."
        ],
        kotlinCode: `@Entity
data class Bookmark(
    @PrimaryKey val id: String,
    val title: String,
    val createdAt: Long
)

@Dao
interface BookmarkDao {
    @Query("SELECT * FROM Bookmark ORDER BY createdAt DESC")
    fun observeAll(): Flow<List<Bookmark>>
}`,
        swiftCode: `import SwiftData

@Model
final class Bookmark {
    @Attribute(.unique) var id: String
    var title: String
    var createdAt: Date

    init(id: String, title: String, createdAt: Date = .now) {
        self.id = id; self.title = title; self.createdAt = createdAt
    }
}

struct BookmarksView: View {
    @Environment(\\.modelContext) private var context
    @Query(sort: \\Bookmark.createdAt, order: .reverse)
    private var bookmarks: [Bookmark]

    var body: some View {
        List(bookmarks) { item in Text(item.title) }
    }
}`
      },
      {
        heading: "2. Preferences DataStore vs. `UserDefaults` & `@AppStorage`",
        shift: "For lightweight non-sensitive flags (like `hasSeenOnboarding` or selected theme), SwiftUI's `@AppStorage(\"key\")` property wrapper binds a `UserDefaults` key directly to view state in one line!",
        details: [
          "<strong>When NOT to use `@AppStorage`:</strong> Never store large JSON blobs or sensitive tokens in `UserDefaults`."
        ],
        kotlinCode: `// Android DataStore
val ONBOARDED_KEY = booleanPreferencesKey("onboarded")`,
        swiftCode: `struct SettingsView: View {
    @AppStorage("has_completed_onboarding")
    private var hasOnboarded = false

    var body: some View {
        Toggle("Onboarding Complete", isOn: $hasOnboarded)
    }
}`
      },
      {
        heading: "3. Android Keystore vs. iOS Keychain Services",
        shift: "Sensitive credentials (JWTs, refresh tokens, biometric keys) belong in the **iOS Keychain** (`Security` framework), which is hardware-encrypted by the Secure Enclave.",
        details: [
          "<strong>Keychain Accessibility Levels:</strong> Use `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` so tokens are only readable while the device is unlocked and are never migrated to a different device via backup."
        ],
        kotlinCode: `// Android: EncryptedSharedPreferences / Keystore cipher wrapping`,
        swiftCode: `// iOS Keychain query dictionary for storing secret Data
let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrAccount as String: "auth_access_token",
    kSecValueData as String: tokenData,
    kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
]`
      }
    ],
    quiz: [
      {
        question: "1. What macro turns a Swift class into a persistent SwiftData table model (similar to `@Entity` in Room)?",
        options: [
          "`@Entity`",
          "`@Model`",
          "`@Persistable`",
          "`@Table`"
        ],
        correctIndex: 1,
        explanation: "The `@Model` macro from `SwiftData` synthesizes schema metadata, persistence tracking, and `@Observable` conformance on your model class."
      },
      {
        question: "2. How do you enforce that a property (like `id` or `email`) in a SwiftData `@Model` class has a unique constraint (like `@PrimaryKey` or `Index(unique = true)` in Room)?",
        options: [
          "`@Attribute(.unique) var id: String`",
          "`@PrimaryKey var id: String`",
          "`unique let id: String`",
          "`@UniqueKey var id: String`"
        ],
        correctIndex: 0,
        explanation: "`@Attribute(.unique)` instructs SwiftData to enforce uniqueness and automatically perform an upsert (insert-or-update) when a duplicate key is saved."
      },
      {
        question: "3. How do you insert or delete a SwiftData `@Model` instance from inside a SwiftUI View?",
        options: [
          "Read `@Environment(\\.modelContext) private var context` and call `context.insert(item)` or `context.delete(item)`",
          "Write raw SQL strings",
          "Mutate the `@Query` array directly",
          "Call `UserDefaults.standard.save(item)`"
        ],
        correctIndex: 0,
        explanation: "`ModelContext` (injected via `.modelContainer(for:)` and accessed via `@Environment(\\.modelContext)`) tracks insertions, mutations, and deletions."
      },
      {
        question: "4. Why must OAuth access tokens, refresh tokens, and API secrets be stored in the **iOS Keychain** rather than `UserDefaults` / `@AppStorage`?",
        options: [
          "Because `UserDefaults` cannot store `String` values",
          "Because `UserDefaults` is stored as an unencrypted plaintext `.plist` file in the app sandbox, whereas the Keychain is hardware-encrypted by the Secure Enclave",
          "Because `UserDefaults` is cleared every 5 minutes",
          "Because `@AppStorage` only works on macOS"
        ],
        correctIndex: 1,
        explanation: "`UserDefaults` is strictly for non-sensitive user preferences. Security tokens and credentials must always be stored in the encrypted iOS Keychain."
      },
      {
        question: "5. What is a surprising behavior of iOS Keychain items when a user uninstalls and reinstalls your app (compared to Android `EncryptedSharedPreferences`)?",
        options: [
          "Keychain items are deleted every time the phone reboots",
          "Keychain items persist across app uninstalls! Many iOS apps check a `hasLaunchedBefore` flag in `UserDefaults` on startup and wipe stale Keychain tokens on a fresh install",
          "Keychain items are uploaded to GitHub",
          "Keychain items become public"
        ],
        correctIndex: 1,
        explanation: "Because Keychain storage lives outside the app bundle sandbox, items remain in Keychain after uninstall unless cleared on first launch detected via `UserDefaults`."
      },
      {
        question: "6. Which Keychain accessibility constant ensures an auth token can ONLY be read when the user's iPhone is unlocked and is NEVER transferred to another device via iCloud/Finder backup?",
        options: [
          "`kSecAttrAccessibleAlways`",
          "`kSecAttrAccessibleWhenUnlockedThisDeviceOnly`",
          "`kSecAttrAccessibleAfterFirstUnlock`",
          "`kSecAttrAccessiblePublic`"
        ],
        correctIndex: 1,
        explanation: "`kSecAttrAccessibleWhenUnlockedThisDeviceOnly` provides the strongest protection for session tokens: hardware-locked when the screen locks and bound strictly to the physical device."
      },
      {
        question: "7. How do you filter a SwiftData `@Query` dynamically using type-safe Swift expressions instead of raw SQL strings?",
        options: [
          "Using the `#Predicate<Model> { ... }` macro",
          "Using `NSPredicate(format:)` only",
          "Using `Regex`",
          "Filtering is not supported in SwiftData"
        ],
        correctIndex: 0,
        explanation: "Swift's `#Predicate` macro checks property names and types at compile time and translates the Swift closure into an optimized SQLite `WHERE` clause."
      },
      {
        question: "8. How do you perform heavy background batch inserts of 10,000 records in SwiftData without freezing the `@MainActor` UI thread?",
        options: [
          "Create a background actor annotated with `@ModelActor` (which owns a background `ModelContext`)",
          "Pass `@MainActor` models across raw `Thread`s",
          "Use `UserDefaults` instead",
          "Disable ARC"
        ],
        correctIndex: 0,
        explanation: "`@ModelActor` creates a dedicated actor with its own background `ModelContext` bound to the `ModelContainer`, keeping heavy I/O off the main thread safely."
      },
      {
        question: "9. Why must SwiftData `@Model` types be declared as `class` rather than `struct`?",
        options: [
          "Because SwiftData tracks object identity and live graph relationships across contexts (similar to an ORM managed entity)",
          "Because structs cannot have properties",
          "Because `@Observable` only works on structs",
          "Because SQLite requires Objective-C"
        ],
        correctIndex: 0,
        explanation: "Like Core Data managed objects, SwiftData `@Model` instances represent persistent identity in the `ModelContext` object graph and support reference relationships."
      },
      {
        question: "10. What single view modifier do you attach to your root `WindowGroup` or `View` to set up the SwiftData database container for the entire app?",
        options: [
          "`.modelContainer(for: [Bookmark.self])`",
          "`.database(Room.inMemory())`",
          "`.environmentObject(SQLite())`",
          "`.onAppear { initDb() }`"
        ],
        correctIndex: 0,
        explanation: "`.modelContainer(for:)` initializes the SQLite backing store and injects the `ModelContext` into the SwiftUI environment."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 8 Persistence Lab: (1) Annotate `Habit` with `@Model`, (2) Mark `id` with `@Attribute(.unique)`, and (3) Use `@Query` inside `HabitListView`.",
      starterCode: `import SwiftData

// TODO 1: Add @Model macro and @Attribute(.unique) on id
final class Habit {
    var id: String
    var name: String
    init(id: String, name: String) { self.id = id; self.name = name }
}

struct HabitListView: View {
    // TODO 2: Declare @Query private var habits: [Habit]
    var habits: [Habit] = []
    var body: some View { List(habits) { h in Text(h.name) } }
}`,
      solutionCode: `import SwiftData

@Model
final class Habit {
    @Attribute(.unique) var id: String
    var name: String
    init(id: String, name: String) { self.id = id; self.name = name }
}

struct HabitListView: View {
    @Query private var habits: [Habit]
    var body: some View { List(habits) { h in Text(h.name) } }
}`,
      simulatedOutput: `✓ @Model schema generated for Habit with @Attribute(.unique) id
✓ @Query live-bound to SwiftUI environment ModelContext!`,
      requiredTokens: ["@Model", "@Attribute(.unique)", "@Query"]
    },
    linkedinPost: `Week 8 of Android -> iOS Before New Year: Room & DataStore vs SwiftData & Keychain! 💾🔐

How does local storage and security on iOS compare to Android?

1️⃣ Room (@Entity + @Dao + Flow) -> SwiftData (@Model + #Predicate + @Query)
In SwiftData, annotating a class with @Model defines the SQLite table, and @Query streams live updates directly into your SwiftUI View—with compile-time type-safe #Predicate queries instead of raw SQL strings!

2️⃣ Preferences DataStore -> @AppStorage ("UserDefaults")
Great for lightweight flags like dark mode or onboarding—bound to a View in 1 line.

3️⃣ EncryptedSharedPreferences / Keystore -> iOS Keychain Services
⚠️ Critical iOS Security Gotcha: Never store JWTs/tokens in UserDefaults (it's an unencrypted plist!). Always use the hardware-backed Keychain—and remember that Keychain items survive app uninstalls unless wiped on first launch!

🎮 Try the interactive iOS Storage Decision Engine + 10-question quiz:
🔗 https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #SwiftData #RoomDatabase #MobileSecurity #SwiftUI`,
    linkedinArticle: `# Week 8: From Room & DataStore to SwiftData (\`@Model\`, \`@Query\`) and the iOS Keychain

Every production mobile app needs three tiers of local persistence:
1. **Relational / Structured Graph Data** (Android Room ↔ iOS SwiftData)
2. **Lightweight Key-Value Preferences** (Android DataStore ↔ iOS \`UserDefaults\` / \`@AppStorage\`)
3. **Hardware-Backed Secret Storage** (Android Keystore ↔ iOS Keychain Services)

In Week 8, I built all three tiers on iOS and uncovered an important Keychain gotcha: unlike \`UserDefaults\`, **Keychain items persist even after the user uninstalls your app!**`
  },

  // ==========================================================================
  // WEEK 9: SWIFT TESTING (@Test), UIKIT INTEROP & INSTRUMENTS
  // ==========================================================================
  {
    week: 9,
    dates: "Dec 15 – Dec 21",
    title: "Swift Testing (`@Test`), UIKit Interop & Instruments",
    subtitle: "Modern Swift Testing (`@Test`, `#expect`), Parameterized Tests, Bridging UIKit (`UIViewRepresentable`), and Profiling with Instruments.",
    androidAnchor: "JUnit 5 + MockK + Turbine, `AndroidView` (View Interop), Android Studio Profiler",
    iosAnchor: "Swift Testing (`@Test`, `#expect`, `#require`), `UIViewRepresentable` & `Coordinator`, Xcode Instruments",
    simulatorType: "interop-lifecycle",
    flashcards: [
      { front: "How does modern Swift Testing (`import Testing`) improve over legacy `XCTest`?", back: "Uses clean `@Test` functions (can live inside `struct`s!), replaces 40+ `XCTAssert*` methods with a single `#expect(...)` macro that prints full values on failure, and runs tests in parallel by default." },
      { front: "What is `#require(...)` in Swift Testing?", back: "It unwraps an Optional or asserts a precondition inside a `@Test`, immediately aborting the test if it fails (replacing `try XCTUnwrap(...)`)." },
      { front: "How do you embed a UIKit `UIView` inside SwiftUI (like `AndroidView` in Jetpack Compose)?", back: "Conform a struct to `UIViewRepresentable` and implement `makeUIView(context:)` and `updateUIView(_:context:)`. Use `makeCoordinator()` to bridge UIKit delegates/callbacks back to SwiftUI." },
      { front: "How do you embed a SwiftUI `View` inside a legacy UIKit `UIViewController` (like `ComposeView` in Android XML)?", back: "Wrap the SwiftUI view in a `UIHostingController(rootView: MySwiftUIView())`." }
    ],
    concepts: [
      {
        heading: "1. Modern Swift Testing (`@Test`, `#expect`, `#require`) vs. JUnit 5",
        shift: "Forget legacy `XCTestCase` subclasses where every method had to start with `func test...()` and used `XCTAssertEqual`. Swift's built-in `Testing` framework uses `@Test` macros, runs on value-type `struct` suites (creating a fresh isolated struct per test!), and supports parameterized tests in 1 line!",
        details: [
          "<strong>Value-Type Test Isolation:</strong> Because your test suite is a `struct`, every `@Test` method automatically gets its own clean instance without shared mutable `setUp()` state bugs!",
          "<strong>Parameterized Tests:</strong> `@Test(arguments: [\"a@b.com\", \"user@domain.org\"]) func validEmail(_ email: String)` runs each input in parallel automatically."
        ],
        kotlinCode: `class CartTest {
    @ParameterizedTest
    @ValueSource(ints = [1, 5, 10])
    fun \`adding quantity updates total\`(qty: Int) = runTest {
        val cart = Cart()
        cart.add(qty)
        assertEquals(qty, cart.count)
    }
}`,
        swiftCode: `import Testing

struct CartTests {
    @Test("Adding quantity updates total", arguments: [1, 5, 10])
    func addingQuantity(qty: Int) async throws {
        var cart = Cart()
        cart.add(qty)
        #expect(cart.count == qty)
    }
}`
      },
      {
        heading: "2. UIKit ↔ SwiftUI Interop (`UIViewRepresentable` & `UIHostingController`)",
        shift: "Just like Android apps bridge `View` and `Compose` using `AndroidView` and `ComposeView`, iOS apps bridge `UIKit` and `SwiftUI` using `UIViewRepresentable` and `UIHostingController`.",
        details: [
          "<strong>The `Coordinator` Pattern:</strong> Many UIKit views (`MKMapView`, `WKWebView`, `UISearchBar`) communicate via delegates (`delegate = self`). Inside `UIViewRepresentable`, you implement `makeCoordinator()` to return a `class` instance that acts as the UIKit delegate and forwards events to your SwiftUI `@Binding`s!"
        ],
        kotlinCode: `// Android: Wrapping a classic View inside Compose
AndroidView(
    factory = { ctx -> WebView(ctx) },
    update = { webView -> webView.loadUrl(url) }
)`,
        swiftCode: `// iOS: Wrapping a UIKit UIView inside SwiftUI
struct WebViewWrapper: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> WKWebView {
        WKWebView()
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        webView.load(URLRequest(url: url))
    }
}`
      },
      {
        heading: "3. Profiling Performance & Memory Leaks with Xcode Instruments",
        shift: "Where Android Studio has the CPU/Memory Profiler and LeakCanary, Xcode provides the **Memory Graph Debugger** (1-click live retain cycle graph!) and **Instruments** (Time Profiler, Allocations, Leaks, SwiftUI View Body tracker).",
        details: [
          "<strong>`Self._printChanges()` Debugging Trick:</strong> Inside any SwiftUI View's `var body: some View`, call `let _ = Self._printChanges()` to print to the console the exact `@State` or `@Observable` property that caused that view to re-render!"
        ],
        kotlinCode: `// Compose Layout Inspector: Recomposition counts`,
        swiftCode: `var body: some View {
    // Prints e.g. "ProfileView: @self, _count changed." in Debug console!
    let _ = Self._printChanges()
    Text("Count: \\(count)")
}`
      }
    ],
    quiz: [
      {
        question: "1. In the modern Swift `Testing` framework (`import Testing`), why is declaring a test suite as a `struct` preferred over a `class`?",
        options: [
          "Because structs run on the main thread",
          "Because value semantics ensure a fresh, completely isolated `struct` instance is created for each individual `@Test` function, preventing accidental shared state between parallel tests",
          "Because classes cannot use `#expect`",
          "Because `struct` tests skip compilation"
        ],
        correctIndex: 1,
        explanation: "With a `struct` test suite, every `@Test` method gets its own independent instance initialized via `init()`, eliminating state leakage across parallel test runs."
      },
      {
        question: "2. What is the difference between `#expect(user != nil)` and `let u = try #require(user)` in Swift Testing?",
        options: [
          "`#expect` crashes the test runner",
          "`#expect` records a failure if false but continues executing the rest of the test; `#require` unwraps the Optional or throws an error that immediately stops the current test if nil",
          "`#require` is only for UI tests",
          "They are identical"
        ],
        correctIndex: 1,
        explanation: "`#require` is the modern replacement for `try XCTUnwrap(...)`: if a precondition or Optional unwrap fails, it aborts the test early so subsequent lines don't fail cascades."
      },
      {
        question: "3. Which SwiftUI protocol is the direct equivalent of Jetpack Compose's `AndroidView(factory = ..., update = ...)` for embedding a UIKit `UIView` inside SwiftUI?",
        options: [
          "`UIViewRepresentable`",
          "`UIHostingController`",
          "`ViewModifier`",
          "`NSObjectProtocol`"
        ],
        correctIndex: 0,
        explanation: "`UIViewRepresentable` bridges any `UIView` into SwiftUI via `makeUIView(context:)` (factory) and `updateUIView(_:context:)` (update)."
      },
      {
        question: "4. Conversely, which class is the direct equivalent of Android's `ComposeView` for embedding a SwiftUI `View` inside an existing UIKit `UIViewController`?",
        options: [
          "`UIHostingController(rootView: MySwiftUIView())`",
          "`UIViewRepresentable`",
          "`SwiftUIBridgeView`",
          "`UINavigationController`"
        ],
        correctIndex: 0,
        explanation: "`UIHostingController` wraps a SwiftUI view hierarchy inside a `UIViewController` so you can adopt SwiftUI screen-by-screen in an existing UIKit codebase."
      },
      {
        question: "5. Inside `UIViewRepresentable`, what is the purpose of `makeCoordinator()` and `context.coordinator`?",
        options: [
          "To manage SQLite transactions",
          "To provide a persistent reference-type (`class`) object that implements UIKit delegates/target-actions and communicates events back to SwiftUI `@Binding`s",
          "To handle navigation between activities",
          "To compile Metal shaders"
        ],
        correctIndex: 1,
        explanation: "Because `UIViewRepresentable` is a value-type `struct`, it cannot be a UIKit `delegate` (`NSObject`). The `Coordinator` class lives alongside the view and bridges delegate callbacks back to SwiftUI."
      },
      {
        question: "6. How many times does SwiftUI call `makeUIView(context:)` vs. `updateUIView(_:context:)` during the lifetime of a mounted `UIViewRepresentable`?",
        options: [
          "Both are called on every frame",
          "`makeUIView` is called ONCE when the view is mounted; `updateUIView` is called initially and every time a SwiftUI state dependency read by the wrapper changes",
          "`updateUIView` is never called",
          "`makeUIView` is called on every state change"
        ],
        correctIndex: 1,
        explanation: "Just like `factory` vs `update` in Compose's `AndroidView`, `makeUIView` creates the underlying `UIView` once, while `updateUIView` syncs new SwiftUI state into that existing instance."
      },
      {
        question: "7. What built-in debug helper can you place at the top of a SwiftUI `var body: some View` to print the exact property that triggered a view re-evaluation?",
        options: [
          "`let _ = Self._printChanges()`",
          "`print(Thread.callStackSymbols)`",
          "`debugger()`",
          "`SwiftUI.dumpTree()`"
        ],
        correctIndex: 0,
        explanation: "`let _ = Self._printChanges()` logs which specific `@State`, `@Binding`, or `@Observable` property caused `body` to be recomputed."
      },
      {
        question: "8. Which Xcode tool lets you pause a running app and visually inspect a graph of all live heap objects and purple `!` warnings for ARC retain cycles?",
        options: [
          "Xcode Debug Memory Graph (`Debug Memory Graph` button in the debug bar)",
          "Interface Builder",
          "Swift Package Manager",
          "Asset Catalog"
        ],
        correctIndex: 0,
        explanation: "Xcode's Debug Memory Graph snapshots all live objects on the heap and automatically highlights retain cycles (similar to inspecting a LeakCanary heap dump in real time)."
      },
      {
        question: "9. In Xcode Instruments, which template specifically tracks SwiftUI `View.body` evaluation counts and durations alongside Core Animation hitches?",
        options: [
          "The **SwiftUI** Instrument template (combined with Time Profiler & Hitches)",
          "Network Instrument",
          "File Activity Instrument",
          "Energy Log"
        ],
        correctIndex: 0,
        explanation: "Instruments includes a dedicated SwiftUI profiler that flags slow or excessive `View.body` evaluations causing frame drops."
      },
      {
        question: "10. How do you write a Parameterized Test in Swift Testing that runs the same test function across 4 different inputs?",
        options: [
          "`@Test(arguments: [10, 20, 30, 40]) func validateScore(_ score: Int) { #expect(score > 0) }`",
          "Write 4 separate functions",
          "Use `@RunWith(Parameterized.class)`",
          "Use a global static array"
        ],
        correctIndex: 0,
        explanation: "`@Test(arguments: [...])` natively generates parallel parameterized test cases for every element in the collection."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 9 Testing Lab: (1) Annotate `discountCalculation` with `@Test`, (2) Unwrap `coupon` using `try #require(optionalCoupon)`, and (3) Assert `finalPrice == 80` using `#expect`.",
      starterCode: `import Testing

struct PricingTests {
    // TODO 1: Add @Test attribute
    func discountCalculation() throws {
        let optionalCoupon: Int? = 20
        // TODO 2: Unwrap optionalCoupon with 'let coupon = try #require(optionalCoupon)'
        let coupon = 0
        let finalPrice = 100 - coupon
        // TODO 3: Assert with #expect(finalPrice == 80)
    }
}`,
      solutionCode: `import Testing

struct PricingTests {
    @Test
    func discountCalculation() throws {
        let optionalCoupon: Int? = 20
        let coupon = try #require(optionalCoupon)
        let finalPrice = 100 - coupon
        #expect(finalPrice == 80)
    }
}`,
      simulatedOutput: `◇ Test run started.
✔ Test discountCalculation() passed after 0.001 seconds (#require & #expect verified!)`,
      requiredTokens: ["@Test", "#require", "#expect(finalPrice == 80)"]
    },
    linkedinPost: `Week 9 of Android -> iOS Before New Year: Swift Testing (@Test & #expect), UIKit Interop & Instruments! 🧪🔍

How do Testing, Legacy View Interop, and Profiling compare between Android and iOS?

1️⃣ JUnit 5 -> Modern Swift Testing (@Test, #expect, #require)
Because Swift test suites are 'struct's, every @Test function automatically gets a fresh, isolated value instance—zero shared mutable state between parallel tests! And #expect(a == b) replaces 40+ XCTAssert functions with rich expression diagnostics.

2️⃣ AndroidView & ComposeView -> UIViewRepresentable & UIHostingController
Need to wrap MKMapView or WKWebView in SwiftUI? Implement UIViewRepresentable (makeUIView + updateUIView + Coordinator). Need to put a SwiftUI screen inside a legacy UIKit app? Wrap it in UIHostingController!

3️⃣ LeakCanary & Layout Inspector -> Xcode Memory Graph Debugger & Self._printChanges()
Add 'let _ = Self._printChanges()' inside any SwiftUI body to see the exact property that triggered recomposition!

🧪 Try the interactive UIKit-SwiftUI Interop Lifecycle Visualizer + 10-question quiz:
🔗 https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #SwiftTesting #SwiftUI #UIKit #MobileEngineering`,
    linkedinArticle: `# Week 9: Modern Swift Testing (\`@Test\`, \`#expect\`), Bridging UIKit (\`UIViewRepresentable\`), and Profiling with Instruments

No mobile engineer is production-ready without knowing how to write fast unit tests, interop with legacy imperative views, and profile frame drops or memory leaks. In Week 9, I tackled all three on iOS.

---

## 1. Why Swift Testing (\`import Testing\`) Is a Joy

Legacy \`XCTest\` felt like JUnit 3—subclassing \`XCTestCase\`, naming methods \`test...\`, and choosing between dozens of \`XCTAssert*\` functions. Modern **Swift Testing** uses Swift macros:
- \`@Test\` on functions inside a \`struct\` (giving you automatic per-test instance isolation!)
- \`#expect(cart.total == 42)\` captures both sides of the comparison expression at compile time
- \`try #require(optionalValue)\` cleanly aborts the test if an Optional is \`nil\``
  },

  // ==========================================================================
  // WEEK 10: CAPSTONE PRODUCTION APP & APP STORE READINESS
  // ==========================================================================
  {
    week: 10,
    dates: "Dec 22 – Dec 31",
    title: "Capstone Production App & App Store Readiness",
    subtitle: "Shipping Before New Year: Modular SPM Architecture, `.xcconfig` Build Flavors, Code Signing, TestFlight & Year-End Retrospective.",
    androidAnchor: "Multi-Module Gradle (`build.gradle.kts`), Product Flavors, Keystore / Play App Signing, Google Play Console",
    iosAnchor: "Local Swift Packages (`Package.swift`), Schemes & `.xcconfig`, Provisioning Profiles, App Store Connect & TestFlight",
    simulatorType: "architecture-blueprint",
    flashcards: [
      { front: "What is the modern iOS equivalent of Android multi-module Gradle subprojects (`:core:network`, `:feature:feed`)?", back: "Local **Swift Package Manager (`Package.swift`)** modules! They eliminate `.xcodeproj` merge conflicts and enforce strict `public` vs `internal` module boundaries." },
      { front: "What are the 3 pieces of an iOS Provisioning Profile during Code Signing?", back: "1. **Signing Certificate** (Who you are / Developer cryptographic identity), 2. **App ID / Entitlements** (What bundle ID and capabilities like Push/Keychain the app uses), and 3. **Provisioned Device UDIDs** (for Development/Ad-Hoc builds)." },
      { front: "How do Swift access control levels (`private`, `fileprivate`, `internal`, `package`, `public`, `open`) compare to Kotlin?", back: "`internal` is the default (visible within the same module). To expose a type or method across SPM modules, you must mark it `public` (or `package` for same-package targets). Unlike Kotlin where `public` is the default!" },
      { front: "Difference between `public` and `open` on a Swift class?", back: "Outside the defining module, a `public` class can be instantiated but NOT subclassed or overridden; an `open` class can be both instantiated and subclassed/overridden (similar to Kotlin's `open class`)." }
    ],
    concepts: [
      {
        heading: "1. Multi-Module Architecture: Gradle Subprojects vs. Local Swift Packages (`Package.swift`)",
        shift: "In large Android apps, we split code into Gradle modules (`:core:model`, `:core:network`, `:feature:home`). In modern iOS apps, we split features into local **Swift Package Manager (`Package.swift`)** modules—completely avoiding monolithic `.xcodeproj` git merge conflicts!",
        details: [
          "<strong>Default Access Control Gotcha (`internal` vs `public`):</strong> In Kotlin, declarations are `public` by default. In Swift, declarations are `internal` by default! When you move a struct into a separate SPM module, you must mark the struct, its properties, AND its `init()` as `public` (or `package` in Swift 5.9+)."
        ],
        kotlinCode: `// settings.gradle.kts
include(":core:model", ":core:network", ":feature:feed")`,
        swiftCode: `// Package.swift — Clean, declarative Swift code!
// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "AppModules",
    platforms: [.iOS(.v17)],
    products: [
        .library(name: "FeatureFeed", targets: ["FeatureFeed"])
    ],
    targets: [
        .target(name: "CoreModel"),
        .target(name: "CoreNetwork", dependencies: ["CoreModel"]),
        .target(name: "FeatureFeed", dependencies: ["CoreModel", "CoreNetwork"]),
        .testTarget(name: "FeatureFeedTests", dependencies: ["FeatureFeed"])
    ]
)`
      },
      {
        heading: "2. Gradle `productFlavors` vs. Xcode Schemes & `.xcconfig` Files",
        shift: "Instead of `productFlavors { create(\"staging\") }` in Gradle, iOS uses plain-text `.xcconfig` (Xcode Configuration) files mapped to Build Configurations (`Debug-Staging`, `Release-Prod`) and Xcode Schemes.",
        details: [
          "<strong>Never Hardcode Secrets in Swift:</strong> Inject environment-specific values (like `API_BASE_URL` and `BUNDLE_ID_SUFFIX`) via `.xcconfig` into `Info.plist` and read them via `Bundle.main.infoDictionary`."
        ],
        kotlinCode: `productFlavors {
    create("staging") {
        applicationIdSuffix = ".staging"
        buildConfigField("String", "API_URL", "\\"https://staging.api.com\\"")
    }
}`,
        swiftCode: `// Staging.xcconfig
PRODUCT_BUNDLE_IDENTIFIER = com.sudhakar.app.staging
PRODUCT_NAME = App (Staging)
API_BASE_URL = api-staging.example.com`
      },
      {
        heading: "3. Code Signing, Provisioning Profiles & TestFlight",
        shift: "On Android, you sign an APK/AAB with any local `.jks` keystore and upload to Play Console. On iOS, Apple requires hardware-verified **Provisioning Profiles** before an app can even launch on a physical iPhone.",
        details: [
          "<strong>The Signing Triangle:</strong> A **Provisioning Profile** binds together: (1) Your **Certificate** (cryptographic identity in Keychain), (2) The **App ID & Entitlements** (Push Notifications, Associated Domains, App Groups), and (3) Allowed **Device UDIDs** (for Dev/Ad-Hoc).",
          "<strong>TestFlight & App Store Connect:</strong> Archiving (`Product -> Archive`) uploads your signed `.ipa` to App Store Connect, where **TestFlight** distributes builds to internal testers immediately and up to 10,000 external beta testers."
        ],
        kotlinCode: `// Android: ./gradlew bundleRelease -> upload .aab to Play Console Internal Track`,
        swiftCode: `// CLI Archive & Export for TestFlight / Xcode Cloud:
// xcodebuild archive -scheme CapstoneApp -archivePath build/App.xcarchive
// xcodebuild -exportArchive -archivePath build/App.xcarchive ...`
      }
    ],
    quiz: [
      {
        question: "1. What is the default access control level of a `struct`, `class`, or `func` in Swift (unlike Kotlin where `public` is the default)?",
        options: [
          "`private`",
          "`internal` (visible only within the same module/target)",
          "`public`",
          "`open`"
        ],
        correctIndex: 1,
        explanation: "In Swift, `internal` is the default access level. Furthermore, even if you mark a `struct` as `public` in an SPM module, its synthesized memberwise `init` remains `internal` unless you explicitly write `public init(...)`!"
      },
      {
        question: "2. Why do you have to explicitly write `public init(...)` on a `public struct` inside a Swift Package module if you want other modules to construct it?",
        options: [
          "Because structs don't have initializers",
          "Because Swift's compiler-synthesized memberwise initializer for a `struct` is `internal` by default so module authors don't accidentally lock themselves into a public ABI contract",
          "Because SPM doesn't support structs",
          "Only classes need `public init`"
        ],
        correctIndex: 1,
        explanation: "This trips up every developer creating their first Swift Package! A `public struct`'s auto-generated memberwise initializer is `internal`—you must declare `public init(...)` explicitly."
      },
      {
        question: "3. What is the difference between `public` and `open` on a Swift `class`?",
        options: [
          "`open` is for structs; `public` is for classes",
          "`public` allows other modules to use the class, but ONLY `open` allows other modules to subclass it or override its methods",
          "They are 100% identical",
          "`open` makes all properties global"
        ],
        correctIndex: 1,
        explanation: "Just like Kotlin makes classes `final` by default unless marked `open`, Swift prevents cross-module subclassing of a `public class` unless it is explicitly marked `open`."
      },
      {
        question: "4. What is the Swift 5.9+ `package` access control modifier used for?",
        options: [
          "Making a symbol visible across multiple targets inside the SAME `Package.swift` without exposing it as `public` to external consumers of the library",
          "Publishing a package to CocoaPods",
          "Creating an Android APK package",
          "Hiding code from unit tests"
        ],
        correctIndex: 0,
        explanation: "`package` access sits right between `internal` (single target) and `public` (world-visible), letting feature and core targets within the same `Package.swift` share APIs cleanly."
      },
      {
        question: "5. What are the 3 core components bound together inside an iOS Development Provisioning Profile?",
        options: [
          "Gradle, Maven, and ProGuard",
          "Developer Signing Certificate, App ID (Bundle ID + Entitlements), and registered physical Device UDIDs",
          "HTML, CSS, and JavaScript",
          "App Store Screenshots, Privacy Policy, and Price Tier"
        ],
        correctIndex: 1,
        explanation: "An iOS Provisioning Profile cryptographically links Who is signing (Certificate), What app & capabilities are allowed (App ID + Entitlements), and Where it can run (Device UDIDs)."
      },
      {
        question: "6. Which plain-text file format do iOS teams use to manage environment-specific build settings (like Staging vs. Production Bundle IDs and API URLs) outside `.xcodeproj`?",
        options: [
          "`.xcconfig` (Xcode Configuration files)",
          "`build.gradle.kts`",
          "`local.properties`",
          "`Podfile.lock`"
        ],
        correctIndex: 0,
        explanation: "`.xcconfig` files store key-value build settings in diff-friendly plain text that can be assigned to Debug, Staging, and Release configurations."
      },
      {
        question: "7. What is an iOS **Entitlements** file (`.entitlements`) equivalent to on Android?",
        options: [
          "`styles.xml`",
          "Privileged OS-level capability declarations (like Push Notifications `aps-environment`, App Groups, Sign in with Apple, Associated Domains for Universal Links) cryptographically signed by Apple",
          "`proguard-rules.pro`",
          "`strings.xml`"
        ],
        correctIndex: 1,
        explanation: "While `Info.plist` holds general metadata and permission prompt strings (like Camera usage), `.entitlements` declares hardware/cloud capabilities that must match your App ID in the Apple Developer Portal."
      },
      {
        question: "8. Where do you declare user-facing privacy permission descriptions on iOS (such as why your app needs Camera or Location access, similar to `<uses-permission>` in `AndroidManifest.xml`)?",
        options: [
          "Inside `Info.plist` using `NS...UsageDescription` keys (e.g., `NSCameraUsageDescription`)",
          "Inside `Package.swift`",
          "Inside `AppDelegate.swift` comments",
          "iOS does not require permission strings"
        ],
        correctIndex: 0,
        explanation: "If you request Camera or Location access on iOS without the corresponding `NSCameraUsageDescription` / `NSLocationWhenInUseUsageDescription` key in `Info.plist`, iOS terminates the app immediately!"
      },
      {
        question: "9. What is Apple's equivalent to Android App Links (`assetlinks.json`) for opening verified HTTPS web links directly inside your native iOS app?",
        options: [
          "**Universal Links** (verified via an `apple-app-site-association` JSON file hosted at `/.well-known/apple-app-site-association` + the Associated Domains entitlement)",
          "Custom URL Schemes (`myapp://`) only",
          "`IntentFilter`",
          "Bluetooth Beacons"
        ],
        correctIndex: 0,
        explanation: "Universal Links pair an `applinks:yourdomain.com` Associated Domains entitlement with `/.well-known/apple-app-site-association` on your HTTPS server."
      },
      {
        question: "10. What happens during App Store Review if your app includes third-party SDKs or uses required-reason APIs (like `UserDefaults` or file timestamps) without a **Privacy Manifest (`PrivacyInfo.xcprivacy`)**?",
        options: [
          "Nothing; Apple ignores it",
          "App Store Connect flags or rejects the binary during upload validation until `PrivacyInfo.xcprivacy` declares the required API reasons and tracking domains",
          "The app runs slower",
          "Xcode deletes the project"
        ],
        correctIndex: 1,
        explanation: "Apple enforces `PrivacyInfo.xcprivacy` manifests during App Store Connect submission whenever required-reason APIs (like `UserDefaults` or disk space checks) or common third-party SDKs are present."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 10 Capstone Entry Point: (1) Mark `CapstoneApp` with `@main`, (2) Conform to `App`, and (3) Attach `.modelContainer(for: Bookmark.self)` to the `WindowGroup`.",
      starterCode: `import SwiftUI
import SwiftData

// TODO 1: Add @main and conform CapstoneApp to App
struct CapstoneApp {
    var body: some Scene {
        // TODO 2: Attach .modelContainer(for: Bookmark.self) to WindowGroup
        WindowGroup {
            ContentView()
        }
    }
}`,
      solutionCode: `import SwiftUI
import SwiftData

@main
struct CapstoneApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: Bookmark.self)
    }
}`,
      simulatedOutput: `✓ @main CapstoneApp: App entry point verified
✓ WindowGroup scene configured with SwiftData .modelContainer(for: Bookmark.self)
🎉 Congratulations! All 10 Weeks of the Android-to-iOS Academy Completed!`,
      requiredTokens: ["@main", ": App", "WindowGroup", ".modelContainer(for: Bookmark.self)"]
    },
    linkedinPost: `Week 10: We made it before New Year! 🎉📱🍎
10 Weeks ago, I was strictly an Android Developer. Today, I’ve completed a full 10-week deep dive into modern iOS engineering (Swift 6, SwiftUI, Swift Concurrency, Actors, SwiftData, Keychain, Swift Testing, and SPM Modular Architecture)—and open-sourced the entire interactive academy!

Here is what Week 10 covers for shipping to production:
1️⃣ Multi-Module Gradle -> Local Swift Packages (Package.swift) & the 'public init' gotcha
2️⃣ Product Flavors -> .xcconfig files & Xcode Schemes
3️⃣ Keystore & Play Console -> Provisioning Profiles, Entitlements, PrivacyInfo.xcprivacy & TestFlight

🌐 Want to learn iOS through your Android mental models too?
I built a free, interactive 10-Week Tutorial Website with 100 quiz questions, live memory/layout simulators, flashcards, and hands-on Swift code labs:
🔗 https://sudhakar-r08.github.io/ios-for-android-devs/
📂 GitHub Repo: https://github.com/sudhakar-r08/ios-for-android-devs

#AndroidDev #iOSDev #Swift6 #SwiftUI #Kotlin #JetpackCompose #MobileEngineering #LearningInPublic`,
    linkedinArticle: `# Week 10: From Android Engineer to Shipping on iOS Before New Year — Multi-Module SPM, Code Signing & Retrospective

Ten weeks ago, I set a public goal: learn modern iOS development before the New Year by mapping every concept directly to the Android engineering mental models I already knew—and document every week so other mobile developers could follow the same path.

In this final Week 10 article, we cover **Modularization with Swift Package Manager (\`Package.swift\`)**, **Build Flavors with \`.xcconfig\`**, **Code Signing & Provisioning Profiles**, and the biggest lessons from my 10-week journey.`
  }
];
