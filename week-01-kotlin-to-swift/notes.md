# Week 1: Swift Basics for Android Developers (Day 1 to Day 5)

> **Goal**: Build a rock-solid, beginner-friendly foundation in Swift by directly mapping Kotlin syntax quirks, argument labels, optionals, value types (`struct`), and pattern matching enums to Android mental models you already know.
>
> *(Note: Deep memory internals like ARC, Retain Cycles, and `[weak self]` are moved to Week 9 so you can focus on building confidence with everyday Swift first!)*

---

## 🗺️ Orientation: Android Studio ➔ Xcode Survival Guide

Before writing code, familiarize yourself with your new IDE environment:

| Concept | Android Studio / IntelliJ | Apple Xcode | Survival Tip |
| :--- | :--- | :--- | :--- |
| **Run / Build** | `Ctrl + R` / `Shift + F10` | `Cmd + R` | Builds and launches active scheme on the selected simulator. |
| **Stop Running** | `Ctrl + F2` | `Cmd + .` | Halts the active running process. |
| **Quick Search Files** | `Shift + Shift` (Search Everywhere) | `Cmd + Shift + O` (Open Quickly) | Jump directly to any Swift file, struct, or protocol by name. |
| **Find in Entire Project** | `Cmd + Shift + F` | `Cmd + Shift + F` | Identical shortcut! Opens global text search navigator. |
| **Auto-Format Code** | `Cmd + Option + L` | `Ctrl + I` | Indents selected lines to standard Apple Swift formatting. |
| **Quick Documentation** | `F1` / `Ctrl + Q` | `Option + Click` | Click any symbol to see its signature, docstring, and availability. |
| **Live UI Preview** | `@Preview` Composable Canvas | `#Preview` Canvas (`Cmd + Option + Return`) | Toggles the real-time interactive canvas canvas next to your code. |
| **Package Dependencies** | `build.gradle.kts` (`dependencies { ... }`) | Swift Package Manager (SPM) | Added via File > Add Package Dependencies... or `Package.swift`. |

---

## 📅 Day 1: Kotlin vs. Swift Syntax Quirks

### 1. `let` vs `val`
- In Kotlin, constants are declared with `val`.
- In Swift, constants are declared with `let`.
- If you declare a variable with `var` and never reassign it, the Swift compiler emits a friendly warning recommending `let`.

```kotlin
// Kotlin
val appName = "AndroidNews"
var count = 1
count += 1
```

```swift
// Swift
let appName = "iOSNews" // 'let' = Kotlin 'val'
var count = 1           // 'var' = Kotlin 'var'
count += 1
```

### 2. String Interpolation: `\(expr)` vs `$var` / `${expr}`
Kotlin uses `"$name"` or `"${user.age + 1}"`. Swift uses `"\(name)"` or `"\(user.age + 1)"`.
Inside `\(...)`, you can place any valid Swift expression!

```kotlin
println("Welcome $username! Total: $${items.size * price}")
```

```swift
print("Welcome \(username)! Total: $\(items.count * price)")
```

### 3. Collection Literals
Kotlin uses factory functions like `listOf("A", "B")` and `mapOf("k" to "v")`.  
Swift uses clean bracket literals:

```swift
let languages = ["Kotlin", "Swift", "Rust"] // Array literal
let deviceMap = ["phone": "iPhone 16", "watch": "Apple Watch"] // Dictionary literal
let firstLang = languages.first ?? "None" // Array elements are safe via .first
```

---

## 📅 Day 2: Functions & "English Sentence" Argument Labels

In Kotlin, parameter names are fixed unless callers choose to write named arguments.  
In Swift, every parameter has **two names**:
1. An **external argument label** (read at the call site).
2. An **internal parameter name** (used inside the function body).

```swift
func transfer(amount: Double, from source: String, to destination: String) {
    print("Moving $\(amount) from \(source) to \(destination)")
}

// Call site reads like a readable English sentence:
transfer(amount: 100.0, from: "Checking", to: "Savings")
```

### Omitting Labels with `_`
If the first parameter is self-explanatory from the function name (e.g. `greet("Sudhakar")`), prefix the parameter with an underscore `_` to omit the label at the call site:

```swift
func greet(_ name: String) -> String {
    return "Hello, \(name)!"
}

// Call site:
print(greet("Sudhakar")) // No label required!
```

---

## 📅 Day 3: Optionals & The "Golden Path" (`guard let`)

Both Kotlin and Swift treat nullability as part of the static type system:
- Kotlin: `null`, Elvis operator `?:`, smart casting `if (user != null)`
- Swift: `nil`, nil-coalescing `??`, `if let`, and `guard let`

| Operation | Kotlin | Swift |
| :--- | :--- | :--- |
| **Nullable Type** | `String?` | `String?` (Enum: `Optional<String>`) |
| **Safe Call** | `user?.profile?.avatar` | `user?.profile?.avatar` |
| **Fallback Value** | `avatar ?: "default.png"` | `avatar ?? "default.png"` |
| **Force Unwrap (Crash)** | `avatar!!` | `avatar!` |
| **Scoped Unwrap** | `if (user != null) { ... }` | `if let user { ... }` |
| **Early Exit Unwrap** | `val u = user ?: return` | `guard let user else { return }` |

### Why `guard let` is Idiomatic Swift (The "Golden Path")
In Kotlin, we often use `?: return` to exit early. In Swift, `guard let` enforces this at the compiler level:

```swift
func processOrder(orderId: String?, cartTotal: Double?) -> String {
    // 1. Validate orderId early
    guard let orderId, !orderId.isEmpty else {
        return "Error: Missing order ID"
    }

    // 2. Validate cartTotal early
    guard let total = cartTotal, total > 0 else {
        return "Error: Empty cart"
    }

    // Both 'orderId' and 'total' are now unwrapped and in scope for the rest of the function!
    return "Processing Order #\(orderId) for $\(total)"
}
```

Notice the huge architectural benefit: your function avoids deep pyramid nesting (`if { if { ... } }`) and stays flat along the "Golden Path".

---

## 📅 Day 4: Struct (Value) vs. Class (Reference) & Deep Immutability

### Kotlin/JVM Mental Model
In Kotlin on the JVM, almost everything (including a `data class`) is a **reference type** allocated on the heap:
- Passing a `data class User(var name: String)` passes a reference pointer.
- `val user = User("A")` only prevents reassigning `user`; if `name` is `var`, `user.name = "B"` still mutates the object!

### Swift Mental Model: Structs are True Value Types
In Swift, `struct` is the default for models, collections, and even SwiftUI views:
- Assigning a `struct` or passing it into a function makes an **independent copy**.
- Mutating the copy **never** affects the original instance.
- **Deep Immutability**: If a struct is declared with `let`, **all its properties are completely frozen**, even if defined as `var` inside the struct!

```swift
struct UserProfile {
    var name: String
    var score: Int

    // Methods that modify properties must be marked 'mutating'
    mutating func addBonus(points: Int) {
        score += points
    }
}

var userA = UserProfile(name: "Sudhakar", score: 100)
var userB = userA // Copies the VALUE!
userB.addBonus(points: 50)

print(userA.score) // 100 (Unchanged!)
print(userB.score) // 150 (Independent copy!)

let lockedUser = UserProfile(name: "Frozen", score: 0)
// lockedUser.name = "New" // ❌ Compile error! 'let' deeply freezes the entire struct.
```

---

## 📅 Day 5: Enums with Associated Values & Pattern Matching

Swift `enum`s are powerful value types that can hold associated values (similar to Kotlin sealed classes or sealed interfaces):

```swift
enum ViewState {
    case idle
    case loading(message: String)
    case success(data: [String])
    case error(code: Int, description: String)
}
```

### Pattern Matching with `switch` (Always Include `default`)
When matching against enums or values, Swift `switch` statements must be exhaustive:

```swift
func renderState(_ state: ViewState) -> String {
    switch state {
    case .idle:
        return "Waiting for user action"
    case .loading(let msg):
        return "Loading: \(msg)..."
    case .success(let items):
        return "Loaded \(items.count) items"
    case .error(let code, let description):
        return "Error \(code): \(description)"
    default:
        // Always provide a default case for fallback handling
        return "Unknown or unexpected state"
    }
}
```

---

## 🧠 What's Next?
In **Week 2**, we explore **Protocol-Oriented Programming (POP)**, Swift `protocol` vs Kotlin `interface`, retroactive extensions, and error handling with `do / try / catch`.

In **Week 9**, we dive deep under the hood into **Automatic Reference Counting (ARC)**, retain cycles, `[weak self]`, Copy-on-Write buffer sharing, and the modern **Swift Testing** framework.
