import Foundation

// ============================================================================
// WEEK 1 LAB: Kotlin -> Swift Mental Model Verification
// Run via terminal: swift week-01-kotlin-to-swift/KotlinVsSwift.swift
// ============================================================================

print("=== 1. VALUE TYPES (struct) VS REFERENCE TYPES (class) ===")

// In Kotlin, `data class Ticket(var seat: String)` is a heap reference type.
// In Swift, `struct` is a true VALUE type.
struct StructTicket {
    var seat: String
}

class ClassTicket {
    var seat: String
    init(seat: String) { self.seat = seat }
}

var structA = StructTicket(seat: "12A")
var structB = structA // Copies the VALUE!
structB.seat = "99Z"

print("Struct A seat (unchanged): \(structA.seat) | Struct B seat: \(structB.seat)")

let classA = ClassTicket(seat: "12A")
let classB = classA // Copies the POINTER (just like Kotlin `val classB = classA`)
classB.seat = "99Z"

print("Class A seat (mutated!):   \(classA.seat) | Class B seat:  \(classB.seat)")

// Notice also:
// `let` on a struct locks ALL its properties, even `var` ones:
let immutableStruct = StructTicket(seat: "1A")
// immutableStruct.seat = "2B" // ❌ Compile-time error in Swift!


print("\n=== 2. AUTOMATIC REFERENCE COUNTING (ARC) & RETAIN CYCLES ===")

class ViewModel {
    let name: String
    var onStateChanged: (() -> Void)?

    init(name: String) {
        self.name = name
        print("  [ARC] \(name) initialized")
    }

    func bindSafeListener() {
        // Using `[weak self]` prevents a retain cycle between ViewModel and the closure
        onStateChanged = { [weak self] in
            guard let self else { return }
            print("  [Callback] State updated in \(self.name)")
        }
    }

    deinit {
        print("  [ARC] \(name) deallocated immediately when ref count hit 0!")
    }
}

do {
    let vm = ViewModel(name: "ProfileViewModel")
    vm.bindSafeListener()
    vm.onStateChanged?()
} // `vm` goes out of scope here -> deinit runs deterministically right now!


print("\n=== 3. OPTIONALS, GUARD LET & NIL-COALESCING ===")

func parseDeepLink(url: String?) -> String {
    // Kotlin equivalent: val rawUrl = url ?: return "Invalid link"
    guard let rawUrl = url, !rawUrl.isEmpty else {
        return "Invalid link (early exit via guard)"
    }
    return "Routing to: \(rawUrl)"
}

print(parseDeepLink(url: nil))
print(parseDeepLink(url: "myapp://profile/42"))


print("\n=== 4. ENUMS WITH ASSOCIATED VALUES (KOTLIN SEALED INTERFACE EQUIVALENT) ===")

enum NetworkResult<T> {
    case loading(attempt: Int)
    case success(data: T)
    case error(code: Int, message: String)
}

func render(state: NetworkResult<[String]>) {
    switch state {
    case .loading(let attempt):
        print("  Loading... (attempt #\(attempt))")
    case .success(let items) where items.isEmpty:
        print("  Empty state UI")
    case .success(let items):
        print("  Loaded \(items.count) items: \(items.joined(separator: ", "))")
    case .error(let code, let message):
        print("  Error \(code): \(message)")
    }
}

render(state: .loading(attempt: 1))
render(state: .success(data: ["SwiftUI", "Combine", "SwiftData"]))
render(state: .error(code: 503, message: "Service Unavailable"))
