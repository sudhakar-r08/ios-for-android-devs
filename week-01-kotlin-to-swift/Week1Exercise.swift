import Foundation

// ============================================================================
// 🛠️ WEEK 1 HANDS-ON CODING EXERCISE: SWIFT BASICS FOR ANDROID DEVS
// Run command:
// swift -module-cache-path /tmp/swift-module-cache week-01-kotlin-to-swift/Week1Exercise.swift
// ============================================================================

print("----------------------------------------------------------------------")
print("CHALLENGE 1 (Day 1): let vs. var & String Interpolation")
print("----------------------------------------------------------------------")
// Goal: Fix the 2 lines below so that `platform` cannot be changed (constant),
// `downloads` increments by 1, and the summary prints:
// "Platform: iOS | Version: 18.0 | Next Target: 1001 downloads"
let platform = "iOS"
var downloads = 1000
downloads += 1
let summary = "Platform: \(platform) | Version: 18.0 | Next Target: \(downloads) downloads"
print("Challenge 1 Output: \(summary)")


print("\n----------------------------------------------------------------------")
print("CHALLENGE 2 (Day 2): Argument Labels & 'English Sentence' Call Sites")
print("----------------------------------------------------------------------")
// Goal: Write a function `scheduleNotification` with:
// - external label `for` with internal parameter `title: String`
// - external label `at` with internal parameter `timeString: String`
// - omitted label `_` for `priority: Int`
// It should return: "Reminder: [title] scheduled at [timeString] (Priority: [priority])"

func scheduleNotification(for title: String, at timeString: String, _ priority: Int) -> String {
    return "Reminder: \(title) scheduled at \(timeString) (Priority: \(priority))"
}

// Call site reads like a natural sentence:
let notificationResult = scheduleNotification(for: "Standup Meeting", at: "09:30 AM", 1)
print("Challenge 2 Output: \(notificationResult)")


print("\n----------------------------------------------------------------------")
print("CHALLENGE 3 (Day 3): Optionals & The Golden Path (guard let)")
print("----------------------------------------------------------------------")
// Goal: Write a function `formatUserBadge` using `guard let` so that if `username`
// is nil OR empty, it safely returns "Anonymous Guest".
// Otherwise, returns "@[username] (Level [level])".

func formatUserBadge(username: String?, level: Int) -> String {
    guard let validUsername = username, !validUsername.isEmpty else {
        return "Anonymous Guest"
    }
    return "@\(validUsername) (Level \(level))"
}

print("Challenge 3A (nil):   \(formatUserBadge(username: nil, level: 5))")
print("Challenge 3B (empty): \(formatUserBadge(username: "", level: 5))")
print("Challenge 3C (valid): \(formatUserBadge(username: "sudhakar", level: 10))")


print("\n----------------------------------------------------------------------")
print("CHALLENGE 4 (Day 4): Struct Mutability (mutating func)")
print("----------------------------------------------------------------------")
// Goal: Complete the `ShoppingCart` struct:
// 1. Mark `addItem` with `mutating` so it can append to `items`
// 2. Declare `myCart` with `var` so it can be mutated

struct ShoppingCart {
    var items: [String]

    mutating func addItem(_ item: String) {
        items.append(item)
    }
}

var myCart = ShoppingCart(items: ["MacBook Pro"])
myCart.addItem("AirPods Pro")
print("Challenge 4 Output: Cart items -> \(myCart.items)")


print("\n----------------------------------------------------------------------")
print("CHALLENGE 5 (Day 5): Enums with Associated Values & Switch (with Default)")
print("----------------------------------------------------------------------")
// Goal: Complete `describePayment` using a `switch` statement with an explicit
// `default:` fallback case. Handle:
// - `.upi(vpa)`: "Paid via UPI (vpa)"
// - `.creditCard(last4, amount)`: "Card ending in last4: $amount"
// - `default:`: "Other payment method"

enum PaymentMethod {
    case upi(vpa: String)
    case creditCard(last4Digits: String, amount: Double)
    case applePay
    case cashOnDelivery
}

func describePayment(_ method: PaymentMethod) -> String {
    switch method {
    case .upi(let vpa):
        return "Paid via UPI (\(vpa))"
    case .creditCard(let last4, let amount):
        return "Card ending in \(last4): $\(amount)"
    default:
        return "Other payment method processed"
    }
}

print("Challenge 5A: \(describePayment(.upi(vpa: "sudhakar@okicici")))")
print("Challenge 5B: \(describePayment(.creditCard(last4Digits: "4242", amount: 149.99)))")
print("Challenge 5C: \(describePayment(.applePay))")
print("Challenge 5D: \(describePayment(.cashOnDelivery))")

print("\n🎯 All 5 Hands-on Challenges Executed Successfully!")
