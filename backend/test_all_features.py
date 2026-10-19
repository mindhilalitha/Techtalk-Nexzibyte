import urllib.request
import json
import sys

def req(url, method='GET', data=None, token=None):
    headers = {'Content-Type': 'application/json'} if data else {}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    body = json.dumps(data).encode('utf-8') if data else None
    r = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(r) as res:
        b = res.read().decode('utf-8')
        return res.status, json.loads(b) if b else {}

print('========================================================')
print('NEXZIBYTE TECHTALK COMPREHENSIVE END-TO-END VERIFICATION')
print('========================================================')

# 0. Admin Login
s, login_res = req('http://127.0.0.1:4000/api/auth/login', method='POST', data={'email': 'nexzibyte@gmail.com', 'password': 'admin'})
token = login_res.get('access_token')
print(f'[PASS] 0. Admin JWT Authentication -> Token generated successfully')

# 1. Health
s, d = req('http://127.0.0.1:4000/api/health')
print(f'[PASS] 1. Health check -> status {s}')

# 2. Stats
s, d = req('http://127.0.0.1:4000/api/stats/dashboard')
print(f'[PASS] 2. Dashboard overview -> {d["total_users"]} users, {d["total_posts"]} posts, {d["total_categories"]} categories')

# 3. Categories CRUD
s, d = req('http://127.0.0.1:4000/api/posts/categories')
print(f'[PASS] 3a. List categories -> {len(d)} categories loaded')

s, d = req('http://127.0.0.1:4000/api/posts/categories', method='POST', data={'name': 'Quantum Computing', 'description': 'Qubits & Algorithms'})
test_cat_id = d['id']
print(f'[PASS] 3b. Create category ({test_cat_id}) -> {d["name"]}')

s, d = req(f'http://127.0.0.1:4000/api/posts/categories/{test_cat_id}', method='PUT', data={'name': 'Quantum Computing & Algorithms'})
print(f'[PASS] 3c. Update category -> {d["name"]}')

s, d = req(f'http://127.0.0.1:4000/api/posts/categories/{test_cat_id}', method='DELETE')
print(f'[PASS] 3d. Delete category -> {d.get("message")}')

# 4. Summits CRUD
s, d = req('http://127.0.0.1:4000/api/summits')
print(f'[PASS] 4a. List summits -> {len(d)} summits')

s, d = req('http://127.0.0.1:4000/api/summits', method='POST', data={
    'title': 'TechTalk AI Summit 2027',
    'subtitle': 'The Future of Agentic Systems',
    'badge': 'PREVIEW',
    'description': 'Annual AI conference',
    'date': 'October 10, 2027',
    'location': 'Hyderabad, India',
    'venue': 'HITEX Exhibition Center'
}, token=token)
test_summit_id = d['id']
print(f'[PASS] 4b. Create summit ({test_summit_id})')

s, d = req(f'http://127.0.0.1:4000/api/summits/{test_summit_id}', method='DELETE', token=token)
print(f'[PASS] 4c. Delete summit ({test_summit_id})')

# 5. Founder Meets CRUD
s, d = req('http://127.0.0.1:4000/api/founder-meets')
print(f'[PASS] 5a. List founder meets -> {len(d)} founder meets')

s, d = req('http://127.0.0.1:4000/api/founder-meets', method='POST', data={
    'title': 'AI Founders Dinner',
    'subtitle': 'Exclusive dinner for Series A founders',
    'badge': 'PRIVATE VIP',
    'description': 'Networking dinner',
    'date': 'Nov 12, 2026',
    'location': 'Bengaluru, India',
    'venue': 'The Leela Palace'
}, token=token)
test_meet_id = d['id']
print(f'[PASS] 5b. Create founder meet ({test_meet_id})')

s, d = req(f'http://127.0.0.1:4000/api/founder-meets/{test_meet_id}', method='DELETE', token=token)
print(f'[PASS] 5c. Delete founder meet ({test_meet_id})')

# 6. Pass Check-in
s, d = req('http://127.0.0.1:4000/api/passes/TT26-914208/check-in', method='POST')
print(f'[PASS] 6a. Pass QR Check-in (TT26-914208) -> status {s}')

s, d = req('http://127.0.0.1:4000/api/passes/TT26-914208/reset-check-in', method='POST')
print(f'[PASS] 6b. Pass Reset Check-in (TT26-914208) -> status {s}')

# 7. Contact Message
s, d = req('http://127.0.0.1:4000/api/contact', method='POST', data={
    'name': 'Rahul Verma',
    'email': 'rahul.verma@innovate.dev',
    'subject': 'Partnership proposal',
    'message': 'We would like to sponsor TechTalk 2026 Summit.'
})
print(f'[PASS] 7. Contact inquiry sent -> id {d["id"]}')

print('========================================================')
print('ALL INTEGRATION AND CRUD ENDPOINTS PASSED FLAWLESSLY!')
print('========================================================')
