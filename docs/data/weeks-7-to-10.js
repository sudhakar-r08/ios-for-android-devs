// ============================================================================
// WEEKS 7 TO 10: Networking/DI, Persistence, Memory Internals & Capstone
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
    dailySteps: [
      {
        day: 1,
        title: "URLSession Basics: Fetching Data with async/await",
        time: "15 mins",
        goal: "Make your first HTTP GET request using Apple's built-in URLSession without external libraries.",
        shift: "Retrofit ➔ `URLSession.shared.data(from: url)`. No interface code-gen needed.",
        details: [
          "<strong>One-Line Networking:</strong> `let (data, response) = try await URLSession.shared.data(from: url)` fetches data asynchronously and suspends cleanly.",
          "<strong>Checking Status Codes:</strong> Unlike Retrofit, URLSession doesn't throw on HTTP 404/500 automatically; inspect `(response as? HTTPURLResponse)?.statusCode`."
        ],
        kotlinCode: `interface ApiService {
    @GET("users")
    suspend fun getUsers(): List<UserDto>
}`,
        swiftCode: `let url = URL(string: "https://api.example.com/users")!
let (data, response) = try await URLSession.shared.data(from: url)
guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
    throw URLError(.badServerResponse)
}`
      },
      {
        day: 2,
        title: "JSON Decoding with Compiler-Synthesized Codable",
        time: "15 mins",
        goal: "Decode JSON into Swift structs automatically without boilerplate reflection.",
        shift: "Moshi / Kotlinx Serialization ➔ Swift `Codable` (typealias for `Encodable & Decodable`).",
        details: [
          "<strong>Zero Annotations:</strong> A `struct` conforming to `Codable` automatically knows how to decode itself.",
          "<strong>Snake-Case Mapping:</strong> Use `decoder.keyDecodingStrategy = .convertFromSnakeCase` to map `user_name` to `userName` without writing custom keys."
        ],
        kotlinCode: `@Serializable
data class GitHubRepo(val id: Int, @SerialName("stargazers_count") val stars: Int)`,
        swiftCode: `struct GitHubRepo: Codable {
    let id: Int
    let stars: Int

    enum CodingKeys: String, CodingKey {
        case id
        case stars = "stargazers_count"
    }
}`
      },
      {
        day: 3,
        title: "Building a Clean APIClient Wrapper",
        time: "15 mins",
        goal: "Create a reusable HTTP service layer that handles authentication headers and JSON decoding.",
        shift: "OkHttp client configuration ➔ A lightweight Swift service struct or actor.",
        details: [
          "Encapsulate URL building, Bearer token injection, and JSONDecoder into a reusable `HTTPClient` protocol."
        ],
        kotlinCode: `class NetworkClient(private val okHttp: OkHttpClient)`,
        swiftCode: `protocol HTTPClient: Sendable {
    func fetch<T: Decodable>(_ endpoint: String) async throws -> T
}`
      },
      {
        day: 4,
        title: "Clean Dependency Injection without Hilt",
        time: "15 mins",
        goal: "Inject API services into ViewModels using protocols and initializers.",
        shift: "Dagger/Hilt `@Inject` ➔ Protocol Constructor Injection + `@Environment`.",
        details: [
          "Because you instantiate your ViewModels in `@main App` or parent views, simple initializer injection (`init(client: HTTPClient)`) works cleanly without annotation processors."
        ],
        kotlinCode: `@HiltViewModel
class FeedViewModel @Inject constructor(private val api: ApiService) : ViewModel()`,
        swiftCode: `@Observable
@MainActor
final class FeedViewModel {
    private let client: any HTTPClient
    init(client: any HTTPClient = LiveHTTPClient()) { self.client = client }
}`
      },
      {
        day: 5,
        title: "Week 7 Project, Quiz & LinkedIn Kit",
        time: "20 mins",
        goal: "Build a live API data viewer, complete the networking quiz, and post your reflection.",
        shift: "Celebrate fetching real data from the web using 100% native Apple APIs.",
        details: [
          "Connect a live GitHub or Weather API to your SwiftUI screen and verify decoding."
        ],
        kotlinCode: `viewModelScope.launch { val repos = api.getUsers() }`,
        swiftCode: `.task { await viewModel.loadRepos() }`
      }
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
        question: "3. How can you decode JSON with `snake_case` keys into a Swift struct with `camelCase` properties without writing manual `CodingKeys`?",
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
        question: "4. Why do most iOS architectures rely on Protocol Initializer Injection + `@Environment` rather than annotation-processor DI frameworks like Dagger/Hilt?",
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
        question: "5. What happens if a JSON payload is missing a key for a property declared as non-optional `let bio: String` in your `Codable` struct?",
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
        question: "6. How do you map a JSON key named `\"created_at_utc\"` to a property named `date` when standard snake_case conversion is not enough?",
        options: [
          "Use `@SerializedName(\"created_at_utc\")`",
          "Define a `private enum CodingKeys: String, CodingKey` inside the struct with `case date = \"created_at_utc\"`",
          "Override the `init(from decoder:)` by hand only",
          "It is not possible in Swift"
        ],
        correctIndex: 1,
        explanation: "Declaring a `CodingKeys: String, CodingKey` enum lets you customize specific key mappings while the compiler generates the rest."
      },
      {
        question: "7. How do you configure a `POST` request with a JSON body using native `URLSession`?",
        options: [
          "Pass a dictionary to `URLSession.shared.post(...)`",
          "Construct a `var request = URLRequest(url: ...)`, set `httpMethod = \"POST\"`, add `\"Content-Type\": \"application/json\"` header, and set `httpBody = try JSONEncoder().encode(payload)`",
          "Use an XML serializer",
          "Call `request.setPayload(jsonString)`"
        ],
        correctIndex: 1,
        explanation: "Swift's `URLRequest` allows setting the HTTP method, headers, and `httpBody` bytes encoded directly by `JSONEncoder`."
      },
      {
        question: "8. What does `(data, response)` return when calling `try await URLSession.shared.data(for: request)`?",
        options: [
          "A JSON string and an error object",
          "A tuple containing the raw response bytes (`Data`) and the network metadata (`URLResponse`)",
          "A parsed dictionary and a status integer",
          "A stream of websocket packets"
        ],
        correctIndex: 1,
        explanation: "`URLSession.shared.data(...)` returns a 2-tuple: `Data` (raw payload) and `URLResponse` (which can be cast to `HTTPURLResponse` for headers and status code)."
      },
      {
        question: "9. If your API returns ISO-8601 formatted timestamp strings, how do you decode them directly into Swift `Date` objects?",
        options: [
          "Write manual regex string parsing for every date",
          "Set `decoder.dateDecodingStrategy = .iso8601` on your `JSONDecoder` instance",
          "Convert timestamps to milliseconds first",
          "Dates must be decoded as Strings first"
        ],
        correctIndex: 1,
        explanation: "Setting `decoder.dateDecodingStrategy = .iso8601` allows `JSONDecoder` to automatically parse ISO date strings into native Swift `Date` values."
      },
      {
        question: "10. What is the recommended way to mock network calls in Swift unit tests without hitting real backend servers?",
        options: [
          "Hardcode a 5-second sleep in the app",
          "Extract the network client into a `protocol APIClientProtocol`, and inject a `MockAPIClient: APIClientProtocol` in your unit tests",
          "Disable WiFi on the developer's Mac",
          "Modify the production API endpoint URLs to test localhost"
        ],
        correctIndex: 1,
        explanation: "Protocol-based dependency injection allows seamlessly swapping real networking implementations with mock stubs during tests."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 7 Networking Lab: (1) Conform `UserDTO` to `Codable`, (2) Map `fullName` to `\"full_name\"` inside `enum CodingKeys: String, CodingKey`, and (3) Decode using `JSONDecoder()`.",
      starterCode: `struct UserDTO {
    let fullName: String
}

func parseUser(data: Data) throws -> UserDTO {
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
When I built the networking layer in Week 7 on iOS, I was shocked that Apple baked all of these directly into the language and standard library:

1️⃣ Retrofit + OkHttp -> URLSession (native async/await & cooperative task cancellation)
2️⃣ Moshi / Kotlinx Serialization -> Compiler-synthesized Codable (with 1-line .convertFromSnakeCase)
3️⃣ Dagger / Hilt -> Protocol Initializer Injection + @Environment

⚠️ Pro-tip for Android devs: URLSession does NOT throw on HTTP 404/500 by default—you must check (response as? HTTPURLResponse)?.statusCode!

🔗 Follow my daily steps on GitHub: https://github.com/sudhakar-r08/ios-for-android-devs
🌐 Tutorial Site: https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #Swift #Kotlin #MobileArchitecture`,
    linkedinArticle: `# Week 7: Replacing Retrofit, OkHttp, Moshi, and Hilt with First-Party Swift APIs

On Android, our networking and dependency injection stack relies on third-party libraries. In Week 7, I built a clean REST networking and DI architecture using zero external dependencies...`
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
      { front: "How does SwiftData's `@Model` macro relate to Room's `@Entity`?", back: "`@Model` transforms a Swift class into a persisted schema managed by `ModelContainer` and `ModelContext` (built on Core Data's SQLite engine) and automatically makes it `@Observable`!" },
      { front: "What does `@Query` do inside a SwiftUI `View`?", back: "It fetches `@Model` records from the environment's `ModelContext` and automatically re-renders the SwiftUI View whenever matching records change (like a Room `@Dao` returning `Flow<List<T>>` + `collectAsState`)." },
      { front: "Why must you NEVER store OAuth tokens or passwords in `UserDefaults` / `@AppStorage`?", back: "`UserDefaults` is stored as an unencrypted `.plist` file in the app sandbox that can be read from unencrypted backups. Sensitive secrets must always go into the hardware-backed **iOS Keychain**." },
      { front: "What happens to iOS Keychain items vs `UserDefaults` when the user uninstalls your app?", back: "`UserDefaults` is deleted immediately on app uninstall. Keychain items can persist across app reinstalls unless explicitly cleared on first launch!" }
    ],
    dailySteps: [
      {
        day: 1,
        title: "Preferences DataStore ➔ @AppStorage (UserDefaults)",
        time: "15 mins",
        goal: "Save simple user preferences (dark mode, onboarding complete) in 1 line of code.",
        shift: "Preferences DataStore ➔ `@AppStorage(\"key\") var isDark = false`.",
        details: [
          "`@AppStorage` directly connects a `UserDefaults` key to a SwiftUI view's state."
        ],
        kotlinCode: `val IS_ONBOARDED = booleanPreferencesKey("onboarded")`,
        swiftCode: `@AppStorage("is_onboarded") private var isOnboarded = false`
      },
      {
        day: 2,
        title: "Room ➔ SwiftData: The @Model Macro",
        time: "15 mins",
        goal: "Define a local SQLite schema using Swift classes.",
        shift: "Room `@Entity` ➔ SwiftData `@Model` class.",
        details: [
          "Annotate a Swift class with `@Model`. SwiftData generates tables, indexes, and observation automatically."
        ],
        kotlinCode: `@Entity data class Task(@PrimaryKey val id: String, val title: String)`,
        swiftCode: `@Model final class Task { @Attribute(.unique) var id: String; var title: String; init(id: String, title: String) { self.id = id; self.title = title } }`
      },
      {
        day: 3,
        title: "Live Database Updates with @Query",
        time: "15 mins",
        goal: "Stream live database results straight into a SwiftUI List without writing manual DAOs.",
        shift: "Room DAO `Flow<List<Task>>` ➔ SwiftData `@Query`.",
        details: [
          "`@Query(sort: \\Task.title) private var tasks: [Task]` automatically updates the View when records change."
        ],
        kotlinCode: `@Query("SELECT * FROM Task") fun observe(): Flow<List<Task>>`,
        swiftCode: `@Query(sort: \\Task.title) private var tasks: [Task]`
      },
      {
        day: 4,
        title: "EncryptedSharedPreferences ➔ iOS Keychain",
        time: "15 mins",
        goal: "Safely store sensitive session tokens in the hardware-backed iOS Keychain.",
        shift: "Android Keystore / EncryptedSharedPreferences ➔ iOS Keychain Services (`Security` framework).",
        details: [
          "Never put passwords or API tokens in `UserDefaults`. Use the Keychain for hardware-encrypted storage."
        ],
        kotlinCode: `EncryptedSharedPreferences.create(...)`,
        swiftCode: `// Stored in hardware Secure Enclave via SecItemAdd`
      },
      {
        day: 5,
        title: "Week 8 Mini-Project, Quiz & LinkedIn Post",
        time: "20 mins",
        goal: "Implement local task caching, test your knowledge, and post your reflection.",
        shift: "Appreciate how SwiftData eliminates separate DAO and Database abstract class boilerplate.",
        details: [
          "Save, read, and delete items with `modelContext.insert()` and `modelContext.delete()`."
        ],
        kotlinCode: `taskDao.insert(task)`,
        swiftCode: `modelContext.insert(task)`
      }
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
        kotlinCode: `val ONBOARDED_KEY = booleanPreferencesKey("onboarded")`,
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
          "<strong>Keychain Accessibility Levels:</strong> Use `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` so tokens are only readable while the device is unlocked."
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
        options: ["`@Entity`", "`@Model`", "`@Persistable`", "`@Table`"],
        correctIndex: 1,
        explanation: "The `@Model` macro from `SwiftData` synthesizes schema metadata, persistence tracking, and `@Observable` conformance on your model class."
      },
      {
        question: "2. Why must OAuth access tokens and API secrets be stored in the **iOS Keychain** rather than `UserDefaults` / `@AppStorage`?",
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
        question: "3. What happens to iOS Keychain items when a user uninstalls and reinstalls your app?",
        options: [
          "Keychain items are deleted every time the phone reboots",
          "Keychain items persist across app uninstalls unless explicitly wiped",
          "Keychain items are uploaded to GitHub",
          "Keychain items become public"
        ],
        correctIndex: 1,
        explanation: "Because Keychain storage lives outside the app bundle sandbox, items remain in Keychain after uninstall unless cleared on first launch."
      },
      {
        question: "4. How do you insert or delete a SwiftData `@Model` instance from inside a SwiftUI View?",
        options: [
          "Read `@Environment(\\.modelContext) private var context` and call `context.insert(item)` or `context.delete(item)`",
          "Write raw SQL strings",
          "Mutate the `@Query` array directly",
          "Call `UserDefaults.standard.save(item)`"
        ],
        correctIndex: 0,
        explanation: "`ModelContext` tracks insertions, mutations, and deletions for SwiftData entities."
      },
      {
        question: "5. How do you stream live database query results directly into a SwiftUI view in SwiftData?",
        options: [
          "Call `room.observeAsState()`",
          "Use the `@Query` property wrapper",
          "Poll the database with a timer",
          "Use `@State` only"
        ],
        correctIndex: 1,
        explanation: "`@Query` automatically observes SwiftData changes and re-evaluates the view body when matching records are modified."
      },
      {
        question: "6. How do you define relationships between `@Model` classes in SwiftData (e.g. an `Author` having many `Book`s)?",
        options: [
          "By defining foreign key integer columns like in SQLite",
          "By defining properties that directly reference other `@Model` types (e.g. `var books: [Book] = []`), optionally annotated with `@Relationship(deleteRule: .cascade)`",
          "By writing SQL JOIN queries in an XML file",
          "SwiftData does not support one-to-many relationships"
        ],
        correctIndex: 1,
        explanation: "SwiftData manages relationships natively using Swift reference types, allowing cascading delete rules and inverse relationships."
      },
      {
        question: "7. How do you filter and sort records using `@Query` in SwiftData?",
        options: [
          "Pass raw SQL strings like `\"SELECT * WHERE active = 1 ORDER BY date DESC\"`",
          "Use `#Predicate<T>` and `SortDescriptor` within the `@Query` initializer: `@Query(filter: #Predicate { $0.isDone == false }, sort: \\.createdDate, order: .reverse)`",
          "Filter the Swift array manually in memory after loading all records",
          "Use a regex search string"
        ],
        correctIndex: 1,
        explanation: "SwiftData uses type-safe `#Predicate` macros and `SortDescriptor` keypaths, translating them into optimized SQLite queries under the hood."
      },
      {
        question: "8. What is the SwiftUI equivalent of Android's `SharedPreferences` or `DataStore` for simple user settings (e.g., dark mode toggle)?",
        options: [
          "`@AppStorage` backed by `UserDefaults`",
          "`@DatabaseState`",
          "`@MemoryStore`",
          "`@RoomSetting`"
        ],
        correctIndex: 0,
        explanation: "`@AppStorage(\"key\")` reads and writes to `UserDefaults`, automatically triggering view updates whenever the stored value changes."
      },
      {
        question: "9. Does SwiftData require manual calls to `context.save()` after every record insertion?",
        options: [
          "Yes, data is lost immediately if `save()` is omitted",
          "No, SwiftData enables autosave by default on the main thread, persisting changes automatically during runloop idle ticks",
          "It saves only when the phone restarts",
          "It saves only when the app is backgrounded"
        ],
        correctIndex: 1,
        explanation: "SwiftData features automatic context saving on the main actor runloop, though explicit `try context.save()` can still be called when immediate disk persistence is required."
      },
      {
        question: "10. How is schema migration handled in SwiftData for non-trivial changes (such as renaming or transforming columns)?",
        options: [
          "Uninstalling and reinstalling the app is required",
          "Using `VersionedSchema` and `SchemaMigrationPlan` to declare explicit migration stages between schema versions",
          "Editing SQLite files directly with terminal scripts",
          "SwiftData migrations are purely handled in Xcode project settings"
        ],
        correctIndex: 1,
        explanation: "Complex SwiftData schema transformations use `VersionedSchema` definitions and a `SchemaMigrationPlan` specifying lightweight or custom migration stages."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 8 Persistence Lab: (1) Annotate `Habit` with `@Model`, (2) Mark `id` with `@Attribute(.unique)`, and (3) Use `@Query` inside `HabitListView`.",
      starterCode: `import SwiftData

final class Habit {
    var id: String
    var name: String
    init(id: String, name: String) { self.id = id; self.name = name }
}

struct HabitListView: View {
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

How does local storage on iOS compare to our Android toolkit?

1️⃣ Room (@Entity + @Dao + Flow) -> SwiftData (@Model + @Query)
In SwiftData, annotating a class with @Model defines the SQLite schema, and @Query streams live updates directly into your SwiftUI View—eliminating separate DAO boilerplate!

2️⃣ Preferences DataStore -> @AppStorage ("UserDefaults")
Great for lightweight flags like dark mode or onboarding in 1 line.

3️⃣ EncryptedSharedPreferences -> iOS Keychain Services
⚠️ Never store JWTs/tokens in UserDefaults (it's unencrypted plaintext!). Always use the hardware-backed Keychain.

🔗 Follow along on GitHub: https://github.com/sudhakar-r08/ios-for-android-devs
🌐 Tutorial: https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #SwiftData #RoomDatabase #MobileSecurity #SwiftUI`,
    linkedinArticle: `# Week 8: From Room & DataStore to SwiftData (\`@Model\`, \`@Query\`) and the iOS Keychain

Every mobile developer needs local persistence. In Week 8, I explored how iOS handles databases and credentials...`
  },

  // ==========================================================================
  // WEEK 9: MEMORY INTERNALS (ARC, RETAIN CYCLES) & SWIFT TESTING
  // ==========================================================================
  {
    week: 9,
    dates: "Dec 15 – Dec 21",
    title: "Memory Internals (ARC, Retain Cycles) & Swift Testing",
    subtitle: "Now that you've built real ViewModels and async flows: Under the hood of ARC vs. Garbage Collection, breaking Retain Cycles with `[weak self]`, Copy-on-Write, and modern Swift Testing.",
    androidAnchor: "ART Tracing GC, LeakCanary, JUnit 5 + MockK, Android Studio Memory Profiler",
    iosAnchor: "Automatic Reference Counting (ARC), `weak`/`unowned`, `[weak self]`, Swift Testing (`@Test`, `#expect`), Memory Graph Debugger",
    simulatorType: "arc-and-cow",
    flashcards: [
      { front: "How does iOS Automatic Reference Counting (ARC) differ from Android's Garbage Collector?", back: "Android's ART periodically scans object trees from roots to collect unreferenced memory. iOS ARC uses compile-time retain (+1) and release (-1) operations; memory is deallocated the exact instant reference count hits 0." },
      { front: "What is a Retain Cycle in iOS, and why doesn't the JVM have this issue?", back: "When Object A holds a strong reference to Object B, and Object B holds a strong reference to Object A, their retain counts never hit 0, leaking memory. The JVM's tracing GC can collect cyclic islands as long as they are unreachable from roots." },
      { front: "How do you break a retain cycle in a Swift closure?", back: "Use a capture list with `[weak self] in` so the closure does not increment the parent's retain count." },
      { front: "What is Copy-on-Write (CoW) in Swift collections?", back: "Swift structs like `Array` and `Dictionary` share their underlying memory buffer on assignment (`var b = a`). The buffer is only duplicated when one of the copies actually mutates." },
      { front: "How does modern Swift Testing (`import Testing`) replace legacy XCTest?", back: "Uses `@Test` macros on functions inside value-type `struct`s ( fresh instance per test!) and a single `#expect(...)` assertion macro." }
    ],
    dailySteps: [
      {
        day: 1,
        title: "How ARC Works Under the Hood vs. JVM GC",
        time: "15 mins",
        goal: "Understand deterministic deallocation: why deinit runs immediately when retain count hits 0.",
        shift: "JVM tracing GC sweeps memory at non-deterministic times; Swift ARC deallocates the exact microsecond the last reference drops.",
        details: [
          "<strong>Deterministic Lifetime:</strong> When a class instance reference goes out of scope, its `deinit` method executes immediately on the current thread.",
          "<strong>Zero GC Pauses:</strong> ARC eliminates unpredictable Garbage Collector pauses during UI scrolling."
        ],
        kotlinCode: `class MyService {
    // In Kotlin, finalize() is deprecated and unpredictable
}`,
        swiftCode: `class MyService {
    deinit {
        print("Deallocated deterministically right now!")
    }
}`
      },
      {
        day: 2,
        title: "Retain Cycles & The [weak self] Closure Fix",
        time: "15 mins",
        goal: "Identify and eliminate memory leaks between ViewModels and closures.",
        shift: "On Android, LeakCanary finds activity leaks; in iOS, `[weak self]` in closures prevents leaks at the source.",
        details: [
          "<strong>The Retain Cycle:</strong> If a ViewModel holds a closure in a property and that closure captures `self` strongly, neither can ever deallocate.",
          "<strong>Breaking the Cycle:</strong> Add `[weak self]` in the closure capture list, followed by `guard let self else { return }`."
        ],
        kotlinCode: `// Android: Lambda captures this, but tracing GC collects both once screen destroys
viewModel.onUpdate = { updateUI() }`,
        swiftCode: `// Swift: [weak self] is essential to break the retain cycle!
viewModel.onUpdate = { [weak self] in
    guard let self else { return }
    self.updateUI()
}`
      },
      {
        day: 3,
        title: "Copy-on-Write (CoW) in Swift Collections",
        time: "15 mins",
        goal: "Understand how Swift arrays and dictionaries stay fast despite value semantics.",
        shift: "Assignment `var b = a` is $O(1)$ fast because the underlying heap buffer is shared until a mutation occurs.",
        details: [
          "Only when `b.append(...)` is called does Swift copy the buffer to preserve value isolation."
        ],
        kotlinCode: `val b = ArrayList(a) // Eager copy in Java/Kotlin`,
        swiftCode: `var b = a // O(1) shared buffer via Copy-on-Write until mutated!`
      },
      {
        day: 4,
        title: "Modern Swift Testing: @Test and #expect",
        time: "15 mins",
        goal: "Write fast, readable unit tests using Apple's modern Testing framework.",
        shift: "JUnit 5 `@Test` and `assertEquals` ➔ Swift Testing `@Test` and `#expect(a == b)`.",
        details: [
          "<strong>Value-Type Suites:</strong> Test suites are `struct`s, meaning each test runs in a fresh, isolated copy with zero shared state bugs.",
          "<strong>Single Assertion Macro:</strong> `#expect(...)` captures full comparison diagnostics on failure."
        ],
        kotlinCode: `@Test
fun testCartTotal() {
    val cart = Cart()
    assertEquals(0, cart.total)
}`,
        swiftCode: `import Testing

struct CartTests {
    @Test func cartTotalStartsAtZero() {
        let cart = Cart()
        #expect(cart.total == 0)
    }
}`
      },
      {
        day: 5,
        title: "Debugging Memory with Xcode Memory Graph",
        time: "20 mins",
        goal: "Use Xcode's Debug Memory Graph to spot retain cycles visually, take the quiz, and publish Week 9.",
        shift: "See your live object graph in 1 click without waiting for an external heap dump.",
        details: [
          "Click the Debug Memory Graph button in Xcode to see purple exclamation marks for retain cycles.",
          "Complete the Week 9 lab and publish your memory insights on LinkedIn!"
        ],
        kotlinCode: `// LeakCanary notification on Android`,
        swiftCode: `// Xcode Debug Memory Graph shows retain cycles visually`
      }
    ],
    concepts: [
      {
        heading: "1. Automatic Reference Counting (ARC) vs. Tracing GC",
        shift: "Swift uses compile-time retain (+1) and release (-1) calls; objects deallocate deterministically at retainCount == 0.",
        details: [
          "No GC pauses during smooth scrolling.",
          "Class instances deallocate immediately when their last strong reference disappears."
        ],
        kotlinCode: `class ViewModel { /* Cleaned up by ART tracing GC */ }`,
        swiftCode: `class ViewModel { deinit { print("Freed immediately!") } }`
      },
      {
        heading: "2. The Retain Cycle Trap & [weak self]",
        shift: "Strong reference cycles (`A <-> B`) keep retain counts at 1 forever; break them with `weak var` or `[weak self]`.",
        details: [
          "`weak` references must always be Optional `var`s because ARC zeroes them out upon deallocation."
        ],
        kotlinCode: `callback = { this.refresh() }`,
        swiftCode: `callback = { [weak self] in self?.refresh() }`
      },
      {
        heading: "3. Copy-on-Write (CoW) Performance",
        shift: "Swift collections share storage buffers until one copy is mutated, combining value safety with pointer speed.",
        details: [
          "Assigning large arrays is $O(1)$ fast."
        ],
        kotlinCode: `val copy = original.toList()`,
        swiftCode: `var copy = original // Shared until copy mutates!`
      },
      {
        heading: "4. Modern Swift Testing (`@Test` & `#expect`)",
        shift: "Replaces legacy XCTestCase with clean value-type struct test suites and rich `#expect` assertions.",
        details: [
          "Parameterized tests via `@Test(arguments: [...])` run in parallel by default."
        ],
        kotlinCode: `@Test fun verify() { assertEquals(4, 2 + 2) }`,
        swiftCode: `@Test func verify() { #expect(2 + 2 == 4) }`
      }
    ],
    quiz: [
      {
        question: "1. Why does a retain cycle in Swift cause a permanent memory leak, whereas in Java/Kotlin the tracing GC can still collect cyclic objects?",
        options: [
          "Because Swift has a smaller heap",
          "Because ARC relies strictly on reference counts hitting 0; if two objects hold strong references to each other, their counts never hit 0, whereas ART's tracing GC checks reachability from GC roots",
          "Because classes cannot be deleted in Swift",
          "Because iOS disables memory management in Release builds"
        ],
        correctIndex: 1,
        explanation: "ARC frees memory strictly when an object's retain count reaches 0. If two unreachable objects strongly reference each other, their counts remain at 1 forever unless broken with `weak`."
      },
      {
        question: "2. Why must a `weak` reference in Swift always be declared as an Optional `var` (e.g. `weak var delegate: MyDelegate?`)?",
        options: [
          "Because Swift classes don't support `let`",
          "Because when the referenced object deallocates, ARC automatically zeroes out the weak reference to `nil` to prevent dangling pointers",
          "Because weak references are saved to disk",
          "Only for Objective-C protocols"
        ],
        correctIndex: 1,
        explanation: "ARC zeroing weak references mutate the pointer to `nil` when the target is freed, requiring the property to be mutable (`var`) and nullable (`Optional`)."
      },
      {
        question: "3. When passing an escaping closure into a ViewModel or service that references `self`, how do you prevent a retain cycle?",
        options: [
          "Use a capture list with `[weak self] in`",
          "Make the ViewModel a struct",
          "Call `System.gc()`",
          "Delete the closure"
        ],
        correctIndex: 0,
        explanation: "Adding `[weak self] in` to the closure's capture list prevents the closure from holding a strong retain on the enclosing instance."
      },
      {
        question: "4. In modern Swift Testing (`import Testing`), what is the primary assertion macro used to verify conditions?",
        options: [
          "`XCTAssertEqual(...)`",
          "`#expect(...)`",
          "`assert(...)`",
          "`assertThat(...)`"
        ],
        correctIndex: 1,
        explanation: "The `#expect(...)` macro is the modern assertion tool in Swift Testing, capturing full expression values on failure."
      },
      {
        question: "5. How does Swift's Copy-on-Write (CoW) optimize collection assignments like `var b = a`?",
        options: [
          "It compresses the array with gzip",
          "Both variables share the exact same underlying memory buffer until one of them is mutated, at which point a fresh copy is allocated",
          "It duplicates the entire array eagerly on the stack",
          "It converts the array into a linked list"
        ],
        correctIndex: 1,
        explanation: "CoW gives you the safety of value semantics with the speed of reference passing by deferring buffer copying until an actual write occurs."
      },
      {
        question: "6. What is the difference between `unowned` and `weak` in Swift?",
        options: [
          "`unowned` can be used on structs, `weak` cannot",
          "`weak` becomes `nil` when deallocated (requiring Optional); `unowned` assumes the reference will NEVER outlive the target and crashes if accessed after deallocation",
          "`unowned` stores data in Keychain",
          "There is no difference; they are aliases"
        ],
        correctIndex: 1,
        explanation: "Use `weak` whenever the referenced object can legitimately become `nil`. Use `unowned` only when lifetimes are strictly coupled (like child-parent where parent outlives child)."
      },
      {
        question: "7. Why do Swift `struct` and `enum` types never suffer from strong reference cycles?",
        options: [
          "Because the compiler bans closures inside structs",
          "Because value types are copied rather than referenced by pointer; they have no heap identity or retain counts",
          "Because they are garbage collected by the OS",
          "Because structs cannot hold references to classes"
        ],
        correctIndex: 1,
        explanation: "Value semantics mean each struct has its own independent value representation, preventing cyclic pointer loops between instances."
      },
      {
        question: "8. What built-in Xcode tool helps you visually identify retain cycles and memory leaks without third-party libraries?",
        options: [
          "The Xcode Memory Graph Debugger (and Instruments Leaks template)",
          "The Android Logcat window",
          "The Terminal top command",
          "The Git history viewer"
        ],
        correctIndex: 0,
        explanation: "Clicking the 'Debug Memory Graph' button in Xcode pauses execution and visualizes live object references with purple warnings on cycles."
      },
      {
        question: "9. How do you organize related test functions into a suite using modern Swift Testing (Xcode 16+)?",
        options: [
          "Subclass `XCTestCase`",
          "Create a `struct` or `class` annotated with `@Suite(\"Suite Name\")` containing `@Test` functions",
          "Write tests inside an XML file",
          "Use `@RunWith(JUnit4::class)`"
        ],
        correctIndex: 1,
        explanation: "Swift Testing uses lightweight value-type structs optionally marked with `@Suite` to organize parallelized test functions."
      },
      {
        question: "10. In Swift Testing, how do you run parameterized test cases across multiple test input arguments?",
        options: [
          "Write a `for` loop inside a single test",
          "Pass an array to the `@Test(arguments: [...])` attribute",
          "Duplicate the test function 10 times",
          "Use a CSV file reader"
        ],
        correctIndex: 1,
        explanation: "Swift Testing supports native parameterized testing directly via `@Test(arguments: [input1, input2])` running iterations concurrently."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 9 Memory Lab: (1) Break the retain cycle in `DownloadTask` with `weak var manager`, and (2) Write a test using `@Test` and `#expect`.",
      starterCode: `class DownloadManager {
    var task: DownloadTask?
}

class DownloadTask {
    // TODO 1: Add 'weak' before var manager
    var manager: DownloadManager?
}

// TODO 2: Annotate with @Test and assert #expect(1 + 1 == 2)
func mathTest() {
    
}`,
      solutionCode: `class DownloadManager {
    var task: DownloadTask?
}

class DownloadTask {
    weak var manager: DownloadManager?
}

import Testing

@Test
func mathTest() {
    #expect(1 + 1 == 2)
}`,
      simulatedOutput: `✓ weak var manager breaks retain cycle with DownloadManager
✓ @Test mathTest() passed with #expect assertion!`,
      requiredTokens: ["weak var manager", "@Test", "#expect"]
    },
    linkedinPost: `Week 9 of Android -> iOS Before New Year: Memory Internals (ARC vs GC) & Swift Testing! 🧵🧪

Now that I've built real ViewModels and async flows in iOS, going under the hood of Swift's memory model was an eye-opener:

1️⃣ ARC vs JVM Tracing Garbage Collection
Android's ART scans object trees periodically. iOS uses compile-time reference counting: deinit runs the exact microsecond the retain count hits 0—zero GC pauses during scrolling!

2️⃣ The Retain Cycle Trap & [weak self]
If ViewModel owns a closure and the closure captures self strongly, both leak forever. Breaking it with [weak self] is essential muscle memory for any Android dev moving to iOS.

3️⃣ Swift Testing (@Test & #expect)
Testing in modern Swift is a breeze: value-type struct test suites mean fresh instances per test, and #expect replaces dozens of XCTAssert methods.

🔗 Follow along on GitHub: https://github.com/sudhakar-r08/ios-for-android-devs
🌐 Tutorial Site: https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #MemoryManagement #SwiftTesting #MobileEngineering`,
    linkedinArticle: `# Week 9: Under the Hood of iOS Memory — ARC, Retain Cycles, and Modern Swift Testing

On Android, we trust the ART Garbage Collector to clean up circular references. On iOS, understanding Automatic Reference Counting (ARC) is vital to writing leak-free code...`
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
    dailySteps: [
      {
        day: 1,
        title: "Modularizing with Local Swift Packages (SPM)",
        time: "15 mins",
        goal: "Break your app into clean local modules using Package.swift (like Gradle subprojects).",
        shift: "Gradle `:core:model` ➔ Local Swift Package targets in `Package.swift`.",
        details: [
          "Local SPM packages prevent massive `.xcodeproj` git merge conflicts and enforce clean feature boundaries.",
          "Remember: declarations in Swift are `internal` by default; mark public APIs and their initializers `public`."
        ],
        kotlinCode: `// settings.gradle.kts: include(":core:model")`,
        swiftCode: `// Package.swift: .target(name: "CoreModel")`
      },
      {
        day: 2,
        title: "Build Flavors with .xcconfig and Schemes",
        time: "15 mins",
        goal: "Configure Staging vs. Production environments without hardcoded secrets.",
        shift: "Gradle `productFlavors` ➔ `.xcconfig` files and Xcode Schemes.",
        details: [
          "Inject `API_BASE_URL` and bundle ID suffixes cleanly via plain-text `.xcconfig` files."
        ],
        kotlinCode: `productFlavors { create("staging") { applicationIdSuffix = ".staging" } }`,
        swiftCode: `// Staging.xcconfig: PRODUCT_BUNDLE_IDENTIFIER = com.app.staging`
      },
      {
        day: 3,
        title: "Code Signing, Provisioning & Entitlements",
        time: "15 mins",
        goal: "Understand Certificates, Provisioning Profiles, and App Capabilities.",
        shift: "Android keystore `.jks` ➔ Apple Developer Certificates & Provisioning Profiles.",
        details: [
          "A Provisioning Profile cryptographically ties your Certificate, App ID, and Device UDIDs together."
        ],
        kotlinCode: `signingConfigs { create("release") { ... } }`,
        swiftCode: `// Automatically managed by Xcode or configured via Provisioning Profile`
      },
      {
        day: 4,
        title: "Shipping to TestFlight & App Store Connect",
        time: "15 mins",
        goal: "Archive the app and distribute beta builds to internal and external testers.",
        shift: "Google Play Internal Track ➔ TestFlight.",
        details: [
          "Use `Product -> Archive` in Xcode to validate and upload your `.ipa` directly to TestFlight."
        ],
        kotlinCode: `// ./gradlew bundleRelease -> Upload to Play Console`,
        swiftCode: `// Xcode -> Product -> Archive -> Distribute to TestFlight`
      },
      {
        day: 5,
        title: "Capstone Showcase & 10-Week Retrospective",
        time: "30 mins",
        goal: "Celebrate completing the 10-week journey before New Year and publish your final retrospective!",
        shift: "From Android Developer to proficient dual-platform Mobile Engineer.",
        details: [
          "Review your progress, showcase your capstone app, and share your year-end journey on LinkedIn!"
        ],
        kotlinCode: `// 10 Weeks Completed!`,
        swiftCode: `// 10 Weeks Completed!`
      }
    ],
    concepts: [
      {
        heading: "1. Multi-Module Architecture: Gradle vs. SPM (`Package.swift`)",
        shift: "In large Android apps, we split code into Gradle modules (`:core:model`, `:core:network`). In modern iOS apps, we split features into local **Swift Package Manager (`Package.swift`)** modules.",
        details: [
          "Declarations in Swift are `internal` by default; remember to declare `public init()` explicitly on public structs."
        ],
        kotlinCode: `// settings.gradle.kts: include(":core:model", ":feature:feed")`,
        swiftCode: `// Package.swift declarative targets`
      },
      {
        heading: "2. Gradle `productFlavors` vs. Xcode Schemes & `.xcconfig`",
        shift: "Instead of `productFlavors` in Gradle, iOS uses plain-text `.xcconfig` files mapped to Build Configurations and Xcode Schemes.",
        details: [
          "Diff-friendly plain text configuration that avoids modifying project files."
        ],
        kotlinCode: `productFlavors { create("staging") }`,
        swiftCode: `// Staging.xcconfig`
      },
      {
        heading: "3. Code Signing & TestFlight Distribution",
        shift: "Apple's Provisioning Profiles bind Developer Certificates, App IDs, and device permissions for seamless distribution via TestFlight.",
        details: [
          "Distribute builds to up to 10,000 external beta testers via App Store Connect."
        ],
        kotlinCode: `// Play Console Internal Track`,
        swiftCode: `// TestFlight beta distribution`
      }
    ],
    quiz: [
      {
        question: "1. What is the default access control level in Swift (unlike Kotlin where `public` is default)?",
        options: ["`private`", "`internal`", "`public`", "`open`"],
        correctIndex: 1,
        explanation: "Declarations in Swift are `internal` by default, meaning they are visible only within the same module/target."
      },
      {
        question: "2. Why must you explicitly write `public init(...)` on a `public struct` inside a Swift Package module?",
        options: [
          "Because structs don't have initializers",
          "Because Swift's auto-generated memberwise initializer is `internal` by default to prevent accidental API lock-in",
          "Because SPM doesn't support structs",
          "Only classes need initializers"
        ],
        correctIndex: 1,
        explanation: "Even if a struct is marked `public`, its synthesized memberwise initializer is `internal` unless declared `public init(...)` explicitly."
      },
      {
        question: "3. What plain-text file format is used by iOS teams to manage build settings like Staging vs Production bundle IDs?",
        options: ["`.xcconfig`", "`build.gradle.kts`", "`Info.plist` only", "`Package.resolved`"],
        correctIndex: 0,
        explanation: "`.xcconfig` files store build settings in clean, diff-friendly plain text."
      },
      {
        question: "4. What is Apple's official beta distribution platform integrated into App Store Connect?",
        options: ["TestFlight", "Xcode Cloud", "CocoaPods", "Play Store"],
        correctIndex: 0,
        explanation: "TestFlight lets you distribute signed builds to internal team members and external beta testers."
      },
      {
        question: "5. What are the core components bound together inside an iOS Provisioning Profile?",
        options: [
          "Developer Signing Certificate, App ID (Bundle ID + Entitlements), and registered physical Device UDIDs",
          "Gradle, Maven, and ProGuard",
          "HTML, CSS, and JavaScript",
          "Screenshots and price tiers"
        ],
        correctIndex: 0,
        explanation: "A Provisioning Profile cryptographically links the developer certificate, bundle ID capabilities, and allowed device IDs."
      },
      {
        question: "6. What is the difference between `public` and `open` access modifiers in Swift?",
        options: [
          "`open` is deprecated in Swift 6",
          "`public` types can be accessed outside their module but cannot be subclassed or overridden; `open` types can be both accessed and subclassed/overridden outside the module",
          "`open` makes properties immutable",
          "`public` is only for structs, `open` is only for enums"
        ],
        correctIndex: 1,
        explanation: "Swift differentiates between consuming a class (`public`) and extending a class (`open`) to prevent unintended subclassing across module boundaries."
      },
      {
        question: "7. Where are sensitive user permissions (like Camera, Location, and Photo Library access) declared in an iOS app?",
        options: [
          "In `AndroidManifest.xml` via `<uses-permission>`",
          "In `Info.plist` with explicit privacy usage descriptions (e.g., `NSCameraUsageDescription`), explaining why the app needs access",
          "In Xcode Schemes under Build Phase",
          "Permissions do not need to be declared on iOS"
        ],
        correctIndex: 1,
        explanation: "Apple mandates that any protected hardware or user data access include a user-facing explanation key in `Info.plist` or the build will be rejected."
      },
      {
        question: "8. How does TestFlight distinguish between Internal Testing and External Testing?",
        options: [
          "Internal testing is paid; External testing is free",
          "Internal testing is instant for up to 100 registered team members with no Apple review; External testing supports up to 10,000 public testers and requires Apple Beta App Review",
          "External testing only works over USB cables",
          "Internal testing is for Android, External is for iOS"
        ],
        correctIndex: 1,
        explanation: "Internal team testers get access immediately upon build upload. External public testing groups require a lightweight Apple Beta App Review for each new version."
      },
      {
        question: "9. How do you integrate third-party dependencies using Swift Package Manager in an Xcode project?",
        options: [
          "Add them to `build.gradle` and sync",
          "Use File > Add Package Dependencies... in Xcode or add them to the `dependencies` block in `Package.swift`",
          "Copy and paste `.jar` files into a `libs/` folder",
          "Run `npm install`"
        ],
        correctIndex: 1,
        explanation: "Xcode natively integrates SPM: you can add git repository URLs directly in Xcode or manage them declaratively in `Package.swift`."
      },
      {
        question: "10. What is an App Clip in the iOS ecosystem (similar to Android Instant Apps)?",
        options: [
          "A video recording of the user's screen",
          "A lightweight, focused snippet of an app (under 50MB) that launches instantly via NFC, QR codes, or Safari without installing the full app",
          "A crash report submitted to Xcode Cloud",
          "A shortcut icon on the Mac desktop"
        ],
        correctIndex: 1,
        explanation: "App Clips are lightweight app experiences that launch fast when needed (e.g. paying for parking or ordering coffee) without downloading the full app."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 10 Capstone Entry Point: (1) Mark `CapstoneApp` with `@main`, (2) Conform to `App`, and (3) Attach `.modelContainer(for: Bookmark.self)` to the `WindowGroup`.",
      starterCode: `import SwiftUI
import SwiftData

struct CapstoneApp {
    var body: some Scene {
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
✓ WindowGroup configured with SwiftData .modelContainer(for: Bookmark.self)
🎉 Congratulations! All 10 Weeks Completed Before New Year!`,
      requiredTokens: ["@main", ": App", "WindowGroup", ".modelContainer(for: Bookmark.self)"]
    },
    linkedinPost: `Week 10: We made it before New Year! 🎉📱🍎
10 Weeks ago, I was strictly an Android Developer. Today, I've completed a full 10-week journey into modern iOS engineering (Swift 6, SwiftUI, Concurrency, SwiftData, SPM Modularization, and TestFlight)—and open-sourced the entire academy!

Here is what I learned shipping my capstone app in Week 10:
1️⃣ Multi-Module Gradle -> Local Swift Packages (Package.swift)
2️⃣ Product Flavors -> .xcconfig files & Xcode Schemes
3️⃣ Google Play Console -> TestFlight & App Store Connect

🌐 Check out the free, beginner-friendly 10-Week Learning Academy:
🔗 https://github.com/sudhakar-r08/ios-for-android-devs
🚀 Live Site: https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #Swift6 #SwiftUI #MobileEngineering #LearningInPublic #YearEndChallenge`,
    linkedinArticle: `# Week 10: From Android Dev to Shipping on iOS Before New Year — The Complete Retrospective

Ten weeks ago, I set out to learn iOS development through my Android mental models. Today, I shipped my capstone app...`
  }
];
