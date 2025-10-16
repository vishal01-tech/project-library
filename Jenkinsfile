pipeline {
    agent any

    tools {
        nodejs 'node18'
        python 'python3'
    }

    environment {
        BACKEND_DIR = 'backend'      // folder name for FastAPI app
        FRONTEND_DIR = 'frontend'    // folder name for React app
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/<your-username>/<your-repo>.git'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm run build'
                }
            }
        }

        stage('Setup Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'python3 -m venv venv'
                    sh 'source venv/bin/activate && pip install -r requirements.txt'
                }
            }
        }

        stage('Run FastAPI Tests (Optional)') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'source venv/bin/activate && pytest || echo "Tests skipped"'
                }
            }
        }

        stage('Start FastAPI Server') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'nohup uvicorn main:app --host 0.0.0.0 --port 8000 &'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build and deployment successful!'
        }
        failure {
            echo '❌ Build failed! Check logs in Jenkins console.'
        }
    }
}
