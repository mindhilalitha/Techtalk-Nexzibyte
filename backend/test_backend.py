import sys
import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_tests():
    print("\n" + "="*60)
    print("RUNNING NEXZIBYTE TECHTALK BACKEND ENDPOINT TESTS")
    print("="*60)

    # 1. Health check
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("  [PASS] 1. Health Check API -> 200 OK")

    # 2. Dynamic Registration & OTP flow
    test_email = f"developer_{uuid.uuid4().hex[:6]}@example.com"
    reg_res = client.post("/api/auth/register", json={
        "email": test_email,
        "password": "SecurePassword123!",
        "name": "NexziByte Member",
        "role": "user"
    })
    assert reg_res.status_code == 200, f"Registration failed: {reg_res.text}"
    reg_data = reg_res.json()
    otp = reg_data.get("otp_demo") or "123456"
    print(f"  [PASS] 2a. Dynamic User Registration -> 200 OK (Email: {test_email})")
    
    # Verify Email OTP
    ver_res = client.post("/api/auth/verify-email", json={"email": test_email, "code": otp})
    assert ver_res.status_code == 200, f"Email verification failed: {ver_res.text}"
    user_token = ver_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {user_token}"}
    print("  [PASS] 2b. Email OTP Verification -> 200 OK")

    # 3. User Login
    login_res = client.post("/api/auth/login", json={"email": test_email, "password": "SecurePassword123!"})
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    print("  [PASS] 3. Dynamic User Login -> 200 OK")

    # 4. Auth Me
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 200, f"Auth Me failed: {res.text}"
    assert res.json()["email"] == test_email
    print("  [PASS] 4. Auth Profile (/api/auth/me) -> 200 OK")

    # 5. Dashboard Metrics
    res = client.get("/api/stats/dashboard")
    assert res.status_code == 200, f"Stats dashboard failed: {res.text}"
    metrics = res.json()
    assert "total_users" in metrics and "total_posts" in metrics and "upcoming_summits" in metrics
    print(f"  [PASS] 5. Dashboard Metrics (Users: {metrics['total_users']}, Posts: {metrics['total_posts']}, Summits: {metrics['upcoming_summits']}) -> 200 OK")

    # 6. Posts CRUD
    res = client.get("/api/posts")
    assert res.status_code == 200, f"List posts failed: {res.text}"
    posts = res.json()
    assert len(posts) > 0
    print(f"  [PASS] 6a. List Technical Posts (Count: {len(posts)}) -> 200 OK")

    # Create new Post
    new_post_res = client.post("/api/posts", json={
        "title": "Production-Grade Distributed Sharding with Citus",
        "category": "System Architecture",
        "excerpt": "Scale relational tables horizontally with multi-node Citus clusters.",
        "content": "Horizontal database scaling for high volume relational tables...",
        "tags": ["PostgreSQL", "Database", "Sharding", "Citus"]
    }, headers=headers)
    assert new_post_res.status_code == 200, f"Create post failed: {new_post_res.text}"
    created_post_id = new_post_res.json()["id"]
    print(f"  [PASS] 6b. Create Technical Dispatch ({created_post_id}) -> 200 OK")

    # Like post
    like_res = client.post(f"/api/posts/{created_post_id}/like", headers=headers)
    assert like_res.status_code == 200
    print(f"  [PASS] 6c. Like Post -> 200 OK")

    # 7. Summits
    res = client.get("/api/summits")
    assert res.status_code == 200
    summits = res.json()
    assert len(summits) > 0
    print(f"  [PASS] 7. Summits List (Count: {len(summits)}) -> 200 OK")

    # 8. Founder Meets
    res = client.get("/api/founder-meets")
    assert res.status_code == 200
    meets = res.json()
    assert len(meets) > 0
    print(f"  [PASS] 8. Founder Meets List (Count: {len(meets)}) -> 200 OK")

    # 9. Speakers
    res = client.get("/api/speakers")
    assert res.status_code == 200
    speakers = res.json()
    assert len(speakers) > 0
    print(f"  [PASS] 9. Speakers & Founders List (Count: {len(speakers)}) -> 200 OK")

    # 10. Pass Registration & QR check-in
    pass_res = client.post("/api/passes/register", json={
        "attendee_name": "Vikram Patel",
        "email": "vikram.patel@example.com",
        "pass_type": "FOUNDER PASS",
        "amount": "INR 499",
        "organization": "QuantumScale Tech",
        "role": "CTO"
    }, headers=headers)
    assert pass_res.status_code == 200
    pass_data = pass_res.json()
    pass_id = pass_data["pass_id"]
    print(f"  [PASS] 10a. Register Pass ({pass_id} - {pass_data['pass_type']}) -> 200 OK")

    # Check-in Pass
    checkin_res = client.post(f"/api/passes/{pass_id}/check-in")
    assert checkin_res.status_code == 200
    print(f"  [PASS] 10b. Contactless QR Check-in ({pass_id}) -> 200 OK")

    # 11. Forgot Password & Reset Password Workflow
    forgot_res = client.post("/api/auth/forgot-password", json={"email": test_email})
    assert forgot_res.status_code == 200, f"Forgot password failed: {forgot_res.text}"
    forgot_data = forgot_res.json()
    assert forgot_data["success"] is True
    reset_token = forgot_data.get("token_demo")
    reset_otp = forgot_data.get("otp_demo")
    print(f"  [PASS] 11a. Forgot Password Request -> 200 OK (OTP: {reset_otp}, Token: {reset_token[:12]}...)")

    # Verify reset token
    verify_tok_res = client.get(f"/api/auth/verify-reset-token?token={reset_token}")
    assert verify_tok_res.status_code == 200, f"Verify reset token failed: {verify_tok_res.text}"
    assert verify_tok_res.json()["valid"] is True
    print("  [PASS] 11b. Verify Reset Token -> 200 OK")

    # Reset Password with new password
    reset_res = client.post("/api/auth/reset-password", json={
        "token": reset_token,
        "new_password": "NewBrandNewPassword2026!"
    })
    assert reset_res.status_code == 200, f"Reset password failed: {reset_res.text}"
    print("  [PASS] 11c. Reset Password with New Password -> 200 OK")

    # Test login with new password
    new_login_res = client.post("/api/auth/login", json={"email": test_email, "password": "NewBrandNewPassword2026!"})
    assert new_login_res.status_code == 200, f"Login with new password failed: {new_login_res.text}"
    print("  [PASS] 11d. Login with Newly Reset Password -> 200 OK")

    # 12. Delete Account / Clean up
    del_res = client.delete(f"/api/users/{test_email}")
    assert del_res.status_code == 200
    print(f"  [PASS] 12. Delete Account ({test_email}) -> 200 OK")

    print("="*60)
    print("[SUCCESS] ALL 12 TEST SUITES PASSED FLAWLESSLY!")
    print("="*60 + "\n")

if __name__ == "__main__":
    run_tests()
