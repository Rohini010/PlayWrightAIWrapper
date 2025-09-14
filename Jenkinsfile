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
        // Use workspace path for Playwright browsers to avoid repeated downloads
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
                // Single branch: checkout the branch Jenkins is building
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'

                script {
                    if (!fileExists("${env.PLAYWRIGHT_BROWSERS_PATH}/chromium-1400")) {
                        echo "Playwright browsers not found. Downloading..."
                        bat 'npx playwright install --force'
                    } else {
                        echo "Playwright browsers already downloaded. Skipping download."
                    }
                }
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
            // Archive Playwright HTML report
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

            // Generate Allure report
            allure([
                reportBuildPolicy: 'ALWAYS',
                includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']]
            ])
        }
    }
}
