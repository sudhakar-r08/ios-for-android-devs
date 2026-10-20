# 📱 Android to iOS Before New Year (10-Week Engineering Journey)

**Author:** [Sudhakar Raju (@sudhakar-r08)](https://github.com/sudhakar-r08)  
**Repository:** [github.com/sudhakar-r08/ios-for-android-devs](https://github.com/sudhakar-r08/ios-for-android-devs)  
**Interactive Tutorial Website:** `https://sudhakar-r08.github.io/ios-for-android-devs/` (Located in [`/docs`](./docs/index.html) — Ready for **GitHub Pages** & **Firebase Hosting**)

Welcome! This repository documents a structured, deep-dive transition from **Android Development (Kotlin / Jetpack Compose)** to **Modern iOS Development (Swift 6 / SwiftUI)** between **October 20 and December 31**.

Each week pairs **hands-on engineering notes & code** with a **thorough educational LinkedIn article** written to help fellow Android and mobile engineers understand iOS through mental models they already know.

---

## 🗺️ The Android ↔ iOS Rosetta Stone

| Concept | Android (Modern) | iOS (Modern) | Key Mental Shift |
| :--- | :--- | :--- | :--- |
| **Language** | Kotlin | Swift | Swift defaults to **value types (`struct`)** & uses **ARC** (deterministic reference counting) instead of a GC. |
| **UI Framework** | Jetpack Compose | SwiftUI | Compose functions (`@Composable`) ↔ `View` structs (`var body: some View`). |
| **State Management** | `remember`, `mutableStateOf`, `StateFlow` | `@State`, `@Binding`, `@Observable` | SwiftUI uses property wrappers and the `@Observable` macro for fine-grained view invalidation. |
| **Concurrency** | Coroutines (`suspend`, `Dispatcher`) | Swift Concurrency (`async`/`await`, `Actor`) | Swift enforces compile-time data-race safety via `Sendable` and `Actor` isolation. |
| **Reactive Streams** | Kotlin `Flow` / `SharedFlow` | `AsyncSequence` / `Combine` | Prefer `AsyncStream` / `@Observable` in new Swift code; know `Combine` for existing codebases. |
| **Navigation** | Navigation Compose (`NavHost`) | `NavigationStack`, `NavigationPath` | Type-safe value-based routing using `.navigationDestination(for:)`. |
| **Dependency Injection** | Hilt / Koin | `@Environment`, Initializer DI, `swift-dependencies` | iOS leans heavily on pure constructor injection and SwiftUI's `Environment` rather than bytecode weaving. |
| **Local Persistence** | Room / DataStore | SwiftData (or Core Data) / `UserDefaults` & Keychain | `@Model` in SwiftData feels like Room `@Entity` + LiveData combined. Sensitive data goes in **Keychain**. |
| **Networking** | Retrofit + OkHttp + Kotlinx Serialization | `URLSession` + `Codable` | `URLSession` with `async/await` and compiler-synthesized `Codable` eliminates most third-party REST libraries. |
| **Build & Packages** | Gradle (`build.gradle.kts`) | Xcode Projects / Swift Package Manager (`Package.swift`) | SPM is built directly into Swift and Xcode—no separate build daemon required. |

---

## 📅 10-Week Curriculum & Publishing Tracker (Oct 20 – Dec 31)

| Week | Dates | Theme | Android Anchor | Deliverables |
| :--- | :--- | :--- | :--- | :--- |
| **Week 1** | Oct 20 – Oct 26 | **Swift Fundamentals & Memory Model** | Kotlin vs. Swift, JVM GC vs. ARC | [Notes](./week-01-kotlin-to-swift/notes.md) · [Code](./week-01-kotlin-to-swift/KotlinVsSwift.swift) · [LinkedIn Article](./week-01-kotlin-to-swift/linkedin-article.md) |
| **Week 2** | Oct 27 – Nov 02 | **Protocols, Generics & Error Handling** | Interfaces, Sealed Classes, Exceptions | `protocol`, Associated Types, Enums with Associated Values, Typed `throws` |
| **Week 3** | Nov 03 – Nov 09 | **SwiftUI Foundations & Layout System** | Jetpack Compose Layouts & Modifiers | `VStack`/`HStack`/`ZStack`, Layout 3-step negotiation, Modifier order sensitivity |
| **Week 4** | Nov 10 – Nov 16 | **State Management & Observation** | `remember`, `ViewModel`, `collectAsState` | `@State`, `@Binding`, `@Observable`, `@Environment`, View identity & lifecycle |
| **Week 5** | Nov 17 – Nov 23 | **Swift Concurrency & Actors** | Kotlin Coroutines, Dispatchers, Mutex | `async`/`await`, Structured Concurrency (`TaskGroup`), `Actor`, `@MainActor`, `Sendable` |
| **Week 6** | Nov 24 – Nov 30 | **Navigation, Lists & App Lifecycle** | `LazyColumn`, `NavHost`, `Activity`/`Application` | `List`, `LazyVStack`, `NavigationStack`, `ScenePhase`, Deep Links |
| **Week 7** | Dec 01 – Dec 07 | **Networking, Serialization & DI** | Retrofit, Moshi/Kotlinx, Hilt | `URLSession`, `Codable`, Custom `CodingKeys`, Protocol-oriented DI |
| **Week 8** | Dec 08 – Dec 14 | **Persistence & Security** | Room, DataStore, EncryptedSharedPreferences | `SwiftData` (`@Model`, `@Query`), `UserDefaults`, Keychain Services |
| **Week 9** | Dec 15 – Dec 21 | **Testing, Interop & Performance** | JUnit/MockK, AndroidView, Layout Inspector | **Swift Testing** (`@Test`, `#expect`), UIKit Interop (`UIViewRepresentable`), Instruments |
| **Week 10** | Dec 22 – Dec 31 | **Capstone App & App Store Readiness** | Play Console, Gradle Signing, Baseline Profiles | Full Production App, Code Signing/Provisioning, TestFlight & Year-End Retrospective |

---

## ✍️ Weekly Workflow for Learning & Publishing

Every week follows a repeatable 4-step loop:
1. **Concept Mapping**: Compare the iOS mechanism directly against how Android solves the same problem under the hood.
2. **Code Lab**: Write runnable Swift / SwiftUI code in that week's directory and verify edge cases.
3. **Deep-Dive Notes (`notes.md`)**: Document architectural trade-offs, interview-level details, and common traps for Android developers.
4. **Educational LinkedIn Article (`linkedin-article.md`)**: Distill the week's insights into a clear, technically rigorous article with side-by-side code snippets and diagrams.

---

## 🌐 Hosting the Interactive Tutorial Website

The [`/docs`](./docs) directory contains a complete, interactive 10-Week **Android-to-iOS Engineering Academy** web application (with side-by-side Kotlin vs. Swift code comparisons, a live **ARC Retain Cycle Simulator**, interactive coding challenges, quizzes, and LinkedIn article kits).

### Option A: Host on GitHub Pages (Free & Automatic)
1. Go to **[Repository Settings → Pages](https://github.com/sudhakar-r08/ios-for-android-devs/settings/pages)**.
2. Under **Build and deployment → Source**, choose either:
   - **GitHub Actions** *(uses the included [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml))*, **OR**
   - **Deploy from a branch** → Select branch `main` and folder `/docs` → Click **Save**.
3. Your live website will be published at:  
   **`https://sudhakar-r08.github.io/ios-for-android-devs/`**

### Option B: Host on Firebase Hosting
This repository includes a pre-configured [`firebase.json`](./firebase.json) pointing `"public": "docs"`.
```bash
# 1. Preview locally with Firebase Emulator
npx -y firebase-tools@latest emulators:start --only hosting

# 2. Deploy to Firebase Hosting
npx -y firebase-tools@latest login
npx -y firebase-tools@latest use --add
npx -y firebase-tools@latest deploy --only hosting
```
