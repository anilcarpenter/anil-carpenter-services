import re, glob, os

SKIP = {'google928a5027613c9aa4.html', '404.html'}

files = sorted(glob.glob("*.html"))
fixed = []
skipped = []

for f in files:
    if f in SKIP:
        skipped.append(f)
        continue

    with open(f, 'r', encoding='utf-8', errors='ignore') as fh:
        c = fh.read()

    orig = c
    changed = False

    # Title nikalo
    m = re.search(r'<title>([^<]+)</title>', c)
    title = m.group(1).strip() if m else f.replace('.html','').replace('-',' ').title()

    # Description nikalo
    m = re.search(r'<meta\s+name="description"\s+content="([^"]+)"', c)
    if not m:
        m = re.search(r'<meta\s+content="([^"]+)"\s+name="description"', c)
    desc = m.group(1).strip() if m else f"Anil Carpenter - {title}"

    # Canonical URL
    canonical = f"https://www.anilcarpenter.com/{f}"

    # OG tags block
    og_block = f'''  <!-- Open Graph / WhatsApp / Facebook Sharing Preview -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{canonical}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80">
  <meta property="og:site_name" content="Anil Carpenter">
  <meta property="og:locale" content="hi_IN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{desc}">
  <meta name="twitter:image" content="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80">
'''

    # OG missing? Add karo </head> se pehle
    if 'og:title' not in c:
        if '</head>' in c:
            c = c.replace('</head>', og_block + '</head>', 1)
            changed = True

    # Canonical missing? Add karo
    if 'rel="canonical"' not in c:
        canonical_tag = f'  <link rel="canonical" href="{canonical}">\n'
        if '</head>' in c:
            c = c.replace('</head>', canonical_tag + '</head>', 1)
            changed = True

    # JSON-LD missing? Add karo
    if 'application/ld+json' not in c:
        jsonld = f'''  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "{title}",
    "description": "{desc}",
    "url": "{canonical}",
    "isPartOf": {{
      "@type": "WebSite",
      "name": "Anil Carpenter",
      "url": "https://www.anilcarpenter.com/"
    }},
    "publisher": {{
      "@type": "LocalBusiness",
      "name": "Anil Carpenter",
      "telephone": "+918341188318",
      "address": {{
        "@type": "PostalAddress",
        "addressLocality": "Khalilabad",
        "addressRegion": "Sant Kabir Nagar, Uttar Pradesh",
        "addressCountry": "IN"
      }}
    }}
  }}
  </script>
'''
        if '</head>' in c:
            c = c.replace('</head>', jsonld + '</head>', 1)
            changed = True

    if changed and c != orig:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(c)
        fixed.append(f)

print(f"\n{'='*60}")
print(f"✅ FIXED: {len(fixed)} files")
print(f"{'='*60}")
for f in fixed:
    print(f"  ✅ {f}")

print(f"\n⏭️  SKIPPED: {len(skipped)} files")
for f in skipped:
    print(f"  ⏭️  {f}")
print(f"\n{'='*60}\n")
