import Foundation

// ============================================================================
// 🛠️ WEEK 1 HANDS-ON CODING EXERCISE
// Run command:
// swift -module-cache-path /tmp/swift-module-cache week-01-kotlin-to-swift/Week1Exercise.swift
// ============================================================================

// ----------------------------------------------------------------------------
// CHALLENGE 1: Struct Mutability (`mutating func` & `let` vs `var`)
// Problem: An Android dev tried to write a `ShoppingCart` struct with an
// `addItem` method, and then tried to add "AirPods" to `myCart`.
// Fix the 2 compiler errors below so `myCart` prints `["MacBook", "AirPods"]`!
// ----------------------------------------------------------------------------
struct ShoppingCart {
    var items: [String]

    // TODO 1A: In Swift, a method inside a `struct` cannot modify its own
    // properties unless you add a specific keyword before `func`. Add it!
    func addItem(_ item: String) {
        items.append(item)
    }
}

// TODO 1B: Why can't we call `addItem` on `myCart`? Fix the declaration below!
let myCart = ShoppingCart(items: ["MacBook"])
myCart.addItem("AirPods")
print("Challenge 1 Passed! Cart items: \(myCart.items)")


// ----------------------------------------------------------------------------
// CHALLENGE 2: Fix the ARC Memory Leak (Retain Cycle)
// Problem: `DownloadManager` and `DownloadTask` hold strong references to each
// other, so their `deinit` methods never get called!
// Fix the property inside `DownloadTask` so both print their deinit messages.
// ----------------------------------------------------------------------------
class DownloadManager {
    var activeTask: DownloadTask?
    deinit { print("Challenge 2 Passed! DownloadManager deallocated.") }
}

class DownloadTask {
    // TODO 2: Break the retain cycle on this back-reference!
    var manager: DownloadManager?
    deinit { print("Challenge 2 Passed! DownloadTask deallocated.") }
}

do {
    let manager = DownloadManager()
    let task = DownloadTask()
    manager.activeTask = task
    task.manager = manager
} // Both `manager` and `task` should deallocate right here!


// ----------------------------------------------------------------------------
// CHALLENGE 3: Refactor to `guard let`
// Problem: Rewrite `formatUserBadge` using `guard let` so that if `username`
// is `nil` OR empty (`username.isEmpty`), it returns `"Anonymous"`.
// Otherwise, return `"@\(username) (Level \(level))"`.
// ----------------------------------------------------------------------------
func formatUserBadge(username: String?, level: Int) -> String {
    // TODO 3: Replace this placeholder with a `guard let` statement!
    return "TODO"
}

print("Challenge 3 (nil):   \(formatUserBadge(username: nil, level: 5))")
print("Challenge 3 (valid): \(formatUserBadge(username: "sudhakar", level: 10))")


// ----------------------------------------------------------------------------
// CHALLENGE 4: Exhaustive Switch on an Enum with Associated Values
// Problem: Complete the `switch` statement inside `describePayment` so it
// handles all cases—including distinguishing between `creditCard` payments
// over $1,000 (high value) vs. regular credit card payments!
// ----------------------------------------------------------------------------
enum PaymentMethod {
    case upi(vpa: String)
    case creditCard(last4Digits: String, amount: Double)
    case cashOnDelivery
}

func describePayment(_ method: PaymentMethod) -> String {
    switch method {
    case .upi(let vpa):
        return "Paid via UPI (\(vpa))"
    case .creditCard(let last4, let amount) where amount > 1000:
        return "High-value Card payment ending in \(last4): $\(amount)"
    // TODO 4: Add the missing case(s) so this switch is 100% exhaustive!
    }
}

print("Challenge 4A: \(describePayment(.upi(vpa: "sudhakar@okicici")))")
print("Challenge 4B: \(describePayment(.creditCard(last4Digits: "4242", amount: 2500)))")
print("Challenge 4C: \(describePayment(.creditCard(last4Digits: "4242", amount: 49.99)))")
print("Challenge 4D: \(describePayment(.cashOnDelivery))")
