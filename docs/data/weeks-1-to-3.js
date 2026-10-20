// ============================================================================
// WEEKS 1 TO 3: Deep-Dive Tutorials, Interactive Simulators, Flashcards & 10 Quizzes/Week
// ============================================================================

window.WEEKS_1_TO_3 = [
  // ==========================================================================
  // WEEK 1: SWIFT FUNDAMENTALS & MEMORY MODEL
  // ==========================================================================
  {
    week: 1,
    dates: "Oct 20 – Oct 26",
    title: "Swift Fundamentals & Memory Model",
    subtitle: "Why 'Writing Kotlin in Swift Syntax' Will Bite You: Value Types (`struct`), Copy-on-Write, Deterministic ARC vs. JVM GC, `guard let`, and Algebraic Enums.",
    androidAnchor: "Kotlin `data class`, ART Tracing GC, `val`/`var`, Elvis `?:`, `sealed interface`",
    iosAnchor: "Swift `struct` (CoW), ARC (`weak`/`unowned`), Deep `let` Immutability, `guard let`, Associated-Value `enum`",
    simulatorType: "arc-and-cow",
    flashcards: [
      { front: "What happens in memory when you assign `var b = a` on a Swift `struct`?", back: "It semantically copies the value so `a` and `b` are completely independent. For collections (`Array`, `String`, `Dictionary`), Swift uses Copy-on-Write (CoW): the buffer is shared until one variable mutates it." },
      { front: "How does `let` on a Swift `struct` differ from `val` on a Kotlin `data class`?", back: "In Kotlin, `val` only locks the object reference; `var` properties inside the `data class` can still mutate. In Swift, `let` on a `struct` freezes the entire value and every nested `var` property." },
      { front: "When does `deinit` run on a Swift `class`?", back: "Deterministically and immediately on the current thread the exact millisecond its ARC strong reference count drops to `0`." },
      { front: "Difference between `weak` and `unowned` references in ARC?", back: "Both avoid increasing the retain count. `weak` is always an Optional `var` that becomes `nil` when the target deallocates. `unowned` is non-optional and traps (crashes) if accessed after deallocation." },
      { front: "Why does `mutating func` exist on `struct` and `enum`, but not on `class`?", back: "Mutating a `struct` actually replaces `self` with a brand-new value in place (`inout self`). Classes mutate heap memory through a constant pointer without replacing `self`." }
    ],
    concepts: [
      {
        heading: "1. Value Semantics (`struct`) vs. Heap Reference Semantics (`class`)",
        shift: "In Kotlin on the JVM, almost every object—including a `data class`—is a heap-allocated reference type. In Swift, `struct` is the default building block and is a true VALUE type allocated inline on the stack (or inside its owning container).",
        details: [
          "<strong>Stack vs. Heap Allocation:</strong> Allocating a Swift `struct` without reference properties requires zero heap allocation, zero lock contention, and zero reference-counting overhead—just moving the stack pointer.",
          "<strong>Deep Immutability of `let`:</strong> When you declare `let user = User(name: \"Alex\")` where `User` is a `struct`, even properties declared as `var` inside `User` cannot be modified. The value is frozen at the bit level.",
          "<strong>The `mutating` Keyword Contract:</strong> Methods on a `struct` or `enum` are read-only by default. To modify any property (or reassign `self = ...`), you must mark the method `mutating func`, which passes `self` as an implicit `inout` parameter."
        ],
        kotlinCode: `// Kotlin: Heap-allocated reference type
data class UserProfile(
    val id: String,
    var followerCount: Int
)

fun demo() {
    val profileA = UserProfile("u1", 100)
    val profileB = profileA // Copies the 64-bit heap pointer!
    profileB.followerCount = 999

    println(profileA.followerCount) // Prints 999! Both point to same object
    profileA.followerCount = 500    // Legal in Kotlin even though profileA is 'val'!
}`,
        swiftCode: `// Swift: Inline/Stack-allocated value type
struct UserProfile {
    let id: String
    var followerCount: Int

    mutating func increment() {
        followerCount += 1
    }
}

func demo() {
    let profileA = UserProfile(id: "u1", followerCount: 100)
    var profileB = profileA // Copies the VALUE!
    profileB.increment()

    print(profileA.followerCount) // Prints 100 (Untouched!)
    print(profileB.followerCount) // Prints 101
    // profileA.increment()       // ❌ Compile error: profileA is a 'let' constant
}`
      },
      {
        heading: "2. Copy-on-Write (CoW): How Swift Collections Stay Fast",
        shift: "If `Array`, `Dictionary`, and `String` are value-type `struct`s in Swift, why doesn't passing a 100,000-element array into a function copy 100,000 elements? Because Swift uses Copy-on-Write (CoW).",
        details: [
          "<strong>Shared Buffer on Read ($O(1)$):</strong> Internally, a Swift `Array<T>` struct holds an internal reference to a contiguous heap buffer. When you write `var b = a`, both structs point to the same buffer (retain count = 2). Reading is $O(1)$.",
          "<strong>Lazy Duplication on Mutation ($O(N)$ only when needed):</strong> The moment you call `b.append(newItem)`, `Array` checks `isKnownUniquelyReferenced(&storage)`. Since the buffer's retain count is `2`, `b` allocates a fresh buffer copy before mutating, leaving `a` untouched!"
        ],
        kotlinCode: `// Kotlin: List vs MutableList shares the underlying reference unless explicitly copied
val listA = mutableListOf(1, 2, 3)
val listB = listA // Same list instance!
listB.add(4)
println(listA) // [1, 2, 3, 4] — listA was mutated!`,
        swiftCode: `// Swift: Value semantics with Copy-on-Write (CoW) optimization
var listA = [1, 2, 3]
var listB = listA // O(1) assignment: shares buffer until mutated!

// Buffer is duplicated right here before appending 4:
listB.append(4)

print(listA) // [1, 2, 3] — 100% isolated!
print(listB) // [1, 2, 3, 4]`
      },
      {
        heading: "3. Automatic Reference Counting (ARC) vs. Tracing Garbage Collection",
        shift: "Android's ART runtime uses a tracing Garbage Collector that periodically sweeps unreachable object graphs (even if they contain cycles). Swift uses compile-time ARC for `class` instances and closures: memory is freed immediately when `retainCount == 0`, but strong reference cycles (`A <-> B`) leak forever.",
        details: [
          "<strong>Deterministic Deinitialization (`deinit`):</strong> In Kotlin/Java, `finalize()` / `Cleaner` runs at an unpredictable future time. In Swift, `deinit` runs synchronously the exact line of code where the last strong reference disappears.",
          "<strong>`weak` vs `unowned`:</strong> Use `weak var` whenever the referenced object can become `nil` during your lifetime (delegates, parent references, async callbacks). Use `unowned` only when the other object is strictly guaranteed to outlive you.",
          "<strong>Closure Capture Lists (`[weak self]`):</strong> In Swift, closures are reference types. If a class stores a closure in a property AND that closure references `self`, you have a retain cycle unless the closure uses `[weak self] in`."
        ],
        kotlinCode: `// Kotlin: Lambda captures 'this' strongly, but ART's tracing GC
// still frees both ViewModel and lambda once ViewModel is unreachable.
class ProfileViewModel {
    var onStateChange: (() -> Unit)? = null
    fun setup() {
        onStateChange = { refresh() }
    }
    fun refresh() {}
}`,
        swiftCode: `// Swift: Must break the cycle between self -> onStateChange -> self!
final class ProfileViewModel {
    var onStateChange: (() -> Void)?

    func setup() {
        onStateChange = { [weak self] in
            guard let self else { return }
            self.refresh()
        }
    }
    func refresh() {}
    deinit { print("Freed immediately when screen pops!") }
}`
      },
      {
        heading: "4. Optionals (`Optional<Wrapped>`), `guard let`, and Algebraic Enums",
        shift: "In Swift, `String?` is literally an `enum Optional<Wrapped> { case none; case some(Wrapped) }`. You unwrap it with `if let` (scoped to braces) or `guard let` (early-exit precondition that keeps the variable unwrapped for the entire function).",
        details: [
          "<strong>`guard let` Golden Path:</strong> The Swift compiler enforces that a `guard` block's `else` clause MUST exit the current scope (`return`, `throw`, `break`, `continue`, or `fatalError`).",
          "<strong>Enums with Associated Values + Pattern Matching:</strong> Unlike Kotlin `enum class`, Swift enums carry per-case payloads and remain value types—replacing Kotlin's heap-allocated `sealed interface` hierarchies."
        ],
        kotlinCode: `// Kotlin: Elvis early return + sealed interface
sealed interface LoadState<out T> {
    data object Idle : LoadState<Nothing>
    data class Loaded<T>(val data: T, val cached: Boolean) : LoadState<T>
    data class Failed(val code: Int) : LoadState<Nothing>
}

fun process(input: String?): String {
    val clean = input?.trim()?.takeIf { it.isNotEmpty() } ?: return "Empty"
    return "Valid: $clean"
}`,
        swiftCode: `// Swift: Value-type enum with associated values + guard let
enum LoadState<T> {
    case idle
    case loaded(data: T, cached: Bool)
    case failed(code: Int)
}

func process(input: String?) -> String {
    guard let clean = input?.trimmingCharacters(in: .whitespaces),
          !clean.isEmpty else {
        return "Empty"
    }
    return "Valid: \\(clean)"
}`
      }
    ],
    quiz: [
      {
        question: "1. Given `struct Ticket { var seat: String }` and `let t1 = Ticket(seat: \"12A\")`, what happens when you execute `var t2 = t1; t2.seat = \"99Z\"`?",
        options: [
          "Compiler error on `var t2 = t1` because `t1` is declared with `let`",
          "`t1.seat` remains \"12A\" and `t2.seat` becomes \"99Z\" because assigning a `struct` copies the value",
          "Both `t1.seat` and `t2.seat` become \"99Z\" because they share the same pointer",
          "Runtime crash due to mutating a frozen struct"
        ],
        correctIndex: 1,
        explanation: "Because `Ticket` is a value-type `struct`, `var t2 = t1` creates an independent mutable copy in `t2`. `t1` stays frozen at \"12A\" while `t2.seat` updates to \"99Z\"."
      },
      {
        question: "2. What happens if you declare `let user = UserClass(name: \"Alex\")` where `UserClass` is a Swift `class` with `var name: String`, and then write `user.name = \"Sam\"`?",
        options: [
          "Compiler error because `user` is a `let` constant",
          "It compiles and mutates `user.name` to \"Sam\" because `let` on a `class` only locks the reference pointer, just like Kotlin's `val`",
          "It creates a copy of `UserClass` automatically",
          "It crashes at runtime with an ARC violation"
        ],
        correctIndex: 1,
        explanation: "On a reference type (`class`), `let` only prevents reassigning the pointer (`user = UserClass(...)`). Mutating its `var` properties is completely legal—unlike a `struct`!"
      },
      {
        question: "3. Why doesn't passing a 50,000-item Swift `Array` to a function duplicate all 50,000 items in memory immediately?",
        options: [
          "Because `Array` is actually a `class` in Swift",
          "Because Swift arrays use Copy-on-Write (CoW), sharing the internal heap buffer until one of the copies is mutated",
          "Because Swift passes all parameters by pointer reference by default",
          "Because the Garbage Collector compresses arrays"
        ],
        correctIndex: 1,
        explanation: "Swift standard library collections (`Array`, `Dictionary`, `String`, `Set`) are `struct`s backed by Copy-on-Write (CoW) storage. The buffer is only copied if a mutation occurs while `retainCount > 1`."
      },
      {
        question: "4. Why must a `weak` property in Swift always be declared as an Optional `var` (e.g., `weak var delegate: MyDelegate?`)?",
        options: [
          "Because Swift classes don't support `let` properties",
          "Because when the target object's retain count drops to 0 and it deallocates, ARC automatically sets the `weak` property to `nil`",
          "Because `weak` properties are lazily initialized from disk",
          "Only Objective-C protocols require `weak var`"
        ],
        correctIndex: 1,
        explanation: "ARC zeroes out weak references the moment the target object deallocates. Since its value can change to `nil` at runtime, it must be both mutable (`var`) and nullable (`Optional`)."
      },
      {
        question: "5. What happens if you access an `unowned` reference after the object it points to has already been deallocated?",
        options: [
          "It safely returns `nil`",
          "It triggers an immediate deterministic runtime trap (crash), similar to force-unwrapping `nil!`",
          "It resurrects the object from the heap",
          "It returns a default empty instance"
        ],
        correctIndex: 1,
        explanation: "Unlike `weak`, an `unowned` reference is non-optional and does not become `nil`. Accessing it after its target deallocates causes an immediate runtime trap."
      },
      {
        question: "6. Why does a method inside a Swift `struct` require the `mutating` keyword to modify one of the struct's properties?",
        options: [
          "To enable multithreaded locking automatically",
          "Because modifying a value type semantically replaces the entire struct instance (`inout self`), so the compiler must prevent calling it on `let` constants",
          "Because struct properties are stored in ROM",
          "Only `private` methods need `mutating`"
        ],
        correctIndex: 1,
        explanation: "`mutating` tells the Swift compiler that the method mutates `self` in place (`inout`), allowing the compiler to forbid calling that method on `let` struct constants."
      },
      {
        question: "7. What is the key scoping difference between `if let user = optionalUser` and `guard let user = optionalUser else { return }`?",
        options: [
          "`if let` is faster at runtime than `guard let`",
          "With `if let`, `user` is only in scope inside the `if` braces; with `guard let`, `user` remains unwrapped and in scope for the entire rest of the function",
          "`guard let` can only be used inside loops",
          "`if let` forces the function to return early"
        ],
        correctIndex: 1,
        explanation: "`guard let` enforces an early exit if the value is `nil`, which guarantees to the compiler that the unwrapped variable is valid for the remainder of the enclosing scope."
      },
      {
        question: "8. Under the hood in the Swift Standard Library, what is `String?` syntactic sugar for?",
        options: [
          "A nullable JVM `java.lang.String` pointer",
          "`enum Optional<String> { case none; case some(String) }`",
          "A `class NullableString` box allocated on the heap",
          "A C pointer `char*`"
        ],
        correctIndex: 1,
        explanation: "In Swift, `T?` is a genuine generic value-type enumeration `Optional<T>` with two cases: `.none` (`nil`) and `.some(T)`."
      },
      {
        question: "9. In Swift, what happens if a `struct` contains a property that is a `class` instance (e.g., `struct Wrapper { var ref: MyClass }`) and you copy the struct (`var w2 = w1`)?",
        options: [
          "Swift deep-copies `MyClass` automatically",
          "The struct itself is copied, but both `w1.ref` and `w2.ref` point to the SAME `MyClass` instance on the heap (incrementing its ARC retain count by 1)",
          "The compiler rejects classes inside structs",
          "The class is converted into a struct at compile time"
        ],
        correctIndex: 1,
        explanation: "This is a classic senior iOS interview question! Copying a `struct` performs a shallow bitwise/memberwise copy of its fields—if one field is a `class` reference, the reference pointer is copied (and retained via ARC), sharing the underlying class instance unless you implement Copy-on-Write."
      },
      {
        question: "10. Why do experienced Swift engineers avoid adding a `default:` branch when switching over their own domain `enum`?",
        options: [
          "`default:` is not allowed on enums with associated values",
          "Using `default:` silences the compiler's exhaustiveness check when a new `case` is added to the enum later, hiding unhandled states",
          "`default:` allocates extra heap memory",
          "`default:` falls through to the next case automatically"
        ],
        correctIndex: 1,
        explanation: "Without `default:`, adding a new case to an `enum` causes the compiler to immediately highlight every `switch` statement that needs to handle the new state."
      }
    ],
    codeChallenge: {
      instructions: "Complete all 3 Week 1 fixes below: (1) Mark `addItem` as `mutating func`, (2) Break the retain cycle in `DownloadTask` using `weak var`, and (3) Unwrap `username` in `formatUserBadge` using `guard let`.",
      starterCode: `struct ShoppingCart {
    var items: [String]
    // TODO 1: Add 'mutating' before func
    func addItem(_ item: String) {
        items.append(item)
    }
}

class DownloadTask {
    // TODO 2: Use 'weak var' to avoid a retain cycle with manager
    var manager: AnyObject?
}

func formatUserBadge(username: String?) -> String {
    // TODO 3: Use 'guard let' to unwrap username and check !username.isEmpty
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
      simulatedOutput: `✓ ShoppingCart(items: ["MacBook", "AirPods"]) — Mutated copy cleanly!
✓ DownloadTask & DownloadManager deinit called (retainCount -> 0)
✓ formatUserBadge(nil) -> "Anonymous"
✓ formatUserBadge("sudhakar") -> "@sudhakar"`,
      requiredTokens: ["mutating func", "weak var", "guard let"]
    },
    linkedinPost: `I’m an Android developer, and for the next 10 weeks before New Year’s, I’m learning modern iOS development from the ground up—and documenting every architectural difference in public. 📱🚀

When you first look at Kotlin and Swift side-by-side, they look 80% identical. Because of that, it’s dangerously easy for an Android engineer to write "Kotlin with Swift syntax."

In Week 1, I went under the hood of Swift’s type system and memory model. Here are the 4 biggest mental shifts:

1️⃣ struct != Kotlin’s data class (True Value Types & Copy-on-Write)
In Kotlin, a data class is still a reference type on the JVM heap. In Swift, struct is a true value type—and declaring 'let user = User()' freezes the entire struct and all its inner 'var' properties!

2️⃣ No Garbage Collector — Welcome to Deterministic ARC & Retain Cycles
Android’s ART uses tracing GC. iOS uses compile-time Automatic Reference Counting (ARC). The millisecond a class’s retain count hits 0, deinit runs deterministically—unless two objects hold strong references to each other (Retain Cycle).

3️⃣ Swift Enums = Kotlin sealed interface (as a Value Type!)
Standard Swift enums carry associated values per case without heap-allocating subclasses.

4️⃣ The "Golden Path" with compiler-enforced guard let
Unlike 'if let' (which scopes the unwrapped variable inside braces), 'guard let' forces an early exit and keeps the unwrapped variable alive for the entire function.

📖 Try the interactive Week 1 tutorial, ARC Memory Simulator, and 10-question quiz on my learning site:
🔗 https://sudhakar-r08.github.io/ios-for-android-devs/
📂 GitHub Repo: https://github.com/sudhakar-r08/ios-for-android-devs

#AndroidDev #iOSDev #Kotlin #Swift #MobileEngineering #SwiftUI #JetpackCompose`,
    linkedinArticle: `# From Kotlin to Swift (Week 1): Why "Writing Kotlin in Swift Syntax" Will Bite You

As an Android developer, opening a Swift file for the first time feels deceptively familiar. You see \`let\` and \`var\` instead of \`val\` and \`var\`, \`String?\` for nullability, \`??\` instead of the Elvis operator \`?:\`, and trailing closures that look just like Kotlin lambdas.

It is tempting to assume Swift is simply "Apple's Kotlin." That assumption is the #1 trap for Android engineers transitioning to iOS. Beneath the surface syntax, **Swift and Kotlin operate on fundamentally different memory models and type philosophies**.

---

## 1. Value Types (\`struct\`) vs. Reference Types (\`class\`)

In Kotlin on the JVM, nearly every object—including a \`data class\`—is a **reference type** stored on the heap. When you assign \`val b = a\`, both variables point to the same memory address.

In Swift, **\`struct\` is the default building block—and it is a true value type**. \`String\`, \`Array\`, \`Dictionary\`, and even \`SwiftUI\` views are all structs.
- Assigning \`var b = a\` copies the value semantically.
- Declaring \`let profile = UserProfile(...)\` makes the entire struct deeply immutable—even its \`var\` properties cannot be changed!
- How do Swift collections stay fast when copied? **Copy-on-Write (CoW)**: multiple copies of an \`Array\` share the same underlying heap buffer until one of them is mutated.

---

## 2. Deterministic ARC vs. Tracing Garbage Collection

Android's ART runtime uses a tracing Garbage Collector that periodically sweeps unreachable object islands—even if objects inside that island reference each other in a cycle.

Swift uses **Automatic Reference Counting (ARC)** for \`class\` instances and closures:
- The compiler inserts \`retain\` (+1) and \`release\` (-1) operations at compile time.
- The exact instant an object's reference count drops to \`0\`, \`deinit\` runs deterministically on the spot.
- **The Trap:** If \`Parent\` strongly holds \`Child\` and \`Child\` strongly holds \`Parent\` (or a stored closure strongly captures \`self\`), their reference counts never hit \`0\`. You must break the cycle with \`weak var\` or \`[weak self] in\`.

---

## 3. \`guard let\` and Algebraic Enums

Where Kotlin relies on smart casts or \`val x = input ?: return\`, Swift provides \`guard let\`, a dedicated precondition statement whose \`else\` block is compiler-enforced to exit the scope—keeping your happy path unindented.

And where Kotlin requires a \`sealed interface\` hierarchy to attach different payloads to different states, Swift's standard \`enum\` supports **Associated Values** directly as a lightweight value type.

🔗 **Interactive Tutorial & Live ARC Simulator:** https://sudhakar-r08.github.io/ios-for-android-devs/`
  },

  // ==========================================================================
  // WEEK 2: PROTOCOLS, GENERICS & TYPED ERROR HANDLING
  // ==========================================================================
  {
    week: 2,
    dates: "Oct 27 – Nov 02",
    title: "Protocols, Generics & Typed Error Handling",
    subtitle: "Protocol-Oriented Programming (`protocol` vs Kotlin `interface`), `associatedtype`, Opaque Types (`some` vs `any`), and Zero-Cost `throws`.",
    androidAnchor: "Kotlin `interface`, Generics `<T>`, Extension Functions, Unchecked Exceptions / `runCatching`",
    iosAnchor: "Swift `protocol`, `associatedtype`, `some` (Opaque Static) vs `any` (Existential Box), Typed `throws`",
    simulatorType: "dispatch-explorer",
    flashcards: [
      { front: "What is Retroactive Conformance in Swift?", back: "Using an `extension` to make an existing type (even a standard library struct like `String` or `Int` that you don't own) conform to a `protocol`." },
      { front: "Difference between `some View` (Opaque Type) and `any View` (Existential Type)?", back: "`some View` preserves the single concrete underlying type at compile time (enabling fast static dispatch and zero heap boxing). `any View` type-erases into a dynamic existential container box with runtime vtable dispatch." },
      { front: "How does a Swift `protocol` declare a generic placeholder type?", back: "Using the `associatedtype` keyword inside the protocol body, rather than angle brackets `<T>` on the protocol name." },
      { front: "Difference between `try`, `try?`, and `try!` in Swift?", back: "`try` forwards or catches the error inside a `do/catch`; `try?` converts any thrown error into `nil` (returning an Optional); `try!` crashes at runtime if an error is thrown." }
    ],
    concepts: [
      {
        heading: "1. Protocol-Oriented Programming & Retroactive Extensions",
        shift: "In Kotlin, only classes/objects can implement an `interface`, and you cannot make a third-party class implement your interface outside its declaration. In Swift, `struct`, `enum`, and `class` all conform to `protocol`s—and you can add protocol conformance to ANY existing type via `extension`!",
        details: [
          "<strong>Default Implementations via Protocol Extensions:</strong> Just like Kotlin interfaces can have default method bodies, Swift uses `extension MyProtocol { ... }` to provide shared default implementations to all conforming types.",
          "<strong>Value Types + Protocols = No Fragile Base Class:</strong> Because `struct`s cannot inherit from classes, Swift architectures compose behavior through protocols (`Equatable`, `Hashable`, `Codable`, `Identifiable`, `Sendable`)."
        ],
        kotlinCode: `// Kotlin: Interfaces + Extension Functions
interface Loggable {
    val logTag: String
    fun log(msg: String) = println("[$logTag] $msg")
}

// Cannot make kotlin.String implement Loggable directly!`,
        swiftCode: `// Swift: Protocols + Retroactive Conformance via Extension
protocol Loggable {
    var logTag: String { get }
    func log(_ msg: String)
}

extension Loggable {
    func log(_ msg: String) { print("[\\(logTag)] \\(msg)") }
}

// Make Swift's built-in String conform to Loggable!
extension String: Loggable {
    var logTag: String { "StringLogger" }
}`
      },
      {
        heading: "2. Associated Types (`associatedtype`) & Primary Associated Types",
        shift: "Kotlin uses generic type parameters on interfaces (`interface Store<T>`). Swift uses `associatedtype Element` inside the protocol, plus primary associated type syntax (`Store<String>`) for ergonomic constraints.",
        details: [
          "<strong>Why `associatedtype`?</strong> It lets the conforming type decide the concrete inner type (or infer it automatically from method signatures).",
          "<strong>`where` Clauses:</strong> Swift lets you write rich generic constraints like `extension Collection where Element: Equatable`."
        ],
        kotlinCode: `interface DataStore<Value> {
    suspend fun load(): Value?
    suspend fun save(value: Value)
}`,
        swiftCode: `protocol DataStore<Value> {
    associatedtype Value
    func load() async -> Value?
    func save(_ value: Value) async
}

struct UserStore: DataStore {
    // Swift automatically infers Value == String!
    func load() async -> String? { "Sudhakar" }
    func save(_ value: String) async {}
}`
      },
      {
        heading: "3. Opaque Types (`some`) vs. Existential Types (`any`)",
        shift: "This is the secret behind SwiftUI's performance. `some Protocol` means 'one specific concrete type known at compile time' (fast static dispatch, stack-allocated). `any Protocol` means 'a heterogeneous box that can hold any conforming type at runtime' (dynamic dispatch, potential heap allocation).",
        details: [
          "<strong>Why SwiftUI uses `var body: some View`:</strong> Every time a View's `body` is evaluated, it must return the exact same concrete type tree so SwiftUI can diff the layout in $O(1)$ without boxing views on the heap.",
          "<strong>Swift 6 Explicit `any`:</strong> Swift 6 requires the `any` keyword whenever you use a protocol as a dynamic existential box (e.g., `var listeners: [any EventListener]`)."
        ],
        kotlinCode: `// Kotlin on JVM: All interfaces use reference pointers
// and virtual method table (vtable/itable) dispatch.
fun createFeedRepository(): Repository<Post> {
    return NetworkPostRepository()
}`,
        swiftCode: `// 'some' = Opaque Type (Compile-time static dispatch, zero boxing!)
func createFeedRepository() -> some DataStore<String> {
    UserStore()
}

// 'any' = Existential Box (Runtime dynamic dispatch, allows mixed types)
let stores: [any DataStore<String>] = [UserStore(), MockStore()]`
      },
      {
        heading: "4. Explicit & Typed Error Handling (`throws`, `do/try/catch`, `try?`)",
        shift: "Kotlin has unchecked exceptions (any function can throw without declaring it, so devs often wrap results in `Result<T>`). Swift uses compiler-checked `throws` (and Swift 6 Typed Throws `throws(AuthError)`) with zero stack-unwinding overhead!",
        details: [
          "<strong>How Swift `throws` Works Under the Hood:</strong> Swift doesn't unwind the call stack or capture expensive stack traces when throwing an `Error`. Instead, the compiler reserves a CPU register for the error value, making `throw` as fast as a normal `return`!",
          "<strong>Bridging with `Result<Success, Failure>`:</strong> Swift also has a built-in `Result` enum when storing completion states outside async/throwing functions."
        ],
        kotlinCode: `// Kotlin: Unchecked exceptions or runCatching
fun parseAge(raw: String): Result<Int> = runCatching {
    raw.toInt().also { require(it >= 0) }
}`,
        swiftCode: `// Swift 6: Typed throws — fast as a return statement!
enum ValidationError: Error {
    case notANumber
    case negativeAge(Int)
}

func parseAge(_ raw: String) throws(ValidationError) -> Int {
    guard let age = Int(raw) else { throw .notANumber }
    guard age >= 0 else { throw .negativeAge(age) }
    return age
}

// Call site options:
let optionalAge: Int? = try? parseAge("28") // Converts error to nil`
      }
    ],
    quiz: [
      {
        question: "1. What is the difference between `func makeView() -> some View` and `func makeView() -> any View` in Swift?",
        options: [
          "`some View` returns an Optional, while `any View` is non-null",
          "`some View` guarantees a single concrete return type fixed at compile time (static dispatch), while `any View` boxes the value in a dynamic existential container",
          "`any View` is faster at runtime than `some View`",
          "They are 100% identical aliases"
        ],
        correctIndex: 1,
        explanation: "`some` (Opaque Type) lets the compiler know the exact concrete type behind the scenes for static optimization, whereas `any` creates a runtime existential box."
      },
      {
        question: "2. How do you declare a generic placeholder type inside a Swift `protocol`?",
        options: [
          "`protocol Container<T> { ... }` without any inner declaration",
          "Using `associatedtype Item` inside the protocol body",
          "Using `typealias Item = Any`",
          "Protocols in Swift cannot be generic"
        ],
        correctIndex: 1,
        explanation: "Swift protocols declare generic placeholders using `associatedtype` (and can optionally expose them as primary associated types via `protocol Container<Item>`)."
      },
      {
        question: "3. Why is throwing an `Error` in Swift (`throw MyError.failed`) dramatically cheaper at runtime than throwing an `Exception` in Java/Kotlin?",
        options: [
          "Because Swift ignores errors in Release builds",
          "Because Swift does not capture a full call-stack trace or perform expensive stack unwinding; it passes the error value back via a dedicated CPU register",
          "Because Swift errors are strings",
          "Because ARC deletes the error immediately"
        ],
        correctIndex: 1,
        explanation: "In Java/Kotlin, constructing a `Throwable` walks the stack to capture a stack trace and unwinds frames. In Swift, `throws` is compiled into a hidden return branch using a CPU register."
      },
      {
        question: "4. What happens if a function declared as `func fetch() throws -> String` fails when called with `let data = try? fetch()`?",
        options: [
          "The app crashes immediately",
          "`data` is assigned `nil` (of type `String?`) and no `do/catch` block is needed",
          "The error is rethrown to the caller",
          "It retries 3 times automatically"
        ],
        correctIndex: 1,
        explanation: "`try?` suppresses any thrown error and evaluates the expression to an `Optional` (`nil` on failure, `.some(value)` on success)."
      },
      {
        question: "5. How do you provide a default method implementation for a Swift `protocol` (similar to a default method body in a Kotlin `interface`)?",
        options: [
          "Write the body directly inside the `protocol { ... }` declaration",
          "Create a protocol extension: `extension MyProtocol { func myMethod() { ... } }`",
          "Use an `abstract class` instead",
          "Mark the protocol with `@DefaultImpl`"
        ],
        correctIndex: 1,
        explanation: "In Swift, protocol declarations only list requirements; default implementations are provided inside an `extension MyProtocol { ... }` block."
      },
      {
        question: "6. How do you restrict a protocol so that ONLY `class` (reference) types can conform to it (needed when storing a `weak var delegate: MyDelegate?`)?",
        options: [
          "`protocol MyDelegate: AnyObject`",
          "`protocol MyDelegate: StructOnly`",
          "`class protocol MyDelegate`",
          "`@ReferenceOnly protocol MyDelegate`"
        ],
        correctIndex: 0,
        explanation: "Conforming a protocol to `AnyObject` (`protocol MyDelegate: AnyObject`) restricts conformance to reference types (`class` / `actor`), enabling `weak var delegate: (any MyDelegate)?`."
      },
      {
        question: "7. What does `extension Array where Element: Numeric { func sum() -> Element { ... } }` demonstrate?",
        options: [
          "A Conditional Extension that adds `sum()` only to arrays whose elements conform to `Numeric`",
          "Subclassing `Array` on the heap",
          "Runtime reflection",
          "Overriding the Garbage Collector"
        ],
        correctIndex: 0,
        explanation: "Swift's `where` clause on extensions lets you conditionally add methods or protocol conformances only when generic type parameters meet specific constraints."
      },
      {
        question: "8. When you synthesize `struct User: Equatable, Hashable, Codable`, when is the implementation generated?",
        options: [
          "At runtime using reflection (like `Gson` in Android)",
          "At compile time by the Swift compiler (zero runtime reflection overhead, just like `kotlinx.serialization`)",
          "By an external Gradle annotation processor (KAPT)",
          "It is not generated; you must write `equals` and `hashCode` manually"
        ],
        correctIndex: 1,
        explanation: "As long as all stored properties of a `struct` or `enum` conform to `Equatable`, `Hashable`, or `Codable`, the Swift compiler synthesizes the conformance at compile time with zero reflection."
      },
      {
        question: "9. Why does the following function fail to compile? `func makeShape(isCircle: Bool) -> some Shape { if isCircle { return Circle() } else { return Square() } }`",
        options: [
          "Because `some Shape` requires every return branch to return the EXACT same concrete underlying type",
          "Because `Shape` is a class",
          "Because `if/else` is not allowed in functions returning protocols",
          "Because `Circle` and `Square` are value types"
        ],
        correctIndex: 0,
        explanation: "An opaque return type (`some Shape`) promises the compiler a single fixed concrete type. Returning `Circle` in one branch and `Square` in another violates that contract (unless wrapped in `@ViewBuilder` or erased with `any Shape`)."
      },
      {
        question: "10. What does Swift 6's `throws(NetworkError)` syntax provide over traditional `throws`?",
        options: [
          "It catches errors on a background thread",
          "Typed Throws: the compiler guarantees only `NetworkError` can be thrown, so `catch` blocks get an exhaustive `error: NetworkError` instead of an untyped `any Error`",
          "It disables ARC during error handling",
          "It converts errors to JSON automatically"
        ],
        correctIndex: 1,
        explanation: "Introduced in Swift 6, Typed Throws (`throws(SpecificError)`) lets callers exhaustively switch over the exact error type in `catch` without needing a catch-all branch."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 2 Lab: (1) Declare `protocol Cacheable` with `var cacheKey: String { get }`, (2) Provide a default `extension Cacheable`, and (3) Mark `decodeItem` with `throws -> String`.",
      starterCode: `// TODO 1: Add 'var cacheKey: String { get }' inside Cacheable
protocol Cacheable {
    
}

// TODO 2: Add an extension on Cacheable with a default method
extension Cacheable {
    func printKey() { print(cacheKey) }
}

// TODO 3: Mark decodeItem with 'throws' before '-> String'
func decodeItem(raw: String) -> String {
    return raw
}`,
      solutionCode: `protocol Cacheable {
    var cacheKey: String { get }
}

extension Cacheable {
    func printKey() { print(cacheKey) }
}

func decodeItem(raw: String) throws -> String {
    return raw
}`,
      simulatedOutput: `✓ Protocol Cacheable & default extension compiled!
✓ decodeItem(raw:) statically verified with 'throws -> String'`,
      requiredTokens: ["var cacheKey: String { get }", "extension Cacheable", "throws -> String"]
    },
    linkedinPost: `Week 2 of Android -> iOS Before New Year! 🚀
This week I dove deep into Protocol-Oriented Programming, Opaque Types (some vs any), and Swift's Zero-Cost Error Handling (throws / try?).

3 things that blew my mind coming from Kotlin:
1️⃣ Retroactive Conformance: You can make built-in types like String or Array conform to your own protocol via an 'extension'!
2️⃣ 'some' vs 'any': Why every SwiftUI view returns 'some View' (compile-time static dispatch with zero heap boxing) instead of 'any View'.
3️⃣ Zero-Cost 'throws': Throwing an Error in Swift doesn't unwind the stack or capture an expensive stack trace like Java/Kotlin Exceptions—it uses a CPU register!

📖 Interactive Week 2 Tutorial + Static vs Dynamic Dispatch Explorer + 10-Question Quiz:
🔗 https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #Kotlin #Swift #SwiftUI #MobileArchitecture`,
    linkedinArticle: `# Week 2: Protocol-Oriented Programming, \`some\` vs \`any\`, and Why Swift Errors Don't Unwind the Stack

In Kotlin, we use \`interface\` for polymorphism and \`Result<T>\` or unchecked exceptions for failures. In Week 2 of my Android-to-iOS journey, I learned why Apple calls Swift a **Protocol-Oriented Language**—and how \`some\`, \`any\`, and \`throws\` work under the hood.

---

## 1. Protocols & Retroactive Modeling

In Swift, \`struct\`s cannot inherit from other structs. Instead, polymorphism is achieved through **Protocols**. Even better: you can make *any* existing type (including types from Apple's standard library) conform to your own protocol using an \`extension\`:

\`\`\`swift
protocol IdentifiableEntity {
    var entityId: String { get }
}

extension String: IdentifiableEntity {
    var entityId: String { self }
}
\`\`\`

---

## 2. \`some Protocol\` (Opaque) vs. \`any Protocol\` (Existential)

When an Android developer sees \`var body: some View\` in SwiftUI, the natural question is: *"Why the word \`some\`?"*

- **\`any View\` (Existential Box):** Can hold a \`Text\` now and a \`Button\` 5 seconds later. Because the concrete size varies, Swift must box it in an Existential Container and use dynamic dispatch.
- **\`some View\` (Opaque Type):** Hides the concrete type from the caller, **but guarantees to the compiler that the function always returns the exact same concrete type**. That gives SwiftUI 100% static dispatch and inline memory layout!

---

## 3. Why \`throws\` in Swift Has Zero Exception Overhead

In Java/Kotlin, throwing an exception walks the call stack to build a stack trace. In Swift, \`throws\` is compiled into a standard branching return using a dedicated CPU register—making error handling as fast as returning an \`Optional\`, with full compile-time exhaustiveness via Swift 6 Typed Throws (\`throws(ApiError)\`).`
  },

  // ==========================================================================
  // WEEK 3: SWIFTUI FOUNDATIONS & LAYOUT ENGINE
  // ==========================================================================
  {
    week: 3,
    dates: "Nov 03 – Nov 09",
    title: "SwiftUI Foundations & Layout Engine",
    subtitle: "Mapping Jetpack Compose `@Composable` & `Modifier` Chains to SwiftUI `View` Structs, `@ViewBuilder`, and the 3-Step Layout Pass.",
    androidAnchor: "`@Composable`, `Column`/`Row`/`Box`, `Modifier.padding().background()`, `Spacer(Modifier.weight(1f))`",
    iosAnchor: "`View` struct (`var body: some View`), `VStack`/`HStack`/`ZStack`, Wrapper Modifiers, `Spacer()`, `@ViewBuilder`",
    simulatorType: "modifier-sandbox",
    flashcards: [
      { front: "What are the 3 steps of SwiftUI's Layout Negotiation Pass?", back: "1. Parent proposes a size to the child. 2. Child chooses its own size (parent MUST respect it!). 3. Parent places the child in the parent's coordinate space." },
      { front: "Why does `.padding(16).background(.blue)` look different from `.background(.blue).padding(16)`?", back: "Every SwiftUI modifier wraps the previous view in a new modified View struct. Putting `.padding(16)` first expands the bounds before `.background(.blue)` paints behind it." },
      { front: "How do you make a SwiftUI view expand to fill available width (like `Modifier.fillMaxWidth()` in Compose)?", back: "Use `.frame(maxWidth: .infinity)` (and optionally `alignment: .leading`)." },
      { front: "What is `@ViewBuilder` in SwiftUI?", back: "A `@resultBuilder` attribute that lets closures (like `VStack { ... }` or `var body: some View`) combine multiple child views and `if/else`/`switch` statements into a single composite `TupleView` or `_ConditionalContent`." }
    ],
    concepts: [
      {
        heading: "1. `@Composable` Functions vs. Lightweight `View` Structs",
        shift: "In Jetpack Compose, UI components are `@Composable` functions emitted into a Slot Table. In SwiftUI, views are value-type `struct`s conforming to `View`. Creating a SwiftUI `View` struct is virtually free—it's just a blueprint stored on the stack!",
        details: [
          "<strong>Views are Value Blueprints, Not UIKit `UIView`s:</strong> Never store heavy objects or execute side effects in a SwiftUI `View`'s `init()`. SwiftUI recreates your `View` struct frequently and diffs the resulting `body` tree.",
          "<strong>`@ViewBuilder` Magic:</strong> Why can you put multiple views inside `VStack { Text(\"A\"); Text(\"B\") }` without a `return` keyword? Because `VStack`'s trailing closure is marked `@ViewBuilder`, a compile-time result builder."
        ],
        kotlinCode: `@Composable
fun ProfileCard(name: String, role: String) {
    Column(
        horizontalAlignment = Alignment.Start,
        verticalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
            .background(Color.White, RoundedCornerShape(12.dp))
    ) {
        Text(text = name, fontWeight = FontWeight.Bold)
        Text(text = role, color = Color.Gray)
    }
}`,
        swiftCode: `struct ProfileCard: View {
    let name: String
    let role: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(name).fontWeight(.bold)
            Text(role).foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(.background, in: RoundedRectangle(cornerRadius: 12))
    }
}`
      },
      {
        heading: "2. The 3-Step Layout Negotiation & Modifier Wrapping Order",
        shift: "Just like Jetpack Compose's single-pass measurement (`MeasurePolicy`), SwiftUI performs a 3-step layout pass: (1) Parent proposes size → (2) Child chooses its own size → (3) Parent positions child. And every modifier wraps the view before it in a new layout node!",
        details: [
          "<strong>No Forced Sizing:</strong> In SwiftUI, a parent cannot force a child view to be a certain size. `.frame(width: 200)` simply creates an invisible wrapper frame of width 200 and proposes 200 to the child.",
          "<strong>`Spacer()` vs `Modifier.weight(1f)`:</strong> In SwiftUI, dropping a `Spacer()` inside an `HStack` or `VStack` greedily expands along the main axis, pushing siblings apart."
        ],
        kotlinCode: `// Compose: Modifier order matters!
Text(
    text = "Upgrade",
    modifier = Modifier
        .background(Color.Blue) // Paints tight box first
        .padding(16.dp)         // Outer transparent margin!
)`,
        swiftCode: `// SwiftUI: Each modifier wraps the view above it!
Text("Upgrade")
    .padding(16)           // 1. Adds 16pt around Text
    .background(.blue)     // 2. Paints full padded box blue
    .clipShape(Capsule())  // 3. Clips blue box into a pill`
      },
      {
        heading: "3. Custom ViewModifiers vs. Custom Compose Modifiers",
        shift: "When you reuse a styling pattern across screens, you create a struct conforming to `ViewModifier` and expose it as a clean `.cardStyle()` extension on `View`.",
        details: [
          "<strong>Stateful ViewModifiers:</strong> Unlike simple Compose modifier chains, a SwiftUI `ViewModifier` is a struct that can even hold its own `@State` or `@Environment` properties!"
        ],
        kotlinCode: `fun Modifier.cardSurface(): Modifier = this
    .padding(16.dp)
    .clip(RoundedCornerShape(12.dp))`,
        swiftCode: `struct CardSurface: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(16)
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

extension View {
    func cardSurface() -> some View { modifier(CardSurface()) }
}`
      }
    ],
    quiz: [
      {
        question: "1. What is the difference between `.padding(16).background(.blue)` and `.background(.blue).padding(16)` on a `Text` view in SwiftUI?",
        options: [
          "They render identically because modifiers are order-independent",
          "The first paints the 16pt padding area blue; the second paints only the tight text bounds blue and adds 16pt of uncolored space around it",
          "The second one fails to compile",
          "`.background` must always come before `.padding`"
        ],
        correctIndex: 1,
        explanation: "Every modifier in SwiftUI wraps the view returned by the preceding modifier into a new View struct. Padding first expands the frame before the background is drawn."
      },
      {
        question: "2. What is the SwiftUI equivalent of Jetpack Compose's `Modifier.fillMaxWidth()`?",
        options: [
          "`.fillMaxWidth()`",
          "`.frame(maxWidth: .infinity)`",
          "`.layoutPriority(100)`",
          "`.edgesIgnoringSafeArea(.all)`"
        ],
        correctIndex: 1,
        explanation: "`.frame(maxWidth: .infinity)` creates a frame wrapper that accepts the parent's full proposed width."
      },
      {
        question: "3. During SwiftUI's 3-step layout pass, who has the final say on a child view's actual size?",
        options: [
          "The parent container forces the child's width and height",
          "The child view always chooses its own size based on the parent's proposal, and the parent must respect it",
          "The `UIWindow` root controller",
          "Auto Layout constraints override SwiftUI views"
        ],
        correctIndex: 1,
        explanation: "In SwiftUI, parents propose a size, the child chooses its own size, and the parent places the child."
      },
      {
        question: "4. Which SwiftUI container corresponds to Jetpack Compose's `Box` (stacking children along the Z-axis)?",
        options: [
          "`VStack`",
          "`HStack`",
          "`ZStack`",
          "`GridStack`"
        ],
        correctIndex: 2,
        explanation: "`ZStack` overlays child views back-to-front along the depth (Z) axis, just like Compose's `Box`."
      },
      {
        question: "5. What compiler feature allows you to list multiple child views inside `var body: some View` or `VStack { ... }` without commas or `return` statements?",
        options: [
          "`@ViewBuilder` (a Swift `@resultBuilder`)",
          "Runtime bytecode weaving",
          "Objective-C dynamic message passing",
          "Macros from Foundation"
        ],
        correctIndex: 0,
        explanation: "`@ViewBuilder` is a Swift `@resultBuilder` that transforms declarative child view statements into a strongly-typed composite `TupleView` at compile time."
      },
      {
        question: "6. Why should you NEVER perform network requests or heavy allocations inside a SwiftUI `View`'s `init()`?",
        options: [
          "Because `struct`s cannot have `init()` methods in Swift",
          "Because SwiftUI frequently re-instantiates lightweight `View` value structs whenever parent state changes; side effects belong in `.task {}` or `.onAppear {}`",
          "Because `init()` runs on a background thread",
          "Because Xcode blocks `init()` in Previews"
        ],
        correctIndex: 1,
        explanation: "A SwiftUI `View` struct is just an ephemeral description of UI, recreated many times during state updates. Side effects must be tied to lifecycle modifiers like `.task`."
      },
      {
        question: "7. How do you push two views to opposite ends of an `HStack` in SwiftUI (like `Arrangement.SpaceBetween` in Compose)?",
        options: [
          "Place a `Spacer()` between the two views inside the `HStack`",
          "Use `.padding(.infinity)`",
          "Wrap them in a `ZStack`",
          "Set `.alignment(.spaceBetween)`"
        ],
        correctIndex: 0,
        explanation: "`Spacer()` flexibly expands along the main axis of an `HStack` or `VStack` to consume all remaining proposed space."
      },
      {
        question: "8. What happens when two sibling views inside an `HStack` don't have enough horizontal space and you apply `.layoutPriority(1)` to the second view?",
        options: [
          "The second view renders on top of the first view",
          "The `HStack` offers available space to the higher-priority view (`1`) first before allocating leftover space to the default-priority (`0`) view",
          "The first view is deleted from the hierarchy",
          "It changes the Z-index of the view"
        ],
        correctIndex: 1,
        explanation: "`.layoutPriority(_:)` (similar to `Modifier.weight` priority in Compose) tells stacks which child should receive its ideal size first when space is constrained."
      },
      {
        question: "9. How do you overlay a badge in the top-trailing corner of an image in SwiftUI without wrapping both in a `ZStack`?",
        options: [
          "Use `.overlay(alignment: .topTrailing) { BadgeView() }`",
          "Use `.background(BadgeView())`",
          "Use `.offset(x: 999)`",
          "Use `HStack`"
        ],
        correctIndex: 0,
        explanation: "The `.overlay(alignment:content:)` modifier layers a secondary view directly over the modified view's bounds using the specified alignment."
      },
      {
        question: "10. How do you create a reusable custom modifier in SwiftUI that can even hold its own `@State`?",
        options: [
          "Create a `struct` conforming to `ViewModifier` and implement `func body(content: Content) -> some View`",
          "Subclass `UIView`",
          "Write a global macro",
          "Add a CSS stylesheet to the bundle"
        ],
        correctIndex: 0,
        explanation: "`ViewModifier` structs encapsulate modifier chains and can hold `@State`, `@Environment`, and custom parameters."
      }
    ],
    codeChallenge: {
      instructions: "Complete the `BadgeCard` SwiftUI View: (1) Conform `BadgeCard` to `View`, (2) Use an `HStack` with a `Spacer()` between the two `Text` views, and (3) Apply `.padding(16)` BEFORE `.background(.blue)`.",
      starterCode: `// TODO: Conform BadgeCard to View, place Spacer() inside HStack,
// and chain .padding(16) followed by .background(.blue)
struct BadgeCard {
    let title: String
    var body: some View {
        HStack {
            Text(title)
            Text("PRO")
        }
    }
}`,
      solutionCode: `struct BadgeCard: View {
    let title: String
    var body: some View {
        HStack {
            Text(title)
            Spacer()
            Text("PRO")
        }
        .padding(16)
        .background(.blue)
    }
}`,
      simulatedOutput: `✓ BadgeCard conforms to View
✓ HStack layout: [Text(title)] <--- Spacer() ---> [Text("PRO")]
✓ Modifier wrapper order verified: .padding(16) wrapped inside .background(.blue)`,
      requiredTokens: [": View", "HStack", "Spacer()", ".padding(16)", ".background(.blue)"]
    },
    linkedinPost: `Week 3 of Android -> iOS Before New Year: Jetpack Compose vs SwiftUI Layout Engine! 🎨📐

If you already know Jetpack Compose, you have a massive superpower learning SwiftUI—because both frameworks share the exact same declarative DNA:

1️⃣ @Composable fun vs View Structs
In Compose, views are functions emitted into a Slot Table. In SwiftUI, views are ultra-lightweight value-type structs conforming to the View protocol.

2️⃣ The 3-Step Layout Negotiation Pass
Parent proposes a size -> Child chooses its own size -> Parent places child. In SwiftUI, a parent can NEVER force a child's size!

3️⃣ Why Modifier Order Matters
Just like Compose Modifiers, chaining .padding(16).background(.blue) wraps the padded box in blue, while reversing them leaves transparent padding outside the blue box!

🎮 Try the live interactive SwiftUI Modifier Sandbox + 10-question quiz on my tutorial site:
🔗 https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #JetpackCompose #SwiftUI #MobileDevelopment`,
    linkedinArticle: `# Week 3: Jetpack Compose vs. SwiftUI — Inside the 3-Step Layout Engine & Modifier Wrapping

Coming from Jetpack Compose, learning SwiftUI feels like meeting a sibling who grew up in a different house. Both frameworks replaced imperative XML/Storyboard trees with declarative state-driven UI. Yet the way SwiftUI encodes view trees in the Swift type system is fascinating.

---

## 1. \`@Composable\` Functions vs. Value-Type \`View\` Structs

In Jetpack Compose, the Kotlin compiler plugin rewrites \`@Composable\` functions to emit nodes into a gap-buffer Slot Table.
In SwiftUI, views are **value-type \`struct\`s** that implement \`var body: some View\`. Because Swift structs are allocated on the stack, creating and destroying thousands of \`View\` structs costs virtually nothing.

---

## 2. The 3-Step Layout Negotiation

Whenever SwiftUI lays out a screen, every parent-child pair goes through a strict 3-step conversation:
1. **Parent proposes a size** (e.g., \`390 × 844\`).
2. **Child chooses its own size** (e.g., \`Text("Hi")\` measures its glyphs and says *"I only need 24 × 20"*).
3. **Parent places the child** in its coordinate space (centered by default).

---

## 3. Why Modifier Order Changes Everything

Every modifier you call in SwiftUI wraps the previous struct in a new \`ModifiedContent<Child, Modifier>\` struct:
- \`.padding(16).background(.blue)\` → Pads the view first, then paints the entire padded area blue.
- \`.background(.blue).padding(16)\` → Paints the tight text box blue first, then adds 16pt of invisible padding around it.`
  }
];
