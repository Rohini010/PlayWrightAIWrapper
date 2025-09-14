pipeline {
    agent any
    tools {
        nodejs "node18"
    }

    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'addProduct', 'cartVerify', 'checkout', 'endToEnd'],
            description: 'Select which test suite to run'
        )
    }

    environment {
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\.playwright"
    }

    stages {

        stage('Verify NodeJS') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Checkout') {
            steps {
                // For multibranch pipeline, use the branch Jenkins scans
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
                bat 'npx playwright install'
            }
        }

        stage('Clean Reports') {
            steps {
                bat 'npm run clean'
            }
        }

        stage('Prepare Allure') {
            steps {
                bat 'npx allure --version'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    switch(params.TEST_SUITE) {
                        case 'all':
                            bat 'npm run test:all'
                            break
                        case 'addProduct':
                            bat 'npm run test:addProduct'
                            break
                        case 'cartVerify':
                            bat 'npm run test:cartVerify'
                            break
                        case 'checkout':
                            bat 'npm run test:checkout'
                            break
                        case 'endToEnd':
                            bat 'npm run test:endToEnd'
                            break
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                bat 'npm run allure:generate'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

            allure([
                reportBuildPolicy: 'ALWAYS',
                includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']]
            ])
        }
    }
}
