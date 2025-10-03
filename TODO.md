# TODO: Fix Signup 401 Unauthorized Issue

## Tasks
- [x] Modify backend/app/main.py signup endpoint logic to allow 'user' role creation without authentication
- [x] Add verify_access_token import to main.py
- [ ] Test the signup functionality after changes
- [ ] Verify that privileged roles still require super_admin authentication

## Notes
- Current issue: POST /signup returns 401 when users exist because auth is required for all user creation after first user
- Solution: Allow public signup for 'user' role, restrict other roles to super_admin only
- Keep first user creation as super_admin without auth
