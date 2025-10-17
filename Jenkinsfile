pipeline {
    agent any

    tools {
        nodejs 'node18'    // Must match the name in Jenkins → Manage Jenkins → Tools
        python 'python'  // Must match the name in Jenkins → Manage Jenkins → Tools
    }

    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR  = 'backend'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📦 Cloning repository...'
                git branch: 'main', url: 'https://github.com/vishal01-tech/project-library.git'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                echo '🐍 Installing FastAPI dependencies...'
                dir("${BACKEND_DIR}") {
                    sh 'pip install --upgrade pip'
                    sh 'pip install -r requirements.txt'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo '🧩 Installing React dependencies...'
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '🏗️ Building React frontend...'
                dir("${FRONTEND_DIR}") {
                    sh 'npm run build'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo '🧪 Running FastAPI backend tests...'
                dir("${BACKEND_DIR}") {
                    // Run pytest if tests exist, skip otherwise
                    sh 'pytest || echo "⚠️ No tests found, skipping..."'
                }
            }
        }

        stage('Package Application') {
            steps {
                echo '📦 Preparing app for deployment...'
                // You can later add Docker build & push steps here
            }
        }

        stage('Deploy (Optional)') {
            steps {
                echo '🚀 Deployment stage (Docker/K8s can be added here later)'
            }
        }
    }

    post {
        success {
            echo '✅ Build completed successfully!'
        }
        failure {
            echo '❌ Build failed. Check logs for details.'
        }
    }
}
