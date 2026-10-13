import os, re, glob

files = [f for f in sorted(glob.glob("*.html")) if f not in ("404.html", "google928a5027613c9aa4.html")]
print(f"\n{'='*60}")
print(f"SEO AUDIT — Total {len(files)} HTML files")
print(f"{'='*60}\n")

issues = {}

for f in files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fh:
        c = fh.read()

    problems = []
    if not re.search(r'<title>[^<]+</title>', c):
        problems.append("no-title")
    if not re.search(r'<meta\s+name="description"', c):
        problems.append("no-desc")
    if not re.search(r'<link\s+rel="canonical"', c):
        problems.append("no-canonical")
    if len(re.findall(r'<h1', c)) == 0:
        problems.append("no-h1")
    if len(re.findall(r'<h1', c)) > 1:
        problems.append("multi-h1")
    if not re.search(r'application/ld\+json', c):
        problems.append("no-jsonld")
    if not re.search(r'og:title', c):
        problems.append("no-og")

    if problems:
        issues[f] = problems

print("📊 PAGES WITH ISSUES:\n")
for f, p in issues.items():
    print(f"  ❌ {f}")
    print(f"     → {', '.join(p)}")

print(f"\n{'='*60}")
print(f"✅ Clean pages: {len(files) - len(issues)}/{len(files)}")
print(f"❌ Pages with issues: {len(issues)}/{len(files)}")
print(f"{'='*60}\n")
