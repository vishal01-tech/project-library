import pytest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.database.test_database import create_test_tables, drop_test_tables, override_get_db
from app.main import app  # Import your FastAPI app
from fastapi.testclient import TestClient

@pytest.fixture(scope="function")
def test_client():
    create_test_tables()
    client = TestClient(app)
    app.dependency_overrides[app.dependency_overrides.get('get_db', lambda: None)] = override_get_db  # Override DB dependency

    # Mock the oauth2_scheme dependency
    def mock_oauth2_scheme():
        return "mock_token"

    from app.utils.auth import oauth2_scheme
    app.dependency_overrides[oauth2_scheme] = mock_oauth2_scheme

    # Mock get_current_user_with_role
    def mock_get_current_user_with_role(required_role=None):
        return {"id": 1, "email": "test@example.com", "role": "admin"}

    from app.utils.auth import get_current_user_with_role
    app.dependency_overrides[get_current_user_with_role] = mock_get_current_user_with_role

    yield client
    drop_test_tables()
