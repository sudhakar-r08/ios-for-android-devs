// ============================================================================
// WEEKS 1 TO 3: Beginner-Friendly Foundations, Daily Micro-Steps & Quizzes
// ============================================================================

window.WEEKS_1_TO_3 = [
  // ==========================================================================
  // WEEK 1: SWIFT BASICS FOR ANDROID DEVELOPERS
  // ==========================================================================
  {
    week: 1,
    dates: "Oct 20 – Oct 26",
    title: "Swift Basics for Android Developers",
    subtitle: "A gentle kickoff: Syntax quirks, 'English sentence' argument labels, optionals without fear, and simple Structs vs Classes.",
    androidAnchor: "`val`/`var`, `$name` string templates, named arguments, Elvis operator `?:`, basic `data class`",
    iosAnchor: "`let`/`var`, `\\(name)` string interpolation, external argument labels, `guard let` / `??`, basic `struct`",
    simulatorType: "syntax-playground",
    flashcards: [
      { front: "What is the Swift equivalent of Kotlin's immutable `val`?", back: "`let`. Use `let` by default for constants, and `var` only when you need to reassign or mutate the variable." },
      { front: "How do you do string interpolation in Swift (like Kotlin's `\"Hello $name\"`)?", back: "Use backslash and parentheses: `\"Hello \\(name)\"`. You can put full expressions inside, like `\"Next year: \\(age + 1)\"`." },
      { front: "Why does Swift have two names for a function parameter (e.g. `func greet(to person: String)`)?", back: "The first name (`to`) is the EXTERNAL label used at the call site so code reads like an English sentence: `greet(to: \"Alex\")`. The second (`person`) is the INTERNAL name used inside the function body." },
      { front: "How do you omit an argument label at the call site in Swift?", back: "Prefix the parameter with an underscore `_`, e.g. `func log(_ message: String)` allows `log(\"Hello\")` without a label." },
      { front: "What is the difference between `if let` and `guard let` for unwrapping optionals?", back: "`if let` creates a variable valid only INSIDE the `{ ... }` braces. `guard let ... else { return }` forces early exit on nil and keeps the variable unwrapped for the entire rest of the function!" }
    ],
    dailySteps: [
      {
        day: 1,
        title: "Variables, Strings & Basic Collections",
        time: "15 mins",
        goal: "Get comfortable declaring variables, string interpolation, and lists in Swift without typing Kotlin syntax by mistake.",
        shift: "Swift uses `let` instead of `val`, `\\(var)` instead of `$var`, and clean bracket literals `[1, 2]` for arrays.",
        details: [
          "<strong>`let` vs `val`:</strong> In Swift, `let` defines a constant. If you never reassign a variable, the compiler will gently warn you to change `var` to `let`.",
          "<strong>String Interpolation:</strong> Kotlin uses `\"Hi $name\"` or `\"Count: ${list.size}\"`. Swift uses `\"Hi \\(name)\"` or `\"Count: \\(list.count)\"`.",
          "<strong>Collections at a Glance:</strong> Swift array literals use square brackets: `let tags = [\"android\", \"ios\"]`. Dictionary literals use colons: `let scores = [\"alice\": 95, \"bob\": 88]`."
        ],
        kotlinCode: `// Kotlin: Day 1 Basics
val appName = "AndroidNews"
var launchCount = 1
val tags = listOf("mobile", "kotlin")
val userProfile = mapOf("name" to "Sudhakar", "role" to "Dev")

println("App: $appName (Launch #$launchCount)")
println("First tag: \${tags.first()}")`,
        swiftCode: `// Swift: Day 1 Basics
let appName = "iOSNews" // 'let' = Kotlin 'val'
var launchCount = 1    // 'var' = Kotlin 'var'
let tags = ["mobile", "swift"] // Array literal
let userProfile = ["name": "Sudhakar", "role": "Dev"] // Dictionary

print("App: \\(appName) (Launch #\\(launchCount))")
print("First tag: \\(tags.first ?? \"none\")")`
      },
      {
        day: 2,
        title: "Functions & 'English Sentence' Argument Labels",
        time: "15 mins",
        goal: "Master external vs. internal argument labels so you can read and write idiomatic Apple APIs.",
        shift: "Swift functions are deliberately designed to read like readable English sentences when called.",
        details: [
          "<strong>The Two-Name Rule:</strong> `func transfer(amount: Double, from source: Account, to destination: Account)`. At the call site, it reads naturally: `transfer(amount: 50, from: checking, to: savings)`.",
          "<strong>Omitting Labels with `_`:</strong> If a parameter label feels redundant, put `_` before the name: `func printMessage(_ text: String)` lets you call `printMessage(\"Hello\")` just like in Kotlin.",
          "<strong>Default Values:</strong> Just like Kotlin, you can give parameters default values: `func load(timeout: Int = 30)`."
        ],
        kotlinCode: `// Kotlin: Named arguments exist, but parameter names are fixed
fun greet(name: String, prefix: String = "Hello") {
    println("$prefix, $name!")
}
// Call site:
greet("Sudhakar")
greet("Sudhakar", prefix = "Hi")`,
        swiftCode: `// Swift: External argument label 'to' + internal name 'name'
func greet(to name: String, withPrefix prefix: String = "Hello") {
    print("\\(prefix), \\(name)!")
}
// Call site reads like an English sentence!
greet(to: "Sudhakar")
greet(to: "Sudhakar", withPrefix: "Hi")

// Omitting external label using '_'
func square(_ number: Int) -> Int {
    number * number
}
print(square(5)) // No label needed!`
      },
      {
        day: 3,
        title: "Optionals Made Simple: Safe Calls, `??` & `guard let`",
        time: "15 mins",
        goal: "Handle nullability in Swift using safe calls `?`, default values `??`, and early-exit `guard let`.",
        shift: "Kotlin uses `?:` (Elvis) for defaults; Swift uses `??`. Kotlin smart-casts after `!= null`; Swift uses `if let` or `guard let`.",
        details: [
          "<strong>The Nil-Coalescing Operator (`??`):</strong> Swift's `name ?? \"Guest\"` is identical to Kotlin's Elvis operator `name ?: \"Guest\"`.",
          "<strong>`guard let` for Early Exit:</strong> Instead of nesting code inside deep `if` statements, Swift uses `guard let user = optionalUser else { return }`. The variable `user` stays valid for the entire rest of the function!",
          "<strong>Safe Unwrapping Shorthand:</strong> In modern Swift, if the variable name is the same, you can write `if let name { ... }` or `guard let name else { return }`."
        ],
        kotlinCode: `// Kotlin: Null safety & Elvis operator
fun displayUser(name: String?, age: Int?) {
    // Elvis operator ?:
    val displayName = name ?: "Guest"

    // Smart casting
    if (age != null) {
        println("$displayName is $age years old")
    }

    // Early return
    val verifiedAge = age ?: return
    println("Verified age: $verifiedAge")
}`,
        swiftCode: `// Swift: Optionals, ?? and guard let
func displayUser(name: String?, age: Int?) {
    // Nil-coalescing operator ??
    let displayName = name ?? "Guest"

    // if let: scoped inside braces
    if let age {
        print("\\(displayName) is \\(age) years old")
    }

    // guard let: early exit, keeps variable in scope!
    guard let age else {
        return
    }
    print("Verified age: \\(age)")
}`
      },
      {
        day: 4,
        title: "Structs, Classes & Enums (The Beginner Rule)",
        time: "15 mins",
        goal: "Know when to create a `struct` vs a `class`, and how Swift enums replace Kotlin sealed classes.",
        shift: "Simple rule of thumb: Default to `struct` for data models and state; use `class` only when you need shared reference identity.",
        details: [
          "<strong>The Golden Rule:</strong> 90% of your models in Swift will be `struct` (lightweight, value-type). You use `class` mostly for long-lived stateful services or ViewModels.",
          "<strong>Automatic Initializers:</strong> A Swift `struct` gets a free memberwise initializer (`User(id: \"1\", name: \"Alex\")`) generated by the compiler—just like a Kotlin `data class`!",
          "<strong>Enums with Associated Values:</strong> In Kotlin, an `enum class` cannot hold different data per case, so you use a `sealed interface`. In Swift, standard `enum`s carry data directly!"
        ],
        kotlinCode: `// Kotlin: data class + sealed interface
data class User(val id: String, val name: String)

sealed interface ScreenState {
    data object Loading : ScreenState
    data class Success(val user: User) : ScreenState
    data class Error(val message: String) : ScreenState
}`,
        swiftCode: `// Swift: struct + enum with associated values
struct User {
    let id: String
    let name: String
} // Free memberwise initializer generated!

enum ScreenState {
    case loading
    case success(user: User)
    case error(message: String)
}

let state: ScreenState = .success(user: User(id: "1", name: "Sudhakar"))`
      },
      {
        day: 5,
        title: "Week 1 Hands-On Lab, Confidence Quiz & LinkedIn Post",
        time: "20 mins",
        goal: "Put the 4 days of Swift basics into practice in Xcode or Swift Playgrounds, test your understanding with a friendly quiz, and publish your week's reflection on LinkedIn.",
        shift: "Reflect on how familiar Swift feels once you know the 3-4 small syntax differences.",
        details: [
          "<strong>Step 1:</strong> Run through the Week 1 coding challenge in the Practice tab.",
          "<strong>Step 2:</strong> Take the 5-question confidence check.",
          "<strong>Step 3:</strong> Copy the ready-made Week 1 LinkedIn post and share your learning journey with your network!"
        ],
        kotlinCode: `// Practice: Combine what you learned in Kotlin
fun createBadge(name: String?, role: String = "Member"): String {
    val cleanName = name?.trim()?.takeIf { it.isNotEmpty() } ?: "Guest"
    return "[$role] $cleanName"
}`,
        swiftCode: `// Practice: Combine what you learned in Swift
func createBadge(for name: String?, withRole role: String = "Member") -> String {
    guard let name = name?.trimmingCharacters(in: .whitespaces), !name.isEmpty else {
        return "[\\(role)] Guest"
    }
    return "[\\(role)] \\(name)"
}
print(createBadge(for: "Sudhakar", withRole: "Android Dev"))`
      }
    ],
    concepts: [
      {
        heading: "1. Swift Syntax Quirks for Kotlin Developers",
        shift: "Kotlin uses `val`, `$variable`, and `listOf()`. Swift uses `let`, `\\(variable)`, and `[\"item1\", \"item2\"]` array literals.",
        details: [
          "<strong>Immutable by Default:</strong> In Swift, use `let` for all values that don't change. The compiler will give you a suggestion if you use `var` unnecessarily.",
          "<strong>String Interpolation:</strong> `\"Hello \\(user.name)\"` works anywhere inside double quotes and can execute expressions like `\"Total: \\(price * 1.08)\"`."
        ],
        kotlinCode: `val language = "Kotlin"
var version = 2.0
val features = listOf("Coroutines", "Compose")
println("Learning $language $version with \${features.size} features")`,
        swiftCode: `let language = "Swift"
var version = 6.0
let features = ["Concurrency", "SwiftUI"]
print("Learning \\(language) \\(version) with \\(features.count) features")`
      },
      {
        heading: "2. The 'English Sentence' Rule for Functions",
        shift: "Swift functions have both external argument labels (for readable call sites) and internal parameter names (for function bodies).",
        details: [
          "<strong>Natural Call Sites:</strong> `func downloadFile(from url: URL, to directory: URL)`. Calling it reads like a sentence: `downloadFile(from: webURL, to: documentsURL)`.",
          "<strong>Omission with `_`:</strong> If the first parameter is obvious from the function name (e.g. `save(user)`), prefix with `_` to omit the label."
        ],
        kotlinCode: `fun sendEmail(to: String, subject: String, body: String) {
    println("Sending to $to: $subject")
}
sendEmail("alex@example.com", "Hi", "Hello there")`,
        swiftCode: `func sendEmail(to recipient: String, subject: String, body: String) {
    print("Sending to \\(recipient): \\(subject)")
}
sendEmail(to: "alex@example.com", subject: "Hi", body: "Hello there")`
      },
      {
        heading: "3. Optionals: `??`, `if let`, and the `guard let` Golden Path",
        shift: "Instead of deep nesting or explicit `!= null` checks, Swift uses `guard let` to handle preconditions and keep your code flat.",
        details: [
          "<strong>Nil-Coalescing:</strong> `let title = rawTitle ?? \"Untitled\"` works exactly like Kotlin's Elvis operator `rawTitle ?: \"Untitled\"`.",
          "<strong>The Golden Path:</strong> `guard let` verifies that required inputs exist right at the top of a function, exiting immediately if they are missing."
        ],
        kotlinCode: `fun processOrder(orderId: String?) {
    val id = orderId ?: return
    println("Processing order: $id")
}`,
        swiftCode: `func processOrder(orderId: String?) {
    guard let id = orderId else {
        return
    }
    print("Processing order: \\(id)")
}`
      },
      {
        heading: "4. When to Use `struct` vs `class` & Algebraic Enums",
        shift: "Beginner rule of thumb: Default to `struct` for models and views; use `class` only for services and stateful ViewModels.",
        details: [
          "<strong>`struct` is a Value Type:</strong> Passing a `struct` to a function or assigning it to a new variable creates a safe copy—no unexpected mutations across threads!",
          "<strong>Enums with Associated Values:</strong> One Swift `enum` can represent loading, success with data, and error states without writing separate subclasses."
        ],
        kotlinCode: `data class Book(val title: String, val author: String)

sealed interface UIState {
    data object Loading : UIState
    data class Success(val books: List<Book>) : UIState
}`,
        swiftCode: `struct Book {
    let title: String
    let author: String
}

enum UIState {
    case loading
    case success(books: [Book])
}`
      }
    ],
    quiz: [
      {
        question: "1. Which keyword is used in Swift to declare an immutable constant (equivalent to Kotlin's `val`)?",
        options: [
          "`val`",
          "`let`",
          "`const`",
          "`immutable`"
        ],
        correctIndex: 1,
        explanation: "In Swift, `let` declares an immutable constant. Use `let` whenever the value will not be reassigned."
      },
      {
        question: "2. How do you print `\"User: Alice (Score: 100)\"` using string interpolation in Swift?",
        options: [
          "`print(\"User: $name (Score: $score)\")`",
          "`print(\"User: \\(name) (Score: \\(score))\")`",
          "`print(\"User: %name (Score: %score)\")`",
          "`print(\"User: \" + name + \" (Score: \" + score + \")\")` only"
        ],
        correctIndex: 1,
        explanation: "Swift string interpolation uses the syntax `\\(expression)` inside double quotes."
      },
      {
        question: "3. What is the purpose of the underscore `_` in `func calculateArea(_ width: Double, _ height: Double)`?",
        options: [
          "It marks the parameters as private",
          "It tells the compiler that callers do NOT need to specify argument labels at the call site (e.g. `calculateArea(10, 20)`)",
          "It marks the parameters as nullable",
          "It ignores the arguments"
        ],
        correctIndex: 1,
        explanation: "Prefixing a parameter with an underscore `_` suppresses the external argument label, allowing the function to be called positionally without labels."
      },
      {
        question: "4. What is the Swift equivalent of Kotlin's Elvis operator `name ?: \"Default\"`?",
        options: [
          "`name ?? \"Default\"` (the nil-coalescing operator)",
          "`name ?: \"Default\"`",
          "`name || \"Default\"`",
          "`name.getOrDefault(\"Default\")`"
        ],
        correctIndex: 0,
        explanation: "Swift uses the nil-coalescing operator `??` to unwrap an optional or provide a fallback value."
      },
      {
        question: "5. What is the main advantage of `guard let` over `if let` when validating inputs at the top of a function?",
        options: [
          "`guard let` runs faster at runtime",
          "`guard let` forces an early exit if the value is `nil` and keeps the unwrapped variable in scope for the rest of the function (preventing nested indentation)",
          "`guard let` can only be used on numbers",
          "`guard let` automatically catches exceptions"
        ],
        correctIndex: 1,
        explanation: "`guard let` enforces the 'Golden Path': you handle errors/nil early and exit, leaving the unwrapped variable in scope for the rest of your clean, unindented logic."
      },
      {
        question: "6. As an Android developer building modern iOS apps, what should be your default choice for data models?",
        options: [
          "`class` (Reference Type)",
          "`struct` (Value Type)",
          "`NSObject`",
          "`AnyObject`"
        ],
        correctIndex: 1,
        explanation: "In modern Swift and SwiftUI, `struct` is the default choice for models, collections, and views because of its safety, speed, and automatic value semantics."
      },
      {
        question: "7. In Swift, how do you declare an array containing the numbers `1, 2, 3`?",
        options: [
          "`listOf(1, 2, 3)`",
          "`[1, 2, 3]`",
          "`Array(1, 2, 3)`",
          "`new int[]{1, 2, 3}`"
        ],
        correctIndex: 1,
        explanation: "Swift uses simple bracket literals `[1, 2, 3]` to initialize arrays."
      },
      {
        question: "8. How do you call a Swift function defined as `func navigate(to screen: String)`?",
        options: [
          "`navigate(\"Home\")`",
          "`navigate(to: \"Home\")`",
          "`navigate(screen = \"Home\")`",
          "`navigate(to = \"Home\")`"
        ],
        correctIndex: 1,
        explanation: "Swift uses a colon `:` after the external argument label at the call site: `navigate(to: \"Home\")`."
      },
      {
        question: "9. What does the shorthand `if let name { ... }` do in modern Swift (Swift 5.7+)?",
        options: [
          "It is a syntax error",
          "It safely unwraps the optional `name` and creates a non-optional variable also named `name` inside the braces (equivalent to `if let name = name`)",
          "It checks if `name.isEmpty`",
          "It makes `name` a global variable"
        ],
        correctIndex: 1,
        explanation: "`if let name` is a handy shorthand for `if let name = name`, eliminating repetitive variable naming when unwrapping."
      },
      {
        question: "10. How do Swift `enum`s with associated values compare to Kotlin?",
        options: [
          "They are identical to Java enums",
          "They serve the same purpose as Kotlin `sealed class` or `sealed interface` hierarchies, allowing each case to carry its own custom data payload",
          "They cannot hold any data",
          "They can only store integer values"
        ],
        correctIndex: 1,
        explanation: "Swift enums with associated values (like `case success(User)`) provide the power of algebraic data types without needing to create a separate class hierarchy like in Kotlin."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 1 Mini-Lab: (1) Declare constant `appName` with `let`, (2) Write a function `greet(to name: String?)` with `guard let`, and (3) Use `??` to provide a fallback of `'Guest'`.",
      starterCode: `// TODO 1: Use 'let' to declare appName = "Academy"
var appName = "Academy"

// TODO 2: Write greet(to name: String?) -> String
// Use guard let to check name, or return "Hello, Guest from \\(appName)!"
func greet(to name: String?) -> String {
    return "TODO"
}`,
      solutionCode: `let appName = "Academy"

func greet(to name: String?) -> String {
    guard let name, !name.isEmpty else {
        return "Hello, Guest from \\(appName)!"
    }
    return "Hello, \\(name) from \\(appName)!"
}`,
      simulatedOutput: `✓ let appName constant initialized cleanly
✓ greet(to: nil) -> "Hello, Guest from Academy!"
✓ greet(to: "Sudhakar") -> "Hello, Sudhakar from Academy!"`,
      requiredTokens: ["let appName", "func greet(to name: String?)", "guard let"]
    },
    linkedinPost: `Week 1 as an Android Developer Learning iOS Before New Year! 📱🚀

This week I took my first steps into modern Swift (after years of writing Kotlin & Jetpack Compose).
Coming from Android, here were the 3 syntax quirks that surprised me most in Week 1:

1️⃣ The "English Sentence" Function Rule
In Kotlin: sendEmail(user, "Welcome")
In Swift: sendEmail(to: user, withSubject: "Welcome")
Swift functions have external labels so call sites read like natural English sentences!

2️⃣ Optionals & The "Golden Path" with guard let
Instead of nesting logic inside deep if-checks or smart-casts, Swift pushes you to use 'guard let'. You check preconditions at the top and exit early, keeping the rest of your function flat and unindented.

3️⃣ let vs val, \\(x) vs $x
Switching muscle memory from 'val' to 'let' and '$name' to '\\(name)' took about 2 days—now it feels second nature.

Next week: Diving into Protocols (Kotlin Interfaces) and building my first SwiftUI screen!

📖 Follow my interactive learning notes, roadmap & code labs on GitHub:
🔗 https://github.com/sudhakar-r08/ios-for-android-devs
🌐 Tutorial Site: https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #Kotlin #Swift #MobileDevelopers #LearningInPublic`,
    linkedinArticle: `# From Kotlin to Swift (Week 1): An Android Developer's First Impressions

Opening Xcode for the first time as an experienced Android engineer is a mix of familiarity and disorientation. You know how software architecture works, but your fingers instinctively type \`val\`, \`fun\`, and \`$variable\`.

In Week 1 of my "Android to iOS Before New Year" challenge, I focused strictly on building comfort with Swift syntax and idiomatic patterns. Here are the biggest takeaways.

---

## 1. \`let\` vs \`val\` & String Interpolation

In Kotlin:
\`\`\`kotlin
val name = "Sudhakar"
println("Hello, $name!")
\`\`\`

In Swift:
\`\`\`swift
let name = "Sudhakar"
print("Hello, \\(name)!")
\`\`\`

Swift uses \`let\` for constants. And string interpolation uses \`\\(expression)\`, which easily accepts full operations like \`\"Next year: \\(age + 1)\"\`.

---

## 2. Argument Labels: Why Swift Functions Read Like Sentences

In Kotlin, parameter names are fixed unless callers choose to write named arguments. In Swift, every parameter can have an **external label** (seen at the call site) and an **internal name** (used inside the function body):

\`\`\`swift
func transfer(amount: Double, from source: Account, to destination: Account) {
    source.balance -= amount
    destination.balance += amount
}

// Call site reads like a sentence:
transfer(amount: 100.0, from: checking, to: savings)
\`\`\`

---

## 3. The "Golden Path" with \`guard let\`

In Kotlin, we often use the Elvis operator \`?: return\` for early exits:
\`\`\`kotlin
val user = repo.getUser() ?: return
\`\`\`

Swift elevates this into a first-class language feature called \`guard let\`:
\`\`\`swift
guard let user = repo.getUser() else {
    print("User not found")
    return
}
// 'user' is now unwrapped and in scope for the rest of the function!
\`\`\`

---

**Next Week (Week 2):** Protocol-Oriented Programming (Kotlin \`interface\` vs Swift \`protocol\`), Extensions, and Error Handling with \`try/catch\`.`
  },

  // ==========================================================================
  // WEEK 2: PROTOCOLS, EXTENSIONS & ERROR HANDLING
  // ==========================================================================
  {
    week: 2,
    dates: "Oct 27 – Nov 02",
    title: "Protocols, Extensions & Error Handling",
    subtitle: "Understanding Protocol-Oriented Programming (`protocol` vs Kotlin `interface`), retroactive extensions, opaque types (`some View`), and `do / try / catch`.",
    androidAnchor: "Kotlin `interface`, Extension Functions, Generics `<T>`, Unchecked Exceptions / `runCatching`",
    iosAnchor: "Swift `protocol`, Protocol Extensions, `some` (Opaque) vs `any`, `throws` & `do / try / catch`",
    simulatorType: "dispatch-explorer",
    flashcards: [
      { front: "What is the Swift equivalent of a Kotlin `interface`?", back: "`protocol`. Structs, classes, and enums can all conform to protocols." },
      { front: "What is Retroactive Conformance in Swift?", back: "Using an `extension` to make an existing type (even Apple's built-in `String` or `Int`) conform to a protocol without modifying the original source code." },
      { front: "What does `var body: some View` mean in SwiftUI?", back: "It returns an Opaque Type: a specific concrete type known to the compiler for static performance, without forcing you to write complex nested generic types." },
      { front: "How does Swift error handling differ from Kotlin/Java exceptions?", back: "Kotlin has unchecked exceptions. Swift functions must declare `throws`, and callers must explicitly use `try`, `try?`, or `do/catch` at the call site." }
    ],
    dailySteps: [
      {
        day: 1,
        title: "Protocols as Interfaces + Default Implementations",
        time: "15 mins",
        goal: "Define protocols and provide shared default behavior using protocol extensions.",
        shift: "Kotlin interfaces have method bodies inside the interface; Swift protocols only declare requirements, and extensions provide default implementations.",
        details: [
          "<strong>Protocol Declaration:</strong> `protocol Identifiable { var id: String { get } }`.",
          "<strong>Default Behavior:</strong> `extension Identifiable { func printId() { print(id) } }` provides the implementation to every conforming type."
        ],
        kotlinCode: `interface Greetable {
    val name: String
    fun greet() = println("Hello, $name!")
}`,
        swiftCode: `protocol Greetable {
    var name: String { get }
    func greet()
}

extension Greetable {
    func greet() {
        print("Hello, \\(name)!")
    }
}`
      },
      {
        day: 2,
        title: "Retroactive Modeling via Extensions",
        time: "15 mins",
        goal: "Add new methods and protocol conformances to existing types without subclassing.",
        shift: "In Kotlin, extension functions cannot make an existing class implement a new interface. In Swift, extensions CAN make any type conform to a protocol!",
        details: [
          "<strong>Retroactive Conformance:</strong> `extension String: Greetable { var name: String { self } }`. Now `String` is officially `Greetable` across your app!"
        ],
        kotlinCode: `// Kotlin extension function (adds method, but does NOT make String implement an interface)
fun String.shout() = this.uppercase() + "!"`,
        swiftCode: `// Swift extension: can add methods AND protocol conformances!
extension String {
    func shout() -> String {
        self.uppercased() + "!"
    }
}`
      },
      {
        day: 3,
        title: "Opaque Types (`some`) vs Existential Boxes (`any`)",
        shift: "Understanding why every SwiftUI view has `var body: some View`.",
        time: "15 mins",
        goal: "Demystify the `some` keyword in Swift for Jetpack Compose developers.",
        details: [
          "<strong>`some View`:</strong> Promises the compiler that this function will always return ONE consistent concrete type, enabling compile-time static optimization without heap boxing.",
          "<strong>`any View`:</strong> A runtime box that can hold any view dynamically (slower, used only when dynamic switching is strictly required)."
        ],
        kotlinCode: `// Compose: Composable functions emit UI directly
@Composable
fun Header() {
    Text("Welcome")
}`,
        swiftCode: `// SwiftUI: View struct returns 'some View'
struct Header: View {
    var body: some View {
        Text("Welcome")
    }
}`
      },
      {
        day: 4,
        title: "Explicit Error Handling (`throws`, `try`, `try?`)",
        time: "15 mins",
        goal: "Handle errors reliably without unexpected runtime crashes.",
        shift: "Kotlin uses unchecked exceptions or `runCatching`. Swift enforces explicit `try` at every call site that can throw.",
        details: [
          "<strong>`try?`:</strong> Turns any thrown error into `nil`, returning an Optional. Great for non-critical operations like parsing an int from a string.",
          "<strong>`do / catch`:</strong> Used when you need to inspect and handle specific errors."
        ],
        kotlinCode: `val age = runCatching { input.toInt() }.getOrNull()`,
        swiftCode: `func parseAge(_ text: String) throws -> Int {
    guard let age = Int(text) else { throw ValidationError.invalidNumber }
    return age
}

// Convert error to Optional nil:
let age = try? parseAge("25")`
      },
      {
        day: 5,
        title: "Week 2 Lab, Confidence Quiz & LinkedIn Post",
        time: "20 mins",
        goal: "Solidify protocol-oriented programming, test your knowledge, and publish Week 2 on LinkedIn.",
        shift: "Recognize how Protocol-Oriented Programming replaces deep class hierarchies with clean composition.",
        details: [
          "Complete the Week 2 practice challenge, take the quiz, and copy the weekly LinkedIn reflection."
        ],
        kotlinCode: `interface Repository<T> {
    suspend fun get(): T
}`,
        swiftCode: `protocol Repository {
    associatedtype Item
    func get() async throws -> Item
}`
      }
    ],
    concepts: [
      {
        heading: "1. Protocols & Protocol Extensions",
        shift: "Swift protocols define requirements; protocol extensions provide default implementations.",
        details: [
          "Structs, enums, and classes can all conform to protocols.",
          "Composition over inheritance: build rich features by combining small protocols."
        ],
        kotlinCode: `interface Printable {
    fun printContent() = println("Content")
}`,
        swiftCode: `protocol Printable {
    func printContent()
}
extension Printable {
    func printContent() { print("Content") }
}`
      },
      {
        heading: "2. Retroactive Conformance via Extensions",
        shift: "Extensions in Swift can make third-party or standard library types conform to your custom protocols.",
        details: [
          "No need to write wrapper classes just to make a type fit an interface."
        ],
        kotlinCode: `fun Int.isEven(): Boolean = this % 2 == 0`,
        swiftCode: `extension Int {
    var isEven: Bool { self % 2 == 0 }
}`
      },
      {
        heading: "3. Opaque Types (`some`) vs Dynamic Boxes (`any`)",
        shift: "`some` gives compile-time static dispatch and zero heap boxing; `any` creates a dynamic runtime existential container.",
        details: [
          "SwiftUI uses `some View` to optimize complex nested view trees."
        ],
        kotlinCode: `fun createView(): View = MyView()`,
        swiftCode: `func createView() -> some View = MyView()`
      },
      {
        heading: "4. Checked Error Handling with `throws` and `try?`",
        shift: "Errors in Swift are compiler-checked and do not incur expensive stack unwinding overhead.",
        details: [
          "Use `try?` when you only care whether the operation succeeded or failed.",
          "Use `do/catch` when you need to show error messages to the user."
        ],
        kotlinCode: `try { api.fetch() } catch (e: Exception) { println(e) }`,
        swiftCode: `do { try api.fetch() } catch { print(error) }`
      }
    ],
    quiz: [
      {
        question: "1. What keyword defines an interface equivalent in Swift?",
        options: ["`interface`", "`protocol`", "`trait`", "`contract`"],
        correctIndex: 1,
        explanation: "Swift uses `protocol` to define a blueprint of methods, properties, and other requirements."
      },
      {
        question: "2. How do you provide a default implementation for a Swift protocol?",
        options: [
          "Write the code inside the protocol declaration",
          "Create a protocol extension: `extension MyProtocol { ... }`",
          "Subclass `NSObject`",
          "Protocols cannot have default implementations"
        ],
        correctIndex: 1,
        explanation: "Protocol extensions provide shared default implementations for conforming types."
      },
      {
        question: "3. What does `some View` mean in SwiftUI's `var body: some View`?",
        options: [
          "It returns an optional View",
          "It returns an opaque type: a specific concrete View known to the compiler for high-performance static dispatch",
          "It returns any random View at runtime",
          "It is a legacy Objective-C macro"
        ],
        correctIndex: 1,
        explanation: "`some View` is an opaque return type that preserves static typing without exposing massive nested generic signatures."
      },
      {
        question: "4. What does `try? parseData()` return if `parseData()` throws an error?",
        options: [
          "It crashes the application",
          "`nil` (of type `Optional`)",
          "A default empty object",
          "It rethrows the error"
        ],
        correctIndex: 1,
        explanation: "`try?` evaluates a throwing expression to an Optional, returning `nil` if an error was thrown."
      },
      {
        question: "5. What is retroactive conformance in Swift?",
        options: [
          "A tool for migrating legacy Objective-C code",
          "Using an `extension` to make an existing type conform to a protocol without changing its original source code",
          "A way to reset variable state",
          "An ARC memory optimization"
        ],
        correctIndex: 1,
        explanation: "Retroactive modeling lets you extend types you don't own (like Apple's `String`) to conform to your own protocols."
      },
      {
        question: "6. What is the fundamental difference between `some Protocol` and `any Protocol` in Swift 5.7+ / 6?",
        options: [
          "`some` is for classes; `any` is for structs",
          "`some` provides static dispatch with zero heap boxing overhead; `any` creates a dynamic existential box with runtime method lookup",
          "`some` is deprecated in iOS 17",
          "There is no difference; they are interchangeable aliases"
        ],
        correctIndex: 1,
        explanation: "`some` is an opaque type resolved statically by the compiler (blazing fast). `any` is an existential container with dynamic dispatch and heap box overhead."
      },
      {
        question: "7. Can a Swift `struct` or `class` conform to multiple protocols simultaneously?",
        options: [
          "No, Swift strictly allows single protocol conformance",
          "Yes, by listing them comma-separated (e.g., `struct User: Identifiable, Codable, Equatable`)",
          "Only if they inherit from `NSObject`",
          "Only classes can conform to multiple protocols; structs cannot"
        ],
        correctIndex: 1,
        explanation: "Types can conform to any number of protocols separated by commas, encouraging compositional architecture."
      },
      {
        question: "8. How does Swift's `defer` statement behave when an error is thrown or a function returns early?",
        options: [
          "It is skipped entirely if an error occurs",
          "It always executes right before leaving the current scope, regardless of whether execution succeeded, returned early, or threw an error",
          "It pauses execution for 1 second",
          "It defers execution to the background thread"
        ],
        correctIndex: 1,
        explanation: "`defer` acts like Kotlin/Java's `finally` block: it guarantees execution immediately before exiting the enclosing scope."
      },
      {
        question: "9. What happens if a function marked `throws` calls another throwing function without prefixing it with `try`?",
        options: [
          "It automatically catches the error and prints it",
          "It compiles with a runtime warning",
          "It is a compile-time error; Swift strictly requires `try`, `try?`, or `try!` at every throwing call site",
          "It silently ignores the error"
        ],
        correctIndex: 2,
        explanation: "Swift mandates explicit error visibility. You must write `try` before any function call that can throw."
      },
      {
        question: "10. How do you create a custom error type in Swift?",
        options: [
          "Subclass `Exception` or `Throwable`",
          "Create an `enum` or `struct` that conforms to the built-in `Error` protocol",
          "Annotate a class with `@Throws`",
          "Import the `CrashReporting` module"
        ],
        correctIndex: 1,
        explanation: "Swift errors are lightweight types conforming to the `Error` protocol, most idiomatically implemented as enums with associated values."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 2 Lab: (1) Define `protocol Describable` with `var descriptionText: String { get }`, and (2) Provide a default `extension Describable`.",
      starterCode: `// TODO 1: Declare protocol Describable
protocol Describable {
    
}

// TODO 2: Add extension Describable with default func printDescription()
extension Describable {
    
}`,
      solutionCode: `protocol Describable {
    var descriptionText: String { get }
}

extension Describable {
    func printDescription() {
        print(descriptionText)
    }
}`,
      simulatedOutput: `✓ Protocol Describable & default extension compiled cleanly!`,
      requiredTokens: ["protocol Describable", "var descriptionText: String { get }", "extension Describable"]
    },
    linkedinPost: `Week 2 of Android -> iOS Before New Year! 🚀
This week I dove into Protocol-Oriented Programming (POP), Extensions, and Swift's Error Handling.

Coming from Kotlin interfaces, two things stood out:
1️⃣ Retroactive Conformance: You can make existing types (even built-in ones like String or Int) conform to your custom protocol via an extension!
2️⃣ The magic of 'some View': Why every SwiftUI view uses an opaque return type for static dispatch performance.

Next week: Building real UI with SwiftUI (mapping Jetpack Compose to SwiftUI)!

🔗 Follow along on GitHub: https://github.com/sudhakar-r08/ios-for-android-devs
🌐 Tutorial: https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #Swift #Kotlin #MobileEngineering`,
    linkedinArticle: `# Week 2: Protocol-Oriented Programming, Extensions, and Why SwiftUI Uses \`some View\`

In Kotlin, we use \`interface\` and inheritance. In Swift, Apple emphasizes **Protocol-Oriented Programming**. Here is how it compares to the Android ecosystem...`
  },

  // ==========================================================================
  // WEEK 3: SWIFTUI FOUNDATIONS & LAYOUT ENGINE
  // ==========================================================================
  {
    week: 3,
    dates: "Nov 03 – Nov 09",
    title: "SwiftUI Foundations (Compose ➔ SwiftUI)",
    subtitle: "Your first real iOS UI: Mapping `@Composable` to `View` structs, Stacks (`VStack`, `HStack`, `ZStack`), and the Modifier wrapping order.",
    androidAnchor: "`@Composable`, `Column`/`Row`/`Box`, `Modifier.padding().background()`, Compose Preview",
    iosAnchor: "`View` struct (`var body: some View`), `VStack`/`HStack`/`ZStack`, Modifier order, `#Preview` Canvas",
    simulatorType: "modifier-sandbox",
    flashcards: [
      { front: "What is the SwiftUI equivalent of Jetpack Compose's `@Composable` function?", back: "A value-type `struct` conforming to the `View` protocol, implementing `var body: some View`." },
      { front: "What are the SwiftUI equivalents of `Column`, `Row`, and `Box`?", back: "`VStack` (vertical), `HStack` (horizontal), and `ZStack` (depth/layered)." },
      { front: "Why does `.padding(16).background(.blue)` differ from `.background(.blue).padding(16)`?", back: "Each modifier in SwiftUI wraps the preceding view in a new layout container. Padding first expands the frame before background paints it." },
      { front: "How do you make a view expand to fill the available width (like `Modifier.fillMaxWidth()` in Compose)?", back: "Use `.frame(maxWidth: .infinity)` (with optional alignment like `alignment: .leading`)." }
    ],
    dailySteps: [
      {
        day: 1,
        title: "From `@Composable` to `View` Structs & Previews",
        time: "15 mins",
        goal: "Build your first SwiftUI view and see it render live in the Xcode Preview Canvas.",
        shift: "Compose views are functions emitted into a Slot Table; SwiftUI views are lightweight structs conforming to `View`.",
        details: [
          "<strong>Lightweight Structs:</strong> Creating a SwiftUI View struct costs virtually nothing; it is just a declarative description of UI.",
          "<strong>`#Preview`:</strong> Use the modern `#Preview` macro to see instant interactive previews in the Xcode Canvas (like `@Preview` in Compose)."
        ],
        kotlinCode: `@Composable
fun WelcomeCard() {
    Text("Hello from Compose!")
}

@Preview
@Composable
fun WelcomePreview() { WelcomeCard() }`,
        swiftCode: `struct WelcomeCard: View {
    var body: some View {
        Text("Hello from SwiftUI!")
    }
}

#Preview {
    WelcomeCard()
}`
      },
      {
        day: 2,
        title: "Layout Stacks: `VStack`, `HStack`, and `ZStack`",
        time: "15 mins",
        goal: "Arrange elements vertically, horizontally, and layered on top of each other.",
        shift: "`Column` ➔ `VStack`, `Row` ➔ `HStack`, and `Box` ➔ `ZStack`.",
        details: [
          "<strong>Spacing & Alignment:</strong> `VStack(alignment: .leading, spacing: 12) { ... }` configures child alignment and gap spacing cleanly.",
          "<strong>Layering with `ZStack`:</strong> `ZStack` layers child views back-to-front along the depth axis."
        ],
        kotlinCode: `Column(
    horizontalAlignment = Alignment.Start,
    verticalArrangement = Arrangement.spacedBy(8.dp)
) {
    Text("Title")
    Text("Subtitle")
}`,
        swiftCode: `VStack(alignment: .leading, spacing: 8) {
    Text("Title").fontWeight(.bold)
    Text("Subtitle").foregroundStyle(.secondary)
}`
      },
      {
        day: 3,
        title: "Modifiers & The Wrapping Order Trap",
        time: "15 mins",
        goal: "Understand why modifier order matters just as much in SwiftUI as it does in Compose.",
        shift: "Each modifier wraps the previous view in a new modified view struct.",
        details: [
          "Chaining `.padding(16).background(.blue)` expands the box by 16pt first, then paints the entire box blue.",
          "Chaining `.background(.blue).padding(16)` paints the tight text bounds blue first, then adds 16pt of transparent space around it!"
        ],
        kotlinCode: `Text(
    text = "Button",
    modifier = Modifier
        .padding(16.dp)
        .background(Color.Blue)
)`,
        swiftCode: `Text("Button")
    .padding(16)
    .background(.blue)
    .clipShape(Capsule())`
      },
      {
        day: 4,
        title: "Flexible Layouts: `Spacer()` & `.frame(maxWidth: .infinity)`",
        time: "15 mins",
        goal: "Make views fill screen width and push siblings apart naturally.",
        shift: "`Modifier.weight(1f)` ➔ `Spacer()`, `Modifier.fillMaxWidth()` ➔ `.frame(maxWidth: .infinity)`.",
        details: [
          "Dropping a `Spacer()` inside an `HStack` expands greedily along the horizontal axis, pushing surrounding items to the edges.",
          "Use `.frame(maxWidth: .infinity, alignment: .leading)` to let cards expand across the entire screen width."
        ],
        kotlinCode: `Row(modifier = Modifier.fillMaxWidth()) {
    Text("Left")
    Spacer(modifier = Modifier.weight(1f))
    Text("Right")
}`,
        swiftCode: `HStack {
    Text("Left")
    Spacer()
    Text("Right")
}
.frame(maxWidth: .infinity)`
      },
      {
        day: 5,
        title: "Week 3 Mini-Project: Building a User Profile Card",
        time: "25 mins",
        goal: "Combine Stacks, Modifiers, Text, and Images to build a polished, production-ready Profile Card screen.",
        shift: "Experience the joy of instant visual feedback in the Xcode Canvas Preview.",
        details: [
          "Assemble an avatar image, name, role badge, bio text, and action button.",
          "Test your understanding with the quiz and share your first iOS screen on LinkedIn!"
        ],
        kotlinCode: `// Android Compose Profile Card
@Composable
fun ProfileCard() {
    Card(modifier = Modifier.padding(16.dp)) {
        Column { Text("Sudhakar"); Text("Android Dev") }
    }
}`,
        swiftCode: `// SwiftUI Profile Card
struct ProfileCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Sudhakar Raju").font(.title2).bold()
            Text("Android Dev learning iOS").foregroundStyle(.secondary)
        }
        .padding(20)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))
        .padding()
    }
}`
      }
    ],
    concepts: [
      {
        heading: "1. `@Composable` Functions vs. `View` Structs",
        shift: "Compose uses functions; SwiftUI uses lightweight value-type structs conforming to `View`.",
        details: [
          "Views are just blueprints that SwiftUI re-evaluates whenever state changes.",
          "Use `#Preview` to get instant visual rendering in Xcode."
        ],
        kotlinCode: `@Composable fun CardView() { Text("Hello") }`,
        swiftCode: `struct CardView: View { var body: some View { Text("Hello") } }`
      },
      {
        heading: "2. Layout Stacks (`VStack`, `HStack`, `ZStack`)",
        shift: "Direct 1:1 translation: `Column` ➔ `VStack`, `Row` ➔ `HStack`, `Box` ➔ `ZStack`.",
        details: [
          "Stacks support spacing and alignment out of the box."
        ],
        kotlinCode: `Column { Text("1"); Text("2") }`,
        swiftCode: `VStack { Text("1"); Text("2") }`
      },
      {
        heading: "3. Modifier Order & Wrapping",
        shift: "Modifiers in SwiftUI wrap views hierarchically from top to bottom.",
        details: [
          "Always apply padding before background if you want the background to cover the padding area."
        ],
        kotlinCode: `Modifier.padding(16.dp).background(Color.Blue)`,
        swiftCode: `.padding(16).background(.blue)`
      },
      {
        heading: "4. Responsive Sizing with `Spacer` and `frame`",
        shift: "Use `Spacer()` to push views apart, and `.frame(maxWidth: .infinity)` to fill width.",
        details: [
          "Parent proposes size, child chooses size, parent places child."
        ],
        kotlinCode: `Modifier.fillMaxWidth()`,
        swiftCode: `.frame(maxWidth: .infinity)`
      }
    ],
    quiz: [
      {
        question: "1. What is the SwiftUI equivalent of Jetpack Compose's `Column`?",
        options: ["`VStack`", "`HStack`", "`ZStack`", "`FlowColumn`"],
        correctIndex: 0,
        explanation: "`VStack` (Vertical Stack) arranges child views in a vertical line."
      },
      {
        question: "2. What is the SwiftUI equivalent of Jetpack Compose's `Row`?",
        options: ["`HStack`", "`VStack`", "`ZStack`", "`FlexRow`"],
        correctIndex: 0,
        explanation: "`HStack` (Horizontal Stack) arranges child views horizontally."
      },
      {
        question: "3. What is the SwiftUI equivalent of Jetpack Compose's `Box` (layering views on top of each other)?",
        options: ["`ZStack`", "`Overlay`", "`StackBox`", "`LayerStack`"],
        correctIndex: 0,
        explanation: "`ZStack` overlays child views back-to-front along the Z-axis."
      },
      {
        question: "4. What happens when you write `Text(\"Hello\").background(.red).padding(20)`?",
        options: [
          "The red background covers the text and the 20pt padding",
          "The red background covers only the tight text bounds, and 20pt of transparent space surrounds it",
          "It is a compiler error",
          "It crashes on iOS 17"
        ],
        correctIndex: 1,
        explanation: "Modifiers wrap from top to bottom. Because `.background(.red)` was called before `.padding(20)`, only the inner text is red."
      },
      {
        question: "5. How do you make a SwiftUI view expand to take the full available width of the screen?",
        options: [
          "`.width(100%)`",
          "`.frame(maxWidth: .infinity)`",
          "`.fillParentWidth()`",
          "`.expandWidth()`"
        ],
        correctIndex: 1,
        explanation: "`.frame(maxWidth: .infinity)` tells the frame wrapper to accept the parent's full proposed width."
      },
      {
        question: "6. Why are SwiftUI Views declared as `struct` rather than `class`?",
        options: [
          "Because classes are not supported in iOS",
          "Views are lightweight, ephemeral data descriptions; structs avoid heap allocation and enable super-fast diffing across renders",
          "Structs can hold reference cycles, which SwiftUI requires",
          "Classes cannot conform to `View`"
        ],
        correctIndex: 1,
        explanation: "SwiftUI views are immutable blueprints, not retained UI components. Structs allocate on the stack and diff with virtually zero memory overhead."
      },
      {
        question: "7. What is `@ViewBuilder` in SwiftUI?",
        options: [
          "A tool for converting XML layouts to Swift code",
          "A result builder parameter attribute that allows combining multiple child views into a tuple without commas or return statements",
          "A UIKit subclass for rendering storyboards",
          "A third-party library for building responsive web pages"
        ],
        correctIndex: 1,
        explanation: "`@ViewBuilder` powers the trailing closures of `VStack`, `HStack`, etc., allowing clean DSL syntax similar to Jetpack Compose `@Composable` blocks."
      },
      {
        question: "8. How does `Spacer()` distribute space inside an `HStack` or `VStack`?",
        options: [
          "It reserves exactly 10pt of fixed whitespace",
          "It expands greedily along the stack's primary axis to consume all remaining unallocated space",
          "It forces child views to wrap onto the next line",
          "It pushes the stack to the background thread"
        ],
        correctIndex: 1,
        explanation: "`Spacer()` is flexible and greedily claims available space, pushing siblings apart along the stack's orientation axis."
      },
      {
        question: "9. What is the three-step layout negotiation rule in SwiftUI?",
        options: [
          "1. Child measures itself, 2. Parent accepts or denies, 3. View renders",
          "1. Parent proposes a size, 2. Child chooses its own size, 3. Parent places child in its coordinate system",
          "1. Screen dimensions dictate size, 2. Subviews stretch to fit, 3. Redraw happens",
          "1. AutoLayout constraints solve, 2. Frame calculates, 3. View displays"
        ],
        correctIndex: 1,
        explanation: "The SwiftUI layout cycle is always: Parent proposes -> Child decides its own size -> Parent positions the child."
      },
      {
        question: "10. What does the `#Preview` macro do in Xcode?",
        options: [
          "Generates an IPA file for TestFlight",
          "Provides a live, interactive canvas preview in Xcode without launching the full device simulator",
          "Compiles unit tests in background",
          "Minifies code for production deployment"
        ],
        correctIndex: 1,
        explanation: "`#Preview` (introduced in Swift 5.9 / Xcode 15) replaces the old `PreviewProvider` with a fast, macro-based live canvas preview."
      }
    ],
    codeChallenge: {
      instructions: "Complete the Week 3 Card: (1) Use an `HStack`, (2) Place a `Spacer()` between the two `Text` views, and (3) Apply `.padding(16)` before `.background(.blue)`.",
      starterCode: `struct StatusCard: View {
    var body: some View {
        // TODO: HStack with Text("Online"), Spacer(), Text("Active")
        // and .padding(16).background(.blue)
        Text("Online")
    }
}`,
      solutionCode: `struct StatusCard: View {
    var body: some View {
        HStack {
            Text("Online")
            Spacer()
            Text("Active")
        }
        .padding(16)
        .background(.blue)
    }
}`,
      simulatedOutput: `✓ StatusCard layout: [Text("Online")] <--- Spacer() ---> [Text("Active")]
✓ .padding(16) before .background(.blue) verified!`,
      requiredTokens: ["HStack", "Spacer()", ".padding(16)", ".background(.blue)"]
    },
    linkedinPost: `Week 3 of Android -> iOS Before New Year: Jetpack Compose to SwiftUI! 🎨📱

If you already know Jetpack Compose, learning SwiftUI feels like discovering an alternate reality version of your daily workflow:

1️⃣ @Composable fun -> View struct
In Compose, UI is functions. In SwiftUI, views are ultra-lightweight structs conforming to the View protocol.

2️⃣ Column, Row, Box -> VStack, HStack, ZStack
The layout containers map almost 1:1.

3️⃣ Modifier Order Matters
Chaining .padding(16).background(.blue) expands the box first then paints it blue; reversing them paints only the tight text bounds blue!

This week I built my first polished SwiftUI profile card screen and previewed it live in Xcode Canvas.

🔗 GitHub: https://github.com/sudhakar-r08/ios-for-android-devs
🌐 Tutorial Site: https://sudhakar-r08.github.io/ios-for-android-devs/

#AndroidDev #iOSDev #JetpackCompose #SwiftUI #MobileDevelopment`,
    linkedinArticle: `# Week 3: An Android Developer's Guide to SwiftUI Layouts

Coming from Jetpack Compose, building UI with SwiftUI is intuitive and rewarding. Here is how Compose concepts translate directly into SwiftUI...`
  }
];
