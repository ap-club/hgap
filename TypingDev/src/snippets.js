export default {
  javascript: [
`function debounce(fn, delay) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}`,
`const clone = obj => JSON.parse(JSON.stringify(obj));`,
`const sleep = ms => new Promise(r => setTimeout(r, ms));`,
`const fact = n => (n <= 1 ? 1 : n * fact(n - 1));`,
`const qs = a =>
    a.length < 2
        ? a
        : [...qs(a.slice(1).filter(x => x <= a[0])), a[0], ...qs(a.slice(1).filter(x => x > a[0]))];`,
`class Stack {
    #s = [];
    push(x) { this.#s.push(x); }
    pop() { return this.#s.pop(); }
    toString() { return '[' + this.#s.join(', ') + ']'; }
}`,
`class Bus {
    #m = new Map();
    on(e, f) { (this.#m.get(e) || this.#m.set(e, []).get(e)).push(f); }
    emit(e, ...a) { (this.#m.get(e) || []).forEach(f => f(...a)); }
}`,
`const curry = (f, ...a) =>
    a.length >= f.length ? f(...a) : (...b) => curry(f, ...a, ...b);`,
`window.addEventListener('resize', debounce(() => console.log('resize'), 200));`,
`const sum = n => (n * (n + 1)) / 2;`,
`const fib = (n, m = { 0: 0, 1: 1 }) => (m[n] ??= fib(n - 1, m) + fib(n - 2, m));`,
`function promisify(fn) {
    return (...a) =>
        new Promise((res, rej) => fn(...a, (e, d) => (e ? rej(e) : res(d))));
}`,
`const Settings = (() => { let inst; return () => (inst ??= { theme: 'dark' }); })();`,
`const flat = a =>
    a.reduce((r, x) => r.concat(Array.isArray(x) ? flat(x) : x), []);`,
`const rgb = (r, g, b) =>
    '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');`,
`function bs(a, t, l = 0, h = a.length - 1) {
    while (l <= h) {
        const m = (l + h) >> 1;
        if (a[m] === t) return m;
        a[m] < t ? (l = m + 1) : (h = m - 1);
    }
    return -1;
}`,
`const uid = (() => { let i = 0; return () => ++i; })();`,
`const diff = (o1, o2) =>
    Object.keys({ ...o1, ...o2 }).filter(k => o1[k] !== o2[k]);`,
`const chunk = (a, n) =>
    a.reduce((r, x, i) => ((i % n ? r[r.length - 1].push(x) : r.push([x])) && r), []);`,
`const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);`,
  ],

  python: [
`from functools import lru_cache
@lru_cache(None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)`,
`squares = [x ** 2 for x in range(10)]`,
`from contextlib import contextmanager
@contextmanager
def open_read(path):
    f = open(path)
    try:
        yield f
    finally:
        f.close()`,
`from collections import Counter
cnt = Counter('banana')
print(cnt.most_common(2))`,
`def qs(a):
    if len(a) < 2:
        return a
    pivot = a[0]
    left = [x for x in a[1:] if x <= pivot]
    right = [x for x in a[1:] if x > pivot]
    return qs(left) + [pivot] + qs(right)`,
`def frange(start, stop, step):
    while start < stop:
        yield start
        start += step`,
`from dataclasses import dataclass
@dataclass
class Point:
    x: int
    y: int`,
`with open('data.txt') as f:
    lines = f.readlines()`,
`from functools import reduce
prod = reduce(lambda a, b: a * b, range(1, 6))`,
`odds = {x for x in range(20) if x % 2}`,
`lengths = list(map(len, ['alpha', 'beta', 'gamma']))`,
`def log(fn):
    def wrapper(*a, **kw):
        print('calling', fn.__name__)
        return fn(*a, **kw)
    return wrapper`,
`def bs(a, t):
    l, r = 0, len(a) - 1
    while l <= r:
        m = (l + r) // 2
        if a[m] == t:
            return m
        if a[m] < t:
            l = m + 1
        else:
            r = m - 1
    return -1`,
`for i, v in enumerate(['a', 'b', 'c']):
    print(i, v)`,
`pairs = list(zip('abc', [1, 2, 3]))`,
`def sum_n(n):
    return n * (n + 1) // 2`,
`from collections import defaultdict
dd = defaultdict(int)
for ch in 'mississippi':
    dd[ch] += 1`,
`import json, sys
json.dump({'x': 1}, sys.stdout)`,
`sub = 'hello'[1:4]`,
`from itertools import cycle, islice
print(list(islice(cycle('abc'), 7)))`,
  ],

  cpp: [
`#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s = 0, x;
    cin >> n;
    while (n-- && cin >> x) s += x;
    cout << s;
}`,
`auto qp = [](long long a, long long b) {
    long long r = 1;
    while (b) {
        if (b & 1) r *= a;
        a *= a; b >>= 1;
    }
    return r;
};`,
`template<typename T>
struct Node {
    T v;
    Node* l;
    Node* r;
    Node(T v): v(v), l(nullptr), r(nullptr) {}
};`,
`ios::sync_with_stdio(false);
cin.tie(nullptr);`,
`int gcd(int a, int b) { return b ? gcd(b, a % b) : a; }`,
`vector<int> a{4, 2, 1};
sort(a.begin(), a.end());`,
`priority_queue<int> pq;`,
`std::unique_ptr<int> p(new int(5));`,
`map<string, int> mp;
mp["a"]++;`,
`for (auto& x : a) cout << x;`,
`bitset<32> bs(10);`,
`auto t0 = chrono::high_resolution_clock::now();`,
`pair<int, string> pr{1, "one"};`,
`struct Point { double x, y; };`,
`constexpr int sq(int x) { return x * x; }`,
`enum class Color { Red, Green, Blue };`,
`set<int> s{1, 2, 3};`,
`stringstream ss("1 2");
int a1, b1; ss >> a1 >> b1;`,
`std::optional<int> opt;`,
`list<int> l1{1, 2}, l2{3};
l1.splice(l1.end(), l2);`,
  ],

  java: [
`class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }
}`,
`record Pair<K, V>(K key, V value) {};`,
`java.util.List<Integer> nums = java.util.List.of(1, 2, 3);
nums.stream().map(x -> x * 2).forEach(System.out::println);`,
`static <T> void print(T t) { System.out.println(t); }`,
`list.sort((a, b) -> a.len - b.len);`,
`synchronized void inc() { count++; }`,
`java.util.Optional<String> maybe = java.util.Optional.of("hi");`,
`try (var br = new java.io.BufferedReader(new java.io.FileReader("a.txt"))) {
    System.out.println(br.readLine());
}`,
`enum Day { MON, TUE, WED }`,
`interface Fly { default void flap() {} }`,
`map.merge("k", 1, Integer::sum);`,
`new Thread(() -> System.out.println("hi")).start();`,
`System.arraycopy(src, 0, dst, 0, len);`,
`boolean ok = "abc".matches("[a-z]+");`,
`StringBuilder sb = new StringBuilder().append(1).append(2);`,
`class Single {
    private static final Single I = new Single();
    private Single() {}
    static Single get() { return I; }
}`,
`var sum = 0;`,
`int len = switch (str) { case "a" -> 1; default -> 0; };`,
`if (obj instanceof Point(int px, int py)) { System.out.println(px); }`,
`String id = java.util.UUID.randomUUID().toString();`,
  ]
};
