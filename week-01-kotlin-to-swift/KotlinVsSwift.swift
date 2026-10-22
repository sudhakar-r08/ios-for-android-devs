import Foundation

// ============================================================================
// WEEK 1 LAB: Swift Basics for Android Developers (Day 1 to Day 5)
// Run via terminal:
// swift -module-cache-path /tmp/swift-module-cache week-01-kotlin-to-swift/KotlinVsSwift.swift
// ============================================================================

print("==================================================================")
print("DAY 1: KOTLIN VS. SWIFT SYNTAX QUIRKS")
print("==================================================================")

// 1. `let` (Kotlin `val`) vs `var` (Kotlin `var`)
let appName = "Android2iOS" // Constant
var launchCount = 1         // Mutable variable
launchCount += 1

// 2. String Interpolation: \(...) instead of $var or ${expr}
let author = "Sudhakar"
let nextLaunch = launchCount + 1
print("App: \(appName) | Author: \(author) | Next Launch: #\(nextLaunch)")

// 3. Array & Dictionary Literals
let androidTopics = ["Kotlin", "Coroutines", "Compose"]
let iosTopics = ["Swift 6", "Async/Await", "SwiftUI"]
let platformMap = [
    "Android": "Google Pixel",
    "iOS": "iPhone 16 Pro"
]
print("Android: \(androidTopics[0]) -> iOS: \(iosTopics[0])")
print("Primary Device: \(platformMap["iOS"] ?? "Unknown")")


print("\n==================================================================")
print("DAY 2: ARGUMENT LABELS & 'ENGLISH SENTENCE' FUNCTIONS")
print("==================================================================")

// In Swift, every parameter has an external label (at call site)
// and an internal name (in the function body).
func transferFunds(amount: Double, from source: String, to destination: String) {
    print("Transferred $\(amount) from '\(source)' account to '\(destination)' account.")
}

// At the call site, it reads like a readable English sentence:
transferFunds(amount: 250.0, from: "Checking", to: "Savings")

// Prefix with `_` to omit the label at the call site when obvious:
func greet(_ name: String) -> String {
    return "Welcome to iOS development, \(name)!"
}
print(greet("Sudhakar"))


print("\n==================================================================")
print("DAY 3: OPTIONALS & THE 'GOLDEN PATH' (guard let)")
print("==================================================================")

// In Swift, nil represents the absence of a value (equivalent to null in Kotlin).
// Nil-coalescing operator `??` is equivalent to Kotlin's Elvis operator `?:`
let remoteProfilePic: String? = nil
let defaultAvatar = "default_avatar.png"
let resolvedAvatar = remoteProfilePic ?? defaultAvatar
print("Resolved Avatar: \(resolvedAvatar)")

// The 'Golden Path' pattern using `guard let`:
// In Kotlin: val rawUrl = url ?: return "Invalid"
// In Swift: guard let enforces early exit and keeps `rawUrl` in outer scope!
func parseDeepLink(url: String?) -> String {
    guard let rawUrl = url, !rawUrl.isEmpty else {
        return "⚠️ Invalid link (Handled via guard let early return)"
    }
    // `rawUrl` is unwrapped and accessible throughout the rest of the function!
    return "✅ Valid link routed to: \(rawUrl)"
}

print(parseDeepLink(url: nil))
print(parseDeepLink(url: "https://github.com/sudhakar-r08/ios-for-android-devs"))


print("\n==================================================================")
print("DAY 4: STRUCT (VALUE) VS CLASS (REFERENCE) & DEEP IMMUTABILITY")
print("==================================================================")

// Swift struct is a VALUE type. Assigning it makes an independent copy.
struct TaskItem {
    var title: String
    var isDone: Bool

    // Struct mutating methods must be marked with `mutating`
    mutating func toggle() {
        isDone.toggle()
    }
}

var task1 = TaskItem(title: "Complete Week 1 Lab", isDone: false)
var task2 = task1 // Copies the VALUE!
task2.toggle()

print("Original task1 isDone: \(task1.isDone) (Unchanged!)")
print("Copied   task2 isDone: \(task2.isDone) (Toggled!)")

// Notice: `let` on a struct deeply freezes all properties!
let frozenTask = TaskItem(title: "Read Notes", isDone: true)
// frozenTask.isDone = false // ❌ Compile error: Cannot mutate property of `let` struct!
print("Frozen Task: \(frozenTask.title) [let struct guarantees deep immutability]")


print("\n==================================================================")
print("DAY 5: ENUMS WITH ASSOCIATED VALUES & SWITCH (WITH DEFAULT CASE)")
print("==================================================================")

// Swift enums can hold associated values (similar to Kotlin sealed classes).
enum NavigationRoute {
    case home
    case profile(userId: String)
    case settings(theme: String)
    case custom(path: String)
}

func handleRoute(_ route: NavigationRoute) -> String {
    switch route {
    case .home:
        return "Navigating to Home Dashboard"
    case .profile(let id):
        return "Opening User Profile for ID: \(id)"
    case .settings(let theme):
        return "Applying Settings with Theme: \(theme)"
    default:
        // Always include a default case for fallback handling as requested
        return "Handling fallback or unexpected route"
    }
}

print(handleRoute(.home))
print(handleRoute(.profile(userId: "android_dev_42")))
print(handleRoute(.settings(theme: "Aurora Vibrant")))
print(handleRoute(.custom(path: "/experimental/feature")))
print("\n🎉 Week 1 All 5 Days Verified Successfully!")
